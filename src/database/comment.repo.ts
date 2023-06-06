import { db } from '../config/dbconfig';
import { createCommentInput } from './schemas/comment.entity';

//콘텐츠에 해당하는 댓글 목록 조회 (id는 비디오나 게시글의 id)
export const findByContents = async (contents_category: number, id: number): Promise<any> => {
  try {
    let whereColumns: string;
    // 동영상일지 게시글일지 !
    if (contents_category === 0) {
      // 0일 경우 비디오 1일 경우 게시글
      whereColumns = 'c.video_id';
    } else {
      whereColumns = 'c.post_id';
    }
    const [row]: any = await db.query(
      `SELECT u.nickname, c.content, c.created_at
           FROM comment c
           JOIN user u ON c.user_id= u.id
           WHERE (${whereColumns}) = ?`,
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
    let whereColumns: string;
    // 동영상일지 게시글일지 !
    if (contents_category === 0) {
      // 0일 경우 비디오 1일 경우 게시글
      whereColumns = 'c.video_id';
    } else {
      whereColumns = 'c.post_id';
    }

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

//댓글 상세 조회
export const findCommentById = async (commentId: number): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `SELECT u.nickname, c.content, c.created_at
           FROM comment c
           JOIN user u ON c.user_id= u.id
           WHERE c.id = ?`,
      [commentId]
    );
    return row;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 상세 조회 실패');
  }
};

// 댓글 등록
export const createComment = async (
  contents_category: number,
  inputData: createCommentInput
): Promise<number> => {
  try {
    let createColumns: string;
    // 동영상일지 게시글일지 !
    if (contents_category === 0) {
      // 0일 경우 비디오 1일 경우 게시글
      createColumns = 'user_id, video_id, content';
    } else {
      createColumns = 'user_id, post_id, content';
    }

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

// 컨텐츠에 해당하는 댓글 전체 삭제 (id는 비디오나 게시글의 id)
export const deleteCommentByContents = async (
  contents_category: number,
  id: number
): Promise<number> => {
  try {
    let whereColumns: string;
    // 동영상일지 게시글일지 !
    if (contents_category === 0) {
      // 0일 경우 비디오 1일 경우 게시글
      whereColumns = 'video_id';
    } else {
      whereColumns = 'post_id';
    }

    const [deleteComment]: any = await db.query(
      `DELETE FROM comment
        WHERE (${whereColumns}) = ?`,
      [id]
    );

    return id;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 삭제 실패');
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

// 댓글 신고
export const reportComment = async (commentId: number): Promise<any> => {
  try {
    const [reportComment]: any = await db.query(
      ` UPDATE post
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
