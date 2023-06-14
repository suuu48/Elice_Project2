import * as shortsRepo from '../database/shorts.repo';
import { AppError } from '../../../back/src/utils/errorHandler';
import { createShortsInput } from '../models/shorts';
import fs from 'fs';
import * as categoryRepo from '../database/category.repo';
import { env } from '../config/envconfig';
import {findShortsListByCategory} from "../database/shorts.repo";

// 메인/카테고리별 쇼츠 목록 조회
export const getShortsList = async (category: number | undefined): Promise<any[]> => {
  try {
    const categories = await categoryRepo.getCategoriesInfo();

    const isCategoryValid = category !== undefined && !isNaN(category);

    if (isCategoryValid) {
      const categoryExists = categories.some((categoryObj) => categoryObj.id === Number(category));
      if (!categoryExists) throw new AppError(400, '유효하지 않은 카테고리입니다.');
      const shorts = await shortsRepo.findShortsByCategory(category);
      if (shorts === undefined) throw new AppError(404, '쇼츠 목록이 없습니다.');

      return shorts;
    } else {
      const shorts = await shortsRepo.findShortsAll();
      if (shorts === undefined) throw new AppError(404, '쇼츠 목록이 없습니다.');

      return shorts;
    }
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 쇼츠 목록 조회 실패');
    }
  }
};

// 쇼츠 상세 조회
export const getShorts = async ( shorts_id: number, user_id: number): Promise<any> => {
  try {
      const isValid = await shortsRepo.isShortsIdValid(shorts_id);
      if (!isValid) throw new AppError(204, '존재하는 쇼츠가 없습니다.');

      if (user_id !== 0) {
        // 조회수 증가
        const isViews = await shortsRepo.getUserShortsViewStatus(shorts_id, user_id);
        if (isViews === 0) {
          const insertRedis = await shortsRepo.incrementShortsViewCount(shorts_id, user_id);
          if (!insertRedis) throw new AppError(404, 'Redis에 업로드 실패'); //Todo: 에러 메세지 변경

          const views = await shortsRepo.viewShorts(shorts_id);
          if (views.affectedRows !== 1) throw new AppError(404, '조회수 업로드 실패');
        }
      }
      const detailShorts = await shortsRepo.findShortsById(shorts_id);
      if (!detailShorts) throw new AppError(404, 'shorts 정보가 없습니다.');

      return detailShorts;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 쇼츠  조회 실패');
    }
  }
};

// 쇼츠 아이디 리스트 조회
export const getIdList = async (category: number | undefined): Promise<any> => {
  try {
    if (typeof category === 'number' && !isNaN(category)) {
      // category 값이 있을 경우!
      const idLists = await shortsRepo.findShortsListByCategory(category);
      if (!idLists) throw new AppError(404, 'shorts_id 리스트 정보가 없습니다.');
      return idLists;
    } else{
      // category 값이 없을 경우
      const idLists = await shortsRepo.findShortsListByCreated();
      if (!idLists) throw new AppError(404, 'shorts_id 리스트 정보가 없습니다.');
      return idLists;
    }

  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 쇼츠 목록 조회 실패');
    }
  }
};
// shorts 등록
export const addShorts = async (inputData: createShortsInput): Promise<any> => {
  try {
    const categories = await categoryRepo.getCategoriesInfo();

    const categoryExists = categories.some(
      (category) => category.id === Number(inputData.category)
    );

    if (!categoryExists) throw new AppError(400, '유효하지 않은 카테고리입니다.');

    const shortsId = await shortsRepo.createShorts(inputData);
    if (shortsId === undefined) throw new AppError(404, '생성된 쇼츠가 없습니다.');

    const shorts = await shortsRepo.findShortsById(shortsId);
    if (!shorts) throw new AppError(404, '생성된 쇼츠가 없습니다.');

    return shorts;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 쇼츠 등록 실패');
    }
  }
};

// 쇼츠 삭제
export const removeShorts = async (shorts_id: number, user_id: number): Promise<number> => {
  try {
    const isValid = await shortsRepo.isShortsIdValid(shorts_id);

    if (isValid.id === undefined) throw new AppError(404, '존재하는 쇼츠가 없습니다.');

    if (isValid.user_id !== user_id) throw new AppError(403, '작성자만 삭제 가능합니다');

    await removeImage(shorts_id);

    const removedCommentId = await shortsRepo.deleteShorts(shorts_id);

    return removedCommentId;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 쇼츠 삭제 실패');
    }
  }
};

/* shorts 이미지 로컬 삭제 */
const removeImage = async (shorts_id: number) => {
  const foundShorts = await shortsRepo.findShortsById(shorts_id);

  if (foundShorts.src) {
    const imgFileName = foundShorts.src.split('/')[6];

    const filePath = `${env.FILE_PATH}/shorts/${imgFileName}`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, '쇼츠 이미지 삭제 중 오류가 발생했습니다.');
    });
  } else return;
};
