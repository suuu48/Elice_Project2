import { Request, Response, NextFunction } from 'express';
import * as teamService from '../services/team.service';

// 카테고리별 팀 조회
export const getTeamsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = Number(req.params.category);

        const teams = await teamService.getTeamByCategory(category);

        res.status(200).json({ message: '팀 목록 조회 성공', data: teams });
    } catch (error: any) {
        console.log(error);
        throw error;
    }
};
