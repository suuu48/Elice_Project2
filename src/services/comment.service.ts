import * as commentRepo from '../database/comment.repo';
import { AppError } from '../../../back/src/utils/errorHandler';
import { createCommentInput } from '../database/schemas/comment.entity';

// 댓글 상세 조회
export const getComment = async (comment_id: number): Promise<any[]> => {
  try {
    const isValid = await commentRepo.isCommentIdValid(comment_id);
    if (isValid === false) throw new AppError(404, '존재하는 댓글이 없습니다.');

    const comment = await commentRepo.findCommentById(comment_id);
    if (comment === undefined) throw new AppError(404, '해당 댓글이 없습니다.');

    return comment;
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

// 댓글 목록 조회
export const getCommentList = async (
  contents_category: number,
  comment_id: number
): Promise<any[]> => {
  try {
    const comments = await commentRepo.findByContents(contents_category, comment_id);
    if (comments === undefined) throw new AppError(404, '해당 댓글이 없습니다.');

    return comments;
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

// 댓글 등록
export const addComment = async (
  contents_category: number,
  inputData: createCommentInput
): Promise<any> => {
  try {
    const commentId = await commentRepo.createComment(contents_category, inputData);
    if (commentId === undefined) throw new AppError(404, '생성된 댓글이 없습니다.');

    const comment = await commentRepo.findCommentById(commentId);
    if (comment === undefined) throw new AppError(404, '해당 댓글이 없습니다.');

    return comment;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 댓글 등록 실패');
    }
  }
};

// 댓글 삭제
export const removeComment = async (comment_id: number, user_id: number): Promise<any> => {
  try {
    const isValid = await commentRepo.isCommentIdValid(comment_id);
    if (isValid === false) throw new AppError(404, '존재하는 댓글이 없습니다.');

    const isUser = await commentRepo.findCommentById(comment_id);
    if (isUser.user_id !== user_id) throw new AppError(403, '작성자만 삭제 가능합니다.');

    const removedCommentId = await commentRepo.deleteComment(comment_id);

    return removedCommentId;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 댓글 삭제 실패');
    }
  }
};

// 댓글 신고
export const reportComment = async (comment_id: number): Promise<any> => {
  try {
    const isValid = await commentRepo.isCommentIdValid(comment_id);
    if (isValid === false) throw new AppError(404, '존재하는 댓글이 없습니다.');

    const reportComment = await commentRepo.reportComment(comment_id);

    if (reportComment.affectedRows !== 1)
      throw new AppError(404, '해당 댓글의 신고 내역이 없습니다.');

    const reportedComment = await commentRepo.findCommentById(comment_id);

    return reportedComment.comment_id;
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 500) console.log(error);
      throw error;
    } else {
      console.log(error);
      throw new AppError(500, '[ 서버 에러 ] 댓글 삭제 실패');
    }
  }
};
