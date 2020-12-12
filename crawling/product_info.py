from flask import Flask, render_template, jsonify, request
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.dbproject

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
    products = data.find('ul', {'class':'_1KcFRtaBgc'})
    product = products.find_all('.li', {'class':'_1vjBlnNJgf'})

    for one in product:
        title = one.select_one('._2aVk27Ie-Ye').text
        price = one.select_one('._3ztiP6MwRJ').text
        img_h = one.select_one('.X1DfuFYD6M > a').get('href')
        img_url = f""
        img_s = one.select_one('.FhsSazoz8T').get('src')
        img_src = f"https:{img_s}"
    
    doc = {'market': marketID[i], 'title':title, 'price':price, 'img_url':img_url, 'img_src':img_src}

    def info():
        url = "https://shopping.naver.com/market/traditionalmarket?storeId=100840009"
    header = {'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'}
    result = requests.get(url)
    soup = BeautifulSoup(result.text, 'html.parser')
    
    products = data.find('ul', {'class':'_1KcFRtaBgc'})
    product = products.find_all('.li', {'class':'_1vjBlnNJgf'})

    for one in product:
        main_title = one.select_one('._2aVk27Ie-Ye').text
        main_price = one.select_one('._3ztiP6MwRJ').text
        main_img_h = one.select_one('.X1DfuFYD6M > a').get('href')
        main_img_url = f""
        main_img_s = one.select_one('.FhsSazoz8T').get('src')
        main_img_src = f"https:{img_s}"

        main_doc = {
            'category': 'arrival',
            'main_title': main_title,
            'main_price': main_price,
            'main_img_url': main_img_url,
            'main_img_src': main_img_src
        }
        db.sijangtong.insert_one(main_doc)
