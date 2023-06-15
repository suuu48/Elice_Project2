from urllib.request import urlopen
from bs4 import BeautifulSoup
import pymysql
import schedule
# import time


def update_kbo_ranking():
    # db에 connect
    sports_db = pymysql.connect(host="sports.caeuznininfh.ap-southeast-2.rds.amazonaws.com", user="root", password="sports1234", charset="utf8")
    dbCursor = sports_db.cursor()
    dbCursor.execute('USE sports')


    # TeamRank 페이지에서 html 가져오기(name, wins, losses, drawns, points, season)
    teamRank_html = urlopen('https://www.koreabaseball.com/TeamRank/TeamRank.aspx')
    teamRankObject = BeautifulSoup(teamRank_html, "html.parser")
    # 기록실>팀기록>타자 페이지에서 html 가져오기(scored)
    scored_html = urlopen('https://www.koreabaseball.com/Record/Team/Hitter/Basic1.aspx')
    scoredObject = BeautifulSoup(scored_html, "html.parser")
    # 기록실>팀기록>투수 페이지에서 html 가져오기(conceded)
    conceded_html = urlopen('https://www.koreabaseball.com/Record/Team/Pitcher/Basic1.aspx')
    concededObject = BeautifulSoup(conceded_html, "html.parser")


    # 시즌 정보 가져오기
    season_element = teamRankObject.find('span', id='cphContents_cphContents_cphContents_lblSearchDateTitle')
    season_text = season_element.text.strip()
    year = season_text.split('.')[0]
    season = year + '-KBO'


    # KBO teamrank 페이지의 table에 tData가져오기
    teamrankTable = teamRankObject.find('table', class_='tData')
    teamrankRows = teamrankTable.find_all('tr')
    # scored 정보 가져오기
    scoredTable = scoredObject.find('table', class_='tData')
    scoredRows = scoredTable.find_all('tr')
    # conceded 정보 가져오기
    concededTable = concededObject.find('table', class_='tData')
    concededRows = concededTable.find_all('tr')


    team_data = []
    # 팀 데이터에 팀아이디, 승, 패, 시즌 정보 추가
    for row in teamrankRows[1:]:
        columns = row.find_all('td')
        name = columns[1].text.strip()
        wins = int(columns[3].text.strip())
        losses = int(columns[4].text.strip())
        drawns = int(columns[5].text.strip())
        points = int(float(columns[6].text.strip()) * 1000)
        
        # name과 DB의 team table의 name을 비교하여 id 가져오기
        query = "SELECT id FROM team WHERE name = %s"  # 팀 테이블에서 name 열이 일치하는 id 조회
        dbCursor.execute(query, name)
        result = dbCursor.fetchone()
        if result is not None:
            team_id = result[0]
        else:
            print("해당하는 팀을 찾을 수 없습니다.")
            continue
        
        team_data.append({'팀명': name, '팀아이디': team_id, '승': wins, '패': losses, '무': drawns, '포인트': points, '시즌': season})
        
    # 팀 데이터에 scored 정보 추가
    for row in scoredRows[1:]:
        columns = row.find_all('td')
        team = columns[1].text.strip()
        scored = int(columns[6].text.strip())

        for data in team_data:
            if data['팀명'] == team:
                data['스코어'] = scored
                break
            
    # 팀 데이터에 conceded 정보 추가
    for row in concededRows[1:]:
        columns = row.find_all('td')
        team = columns[1].text.strip()
        conceded = int(columns[15].text.strip())

        for data in team_data:
            if data['팀명'] == team:
                data['실점'] = conceded
                break

    # season 값이 '-KBO'인 모든 행 삭제
    delete_query = "DELETE FROM `rank` WHERE season = %s"
    dbCursor.execute(delete_query, season)
    sports_db.commit()

    # team_data의 각 요소를 rank 테이블의 컬럼과 일치하는 값으로 입력
    for data in team_data:
        query = "INSERT INTO `rank` (team_id, season, wins, losses, drawns, scored, conceded, points) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        values = (data['팀아이디'], data['시즌'], data['승'], data['패'], data['무'], data['스코어'], data['실점'], data['포인트'])
        dbCursor.execute(query, values)
        sports_db.commit()

    sports_db.close()

    # 데이터 출력
    for data in team_data:
        print(f"팀: {data['팀명']}, 팀아이디: {data['팀아이디']}, 시즌: {data['시즌']}, 승: {data['승']}, 패: {data['패']}, 무: {data['무']}, 포인트: {data['포인트']}, 스코어: {data['스코어']}, 실점: {data['실점']}")



# 매일 자정에 작업 실행
schedule.every().day.at("00:00").do(update_kbo_ranking)
update_kbo_ranking()
# # 프로그램 종료까지 대기
# while schedule.jobs:
#     schedule.run_pending()
#     time.sleep(1)