import express from 'express';
import * as scheduleController from '../controller/schedule.controller'
export const scheduleRoute = express();


// 카테고리 별 경기 일정 및 팀 조회
scheduleRoute.get('/:category', scheduleController.getAllScheduleHandler );