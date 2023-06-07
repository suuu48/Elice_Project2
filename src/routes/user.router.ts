import express from 'express';
import * as userController from '../controller/user.controller';

export const userRoute = express();

// 모두 로그인 필요
// 유저 정보 조회
userRoute.get('/:user_id', userController.getUserInfo);

// 유저 정보 수정
userRoute.post('/:user_id', userController.updateUserHandler);

// 유저 정보 삭제
userRoute.delete('/:user_id', userController.hardDeleteUserHandler);

// 유저 게시글 조회
userRoute.get('/post/:user_id/', userController.getPostByUserHandler);

// 유저 동영상 조회
userRoute.get('/shorts/:user_id', userController.getShortsByUserHandler);