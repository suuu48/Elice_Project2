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
/*
// 카테고리 유효성 체크
export const validateCategory = async (req: Request, res: Response, next: NextFunction) => {
    // 카테고리 조회 API를 호출하여 유효성 검사
    try {
        const categoryId = req.params.id;
        const categories = await categoryService.getCategories(); // 카테고리 조회 서비스 메소드 호출
    
        const isValidCategory = categories.data.some((category: { id: number }) => category.id === Number(categoryId));
    
        if (!isValidCategory) {
            return res.status(400).json({ message: 'Invalid category' });
        }
  
        next();
    } catch (error) {
        console.error('Error validating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

 */