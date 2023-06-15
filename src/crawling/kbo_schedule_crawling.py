from selenium import webdriver
# selenium으로 키를 조작하기 위한 import
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import pymysql
import schedule
import time


def update_schedule():
    # db에 connect
    sports_db = pymysql.connect(host="sports.caeuznininfh.ap-southeast-2.rds.amazonaws.com", user="root", password="sports1234", charset="utf8")
    dbCursor = sports_db.cursor()
    dbCursor.execute('USE sports')


    # 크롬드라이버 실행
    driver = webdriver.Chrome()
    driver.get('https://www.koreabaseball.com/Schedule/Schedule.aspx')
    time.sleep(3) # 페이지가 완전 로딩되도록 3초 대기

    year_bar = driver.find_element(By.ID, 'ddlYear')
    month_bar = driver.find_element(By.ID, 'ddlMonth')

    year_bar.click()
    year_bar.send_keys(Keys.ENTER)
    month_bar.click()
    month_bar.send_keys(Keys.ENTER)


    schedule_data = []

    # 시즌값은 year_bar의 최상단 값을 가져옴
    year = year_bar.get_attribute("value")
    season = year + '-KBO'
    start_day = None

    table_rows = driver.find_elements(By.XPATH, '//tbody/tr')
    for index, row in enumerate(table_rows):
        cells = row.find_elements(By.XPATH, './td')
        
        # start_time
        if index % 5 == 0:
            start_day = cells[0].text.split()[0][:5].replace('.', '-')
        start_hour = cells[-8].text + ":00"
        start_time = f"{year}-{start_day} {start_hour}"
        
        # team1 팀명, team2 팀명
        teams = cells[-7].find_elements(By.TAG_NAME, 'span')
        team1 = teams[0].text
        team2 = teams[-1].text
        
        # score1, score2
        em_element = cells[-7].find_element(By.CSS_SELECTOR, 'em')
        span_elements = em_element.find_elements(By.TAG_NAME, 'span')
        score1 = span_elements[0].text if span_elements[0].text.isdigit() else 'NULL'
        score2 = span_elements[-1].text if span_elements[-1].text.isdigit() else 'NULL'

        # location
        location = cells[-2].text
        
        # team1 id, team2 id
        team_ids = {}  # 팀 이름과 ID를 저장할 딕셔너리
        # 팀 이름과 ID 매칭을 위한 쿼리
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
        
        # state
        relay_element = cells[-6]
        if relay_element.text == '리뷰':
            state = '경기 종료'
        if relay_element.text == '프리뷰':
            state = '경기 예정'
        elif cells[-1].text != '-':
            state = '경기 취소'
        
        schedule_data.append({'시작시간': start_time, '시즌': season, '팀1_id': team1_id, '팀2_id': team2_id, '득점1': score1, '득점2': score2, '구장': location, '상태': state})


    for data in schedule_data:
        try:
            # 데이터 삽입
            query = "INSERT INTO schedule (start_time, team1, team2, score1, score2, location, state, season) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
            dbCursor.execute(query, (
                data['시작시간'],
                data['팀1_id'],
                data['팀2_id'],
                data['득점1'],
                data['득점2'],
                data['구장'],
                data['상태'],
                data['시즌']
            ))
            sports_db.commit()
        except pymysql.IntegrityError:
            # 중복된 데이터인 경우 상태 업데이트
            existing_data_query = "SELECT state FROM schedule WHERE start_time = %s AND team1 = %s AND team2 = %s"
            dbCursor.execute(existing_data_query, (data['시작시간'], data['팀1_id'], data['팀2_id']))
            existing_state = dbCursor.fetchone()

            if existing_state == '경기 예정' and data['상태'] == '경기 종료':
                update_query = "UPDATE schedule SET state = %s WHERE start_time = %s AND team1 = %s AND team2 = %s"
                dbCursor.execute(update_query, (data['상태'], data['시작시간'], data['팀1_id'], data['팀2_id']))
                sports_db.commit()
                print("데이터 업데이트 완료.")
            else:
                print("중복된 데이터. 삽입되지 않음.")
            
    sports_db.close()

    # 데이터 출력
    for data in schedule_data:
        print(f"시작시간: {data['시작시간']}, 시즌: {data['시즌']}, 팀1: {data['팀1_id']}, 팀2: {data['팀2_id']}, 득점1: {data['득점1']}, 득점2: {data['득점2']}, 구장: {data['구장']}, 상태: {data['상태']}")

# 매주 월요일 새벽 1시에 작업 실행
schedule.every().day.at("01:00").do(update_schedule)
update_schedule()