import { env } from '../config/envconfig';
import { Request, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { decodedToken } from '../models/user';
//
export const isAccessTokenValid: RequestHandler = (req, res, next) => {
  const userToken = req.headers['authorization']?.split(' ')[1];

  if (!userToken) {
    return res.status(403).json({
      result: 'forbidden-approach',
      msg: '로그인한 유저만 사용할 수 있는 서비스입니다.\n토큰을 제시해 주세요.',
    });
  }

  // token 검증
  try {
    const accessTokenSecret = env.ACCESS_TOKEN_SECRET || 'default-access-token-secret';
    const jwtDecoded = jwt.verify(userToken, accessTokenSecret) as decodedToken;

    req.user = jwtDecoded;

    next();
  } catch (error: any) {
    console.log(error);

    switch (error.message) {
      case 'invalid signature':
        const notAllow = new Error('404, 우리가 서명한 토큰이 아닙니다.');
        next(notAllow);
        break;
      case 'jwt expired':
        const expired = new Error('403, 만료된 토큰입니다.');
        //refreshTokenValid(req, res, next);
        next(expired);
        break;
      case 'is not access token':
        const notAT = new Error('400, AT로 인증해주시길 바랍니다. ');
        next(notAT);
        break;
      default:
        next(new Error('400, 토큰 검증 도중 오류가 발생했습니다.'));
    }
  }
};

/*
const refreshTokenValid: RequestHandler = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken; //=> refresh토큰은 헤더에서 가져오는게 아님!

        if (!refreshToken) {
            throw new Error('401, 리프레시 토큰이 필요합니다.');
        }

        const refreshSecretKey = env.REFRESH_TOKEN_SECRET || 'default-refresh-token-secret';
        const refreshDecoded = jwt.verify(refreshToken, refreshSecretKey) as JwtPayload; // 명시적으로 JwtPayload 타입으로 지정
        console.log(refreshDecoded);

        // 리프레시 토큰이 정상적으로 검증되면 액세스 토큰을 재발급
        const payload = {
            email: refreshDecoded.email,
            password: refreshDecoded.password,
        };
        const secretKey = env.ACCESS_TOKEN_SECRET || 'default-access-token-secret';
        const expiresIn = env.ACCESS_TOKEN_EXPIRES_IN;

        const newAccessToken = jwt.sign(payload, secretKey, { expiresIn });

        req.body = { ...req.body, jwtDecoded: { ...refreshDecoded, newAccessToken } };
        console.log(req.body);
        next();
    } catch (refreshError: any) {
        const refreshTokenError = new Error('401, 리프레시 토큰이 만료되었거나 유효하지 않습니다.');
        next(refreshTokenError);
    }
};*/
