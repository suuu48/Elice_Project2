import * as userRepo from '../database/user.repo';
import { updateUserInput, UserProfile } from '../database/types/user.entity';
import * as postRepo from '../database/post.repo';
import * as shortsRepo from '../database/shorts.repo';
import { AppError } from '../utils/errorHandler';
import * as categoryRepo from '../database/category.repo';

// 유저 정보 조회
export const getUser = async (userId: number): Promise<UserProfile> => {
  try {
    const foundUser = await userRepo.getUserInfoById(userId);
    if (!foundUser.id) throw new AppError(404, '존재하지 않는 아이디 입니다.');

    return foundUser;
  } catch (error) {
    console.error(error);
    throw new Error('[유저 정보 조회 에러] 정보 조회에 실패했습니다.');
  }
};

// 유저 정보 수정
export const updateUserInfo = async (
  userId: number,
  updateData: updateUserInput
): Promise<UserProfile> => {
  try {
    const foundUser = await userRepo.getUserInfoById(userId);
    if (!foundUser.id) throw new AppError(404, '존재하지 않는 아이디 입니다.');

    // 카테고리 유효성 검사
    const categories = await categoryRepo.getCategoriesInfo();

    if (updateData.interest) {
      const categoryExists = categories.some(
        (category) => category.id === Number(updateData.interest)
      );
      if (!categoryExists) {
        throw new AppError(400, '유효하지 않은 카테고리입니다.');
      }
    }

    const updateUser = await userRepo.updateUser(userId, updateData);
    const user = await userRepo.getUserInfoById(updateUser.id);
    return user;
  } catch (error) {
    console.error(error);
    throw new Error('[유저 수정 에러] 유저 정보 수정에 실패했습니다.');
  }
};

// 유저 삭제
export const removeUser = async (userId: number): Promise<number> => {
  try {
    const foundUser = await userRepo.getUserInfoById(userId);
    if (!foundUser.id) throw new AppError(404, '존재하지 않는 아이디 입니다.');

    const deleteId = await userRepo.deleteUser(userId);

    return deleteId;
  } catch (error: any) {
    console.log(error);
    throw new Error('유저 삭제에 실패했습니다.');
  }
};

// 유저가 작성한 게시글 목록 조회
export const getPostsByUser = async (
  userId: number,
  category: number | undefined
): Promise<any[]> => {
  try {
    const isCategoryValid = category !== undefined && !isNaN(category);
    const posts = isCategoryValid
      ? await postRepo.findPostsByUserAndCategory(userId, category)
      : await postRepo.findPostsByUser(userId);

    if (posts === undefined) throw new Error('[ 게시글 조회 에러 ] 게시글 조회 실패');

    return posts;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 목록 조회 실패');
    }
  }
};

// 유저가 작성한 쇼츠 목록 조회
export const getShortsByUser = async (
  userId: number,
  category: number | undefined
): Promise<any[]> => {
  try {
    const isCategoryValid = category !== undefined && !isNaN(category);
    const shorts = isCategoryValid
      ? await shortsRepo.findShortsByUserAndCategory(userId, category)
      : await shortsRepo.findShortsByUser(userId);

    if (shorts === undefined) throw new Error('[ shorts 조회 에러 ] shorts 목록 조회 실패');

    return shorts;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] shorts 목록 조회 실패');
    }
  }
};
