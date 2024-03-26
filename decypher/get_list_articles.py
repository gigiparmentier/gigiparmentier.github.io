from mediawikiapi import MediaWikiAPI
import requests,random,tqdm

# Create a MediaWiki object
wiki = MediaWikiAPI()
wiki.config.language = "fr"

# Get a list of 500 random page titles
random_titles = []
for i in tqdm.tqdm(range(10)):
    response = requests.get('https://fr.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=500&format=json')
    data = response.json()
    titles = [page['title'] for page in data['query']['random']]
    random_titles.extend(titles)

# Retrieve summaries for the random pages
random_pages_with_summaries = {}
for title in tqdm.tqdm(random_titles):
    try:
        summary = wiki.summary(title)
        if len(summary) > 250:
            random_pages_with_summaries[title] = summary
    except Exception as e:
        pass

with open("articles.txt", 'w', encoding='utf-8') as file:
    for title, summary in random_pages_with_summaries.items():
        file.write(title + f"\n")