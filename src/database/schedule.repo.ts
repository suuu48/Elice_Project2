import { db } from '../config/dbconfig';

//Todo: any타입 변경

// 종목 별 팀 조회
export const findTeamByCategory = async (category: number): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `
            SELECT *
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
      `
            SELECT s.id, DATE_FORMAT(s.start_time, '%Y-%m-%d') AS start_date, TIME(s.start_time) AS start_time , s.location, t1.name AS team1, t2.name AS team2, s.score1, s.score2, s.state
            FROM schedule s 
            JOIN team t1 On s.team1 = t1.id
            JOIN team t2 ON s.team2 = t2.id
            WHERE t1.category = ? and t2.category = ?`,
      [category, category]
    );

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
      `
    SELECT s.id, DATE_FORMAT(s.start_time, '%Y-%m-%d') AS start_date, TIME(s.start_time) AS start_time , s.location, t1.name AS team1, t2.name AS team2, s.score1, s.score2, s.state
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

// 일별 경기 일정 수 조회
export const findCountByDay = async (): Promise<any[]> => {
  try {
    const [row]: any = await db.query(
      `
                SELECT DATE(start_time) AS match_date, COUNT(*) AS num_matches
                FROM schedule
                GROUP BY DATE(start_time);`
    );

    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 일별 경기 일정 조회
export const findScheduleByDay = async (day: string): Promise<any[]> => {
  try {
    const [row]: any = await db.query(
      `
                SELECT s.id, DATE_FORMAT(s.start_time, '%Y-%m-%d') AS start_day, TIME(s.start_time) AS start_time , s.location, t1.name AS team1, t2.name AS team2, s.score1, s.score2, s.state
                FROM schedule s
                         JOIN team t1 ON s.team1 = t1.id
                         JOIN team t2 ON s.team2 = t2.id
                WHERE DATE(s.start_time) = ?
                order by start_time;`,
      [day]
    );

    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
