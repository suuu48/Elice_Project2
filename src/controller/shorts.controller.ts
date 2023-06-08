import { Request, Response, NextFunction } from 'express';
import * as shortsService from '../services/shorts.service';
import { AppError } from '../../../back/src/utils/errorHandler';
import { createShortsInput } from '../database/schemas/shorts.entity';

// 쇼츠 최신 순 목록 조회
export const getShortsListHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = Number(req.query.category);

    const shorts = await shortsService.getShortsList(category);

    res.status(200).json({ message: '쇼츠 목록 조회 성공', data: shorts });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 쇼츠 목록  조회 실패'));
    }
  }
};

// 쇼츠 상세 조회
export const getShortsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shorts_id = Number(req.params.shorts_id);

    const shorts = await shortsService.getShorts(shorts_id);

    res.status(200).json({ message: '쇼츠 상세 조회 성공', data: shorts });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 쇼츠 상세 조회 실패'));
    }
  }
};

// 쇼츠 등록
export const addShortsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = Number(req.params);
    const { category, title, src } = req.body;

    if (user_id === null) throw new AppError(400, '회원 ID를 입력해주세요.');

    if (!category || !title || !src)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const shortsData: createShortsInput = {
      user_id,
      category,
      title,
      src,
    };

    const createShorts = await shortsService.addShorts(shortsData);

    res.status(200).json({ message: '쇼츠 등록성공', data: createShorts });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 게시글 등록 실패'));
    }
  }
};

// 게시글 삭제
export const removeShortsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shorts_id = Number(req.params);

    if (shorts_id === undefined) throw new AppError(400, 'shorts_id를 입력해주세요.');

    const deletedShorts = await shortsService.removeShorts(shorts_id);

    res.status(200).json({ message: 'shorts 삭제 성공', data: { shorts_id: deletedShorts } });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] shorts 삭제 실패'));
    }
  }
};
