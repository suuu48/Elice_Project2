import jwt from 'jsonwebtoken';
import * as userRepo from '../database/user.repo';
import { createUserInput } from '../database/types/user.entity';
import { env } from '../config/envconfig';
import { AppError } from '../../../back/src/utils/errorHandler';
import * as categoryRepo from '../database/category.repo';

// 회원가임
export const addUser = async (inputData: createUserInput) => {
  try {
    const categories = await categoryRepo.getCategoriesInfo();

    if (inputData.interest) {
      const categoryExists = categories.some(
        (category) => category.id === Number(inputData.interest)
      );
      if (!categoryExists) {
        throw new AppError(400, '유효하지 않은 카테고리입니다.');
      }
    }

    const newUserId = await userRepo.createUser(inputData);

    const user = await userRepo.getUserInfoById(newUserId);
    if (!user) throw new AppError(404, '가입된 유저를 찾을 수 없습니다.');

    return user;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 회원가입 실패');
    }
  }
};

// 로그인
export const getUserToken = async (user_id: number): Promise<any> => {
  try {
    const user = await userRepo.getUserInfoById(user_id);
    if (!user.id) throw new AppError(404, '존재하지 않는 아이디 입니다.');
    // 로그인 시작 -> JWT 웹 토큰 생성
    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'default-access-token-secret';
    const refreshTokenSecret = env.REFRESH_TOKEN_SECRET || 'default-refresh-token-secret';

    const payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { user, accessToken, refreshToken };
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 로그인 실패');
    }
  }
};
