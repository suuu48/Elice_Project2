import * as scheduleRepo from '../database/schedule.repo';

// 카테고리 별 일정 조회
export const scheduleByCategory = async (category: number): Promise<any[]> => {
  try {
    const schedules = await scheduleRepo.findScheduleByCategory(category);

    if (schedules === undefined) throw new Error('[ 일정 조회 에러 ] 일정이 존재하지 않습니다.');

    return schedules;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

// 팀별 일정 조회
export const scheduleByTeam = async (teamId: number): Promise<any[]> => {
  try {
    const schedules = await scheduleRepo.findScheduleByTeam(teamId);

    if (schedules === undefined) throw new Error('[ 일정 조회 에러 ] 일정이 존재하지 않습니다.');

    return schedules;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

// 날짜 별 일정 조회
export const scheduleByDay = async (day: string, category: number| undefined): Promise<any[]> => {
  try {
     const schedules = await scheduleRepo.findScheduleByDay(day, category);

    if (schedules === undefined) throw new Error('[ 일정 조회 에러 ] 일정이 존재하지 않습니다.');

    return schedules;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

// 카테고리별 팀 확인
export const isCheckTeam = async (teamId: number, category: number): Promise<any[]> => {
  try {
    const isTeam = await scheduleRepo.checkTeamByCategory(category, teamId);

    if (isTeam === undefined) throw new Error('[ 일정 조회 에러 ] 해당 종목의 팀이 아닙니다.');

    return isTeam;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
