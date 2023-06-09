import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../back/src/utils/errorHandler';
import multer from 'multer';
import fs from 'fs';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

if (!fs.existsSync('public/shorts')) {
  fs.mkdirSync('public/shorts');
}

if (!fs.existsSync('public/img')) {
  fs.mkdirSync('public/img');
}

const shortsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/shorts');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const imgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const shortsUpload = multer({ storage: shortsStorage });
const imgUpload = multer({ storage: imgStorage });

export const uploadShorts = (req: Request, res: Response, next: NextFunction) => {
  shortsUpload.single('src')(req, res, (error) => {
    try {
      next();
    } catch (error) {
      console.log(error);
      next(new AppError(400, '[ Shorts 업로드 에러 ] 업로드 실패'));
    }
  });
};

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  imgUpload.single('img')(req, res, (error) => {
    try {
      next();
    } catch (error) {
      console.log(error);
      next(new AppError(400, '[ 이미지 업로드 에러 ] 업로드 실패'));
    }
  });
};
