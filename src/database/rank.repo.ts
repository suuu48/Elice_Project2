import { db } from '../config/dbconfig';

// 종목 별 시즌 조회
export const findSeasonByCategory = async (category: number): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `SELECT DISTINCT r.season
      FROM \`rank\` r
      JOIN team t On t.id = r.team_id
      WHERE t.category = ? `,
      [category]
    );

    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 종목, 시즌 별 팀 순위
export const findRankByCategory = async (category: number, season: string): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `SELECT (SELECT COUNT(*) + 1 FROM sports.rank r2 WHERE r2.season = r.season AND (r2.wins > r.wins OR (r2.wins = r.wins AND r2.points > r2.points))) AS rating
      ,t.category, r.season, r.team_id, t.name AS team_name, t.img, r.wins, r.losses, r.drawns, r.scored, r.conceded, r.points     
      FROM \`rank\` r
      JOIN team t On t.id = r.team_id
      WHERE t.category = ? and r.season =?
      ORDER BY r.wins DESC, r.points DESC`,
      [category, season]
    );
    console.log(row)
    return row;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
