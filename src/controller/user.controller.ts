import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import * as User from '../models/user';
import { AppError } from '../utils/errorHandler';

// Todo: userId 에러처리!
// 유저 정보 조회
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.user_id;

  try {
    //  if (!userId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');
    const userInfo = await userService.getUser(userId);

    res.status(200).json({ message: '유저 정보 조회 성공', data: userInfo });
  } catch (error: any) {
    console.log('유저 정보 조회 실패');
    throw error;
  }
};

// 유저 정보 수정
export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.user_id;

  try {
    const { nickname, phone, interest, img } = req.body;

    if (!nickname && !phone && !interest && !img) throw new AppError(400, '변경된 값이 없습니다!');

    const updateUserData: User.updateUserInput = {
      nickname,
      phone,
      interest,
      img,
    };

    const userInfo = await userService.updateUserInfo(userId, updateUserData);

    res.status(201).json({ message: '유저 수정 성공', data: userInfo });
  } catch (error: any) {
    console.log('유저 수정 실패');
    throw error;
  }
};

// 유저 삭제
export const hardDeleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.user_id;

  try {
    const deletedUserID = await userService.removeUser(userId);

    res.status(200).json({ message: '계정 삭제 성공', data: { user_id: deletedUserID } });
  } catch (error: any) {
    console.log('계정 삭제 실패');
    throw error;
  }
};

// 유저 작성글 조회
export const getPostByUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.user_id;

  try {
    const category = Number(req.query.category);

    const posts = await userService.getPostsByUser(userId, category);

    res.status(200).json({ message: '유저 게시글 조회 성공', data: posts });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 유저 게시글 조회 실패'));
    }
  }
};

// 유저 shorts 조회
export const getShortsByUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user.user_id;

  try {
    const category = Number(req.query.category);

    const shorts = await userService.getShortsByUser(userId, category);

    res.status(200).json({ message: '유저 shorts 조회 성공', data: shorts });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 유저 shorts 조회 실패'));
    }
  }
};
