import * as scheduleRepo from '../database/schedule.repo';

// 카테고리별 팀 조회
export const getTeamByCategory = async (category: number): Promise<any[]> => {
  try {
    const teams = await scheduleRepo.findTeamByCategory(category);

    if (teams === undefined) throw new Error('[ 팀 조회 에러 ] 팀이 존재하지 않습니다.');

    return teams;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

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
