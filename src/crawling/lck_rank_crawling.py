from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import datetime
import pymysql
import schedule
import time


def update_lck_ranking():
    # MySQL에 sports DB 연결
    sports_db = pymysql.connect(host="sports.caeuznininfh.ap-southeast-2.rds.amazonaws.com", user="root", password="sports1234", charset="utf8")
    dbCursor = sports_db.cursor()
    dbCursor.execute('USE sports')

    # Selenium 웹 드라이버를 사용하여 크롬 브라우저를 제어
    driver = webdriver.Chrome()
    driver.implicitly_wait(3) # seconds

    naver_lck = "https://game.naver.com/esports/League_of_Legends/record/lck/team/lck_2023_summer"
    driver.get(naver_lck)

    page = driver.page_source
    lck_list =  BeautifulSoup(page,"html.parser")
    team_list = lck_list.select('.record_list_wrap__A8cnT > .record_list_wrap_team__215Gz > ul > li')
    detail_list = lck_list.select('.record_list_wrap_list__lkd3u > .record_list_wrap_filter__1Ux0E > ul > li')

    season = lck_list.select('.record_filter_info__3y5kV')[1].text.replace(' ', '-')
    lck_rank_data = []
    drawns = 0
    # print(season)
    for team, detail in zip(team_list, detail_list):
        name = team.select('.record_list_name__27huQ')[0].text
        wins = detail.select('.record_list_data__3wyY7')[0].text
        losses = detail.select('.record_list_data__3wyY7')[1].text
        scored = detail.select('.record_list_data__3wyY7')[5].text
        conceded = detail.select('.record_list_data__3wyY7')[6].text
        points = detail.select('.record_list_data__3wyY7')[2].text
        
        # name과 DB의 team table의 name을 비교하여 id 가져오기
        query = "SELECT id FROM team WHERE name = %s"  # 팀 테이블에서 name 열이 일치하는 id 조회
        dbCursor.execute(query, name)
        result = dbCursor.fetchone()
        if result is not None:
            team_id = result[0]
        else:
            print("해당하는 팀을 찾을 수 없습니다.")
            continue
        
        print(name, team_id, season, wins, losses, scored, conceded, points)
        lck_rank_data.append({'팀명': name, '팀아이디': team_id, '승': wins, '패': losses, '무': drawns, '득점': scored, '실점': conceded, '포인트': points, '시즌': season})


    # season 값이 같은 기존의 모든 행 삭제
    delete_query = "DELETE FROM `rank` WHERE season = %s"
    dbCursor.execute(delete_query, season)
    sports_db.commit()

    # kteam_data의 각 요소를 rank 테이블의 컬럼과 일치하는 값으로 입력
    for data in lck_rank_data:
        query = "INSERT INTO `rank` (team_id, season, wins, losses, drawns, scored, conceded, points) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = (data['팀아이디'], data['시즌'], data['승'], data['패'], data['무'], data['득점'], data['실점'], data['포인트'])
        dbCursor.execute(query, values)
        sports_db.commit()

    sports_db.close()
    
    
# 매일 자정에 작업 실행
schedule.every().day.at("03:00").do(update_lck_ranking)
update_lck_ranking()
# # 프로그램 종료까지 대기
# while schedule.jobs:
#     schedule.run_pending()
#     time.sleep(1)