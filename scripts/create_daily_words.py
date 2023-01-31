import random
selected_words = []
# Define the fixed length of the 5 words
word_lengths = [5, 6, 7, 8, 9]
scrambled_words = []

# Define the scramble function 
def scramble(word):
    scrambled_word = ""
    letters = list(word)
    while len(letters) > 0:
        random_index = random.randint(0, len(letters) - 1)
        scrambled_word += letters[random_index]
        letters.pop(random_index)
    return scrambled_word



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
    selected_words.append(random.choice([word for word in words if len(word) == length]))

# Write the selected words to a new file
print("Writing selected words to file...")
try:
    with open('selected_words.txt', 'w') as f:
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
    with open('scrambled_words.txt', 'w') as f:
        f.write(' '.join(scrambled_words))
except:
    print("An error occurred while writing scrambled_words to file.")
    exit()

print("Script executed successfully")
print("The words are: " +str(selected_words))
print("Scrambled words are: " +str(scrambled_words))