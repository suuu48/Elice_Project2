import express from 'express';
import * as commentController from '../controller/comment.controller';
import { isAccessTokenValid } from '../middleware/jwt';

export const commentRoute = express();

// 댓글 상세 조회
commentRoute.get('/:comment_id', commentController.getCommentHandler);

//댓글 목록 조회
commentRoute.get('/list/:id', commentController.getCommentListHandler);

// 댓글 등록 (로그인 필수)
commentRoute.post('/', isAccessTokenValid, commentController.addCommentHandler);

// 댓글 삭제 (로그인 필수)
commentRoute.delete('/:comment_id', isAccessTokenValid, commentController.removeCommentHandler);

// 댓글 신고 (로그인 필수)
commentRoute.patch(
  '/report/:comment_id',
  isAccessTokenValid,
  commentController.reportCommentHandler
);
