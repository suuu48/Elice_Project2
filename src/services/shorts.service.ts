import * as shortsRepo from '../database/shorts.repo';
import { AppError } from '../../../back/src/utils/errorHandler';
import { createShortsInput } from '../database/schemas/shorts.entity';

// 메인/카테고리별 쇼츠 목록 조회
export const getShortsList = async (category: number | undefined): Promise<any[]> => {
  try {
    let shorts;
    if (category === undefined) {
      shorts = await shortsRepo.findShortsAll();
    } else {
      shorts = await shortsRepo.findShortsByCategory(category);
    }

    if (shorts === undefined) throw new AppError(404, '쇼츠 목록이 없습니다.');

    return shorts;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 댓글 목록 조회 실패');
    }
  }
};

// 쇼츠 상세 조회
export const getShorts = async (shorts_id: number): Promise<any[]> => {
  try {
    const isValid = await shortsRepo.isShortsIdValid(shorts_id);
    if (isValid === false) throw new AppError(404, '존재하는 쇼츠가 없습니다.');

    const shorts = await shortsRepo.findShortsById(shorts_id);
    if (shorts === undefined) throw new AppError(404, '해당 쇼츠가 없습니다.');

    await shortsRepo.viewShorts(shorts_id);

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

// shorts 등록
export const addShorts = async (inputData: createShortsInput): Promise<any> => {
  try {
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
export const removeShorts = async (shorts_id: number): Promise<any> => {
  try {
    const isValid = await shortsRepo.isShortsIdValid(shorts_id);
    if (isValid === false) throw new AppError(404, '존재하는 쇼츠가 없습니다.');

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
