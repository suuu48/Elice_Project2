import { Request, Response, NextFunction } from 'express';
import * as scheduleService from '../services/schedule.service';
/* 팀별 일정 조회 */
export const getAllScheduleHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = Number(req.query.category);

        const teams = await scheduleService.getTeamByCategory(category);
        const schedules = await scheduleService.scheduleByCategory(category);

        res.status(200).json({ message: '게시글 목록 조회 성공', data: {teams, schedules} });
    } catch (error: any) {
        console.log(error);
        throw error;
    }
};