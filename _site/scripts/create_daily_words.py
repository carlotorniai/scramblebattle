import random
import os
import json

selected_words = []
# Define the fixed length of the 5 words
word_lengths = [5, 6, 7, 8, 9]
scrambled_words = []
alternative_scramble = dict()

#remove accents from words
def remove_accents(word):
    word = word.replace('à', r'a').replace('á', r'a').replace('è', r'e').replace('é',r'e').replace('ì', r'i').replace('í', r'i').replace('ò', r'o').replace('ó', r'o').replace('ù', r'u').replace('ú', r'u')
    return word


def scramble(word):
    syllables = []
    syllable = ""
    for letter in word:
        if letter in "aeiouAEIOU":
            if syllable:
                syllables.append(syllable)
                syllable = ""
            syllables.append(letter)
        else:
            syllable += letter
    if syllable:
        syllables.append(syllable)

    fixed_syllable_index = random.randint(0, len(syllables) - 1)
    fixed_syllable = syllables.pop(fixed_syllable_index)

    random.shuffle(syllables)
    scrambled_syllables = [fixed_syllable] + syllables
    random.shuffle(scrambled_syllables)
    scrambled_generated = "".join("".join(syllable) for syllable in scrambled_syllables)
    if scrambled_generated == word:
            print ("Same word !! Rerunning scramble")
            return scramble(word)
    else:
        return  scrambled_generated

print("Reading words from file...")
try:
    # Read the words from the file
    with open('parole.txt', 'r') as f:
        words = f.read().split()
except FileNotFoundError:
    print("Error: The file 'parole.txt' could not be found.")
    exit()

# Select 5 random words with the specified lengths
for length in word_lengths:
    selected_words.append(random.choice([remove_accents(word) for word in words if len(word) == length]))

# Write the selected words to a new file
print("Writing selected words to file...")
try:
    with open(os.path.join(os.getcwd(), 'selected_words.txt'), 'w') as f:
        f.write(' '.join(selected_words))
except:
    print("An error occurred while writing selected_words to file.")
    exit()

# Now I need also to build the scramble vector of words to be unique
for word in selected_words:
    scrambled_words.append(scramble(word))

# Write the selected words to a new file
print("Writing scrambled words to file...")
try:
    with open(os.path.join(os.getcwd(), 'scrambled_words.txt'), 'w') as f:
        f.write(' '.join(scrambled_words))
except:
    print("An error occurred while writing scrambled_words to file.")
    exit()


#Here i need to generate the alternative scramble
#reading the anagrams.json

# Load the anagrams.json file
with open("anagrams.json", "r") as f:
    anagrams = json.load(f)

# Iterate over the selected words
for word in selected_words:
    if word in anagrams:
        # If the word exists in the anagrams, add the word and its values to alternative_scramble
        alternative_scramble[word] = anagrams[word]

# Save the alternative_scramble dictionary to alternative_scramble.json
with open("alternative_scramble.json", "w") as f:
    json.dump(alternative_scramble, f)

print("Script executed successfully")
print("The words are: " +str(selected_words))
print("Scrambled words are: " +str(scrambled_words))
print("Alternative scramble words are: " +str(scrambled_words))