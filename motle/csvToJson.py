import csv
import random
import unidecode

words = []

with open('possible_words.csv', newline='', encoding='utf-8') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=';', quotechar='|')
    for row in list(spamreader)[1:]:
        word = row[0]
        word = unidecode.unidecode(word)
        type = row[3]
        letters = row[14]
        frequency = float(row[9].replace(',','.'))
        if type == 'NOM' and letters == '5' and frequency > .5:
            words.append(word)

print(len(words))
random.shuffle(words)

with open('dict_small.txt','w') as f:
    for word in words:
        f.write(word + '\n')
