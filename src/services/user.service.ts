import jwt from 'jsonwebtoken';
import * as userRepo from '../database/user.repo';
import { createUserInput, updateUserInput, User, UserProfile } from '../database/schemas/user.entity';
import { env } from '../config/envconfig';
import fs from 'fs';

// 유저 정보 조회
export const getUser = async (userId: number): Promise<UserProfile> => {
  try {
    const foundUser = await userRepo.getUserInfoById(userId);
    if (!foundUser) throw new Error('존재하지 않는 사용자입니다');

    return foundUser;
  } catch (error) {
    console.error(error);
    throw new Error('[유저 정보 조회 에러] 정보 조회에 실패했습니다.');
  }
};

// 유저 정보 수정
export const updateUserInfo = async (
  userId: number,
  updateData: updateUserInput
): Promise<UserProfile> => {
  try {
    const foundUser = await userRepo.getUserInfoById(userId);
    if (!foundUser) throw new Error('존재하지 않는 아이디 입니다.');

    await editImage(userId, updateData);

    const updateUser = await userRepo.updateUser(userId, updateData);
    const user = await userRepo.getUserInfoById(updateUser.id);
    return user;
  } catch (error) {
    console.error(error);
    throw new Error('[유저 수정 에러] 유저 정보 수정에 실패했습니다.');
  }
};
/* 유저 이미지 로컬 수정 */
const editImage = async (userId: number, inputData: updateUserInput) => {
  const foundUser = await userRepo.getUserInfoById(userId);
  if (!foundUser) throw new Error('존재하지 않는 아이디 입니다.');

  if (foundUser.img && foundUser.img !== inputData.img) {
    const imgFileName = foundUser.img.split('/')[6];

    const filePath = `/Users/subin/IdeaProjects/peeps_back-end3/public/${imgFileName}`;
    // const filePath = `서버 실행하는 로컬의 public 파일 절대경로`;
    // const filePath = `클라우드 인스턴스 로컬의 public 파일 절대경로`;

    fs.unlink(filePath, (error) => {
      if (error) throw new Error('유저 이미지 수정 중 오류가 발생했습니다.');
    });
  } else return;
};

// 유저 hard 삭제
export const hardDelete = async (userId: number): Promise<void> => {
  try {
    const foundUser = await userRepo.getUserInfoById(userId);
    if (!foundUser) throw new Error('존재하지 않는 아이디 입니다.');

    await userRepo.hardDeleteUser(userId);
  } catch (error: any) {
    console.log(error);
    throw new Error('유저 삭제에 실패했습니다.');
  }
};