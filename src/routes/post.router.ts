import express from 'express';
import * as postController from '../controller/post.controller';
import {isAccessTokenValid} from "../middleware/jwt";

export const postRoute = express();

// 메인페이지 게시글 조회
postRoute.get('/main/:category', postController.getPostMainHandler);

// 카테고리 별 게시글 목록 조회
postRoute.get('/category/:category', postController.getPostsByCategoryHandler);

// 게시글 상세 조회 // 및 댓글 조회
postRoute.get('/:post_id', postController.getPostHandler);

// 게시글 등록 (로그인 필수)
postRoute.post('/', isAccessTokenValid, postController.addPostHandler);

// 게시글 수정 (로그인 필수)
postRoute.patch('/:post_id', isAccessTokenValid, postController.editPostHandler);

// 게시글 삭제 (로그인 필수)
postRoute.delete('/:post_id', isAccessTokenValid, postController.removePostHandler);

// 게시글 신고 (로그인 필수)
postRoute.post('/report/:post_id', isAccessTokenValid, postController.reportPostHandler);
