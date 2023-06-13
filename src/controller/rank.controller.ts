import { Request, Response, NextFunction } from 'express';
import * as rankService from '../services/rank.service';

// 종목별 시즌 조회
export const getSeasonHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = Number(req.params.category);

    if (typeof category !== 'number') throw new Error(`category 유효값 체크`);

    const seasons = await rankService.getSeason(category);

    res.status(200).json({ message: '시즌 목록 조회 성공', data: seasons });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

// 종목 별 팀 순위 조회
export const getRanksHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = Number(req.params.category);
    const season = req.params.season;

    if (typeof category !== 'number') throw new Error(`category 필수값임`);
    if (!season) throw new Error(`category 필수값임`);

    const ranks = await rankService.getRank(category, season);

    res.status(200).json({ message: '순위 목록 조회 성공', data: ranks });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
