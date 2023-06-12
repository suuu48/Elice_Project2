import { Request, Response, NextFunction } from 'express';
import * as scheduleService from '../services/schedule.service';
import * as teamService from '../services/team.service';

// 카테고리별 일정 조회
export const getAllScheduleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = Number(req.params.category);

    const schedules = await scheduleService.scheduleByCategory(category);

    res.status(200).json({ message: '종목 별 일정 목록 조회 성공', data: schedules });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

// 팀 별 경기 일정 조회
export const getScheduleByTeamHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = Number(req.params.category);
    const teamId = Number(req.query.teamId);
    // 카테고리안에 있는 팀인지 확인하는 로직
    const teams = await teamService.getTeamByCategory(category);

    const matchingTeam = teams.find((item) => item.id === teamId);
    //{ id: 1, name: 'Team A', category: 1, img: '/path/to/teamA.jpg' } 으로 출력
    if (!matchingTeam) throw new Error(`해당종목의 팀이 아님`);

    const schedules = await scheduleService.scheduleByTeam(teamId);

    res.status(200).json({ message: '팀 별 일정 목록 조회 성공', data: schedules });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

// 날짜별 일정 조회
export const getScheduleByDayHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const day = req.params.day;
    const category = Number(req.query.category);

    const schedules = await scheduleService.scheduleByDay(day, category);

    res.status(200).json({ message: '날짜 별 일정 목록 조회 성공', data: schedules });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
