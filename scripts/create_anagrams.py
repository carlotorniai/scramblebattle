import json

def find_anagrams(word):
    """
    Find all anagrams of the given word in the all_words.txt file.
    """
    anagrams = []
    # sort the characters of the word to normalize it
    sorted_word = "".join(sorted(word))
    try:
        with open("./all_words.txt") as f:
            for line in f:
                line = line.strip()
                #check if the word and line have the same length
                if len(word) != len(line):
                    continue
                # sort the characters of each word
                sorted_line = "".join(sorted(line))
                # check if the sorted word and the sorted line are equal
                if sorted_word == sorted_line:
                    anagrams.append(line)
    except FileNotFoundError:
        print("all_words.txt file not found.")
    except:
        print("An error occurred while reading the all_words.txt file.")
    return anagrams

def main():
    """
    The main function that reads the all_words.txt file and produces the json file.
    """
    anagrams_dict = {}
    try:
        with open("all_words.txt") as f:
            for i,word in enumerate(f):
                word = word.strip()
                # find anagrams of the word
                anagrams = find_anagrams(word)
                # add the word and its anagrams to the dictionary
                anagrams_dict[word] = anagrams
                if i % 100 == 0:
                    print("Processed {} words".format(i))
        # write the dictionary to a json file
        with open("anagrams.json", "w") as f:
            json.dump(anagrams_dict, f, indent=4)
    except FileNotFoundError:
        print("all_words.txt file not found.")
    except:
        print("An error occurred while reading the all_words.txt file.")

if __name__ == "__main__":
    main()
