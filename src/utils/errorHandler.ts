import { Request, Response, NextFunction } from 'express';

class AppError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandlerMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message = '서버에서 에러가 발생했습니다.' } = err;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });

};

export { AppError, errorHandlerMiddleware };
