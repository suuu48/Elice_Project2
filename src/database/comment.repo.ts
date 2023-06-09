import { db } from '../config/dbconfig';
import { createCommentInput } from './schemas/comment.entity';

// 콘텐츠에 해당하는 댓글 목록 조회 (id는 비디오나 게시글의 id) Todo: service에서 contents_category 별로 함수 다르게 작성 및 쿼리추가
export const findByContents = async (contents_category: number, id: number): Promise<any> => {
  try {
    const isCategoryValid = contents_category === 0;
    const whereColumns = isCategoryValid ? 'c.video_id' : 'c.post_id';

    const [row]: any = await db.query(
      `SELECT u.nickname, u.img, c.content, c.created_at
           FROM comment c
           JOIN user u ON c.user_id= u.id 
           WHERE (${whereColumns}) = ?
           ORDER BY created_at`,
      [id]
    );
    return row;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 상세 조회 실패');
  }
};


//콘텐츠에 해당하는 댓글 수 조회 (id는 비디오나 게시글의 id)
export const findCountByContent = async (contents_category: number, id: number): Promise<any> => {
  try {
    const isCategoryValid = contents_category === 0;
    const whereColumns = isCategoryValid ? 'c.video_id' : 'c.post_id';

    const [row]: any = await db.query(
      `SELECT COUNT(*) as comment_count
           FROM comment c
           JOIN user u ON c.user_id= u.id
           WHERE (${whereColumns}) = ?`,
      [id]
    );

    return row[0].comment_count;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 상세 조회 실패');
  }
};

// 댓글 상세 조회
export const findCommentById = async (commentId: number): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `SELECT c.id as comment_id, c.video_id, c.post_id, c.user_id, u.nickname, c.content, c.created_at
           FROM comment c
           JOIN user u ON c.user_id= u.id
           WHERE c.id = ?`,
      [commentId]
    );

    return row[0];
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 상세 조회 실패');
  }
};

// 댓글 등록
export const createComment = async (contents_category: number, inputData: createCommentInput): Promise<number> => {
  try {
    const isCategoryValid = contents_category === 0;
    const createColumns = isCategoryValid ? 'video_id, user_id, content' : 'post_id, user_id, content';
    console.log(createColumns);
    const createValues = Object.values(inputData)
      .map((value) => `'${value}'`)
      .join(', ');

    const [newComment]: any = await db.query(
      `
          INSERT INTO comment (${createColumns})
          VALUES (${createValues})`
    );

    const createdCommentId = (newComment as { insertId: number }).insertId;

    return createdCommentId;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 댓글 등록 실패');
  }
};

// 댓글 삭제
export const deleteComment = async (commentId: number): Promise<number> => {
  try {
    const [deleteComment]: any = await db.query(
      `DELETE FROM comment
        WHERE id = ?`,
      [commentId]
    );

    return commentId;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 삭제 실패');
  }
};

// 댓글 신고
export const reportComment = async (commentId: number): Promise<any> => {
  try {
    const [reportComment]: any = await db.query(
      ` UPDATE comment
              SET report = report + 1
              WHERE id = ?`,
      [commentId]
    );

    return reportComment!;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 댓글 신고 실패');
  }
};

// 댓글 유효성 검사
export const isCommentIdValid = async (commentId: number): Promise<boolean> => {
  try {
    const [countRows]: any = await db.query(
        `SELECT COUNT(*) AS count
         FROM comment
         WHERE id = ?`,
        [commentId]
    );
    const count = countRows[0].count;

    return count > 0;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 댓글 유효성 검사 실패');
  }
};