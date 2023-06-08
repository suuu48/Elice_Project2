import { db } from '../config/dbconfig';

//Todo: any타입 변경

// 종목 별 팀 조회
export const findTeamByCategory = async (category: number): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `SELECT *
       FROM team 
       WHERE category = ?`,
      [category]
    );

    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 종목 별 경기 일정 조회
export const findScheduleByCategory = async (category: number): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `SELECT s.id, DATE_FORMAT(s.start_time, '%Y-%m-%d') AS start_date, TIME(s.start_time) AS start_time , s.location, t1.name AS team1,t1.img AS tema1_img, t2.name AS team2, t2.img AS tema2_img,t1.category As category, s.score1, s.score2, s.state, s.season
       FROM schedule s 
       JOIN team t1 On s.team1 = t1.id
       JOIN team t2 ON s.team2 = t2.id
       WHERE t1.category = ? and t2.category = ?
       order by id`,
      [category, category]
    );
    console.log(db.query);
    console.log(row);
    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 팀별 경기 일정 조회
export const findScheduleByTeam = async (teamId: number): Promise<any[]> => {
  try {
    const [row]: any = await db.query(
      `SELECT s.id, DATE_FORMAT(s.start_time, '%Y-%m-%d') AS start_date, TIME(s.start_time) AS start_time , s.location, t1.name AS team1,t1.img AS tema1_img, t2.name AS team2, t2.img AS tema2_img,t1.category As category, s.score1, s.score2, s.state, s.season
    FROM schedule s
        JOIN team t1 On s.team1 = t1.id
        JOIN team t2 ON s.team2 = t2.id
    WHERE t1.id = ? or t2.id = ? 
    order by start_date`,
      [teamId, teamId]
    );

    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/*
// 일별 경기 일정 수 조회
export const findCountByDay = async (): Promise<any[]> => {
  try {
    const [row]: any = await db.query(
      `SELECT DATE(start_time) AS match_date, COUNT(*) AS num_matches
       FROM schedule
       GROUP BY DATE(start_time);`
    );

    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};*/

// 날짜 별 경기 일정 조회
export const findScheduleByDay = async (
  day: string,
  category: number | undefined
): Promise<any[]> => {
  try {
    const isCategoryValid = category !== undefined && !isNaN(category);
    const whereColumns = isCategoryValid
      ? `(DATE_FORMAT(s.start_time, '%Y%m%d') = ? OR DATE_FORMAT(s.start_time, '%Y-%m-%d') = ?) OR (DATE_FORMAT(s.start_time, '%Y%m') = ? OR DATE_FORMAT(s.start_time, '%Y-%m') = ?) AND t1.category = ${category}`
      : `DATE_FORMAT(s.start_time, '%Y%m%d') = ? OR DATE_FORMAT(s.start_time, '%Y-%m-%d') = ?) OR (DATE_FORMAT(s.start_time, '%Y%m') = ? OR DATE_FORMAT(s.start_time, '%Y-%m') = ?`;

    const [row]: any = await db.query(
      `SELECT s.id, DATE_FORMAT(s.start_time, '%Y-%m-%d') AS start_date, TIME(s.start_time) AS start_time , s.location, t1.name AS team1,t1.img AS tema1_img, t2.name AS team2, t2.img AS tema2_img,t1.category As category, s.score1, s.score2, s.state, s.season
       FROM schedule s
       JOIN team t1 ON s.team1 = t1.id
       JOIN team t2 ON s.team2 = t2.id
       WHERE (${whereColumns})
       order by start_time`,
      [day, day, day, day]
    );

    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 카테고리 별 팀 확인
export const checkTeamByCategory = async (category: number, teamId: number): Promise<any[]> => {
  try {
    const [row]: any = await db.query(
      `SELECT *
       FROM team
       WHERE category= ? and id= ?;`,
      [category, teamId]
    );

    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
