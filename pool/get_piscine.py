import requests,datetime,time,os
from bs4 import BeautifulSoup

base_url = "https://affluences.com/"
pool_url = "piscine-de-la-butte-aux-cailles"

while True:
	response = requests.get(base_url + pool_url)
	soup = BeautifulSoup(response.text, "html.parser")

	day = datetime.datetime.today().weekday()
	hour = datetime.datetime.now().strftime("%H")
	minutes = datetime.datetime.now().strftime("%M")

	line_selector = "[href*='/" + pool_url + "/ligne']"
	lines = soup.select(line_selector)

	is_closed = False

	for i,line in enumerate(lines):
	    if len(line.select('.app-counter')) == 0:
	        is_closed = True
	        break
	    line_percentage = int(line.select('.app-counter')[0]['value'])
	    with open("piscine.csv", "a") as f:
	        f.write(f"{day},{hour},{minutes},{i},{line_percentage}\n")

	if is_closed:
	    print(f"Data not collected at {hour}:{minutes}")
	else:
	    print(f"Data collected at {hour}:{minutes}")

	if int(minutes) % 5 == 0:
	    os.system('python3 graph_piscine.py url')

	time.sleep(60)
