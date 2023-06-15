from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import datetime
import pymysql
import schedule
import time


def update_schedule():
    # MySQL에 sports DB 연결
    sports_db = pymysql.connect(host="sports.caeuznininfh.ap-southeast-2.rds.amazonaws.com", user="root", password="sports1234", charset="utf8")
    dbCursor = sports_db.cursor()
    dbCursor.execute('USE sports')

    driver = webdriver.Chrome()
    driver.implicitly_wait(3) # seconds

    year_now = datetime.datetime.now().year
    month_now = datetime.datetime.now().month
    naver_kfootball = f"https://sports.news.naver.com/kfootball/schedule/index?year={year_now}&month={month_now}&category=kleague"
    driver.get(naver_kfootball)

    page = driver.page_source
    k_team_schedule_list =  BeautifulSoup(page,"html.parser")
    k_schedule_list = k_team_schedule_list.select('.schedule_month_table>table>tbody>tr')

    season = str(year_now) + "-K-League"
    for match in k_schedule_list:
        # 경기가 없는 row는 건너뜀
        inner_empty = match.select('.inner.empty')
        if inner_empty:
            continue


        # start_time
        kdate = match.select('th[scope="row"] > .inner > em')
        ktime = match.select('.time_place > div.inner > span.time')[0].text
        if kdate:
            month, day = kdate[0].text.split('.')
            # 월과 일이 한 자리 수인 경우 앞에 0을 붙여줌
            if len(month) == 1:
                month = '0' + month
            if len(day) == 1:
                day = '0' + day
            month_day = month + '-' + day
            previous_date = month_day
        else:
            month_day = previous_date
        start_time = str(year_now) + "-" + month_day + " " + ktime
            
            
        # location
        location = match.select('.time_place > div.inner > span.place')[0].text
        
        
        # team1, team2, score1, score2, state
        team1 = match.select('div.inner > span.team_left > .name')[0].text
        team2 = match.select('div.inner > span.team_right > .name')[0].text
        score1_element = match.select('div.inner > span.team_left > .score')
        score2_element = match.select('div.inner > span.team_right > .score')
        if score1_element:
            score1 = score1_element[0].text
            score2 = score2_element[0].text
            state = '경기 종료'
        else:
            score1 = 'NULL'
            score2 = 'NULL'
            state = '경기 예정'
            
        # 팀명을 id로 전환
        team_ids = {}  # 팀 이름과 ID를 저장할 딕셔너리
        query = "SELECT id FROM team WHERE name = %s"
        for team_name in [team1, team2]:
            dbCursor.execute(query, team_name)
            result = dbCursor.fetchone()
            if result is not None:
                team_ids[team_name] = result[0]
            else:
                print("No team found.")
                continue
        team1_id = team_ids.get(team1)
        team2_id = team_ids.get(team2)    
        
        print(start_time, team1, team1_id, score1, " : ", score2, team2_id, team2, season, state)
        
        
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

    
# 매주 월요일 새벽 1시에 작업 실행
schedule.every().day.at("01:30").do(update_schedule)
update_schedule()