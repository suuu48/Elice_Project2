import express from 'express';
import * as shortController from '../controller/shorts.controller';

export const shortsRoute = express();

// 최신순 목록 조회
shortsRoute.get('/', shortController.getShortsListHandler);

// 쇼츠 상세 조회
shortsRoute.get('/:shorts_id', shortController.getShortsHandler);

// 쇼츠 등록 (로그인 필요)
shortsRoute.post('/:user_id', shortController.addShortsHandler);

// 쇼츠 삭제 (로그인 필요)
shortsRoute.delete('/:shorts_id', shortController.removeShortsHandler);
