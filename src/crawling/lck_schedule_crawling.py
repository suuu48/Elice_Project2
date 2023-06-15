from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import datetime
import pymysql
import re   # 
import schedule
import time


def update_schedule():
    # MySQL에 sports DB 연결
    sports_db = pymysql.connect(host="sports.caeuznininfh.ap-southeast-2.rds.amazonaws.com", user="root", password="sports1234", charset="utf8")
    dbCursor = sports_db.cursor()
    dbCursor.execute('USE sports')

    # Selenium 웹 드라이버를 사용하여 크롬 브라우저를 제어
    driver = webdriver.Chrome()
    driver.implicitly_wait(3) # seconds

    year_now = datetime.datetime.now().year
    month_now = str(datetime.datetime.now().month).zfill(2)

    naver_lck = f"https://game.naver.com/esports/League_of_Legends/schedule/lck?date={year_now}-{month_now}"
    driver.get(naver_lck)

    # Selenium 웹 드라이버로 현재 페이지 소스코드를 가져와 BS 라이브러리로 파싱
    page = driver.page_source
    lck_schedule_list =  BeautifulSoup(page,"html.parser")
    schedule_list = lck_schedule_list.select('.list_wrap__3zIxG > .card_item__3Covz')

    season = str(year_now) + "-LCK-서머"
    for match_per_day in schedule_list:
        day_data = match_per_day.select('.card_date__1kdC3')[0].text[:7]
        match_day = day_data.replace('월', '-').replace('일', '').replace(" ", "")
        matches = match_per_day.select('.card_list__-eiJk > .row_item__dbJjy')
        for match in matches:
            match_time = match.select('div.row_game_info__1drvl > span.row_time__28bwr')[0].text
            match_state = match.select('div.row_game_info__1drvl > span.row_state__2RKDU')[0].text
            team1 = match.select('div.row_box_score__1WQuz > .row_home__zbX5s > span.row_name__IDFHz')[0].text
            
            score1_element = match.select('div.row_box_score__1WQuz > .row_home__zbX5s > span.row_score__2RmGQ')
            score2_element = match.select('div.row_box_score__1WQuz > .row_away__3zJEV > span.row_score__2RmGQ')
            if score1_element:
                score1 = score1_element[0].text
                score2 = score2_element[0].text
            else:
                score1 = 'NULL'
                score2 = 'NULL'
            
            team2 = match.select('div.row_box_score__1WQuz > .row_away__3zJEV > span.row_name__IDFHz')[0].text
        
            start_time = f"{year_now}-{match_day} {match_time}:00"
            location = "서울 LoL PARK"
            
            # 팀명을 id로 전환, 팀명이 아예 다르게 돼 직접 전환...
            team_id_map = {'젠지': 26, 'T1': 27, 'kt 롤스터': 28, 'Dplus KIA': 29, '한화생명e스포츠': 30, '리브 샌드박스': 31, '광동 프릭스': 32, 'OK저축은행 브리온': 33, 'DRX': 34, '농심 레드포스': 35}
            team1_id = team_id_map.get(team1)
            team2_id = team_id_map.get(team2)
            
            state = f"경기 {match_state}"
            print(start_time, location, team1_id, team2_id, score1, score2, state, season)
            
            try:
                # 데이터 삽입
                query = "INSERT INTO schedule (start_time, team1, team2, score1, score2, location, state, season) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
                dbCursor.execute(query, (
                    start_time,
                    team1_id,
                    team2_id,
                    score1,
                    score2,
                    location,
                    state,
                    season
                ))
                sports_db.commit()
            except pymysql.IntegrityError:
                # 중복된 데이터인 경우 상태 업데이트
                existing_data_query = "SELECT state FROM schedule WHERE start_time = %s AND team1 = %s AND team2 = %s"
                dbCursor.execute(existing_data_query, (start_time, team1_id, team2_id))
                existing_state = dbCursor.fetchone()

                if existing_state == '경기 예정' and state == '경기 종료':
                    update_query = "UPDATE schedule SET state, score1 = %s, score2 = %s = %s WHERE start_time = %s AND team1 = %s AND team2 = %s"
                    dbCursor.execute(update_query, (state, score1, score2, start_time, team1_id, team2_id))
                    sports_db.commit()
                    print("데이터 업데이트 완료.")
                else:
                    print("중복된 데이터. 삽입되지 않음.")


    sports_db.close()


# 매일 새벽 3시 반에 작업 실행
schedule.every().day.at("03:30").do(update_schedule)
update_schedule()