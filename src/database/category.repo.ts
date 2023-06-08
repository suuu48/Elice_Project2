import { db } from '../config/dbconfig';

// 모든 카테고리 정보를 검색합니다.
export const getCategoriesInfo = async (): Promise<any[]> => {
  try {
    const [rows]: any = await db.query('SELECT * FROM category');
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('카테고리 정보를 검색하는데 실패했습니다.');
  }
};