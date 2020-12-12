from bs4 import BeautifulSoup
import requests

res = requests.get("https://shopping.naver.com/market/traditionalmarket?storeId=100938154")
a = res.text
soup = BeautifulSoup(a,'html.parser')
data = soup.select('#listingArea > ul > li > div > strong')

for product in data:
    print(product.get_text())