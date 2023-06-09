import jwt from 'jsonwebtoken';
import * as userRepo from '../database/user.repo';
import { createUserInput, UserProfile } from '../database/schemas/user.entity';
import { env } from '../config/envconfig';
import fs from 'fs';
import { AppError } from '../../../back/src/utils/errorHandler';
import { getUserInfoById } from '../database/user.repo';

// 회원가임
export const addUser = async (inputData: createUserInput) => {
  try {
    const newUserId = await userRepo.createUser(inputData);

    const user = await userRepo.getUserInfoById(newUserId);
    if (!user) throw new Error('[ 유저 가입 에러 ] 가입된 유저를 찾을 수 없습니다.');

    return user;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(500, error.message || null);
    }
  }
};

// 로그인
export const getUserToken = async (userId: number): Promise<any> => {
  try {
    const user = await userRepo.getUserInfoById(userId);
    if (user === undefined) throw new AppError(404, '회원가입된 유저가 없습니다.');
    // 로그인 시작 -> JWT 웹 토큰 생성
    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'default-access-token-secret';
    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'default-refresh-token-secret';

    const payload = {
      user_id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new Error('[JWT 토큰 에러] 토큰 발급에 실패했습니다.');
  }
};
