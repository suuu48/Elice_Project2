import express from 'express';
import { getRanksHandler, getSeasonHandler } from '../controller/rank.controller';
export const rankRoute = express();

// 카테고리 별 경기 일정 조회
rankRoute.get('/:category/:season', getRanksHandler);

//종목 별 시즌 조회
rankRoute.get('/:category', getSeasonHandler);
