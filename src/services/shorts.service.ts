import * as shortsRepo from '../database/shorts.repo';
import { AppError } from '../../../back/src/utils/errorHandler';
import { createShortsInput } from '../database/types/shorts.entity';
import fs from 'fs';
import * as categoryRepo from '../database/category.repo';

// 메인/카테고리별 쇼츠 목록 조회
export const getShortsList = async (category: number | undefined): Promise<any[]> => {
  try {
    const categories = await categoryRepo.getCategoriesInfo();

    const categoryExists = categories.some((category) => category.id === Number(category.category));
    if (!categoryExists) throw new AppError(400, '유효하지 않은 카테고리입니다.');

    const isCategoryValid = category !== undefined && !isNaN(category);
    const shorts = isCategoryValid
      ? await shortsRepo.findShortsAll()
      : await shortsRepo.findShortsByCategory(category);

    if (shorts === undefined) throw new AppError(404, '쇼츠 목록이 없습니다.');

    return shorts;
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
export const getShorts = async (
  shorts_id: number | undefined,
  category: number
): Promise<any[]> => {
  try {
    if (typeof shorts_id === 'number' && !isNaN(shorts_id)) {
      const isValid = await shortsRepo.isShortsIdValid(shorts_id);
      if (!isValid) throw new AppError(404, '존재하는 쇼츠가 없습니다.');
      const detailShorts = await shortsRepo.findShortsByIdAndCategory(shorts_id, category);
      await shortsRepo.viewShorts(shorts_id);
      return detailShorts;
    } else {
      const detailShorts = await shortsRepo.findOneShortsByCategory(category);
      return detailShorts;
    }
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

    const filePath = `/Users/subin/IdeaProjects/back/public/shorts/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, '쇼츠 이미지 삭제 중 오류가 발생했습니다.');
    });
  } else return;
};
