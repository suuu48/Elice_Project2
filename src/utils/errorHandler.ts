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
  const { statusCode, message } = err;
  res.status(statusCode || 500).json({
    status: 'error',
    statusCode: statusCode || 500,
    message: message || '서버에서 에러가 발생했습니다.',
  });
};

export { AppError, errorHandlerMiddleware };
