import { db } from '../config/dbconfig';
import { shortsProfile, createShortsInput } from './schemas/shorts.entity';

// 유저가 작성한 동영상 조회
export const findShortsByUser = async (user_id: number): Promise<any[]> => {
    try {
        const [row]: any = await db.query(
            `SELECT  *
             FROM video
             WHERE user_id =?
             ORDER BY created_at `,
            [user_id]
        );
        return row;
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 유저 별 동영상  조회 실패');
    }
};

// 유저가 작성한 동영상 종목 별 조회
export const findShortsByUserAndCategory = async (
    userId: number,
    category: number
): Promise<any> => {
    try {
        const [row]: any = await db.query(
            `SELECT v.id, v.category, v.title, v.src, v.views 
           FROM video v
           WHERE v.user_id = ? AND v.category = ? `,
            [userId, category]
        );
        return row;
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 게시글 목록 조회 실패');
    }
};

// 메인 페이지 쇼츠 조회
export const findShortsAll = async (): Promise<any[]> => {
    try {
        const [row]: any = await db.query(
            `SELECT v.id, v.title, v.src, u.img, u.nickname, v.views 
           FROM video v
           JOIN user u ON v.user_id= u.id`
        );

        return row;
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 메인페이지 쇼츠 목록 조회 실패');
    }
};
// 카테고리 별 쇼츠 목록 조회
export const findShortsByCategory = async (category: number): Promise<any[]> => {
    try {
        const [row]: any = await db.query(
            `SELECT v.id, v.title, v.src, v.created_at, u.img, u.nickname, v.views
             FROM video v
                      JOIN user u ON v.user_id= u.id
             WHERE v.category = ?`,
            [category]
        );
        return row;
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 카테고리별 쇼츠 목록 조회 실패');
    }
};

//쇼츠 상세 조회
export const findShortsById = async (shortsId: number): Promise<any> => {
    try {
        const [row]: any = await db.query(
            `SELECT v.id, v.title, v.category,v.src, v.created_at, u.img, u.nickname, v.views
             FROM video v
                      JOIN user u ON v.user_id= u.id
             WHERE v.id = ? `,
            [shortsId]
        );
        return row[0];
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 비디오 상세 조회 실패');
    }
};

// 쇼츠 등록
export const createShorts = async (inputData: createShortsInput): Promise<number> => {
    try {
        const createColumns = 'user_id, category, title, src';
        const createValues = Object.values(inputData)
            .map((value) => `'${value}'`)
            .join(', ');

        const [newPost]: any = await db.query(
            `
                INSERT INTO video (${createColumns})
                VALUES (${createValues})`
        );

        const createdVideoId = (newPost as { insertId: number }).insertId;

        return createdVideoId;
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 쇼츠 등록 실패');
    }
};

// 게시글 조회수 증가
export const viewShorts = async (shortsId: number): Promise<any> => {
    try {
        const [viewShorts]: any = await db.query(
            ` UPDATE video
              SET views = views + 1
              WHERE id = ?`,
            [shortsId]
        );

        return viewShorts!;
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 게시글 조회수 증가 실패');
    }
};

// 게시글 삭제
export const deleteShorts = async (shortsId: number): Promise<number> => {
    try {
        const [deleteShorts]: any = await db.query(
            `DELETE FROM video
             WHERE id = ?`,
            [shortsId]
        );

        return shortsId;
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 쇼츠 삭제 실패');
    }
};

/* videoId 유효성 검사 */
export const isShortsIdValid = async (shortsId: number): Promise<boolean> => {
    try {
        const [countRows]: any = await db.query(
            `SELECT COUNT(*) AS count
             FROM vidoe
             WHERE id = ?`,
            [shortsId]
        );
        const count = countRows[0].count;

        return count > 0;
    } catch (error) {
        console.log(error);
        throw new Error('[ DB 에러 ] 비디오 유효성 검사 실패');
    }
};
