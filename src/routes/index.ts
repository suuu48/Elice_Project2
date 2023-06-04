import express from 'express';
import { scheduleRoute } from './schedule.router';
import { teamRoute } from './team.router';
import { rankRoute } from './rank.router';
export const v1Router = express.Router();

// v1Router.use('/user', userRoute);
v1Router.use('/schedule', scheduleRoute);
v1Router.use('/rank', rankRoute);
v1Router.use('/team', teamRoute);
