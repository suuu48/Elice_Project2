import { Request, Response, NextFunction } from 'express';
import * as shortsService from '../services/shorts.service';
import { AppError } from '../../../back/src/utils/errorHandler';
import { env } from '../config/envconfig';
import { createShortsInput } from '../models/shorts';

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

// 메인페이지 목록에서 detail 페이지로 조회시 shorts 정보와 다음 shorts_id 리스트 조회(1번)
export const getShortsHandler = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user.user_id;
  try {
    const shorts_id = Number(req.query.shorts_id);
    if(!shorts_id) throw new AppError(400, 'shorts_id는 필수값입니다!');
    const category = Number(req.query.category);

    const detail = await shortsService.getShorts(shorts_id, user_id);
    const id_lists = await shortsService.getIdList(category);

    const lists = id_lists.map((item: any) => item.id);

    res.status(200).json({ detail: detail, lists: lists});
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
// 카테고리 페이지에서 shorts 페이지(2번)
export const getShortsByCategoryHandler = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user.user_id;
  try {
    const category = Number(req.query.category);
    if(!category) throw new AppError(400, 'category는 필수값입니다!');
    const id_lists = await shortsService.getIdList(category);

    const detail = await shortsService.getShorts(id_lists[0].id, user_id);

    const lists = id_lists.map((item: any) => item.id);

    res.status(200).json({ detail: detail, lists: lists});
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
//3번 :  다음 쇼츠 조회
export const getNextShortsHandler = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user.user_id;
  try {
    const shorts_id = Number(req.params.shorts_id);
    if(!shorts_id) throw new AppError(400, 'shorts_id는 필수값입니다!');

    const detail = await shortsService.getShorts(shorts_id, user_id);

    res.status(200).json({ detail: detail });
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
  const user_id = req.user.user_id;
  if (user_id === null && user_id === 0) throw new AppError(400, '회원 ID가 필요합니다.');
  try {
    const { category, title } = req.body;
    const imgFileRoot = `${env.STATIC_PATH}/shorts/${req.file?.filename}`;

    if (!category || !title || !imgFileRoot)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const shortsData: createShortsInput = {
      user_id,
      category,
      title,
      src: imgFileRoot,
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

// shorts 삭제
export const removeShortsHandler = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user.user_id;
  if (user_id === null && user_id === 0) throw new AppError(400, '회원 ID가 필요합니다.');
  try {
    const shorts_id = Number(req.params.shorts_id);

    if (!shorts_id) throw new AppError(400, 'shorts_id를 입력해주세요.');

    const deletedShortsId = await shortsService.removeShorts(shorts_id, user_id);

    res.status(200).json({ message: 'shorts 삭제 성공', data: { shorts_id: deletedShortsId } });
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
