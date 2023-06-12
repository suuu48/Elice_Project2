import express from 'express';
import * as categoryController from '../controller/category.controller';
export const categoryRoute = express();

// 카테고리 조회
categoryRoute.get('/', categoryController.getCategoriesHandler);

export default categoryRoute;