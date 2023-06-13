import express from 'express';
import * as shortController from '../controller/shorts.controller';
import { isAccessTokenValid } from '../middleware/jwt';
import { uploadShorts } from '../middleware/multer';

export const shortsRoute = express();

// 최신순 목록 조회
shortsRoute.get('/', shortController.getShortsListHandler);

// 메이페이지에서 디테일 페이지로(1번)
shortsRoute.get('/detail', isAccessTokenValid, shortController.getShortsHandler);

// 쇼츠 정보 조회(3번)
shortsRoute.get('/detail/:shorts_id', isAccessTokenValid, shortController.getNextShortsHandler);

// 카테고리페이지에서 디테일 페이지(2번)
shortsRoute.get('/category/detail', isAccessTokenValid, shortController.getShortsByCategoryHandler);

// 쇼츠 등록 (로그인 필요)
shortsRoute.post('/', isAccessTokenValid, uploadShorts, shortController.addShortsHandler);

// 쇼츠 삭제 (로그인 필요)
shortsRoute.delete('/:shorts_id', isAccessTokenValid, shortController.removeShortsHandler);
