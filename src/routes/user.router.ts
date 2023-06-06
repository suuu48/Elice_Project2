import express from 'express';
import * as userController from '../controller/user.controller';
export const userRoute = express();

// 유저 정보 조회
userRoute.get('/:email', userController.getUserInfo);

// 유저 정보 수정
userRoute.post('/:email', userController.updateUserHandler);

// 유저 정보 삭제
userRoute.delete('/:email', userController.hardDeleteUserHandler);
