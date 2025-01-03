#!/usr/bin/env python3
"""
Enhances the original script by:
  1. Organizing code into functions (improved structure).
  2. Adding better error handling and logging.
  3. Supporting reproducible randomness via optional seeding.
  4. Checking edge cases (e.g., if not enough words of a certain length exist).
  5. Enforcing consistent style and docstrings.
"""

import random
import os
import json
import logging
from typing import List, Dict, Any

# Setup a basic logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s [%(filename)s:%(lineno)d] - %(message)s'
)

# Fixed lengths of the 5 words to select
WORD_LENGTHS = [5, 6, 7, 8, 9]

def remove_accents(word: str) -> str:
    """
    Remove common accented characters from a given string.

    Args:
        word (str): The original word.

    Returns:
        str: The word with accented characters replaced.
    """
    # You can expand this mapping if more accents are needed
    replacements = {
        'à': 'a', 'á': 'a',
        'è': 'e', 'é': 'e',
        'ì': 'i', 'í': 'i',
        'ò': 'o', 'ó': 'o',
        'ù': 'u', 'ú': 'u',
    }
    for accented, plain in replacements.items():
        word = word.replace(accented, plain)
    return word

def scramble(word: str) -> str:
    """
    Generate a scrambled version of the word based on a 'syllable-like' approach.

    - Splits the word into 'syllables' by grouping consonants, then single vowels
    - Chooses one random chunk as a 'fixed' piece
    - Shuffles the rest and ensures it doesn't accidentally produce the original word
      (retries if it does)

    Args:
        word (str): The original word to scramble.

    Returns:
        str: A scrambled version of the word.
    """
    def create_syllables(w: str) -> List[str]:
        """Split a word into a minimal set of 'syllables'—consonants grouped, vowels isolated."""
        vowels = "aeiouAEIOU"
        result = []
        current = []
        for ch in w:
            if ch in vowels:
                # push the current consonant cluster if any
                if current:
                    result.append("".join(current))
                    current = []
                # push the vowel as separate
                result.append(ch)
            else:
                current.append(ch)
        # leftover consonants
        if current:
            result.append("".join(current))
        return result

    def do_scramble(w: str) -> str:
        """Perform a single scramble attempt. Might generate the same word by coincidence."""
        syllables = create_syllables(w)
        if len(syllables) == 1:
            # There's only 1 chunk, so scrambling won't help
            return w
        
        fixed_index = random.randint(0, len(syllables) - 1)
        fixed_chunk = syllables.pop(fixed_index)

        random.shuffle(syllables)
        scrambled_list = [fixed_chunk] + syllables
        random.shuffle(scrambled_list)

        return "".join(scrambled_list)

    scrambled_word = do_scramble(word)
    # If scramble yields original word, try again
    max_retries = 5
    retries = 0
    while scrambled_word == word and retries < max_retries:
        logging.debug(f"Scramble produced the same word '{word}'. Retrying...")
        scrambled_word = do_scramble(word)
        retries += 1
    
    return scrambled_word

def read_words_from_file(file_path: str) -> List[str]:
    """
    Read and return a list of words from the specified file.

    Args:
        file_path (str): Path to the file containing words.

    Returns:
        List[str]: List of words (whitespace-split).
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read().split()
        return content
    except FileNotFoundError:
        logging.error(f"Error: File '{file_path}' not found.")
        return []
    except Exception as ex:
        logging.error(f"An unexpected error occurred while reading '{file_path}': {ex}")
        return []

def select_random_words(words: List[str], lengths: List[int]) -> List[str]:
    """
    From a list of words, selects random words for each length in 'lengths'.

    Args:
        words (List[str]): List of all candidate words (already accent-removed).
        lengths (List[int]): The target word lengths to pick.

    Returns:
        List[str]: Five words in total, each matching the respective length.
    """
    selected = []
    for length in lengths:
        # Filter for words matching the length
        matching = [w for w in words if len(w) == length]
        if not matching:
            logging.warning(f"No words of length {length} found. Cannot select a word of this length.")
            selected.append("")  # or handle differently
            continue
        # choose a random one from the matching set
        chosen = random.choice(matching)
        selected.append(chosen)
    return selected

def load_anagrams(file_path: str) -> Dict[str, Any]:
    """
    Loads a JSON file of anagrams, returning a dictionary.

    Args:
        file_path (str): Path to the JSON file.

    Returns:
        Dict[str, Any]: The dictionary of anagrams. Could be {word: [list_of_anagrams]}.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        logging.warning(f"Anagrams file '{file_path}' not found; continuing without anagrams.")
        return {}
    except json.JSONDecodeError as ex:
        logging.error(f"Could not decode JSON in '{file_path}': {ex}")
        return {}
    except Exception as ex:
        logging.error(f"Error while loading anagrams from '{file_path}': {ex}")
        return {}

def main() -> None:
    """
    Main entry point for the script. Orchestrates:
      1. Reading words from 'parole.txt'.
      2. Removing accents and selecting 5 words by length.
      3. Scrambling those words.
      4. Writing results to 'selected_words.txt' and 'scrambled_words.txt'.
      5. Loading an anagrams JSON and storing relevant anagrams to 'alternative_scramble.json'.
    """
    # If you want reproducible results, uncomment and set your desired seed:
    # random.seed(42)

    words_file = "parole.txt"
    anagrams_file = "anagrams.json"
    
    logging.info("Reading words from file...")
    all_words = read_words_from_file(words_file)

    # remove accents
    logging.info("Removing accents from loaded words...")
    all_words = [remove_accents(w) for w in all_words]

    # select words
    logging.info("Selecting random words of lengths [5, 6, 7, 8, 9]...")
    selected_words = select_random_words(all_words, WORD_LENGTHS)
    logging.info(f"Selected words: {selected_words}")

    # Write the selected words to file
    selected_output_path = os.path.join(os.getcwd(), 'selected_words.txt')
    try:
        with open(selected_output_path, 'w', encoding='utf-8') as f:
            f.write(' '.join(selected_words))
        logging.info(f"Selected words saved to '{selected_output_path}'")
    except Exception as ex:
        logging.error(f"An error occurred while writing selected_words to file: {ex}")

    # scramble words
    logging.info("Scrambling selected words...")
    scrambled_words = [scramble(word) if word else "" for word in selected_words]
    logging.info(f"Scrambled words: {scrambled_words}")

    # Write the scrambled words to file
    scrambled_output_path = os.path.join(os.getcwd(), 'scrambled_words.txt')
    try:
        with open(scrambled_output_path, 'w', encoding='utf-8') as f:
            f.write(' '.join(scrambled_words))
        logging.info(f"Scrambled words saved to '{scrambled_output_path}'")
    except Exception as ex:
        logging.error(f"An error occurred while writing scrambled_words to file: {ex}")

    # Load anagrams
    logging.info(f"Loading anagrams from '{anagrams_file}'...")
    anagrams_data = load_anagrams(anagrams_file)

    # Build alternative scramble dictionary for selected words
    alternative_scramble = {}
    for word in selected_words:
        if word and word in anagrams_data:
            alternative_scramble[word] = anagrams_data[word]

    # Save the alternative_scramble dictionary
    alt_scramble_output_path = os.path.join(os.getcwd(), "alternative_scramble.json")
    try:
        with open(alt_scramble_output_path, "w", encoding='utf-8') as f:
            json.dump(alternative_scramble, f, ensure_ascii=False, indent=2)
        logging.info(f"Alternative scramble data saved to '{alt_scramble_output_path}'")
    except Exception as ex:
        logging.error(f"An error occurred while writing alternative_scramble.json: {ex}")

    logging.info("Script executed successfully.")

if __name__ == "__main__":
    main()
