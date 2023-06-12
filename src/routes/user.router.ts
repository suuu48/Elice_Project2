import express from 'express';
import * as userController from '../controller/user.controller';
import { isAccessTokenValid } from '../middleware/jwt';

export const userRoute = express();

// 모두 로그인 필요
// 유저 정보 조회
userRoute.get('/', isAccessTokenValid, userController.getUserInfo);

// 유저 정보 수정
userRoute.post('/', isAccessTokenValid, userController.updateUserHandler);

// 유저 정보 삭제
userRoute.delete('/', isAccessTokenValid, userController.hardDeleteUserHandler);

// 유저 게시글 조회
userRoute.get('/post/', isAccessTokenValid, userController.getPostByUserHandler);

// 유저 동영상 조회
userRoute.get('/shorts/', isAccessTokenValid, userController.getShortsByUserHandler);
