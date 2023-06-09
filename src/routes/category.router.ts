import express from 'express';
import { getCategoriesHandler } from "../controller/category.controller";
export const categoryRoute = express();

// 카테고리 조회
categoryRoute.get('/', getCategoriesHandler);

export default categoryRoute;