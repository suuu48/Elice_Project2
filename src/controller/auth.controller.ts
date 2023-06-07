import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { createUserInput } from '../database/schemas/user.entity';
import bcrypt from 'bcrypt';
import * as userRepo from '../database/user.repo';
import { AppError } from '../../../back/src/utils/errorHandler';
import {checkDuplicateEmail, checkDuplicateNickname} from "../database/user.repo";
import {addUser} from "../services/auth.service";

// 유저 추가
export const addUserHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, nickname, interest, phone } = req.body;
        // const imgFileRoot = `http://localhost:3000/api/v1/static/${req.file?.filename}`;
        if (!email || !password || !nickname || !interest || !phone)
            throw new Error('[ 요청 에러 ] 사진을 제외한 모든 필드를 입력해야 합니다.');
        const isCheckId = await userRepo.checkDuplicateEmail(email);

        if (isCheckId) {
            throw Error('이 아이디는 현재 사용중입니다. 다른 아이디를 입력해 주세요.');
        }

        // 닉네임 중복체크
        const isCheckNickname = await userRepo.checkDuplicateNickname(nickname);
        if (isCheckNickname) {
            throw Error('이 닉네임은 현재 사용중입니다. 다른 닉네임을 입력해 주세요.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData: createUserInput = {
            email,
            password: hashedPassword,
            nickname,
            interest,
            phone,
            //user_img: imgFileRoot,
        };

        const createdUser = await authService.addUser(userData);
        res.status(201).json({ message: '회원가입 성공', data: createdUser });
    } catch (error: any) {
        if (error instanceof AppError) {
            if (error.statusCode === 400) console.log(error);
            next(error);
        } else {
            console.log(error);
            throw new AppError(500, '[ HTTP 요청 에러 ] 유저 등록 실패');
        }
    }
};

// 로그인
export const logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, password } = req.body;

        if (!id || !password)
            throw new Error('[ 요청 에러 ] 아이디와 비밀번호를 반드시 입력해야 합니다.');

        const checkId = await userRepo.checkDuplicateEmail(id);
        if (!checkId) {
            throw Error('해당 아이디는 가입 내역이 없습니다. 다른 아이디를 입력해 주세요.');
        }

        const correctPasswordHash = checkId.password; // db에 저장되어 있는 암호화된 비밀번호

        if (correctPasswordHash !== password) {
            const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);
            if (!isPasswordCorrect) {
                throw new Error('비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.');
            }
        }

        const userToken = await authService.getUserToken(checkId.id);

        res.status(201).json({
            message: '로그인 성공',
            data: {
                userToken
            },
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            if (error.statusCode === 400) console.log(error);
            next(error);
        } else {
            console.log(error);
            throw new AppError(500, '[ HTTP 요청 에러 ] 로그인 실패');
        }
    }
};
