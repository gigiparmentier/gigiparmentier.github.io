from bs4 import BeautifulSoup
import re
import requests
import json
import js2py
import ast

url = "https://www.rocketleagueesports.com/-/custom/standings-script.html?season=7-e8fcccb7dd-7h0w65&league=7-57d5ab4-qm0qcw&region=0&stage=7-57d5ab4-g1dsq3"

soup = BeautifulSoup(requests.get(url).content,features="html5lib")

script_text = soup.find("script", text=re.compile("var\s+teams")).text.split("= ", 1)[1]

#print(soup)

js = str(script_text).replace("document.write", "return ")

result = js2py.eval_js(js)  # executing JavaScript and converting the result to python string

result = str(result).replace('\'','\"').replace('x\"','x\'')

#print(result)

jsonfile = json.loads(result)

with open('results.json', 'w') as outfile:
    json.dump(jsonfile, outfile)
