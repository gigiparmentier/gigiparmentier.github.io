import os

folder = os.listdir()
for x in range(0,len(folder)):
    if folder[x].split('.')[1] == 'grid':
        os.rename(folder[x],folder[x].split('grid (')[1].split(')')[0] + '.grid')
