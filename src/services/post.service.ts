import * as postRepo from '../database/post.repo';
import * as commentRepo from '../database/comment.repo';
import { AppError } from '../../../back/src/utils/errorHandler';
import { Post, createPostInput, updatePostInput } from '../database/schemas/post.entity';

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

    await postRepo.viewPost(post_id);

    // const comment = await commentRepo.findByContent(1,post_id);
    // if (post === undefined) throw new AppError(404, '존재하는 게시글이 없습니다.');

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
export const editPost = async (post_id: number, updateData: updatePostInput): Promise<any> => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);
    if (isValid === false) throw new AppError(404, '존재하는 게시글이 없습니다.');

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
export const removePost = async (post_id: number): Promise<any> => {
  try {
    const isValid = await postRepo.isPostIdValid(post_id);
    if (isValid === false) throw new AppError(404, '존재하는 게시글이 없습니다.');

    const removedComment = await commentRepo.deleteCommentByContents(1, post_id);
    if (removedComment === undefined) throw new AppError(404, '삭제된 댓글이 없습니다.');

    const removedPostId = await postRepo.deletePost(post_id);
    if (removedPostId === undefined) throw new AppError(404, '삭제된 게시글이 없습니다.');

    return removedPostId;
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
      throw new AppError(500, '[ 서버 에러 ] 게시글 수정 실패');
    }
  }
};
