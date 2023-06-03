import express from 'express';
import { scheduleRoute } from './schedule.router';

export const v1Router = express.Router();

// v1Router.use('/user', userRoute);
v1Router.use('/schedule', scheduleRoute);
