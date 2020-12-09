from bs4 import BeautifulSoup
from urlib.request import urlopen

#상품 이름을 긁어오는 함수
def product_name():
    url = "https://shopping.naver.com/market/traditionalmarket?storeId=100840028"
    
    result = requests.get(url)
    a = result.text

    soup = BeautifulSoup(a, 'html.parser')

    link = soup.select('div.X1DfuFYD6M > a')
    len(link)