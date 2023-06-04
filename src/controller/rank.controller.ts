import { Request, Response, NextFunction } from 'express';
import * as rankService from '../services/rank.service';

// 종목별 시즌 조회
export const getSeasonHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = Number(req.params.category);

    if (!category) throw new Error(`category 필수값임`);

    const seasons = await rankService.getSeason(category);

    res.status(200).json({ message: '시즌 목록 조회 성공', data: seasons });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

// 시즌별 순위 조회
export const getRanksHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = Number(req.params.category);
    const season = req.params.season;

    if (!category) throw new Error(`category 필수값임`);
    if (!season) throw new Error(`category 필수값임`);

    const isSeason = await rankService.getSeason(category);

    const matchingSeason = isSeason.find((item) => item.season === season);
    if (!matchingSeason) {
      throw new Error(`해당 종목의 시즌이 아닙니다`);
    }

    const ranks = await rankService.getRank(category, season);

    res.status(200).json({ message: '순위 목록 조회 성공', data: ranks });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
