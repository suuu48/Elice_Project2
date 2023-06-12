import express from 'express';
import { getRanksHandler, getSeasonHandler } from '../controller/rank.controller';
export const rankRoute = express();

// 종목 별 시즌 조회
rankRoute.get('/:category', getSeasonHandler);

// 시즌 별 순위 조회
rankRoute.get('/:category/:season', getRanksHandler);
