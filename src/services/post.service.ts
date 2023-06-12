import * as postRepo from '../database/post.repo';
import * as commentRepo from '../database/comment.repo';
import { AppError } from '../../../back/src/utils/errorHandler';
import { Post, createPostInput, updatePostInput } from '../database/types/post.entity';
import fs from 'fs';

// 메인페이지 최신글 조회
export const getPostsMain = async (category: number): Promise<any[]> => {
  try {
    const posts = await postRepo.findPostsByCreated(category);
    if (posts === undefined) throw new Error('[ 최신글 조회 에러 ] 게시글 조회 실패');

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

// 종목 별 게시글 목록 조회
export const getPostsByCategory = async (category: number): Promise<any[]> => {
  try {
    const posts = await postRepo.findPostsByCategory(category);

    if (posts === undefined) throw new AppError(404, '존재하는 게시글이 없습니다.');

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

// 게시글 상세 조회 (및 댓글 목록 조회)
export const getPost = async (post_id: number): Promise<any[]> => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);
    if (isValid === false) throw new AppError(404, '존재하는 게시글이 없습니다.');

    const post = await postRepo.findPostById(post_id);
    if (post === undefined) throw new AppError(404, '해당 게시글이 없습니다.');

    const views = await postRepo.viewPost(post_id);
    if(!views) throw new AppError(404, '조회수 업로드 실패');

    return post;
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

// 게시글 등록
export const addPost = async (inputData: createPostInput): Promise<any> => {
  try {
    const postId = await postRepo.createPost(inputData);
    if (postId === undefined) throw new AppError(404, '생성된 게시글이 없습니다.');

    const foundCreatedPost = await postRepo.findPostById(postId);
    if (foundCreatedPost === undefined) throw new AppError(404, '게시글이 존재하지 않습니다.');

    return foundCreatedPost;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 등록 실패');
    }
  }
};

// 게시글 수정
export const editPost = async (
  post_id: number,
  updateData: updatePostInput,
  user_id: number
): Promise<any> => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);
    if (isValid === false) throw new AppError(404, '존재하는 게시글이 없습니다.');

    const isUser = await postRepo.findPostById(post_id);
    if (isUser.user_id !== user_id) throw new AppError(403, '작성자만 수정 가능합니다.');

    await editImage(post_id, updateData);

    const updatePost = await postRepo.updatePost(post_id, updateData);
    if (updatePost === undefined) throw new AppError(404, '수정된 게시글이 없습니다.');

    const post = await postRepo.findPostById(post_id);

    return post;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 수정 실패');
    }
  }
};

// 게시글 삭제
export const removePost = async (post_id: number, user_id: number): Promise<number> => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);
    if (isValid === false) throw new AppError(404, '존재하는 게시글이 없습니다.');

    const isUser = await postRepo.findPostById(post_id);
    if (isUser.user_id !== user_id) throw new AppError(403, '작성자만 삭제 가능합니다.');

    await removeImage(post_id);

    const removedPostId = await postRepo.deletePost(post_id);

    return removedPostId;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 삭제 실패');
    }
  }
};

// 게시글 신고
export const reportPost = async (post_id: number): Promise<any> => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);
    if (isValid === false) throw new AppError(404, '존재하는 게시글이 없습니다.');

    const reportPost = await postRepo.reportPost(post_id);
    if (reportPost.affectedRows !== 1)
      throw new AppError(404, '해당 게시글의 신고 내역이 없습니다.');

    const reportedPost = await postRepo.findPostById(post_id);
    return reportedPost.id;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 게시글 신고 실패');
    }
  }
};

/* 게시글 이미지 로컬 수정 */
const editImage = async (post_id: number, inputData: updatePostInput) => {
  const foundPost = await postRepo.findPostById(post_id);

  if (foundPost.img && foundPost.img !== inputData.img) {
    const imgFileName = foundPost.img.split('/')[6];

    const filePath = `/Users/subin/IdeaProjects/back/public/img/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, '게시글 이미지 수정 중 오류가 발생했습니다.');
    });
  } else return;
};

/* 게시글 이미지 로컬 삭제 */
const removeImage = async (post_id: number) => {
  const foundPost = await postRepo.findPostById(post_id);

  if (foundPost.img) {
    const imgFileName = foundPost.img.split('/')[6];
    console.log(imgFileName);
    const filePath = `/Users/subin/IdeaProjects/back/public/img/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new AppError(400, '게시글 이미지 삭제 중 오류가 발생했습니다.');
    });
  } else return;
};
