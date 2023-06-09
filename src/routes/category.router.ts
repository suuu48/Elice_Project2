import express from 'express';
import { getCategoriesHandler } from "../controller/category.controller";
export const categoryRoute = express();

// 카테고리 조회
categoryRoute.get('/', getCategoriesHandler);

// 카테고리 유효성 체크
//categoryRoute.get('/:categoryId', validateCategory);

export default categoryRoute;