import * as rankRepo from '../database/rank.repo';
import * as categoryRepo from "../database/category.repo";
import {AppError} from "../utils/errorHandler";

export const getSeason = async (category: number): Promise<any[]> => {
  try {
    const seasons = await rankRepo.findSeasonByCategory(category);

    if (seasons === undefined) throw new AppError(400,'데이터가 존재하지 않습니다.');

    return seasons;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export const getRank = async (category: number, season: string): Promise<any> => {
  try {
    const categories = await categoryRepo.getCategoriesInfo();
    const categoryExists = categories.some((categoryObj) => categoryObj.id === category);

    if (!categoryExists) throw new AppError(400, '유효하지 않은 카테고리입니다.');

    const ranks = await rankRepo.findRankByCategory(category, season);

    if (ranks === undefined) throw new AppError(400,'[ 순위 조회 에러 ] 순위 데이터 없음');

    return ranks;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
