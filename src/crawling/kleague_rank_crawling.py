from urllib.request import urlopen
from bs4 import BeautifulSoup
import pymysql
import schedule
import datetime
# import time


def update_kleague_ranking():
    # db에 connect
    sports_db = pymysql.connect(host="sports.caeuznininfh.ap-southeast-2.rds.amazonaws.com", user="root", password="sports1234", charset="utf8")
    dbCursor = sports_db.cursor()
    dbCursor.execute('USE sports')


    # kleague data 페이지에서 html 가져오기
    kteamRank_html = urlopen('https://sports.news.naver.com/kfootball/record/index')
    kteamRankObject = BeautifulSoup(kteamRank_html, "html.parser")

    # kleague data 페이지의 table에 tData가져오기
    kteamrankTable = kteamRankObject.select('#regularGroup_table')
    kteamrankRows = []
    for table in kteamrankTable:
        rows = table.find_all('tr')
        kteamrankRows.extend(rows)


    kteam_data = []
    # 시즌 정보
    season = str(datetime.datetime.now().year) + "-K-League"

    # 팀 데이터에 팀아이디, 승, 패, 시즌 정보 추가
    for row in kteamrankRows[:]:
        columns = row.find_all('td')
        name = columns[0].text.strip()
        wins = int(columns[3].text.strip())
        losses = int(columns[5].text.strip())
        drawns = int(columns[4].text.strip())
        points = int(columns[2].text.strip())
        scored = int(columns[6].text.strip())
        conceded = int(columns[7].text.strip())
        
        # name과 DB의 team table의 name을 비교하여 id 가져오기
        query = "SELECT id FROM team WHERE name = %s"  # 팀 테이블에서 name 열이 일치하는 id 조회
        dbCursor.execute(query, name)
        result = dbCursor.fetchone()
        if result is not None:
            team_id = result[0]
        else:
            print("해당하는 팀을 찾을 수 없습니다.")
            continue
        
        kteam_data.append({'팀명': name, '팀아이디': team_id, '승': wins, '패': losses, '무': drawns, '득점': scored, '실점': conceded, '포인트': points, '시즌': season})

    # season 값이 '-K-League'인 모든 행 삭제
    delete_query = "DELETE FROM `rank` WHERE season = %s"
    dbCursor.execute(delete_query, season)
    sports_db.commit()

    # kteam_data의 각 요소를 rank 테이블의 컬럼과 일치하는 값으로 입력
    for data in kteam_data:
        query = "INSERT INTO `rank` (team_id, season, wins, losses, drawns, scored, conceded, points) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = (data['팀아이디'], data['시즌'], data['승'], data['패'], data['무'], data['득점'], data['실점'], data['포인트'])
        dbCursor.execute(query, values)
        sports_db.commit()

    sports_db.close()

    # 데이터 출력
    for data in kteam_data:
        print(f"팀: {data['팀명']}, 팀아이디: {data['팀아이디']}, 시즌: {data['시즌']}, 승: {data['승']}, 패: {data['패']}, 무: {data['무']}, 포인트: {data['포인트']}, 득점: {data['득점']}, 실점: {data['실점']}")



# 매일 자정에 작업 실행
schedule.every().day.at("00:30").do(update_kleague_ranking)
update_kleague_ranking()
# # 프로그램 종료까지 대기
# while schedule.jobs:
#     schedule.run_pending()
#     time.sleep(1)