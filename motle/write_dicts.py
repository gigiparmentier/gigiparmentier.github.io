import csv
import random
import unidecode

def write_small(length):
    words = []
    with open('secret_words.csv', newline='', encoding='utf-8') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=';', quotechar='|')
        for row in list(spamreader)[1:]:
            word = row[0]
            word = unidecode.unidecode(word)
            type = row[3]
            letters = row[14]
            frequency = float(row[9].replace(',','.'))
            if type == 'NOM' and letters == str(length) and frequency > .5:
                words.append(word)

    print('{} {}-letter words.'.format(len(words),length))
    random.shuffle(words)

    with open('dicts/small_{}.txt'.format(length),'w') as f:
        for word in words:
            f.write(word + '\n')

def write_big(length):
    words = []
    with open('all_words.txt') as file:
        for row in file:
            word = row.rstrip()
            if len(word) == length:
                words.append(word.lower())

    with open('dicts/small_{}.txt'.format(length)) as file:
        for row in file:
            word = row.rstrip()
            if word not in words:
                words.append(word.lower())

    with open('dicts/big_{}.txt'.format(length),'w') as f:
        for word in words:
            f.write(word + '\n')

for i in range(4,9):
    write_small(i)
    write_big(i)
