import * as rankRepo from '../database/rank.repo';

export const getSeason = async (category: number): Promise<any[]> => {
  try {
    const ranks = await rankRepo.findSeasonByCategory(category);

    if (ranks === undefined) throw new Error('[ 순위 조회 에러 ] 뭐라고 써야할지 모르겠음!');

    return ranks;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getRank = async (category: number, season: string): Promise<any[]> => {
  try {
    const ranks = await rankRepo.findRankByCategory(category, season);

    if (ranks === undefined) throw new Error('[ 순위 조회 에러 ] 뭐라고 써야할지 모르겠음!');

    return ranks;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
