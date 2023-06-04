import { db } from '../config/dbconfig';
import { Post, createPostInput, updatePostInput } from './schemas/post.entity';

// 메인페이지 최신순 5개 조회
export const findAllPostsByCreated = async (): Promise<any[]> => {
  try {
    const [row]: any = await db.query(
      `SELECT  id, category, title, created_at, views 
           FROM post
           ORDER BY created_at DESC LIMIT 5`
    );
    return row;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 카테고리별 게시글 목록 조회 실패');
  }
};

// 메인페이지 카테고리 별 최신순 5개 조회
export const findPostsByCreated = async (category: number): Promise<any[]> => {
  try {
    const [row]: any = await db.query(
      `SELECT id, title, views
            FROM post 
           WHERE category = ?
           ORDER BY created_at DESC LIMIT 5`,
      [category]
    );
    return row;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 카테고리별 게시글 목록 조회 실패');
  }
};

// 카테고리 별 게시글 글 목록 조회
export const findPostsByCategory = async (category: number): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `SELECT p.id, p.title, p.created_at, u.nickname, p.views 
           FROM post p
           JOIN user u ON p.user_id= u.id
           WHERE category = ?`,
      [category]
    );
    return row;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 카테고리별 게시글 목록 조회 실패');
  }
};

//게시글 글 상세 조회
export const findPostsById = async (postId: number): Promise<any> => {
  try {
    const [row]: any = await db.query(
      `SELECT p.id, p.title, p.category, p.created_at, u.nickname, p.views 
           FROM post p
           JOIN user u ON p.user_id= u.id
           WHERE p.id = ?`,
      [postId]
    );
    return row[0];
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 상세 조회 실패');
  }
};

// 게시글 등록
export const createPost = async (inputData: createPostInput): Promise<number> => {
  try {
    const createColumns = 'user_id, category, title, content';
    const createValues = Object.values(inputData)
      .map((value) => `'${value}'`)
      .join(', ');

    const [newPost]: any = await db.query(
      `
          INSERT INTO post (${createColumns})
          VALUES (${createValues})`
    );

    const createdPostId = (newPost as { insertId: number }).insertId;

    return createdPostId;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 등록 실패');
  }
};

// update의 경우 key값과 value값을 매칭 시켜줌
export const updateDataTrans = (input: Record<string, string | number | boolean | Date>) => {
  const data = Object.entries(input).reduce(
    (a, [key, value]) => {
      a[0].push(`${key} = ?`);
      a[1].push(value);
      return a;
    },
    [[], []] as [string[], Array<string | number | boolean | Date>]
  );
  return data;
};

// 게시글 수정 Todo: updated_at now()로 해야함
export const updatePost = async (postId: number, updateData: updatePostInput): Promise<any> => {
  try {
    const [keys, values] = updateDataTrans(updateData);
    const [updatePost]: any = await db.query(
      ` UPDATE post
            SET ${keys.join(', ')}
            WHERE id = ?`,
      [...values, postId]
    );

    return updatePost!;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 수정 실패');
  }
};

// 게시글 수정
export const reportPost = async (postId: number, updateData: updatePostInput): Promise<any> => {
  try {
    const [keys, values] = updateDataTrans(updateData);
    const [updatePost]: any = await db.query(
      ` UPDATE post
              SET ${keys.join(', ')}
              WHERE id = ?`,
      [...values, postId]
    );

    return updatePost!;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 수정 실패');
  }
};

// 게시글 삭제
const deletePost = async (postId: number): Promise<number> => {
  try {
    const [deletePost]: any = await db.query(
      `DELETE FROM post
        WHERE id = ?`,
      [postId]
    );

    return postId;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 삭제 실패');
  }
};

/* post_id 유효성 검사 */
export const isPostIdValid = async (postId: number): Promise<boolean> => {
  try {
    const [countRows]: any = await db.query(
      `SELECT COUNT(*) AS count
         FROM post
         WHERE id = ?`,
      [postId]
    );
    const count = countRows[0].count;

    return count > 0;
  } catch (error) {
    console.log(error);
    throw new Error('[ DB 에러 ] 게시글 유효성 검사 실패');
  }
};
