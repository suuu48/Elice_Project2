import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service';
import { AppError } from '../../../back/src/utils/errorHandler';
import { createCommentInput } from '../database/types/comment.entity';

// 댓글 상세 조회
export const getCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentId = Number(req.params.comment_id);
    if (commentId === null) throw new AppError(400, '댓글 ID를 입력해주세요.');

    const comment = await commentService.getComment(commentId);

    res.status(200).json({ message: '댓글 상세 조회 성공', data: comment });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 조회 실패'));
    }
  }
};
// 댓글 목록 조회
export const getCommentListHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!id) throw new AppError(400, 'ID를 입력해주세요.');

    const contents_category = Number(req.query.contents_category);
    if (isNaN(contents_category) && contents_category === undefined)
      throw new AppError(400, 'ID를 입력해주세요.');

    const comments = await commentService.getCommentList(contents_category, id);

    res.status(200).json({ message: '댓글 상세 조회 성공', data: comments });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 조회 실패'));
    }
  }
};

// 댓글 등록
export const addCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user.user_id;
  try {
    const { contents_category, id, content } = req.body;

    if (isNaN(contents_category) || !id || !content)
      throw new AppError(400, '요청 body에 모든 정보를 입력해주세요.');

    const commentData: createCommentInput =
      contents_category === 0
        ? { post_id: id, user_id, content }
        : { video_id: id, user_id, content };

    const comment = await commentService.addComment(contents_category, commentData);

    res.status(200).json({ message: '댓글 등록 성공', data: comment });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 등록 실패'));
    }
  }
};

// 댓글 삭제
export const removeCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user.user_id;

  try {
    const commentId = Number(req.params.comment_id);
    if (commentId === null) throw new AppError(400, '댓글 ID를 입력해주세요.');

    const deleteCommentId = await commentService.removeComment(commentId, user_id);

    res.status(200).json({ message: '댓글 삭제 성공', data: { comment_id: deleteCommentId } });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 삭제 실패'));
    }
  }
};

// 댓글 신고
export const reportCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment_id = Number(req.params.comment_id);
    if (comment_id === undefined) throw new AppError(400, 'comment_id를 입력해주세요.');

    const reportCommentId = await commentService.reportComment(comment_id);

    res.status(200).json({ message: '댓글 신고 성공', data: { comment_id: reportCommentId } });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.statusCode === 404 || error.statusCode === 400) console.log(error);
      next(error);
    } else {
      console.log(error);
      next(new AppError(500, '[ HTTP 요청 에러 ] 댓글 신고 실패'));
    }
  }
};
