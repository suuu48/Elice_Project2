import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import * as User from '../database/schemas/user.entity';

// 유저 정보 조회
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params);

    if (!userId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');

    const userInfo = await userService.getUser(userId);

    res.status(201).json({ message: '유저 정보 조회 성공', data: userInfo });
  } catch (error: any) {
    console.log('유저 정보 조회 실패');
    throw error;
  }
};

// 유저 정보 수정
export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params); // user.id는 number니까
    const imgFileRoot = `http://localhost:3000/api/v1/static/${req.file?.filename}`;

    if (!userId) throw new Error('[ 요청 에러 ] 아이디를 반드시 입력해야 합니다.');

    const { nickname, phone, interest, img } = req.body;

    if (!nickname && !phone && !interest && !img)
      throw new Error('[ 요청 에러 ] 변경된 값이 없습니다!');

    const updateUserData: User.updateUserInput = {
      nickname,
      phone,
      interest,
      img: imgFileRoot,
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
  try {
    const userId = Number(req.params);
    if (!userId) throw new Error('[요청 에러] 사용자 아이디를 반드시 입력해야 합니다.');

    const deleteId = await userService.hardDelete(userId);
    res.status(200).json({ message: '유저 삭제 성공', data: deleteId });
  } catch (error: any) {
    console.log('계정 삭제 실패');
    throw error;
  }
};

// 유저 작성글 조회
export const getPostByUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params);
    if (!userId) throw new Error('[요청 에러] 사용자 아이디를 반드시 입력해야 합니다.');

    const category = Number(req.query.category);

    const posts = await userService.getPostsByUser(category, userId);

    res.status(200).json({ message: '유저 게시글 조회 성공', data: posts });
  } catch (error: any) {
    console.log('유저 게시글 조회 실패');
    throw error;
  }
};

// 유저 shorts 조회
export const getShortsByUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params);
    if (!userId) throw new Error('[요청 에러] 사용자 아이디를 반드시 입력해야 합니다.');

    const category = Number(req.query.category);

    const shorts = await userService.getPostsByUser(category, userId);

    res.status(200).json({ message: '유저 shorts 조회 성공', data: shorts });
  } catch (error: any) {
    console.log('유저 shorts 조회 실패');
    throw error;
  }
};
