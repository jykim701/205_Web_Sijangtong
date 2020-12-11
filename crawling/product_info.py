from flask import Flask, render_templte, jsonify, request
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
crawlingDB = client.dbproject

#성대전통시장 URL
def get_product_info():
    url = "https://shopping.naver.com/market/traditionalmarket?storeId=100840009"
    header = {'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'}
    result = requests.get(url)
    soup = BeautifulSoup(result.text, 'html.parser')
    
    #href 태그 속 market ID
    marketID = ['100840011','100840017', '100840024','100938154','100840031','100840035','100840048','100840055','100840059','100840069','100840074',
                '100859292','100939541','100840113','100840005','100840009','100840013','100839993','100840018','100942860','100840072','100839984',
                '100840023','100840028','100840033','100840037','100840044','100840049','100840052','100840003','100840064']

    #시장별 URL을 넣으면 된다
    #파이썬 크롤링 코드로 이미 시장별 strodID를 모아와 list에 저장했기 때문에 stordID를 긁어오는 별도의 코드없이 바로 넣는다
    for i in range(len(marketID)):
        storeId = marketID[i]
        result = requests.get(f"https://shopping.naver.com/market/traditionalmarket?storeId={storeId}")

    #카테고리별 반복문 돌리기
    data = BeautifulSoup(result.text, 'html.parser')
    products = data.find('div', {'class':'jas_contain'})
    product = products.find_all('div', {'class':'product-grid-item'})

    for one in product:
        title = one.select_one('.product-title').text
        price = one.select_one('.price').text
        img_h = one.select_one('.product-element-top > a').get('href')
        img_url = f""
        img_s = one.select_one('.product-element-top > a > img').get('src')
        img_src = f"https:{img_s}"
    
    doc = {'market': keys[i], 'title':title, 'price':price, 'img_url':img_url, 'img_src':img_src}

    def info():
        url = "https://zerowastestore.com/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    result = requests.get(url, headers=headers)
    soup = BeautifulSoup(result.text, 'html.parser')
    products = soup.find('div', {'class': 'jas_contain'})
    product = products.find_all(
        'div', {'class': 'product-grid-item'})
    for one in product:
        main_title = one.select_one('.product-title').text
        main_price = one.select_one('.price').text
        main_img_h = one.select_one(
            '.product-element-top > a').get('href')
        main_img_url = f"https://zerowastestore.com{main_img_h}"
        main_img_s = one.select_one(
            '.product-element-top > a > img').get('src')
        main_img_src = f"https:{main_img_s}"

        main_doc = {
            'category': 'arrival',
            'main_title': main_title,
            'main_price': main_price,
            'main_img_url': main_img_url,
            'main_img_src': main_img_src
        }
        db.zerowastestore.insert_one(main_doc)
    

def update_db():
    update_soap = db.zerowastestore.update_many(
        {'category': 'Soap Bars'}, {'$set': {'category': 'Others'}})
    update_zwk = db.zerowastestore.update_many(
        {'category': 'ZWS Kits'}, {'$set': {'category': 'Others'}})
    update_zws = db.zerowastestore.update_many({'category': 'ZWS Sustainables'}, {'$set': {'category': 'Others'}})

if __name__ == "__main__":
    # get_info()