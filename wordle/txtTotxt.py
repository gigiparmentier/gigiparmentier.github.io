import csv
import random

words = []

with open('existing_words.txt') as file:
    for row in file:
        word = row.rstrip()
        if len(word) == 5:
            words.append(word.lower())

print(len(words))

with open('dict_big.txt','w') as f:
    for word in words:
        f.write(word + '\n')
