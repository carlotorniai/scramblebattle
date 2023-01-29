import random

# Define the fixed length of the 5 words
word_lengths = [5, 6, 7, 8, 9]

print("Reading words from file...")
try:
    # Read the words from the file
    with open('parole.txt', 'r') as f:
        words = f.read().split()
except FileNotFoundError:
    print("Error: The file 'parole.txt' could not be found.")
    exit()

# Select 5 random words with the specified lengths
selected_words = []
for length in word_lengths:
    selected_words.append(random.choice([word for word in words if len(word) == length]))

print("Writing selected words to file...")
try:
    # Write the selected words to a new file
    with open('selected_words.txt', 'w') as f:
        f.write(' '.join(selected_words))
except:
    print("An error occurred while writing to file.")
    exit()

print("Script executed successfully. The words are: " +str(selected_words))
