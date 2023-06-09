import * as categoryRepo from '../database/category.repo';

// DB에서 카테고리 정보 확인
export const fetchCategoriesFromDb = async (): Promise<any[]> => {
  try {
    // 데이터베이스에서 카테고리 정보 조회
    const categories = await categoryRepo.getCategoriesInfo();

    // 조회된 카테고리 정보를 배열로 변환하여 반환
    return categories;
  } catch (error) {
    // 에러 처리
    throw new Error('카테고리 정보를 가져오는데 실패했습니다.');
  }
};