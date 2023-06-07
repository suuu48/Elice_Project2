import express from 'express';
import * as scheduleController from '../controller/schedule.controller';
export const scheduleRoute = express();

// 카테고리 별 경기 일정 조회
scheduleRoute.get('/:category', scheduleController.getAllScheduleHandler);

// 팀 별 경기 일정 조회
scheduleRoute.get('/:category/team', scheduleController.getScheduleByTeamHandler);

// 날짜 별 경기 일정 조회
scheduleRoute.get('/day/:day', scheduleController.getScheduleByDayHandler);
