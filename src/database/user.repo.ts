import { db } from '../config/dbconfig';
import { createUserInput, UserProfile, User } from './schemas/user.entity';

// 닉네임 중복 체크
export const checkDuplicateNickname = async (nickName: string): Promise<User> => {
  try {
    const [row]: any = await db.query(
      `
        SELECT *
        FROM user
        WHERE nickname = ?`,
      [nickName]
    );

    return row[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// userId 입력시 user 정보 추출
export const getUserInfoById = async (userId: string): Promise<User> => {
  try {
    const [row]: any = await db.query(
      `
    SELECT *
    FROM user
    WHERE user_id = ? and delete_flag ='0'`,
      [userId]
    );
    return row[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 유저 추가
export const createUser = async (inputData: createUserInput): Promise<User> => {
  try {
    const newColumns = 'id, email, password, nickname, interest, phone, role, img';
    const newValues = Object.values(inputData)
      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
      .join(', ');
    const [newUser]: any = await db.query(
      `
          INSERT INTO user (${newColumns})
          VALUES (${newValues})
      `
    );

    const createUserId = String(inputData.id);

    const createuser = await getUserInfoById(createUserId);

    return createuser!;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

// 유저 정보 수정
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    const updateValues = Object.entries(updates)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key} = '${value}'`;
        }
        return `${key} = ${value}`;
      })
      .join(', ');

    await db.query(
      `
      UPDATE user
      SET ${updateValues}
      WHERE user_id = ?
    `,
      [userId]
    );

    const updatedUser = await getUserInfoById(userId);

    return updatedUser!;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
