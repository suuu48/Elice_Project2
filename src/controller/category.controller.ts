import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';

// 카테고리 조회 API 핸들러
export const getCategoriesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 데이터베이스에서 카테고리 정보 조회
    const categories = await categoryService.fetchCategoriesFromDb();

    // 응답으로 카테고리 정보를 JSON 형식으로 반환
    res.status(200).json({ message: '카테고리 조회 성공', data: categories });
  } catch (error: any) {
    console.log('카테고리 조회 실패');
    throw error;
  }
};
