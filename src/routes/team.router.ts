import express from 'express';
import {getTeamsHandler} from "../controller/team.controller";
export const teamRoute = express();


// 카테고리 별 경기 일정 조회
teamRoute.get('/:category', getTeamsHandler );


