import express from 'express';
import { authRoute } from './auth.router';
import { userRoute } from './user.router';
import { shortsRoute } from './shorts.router';
import { postRoute } from './post.router';
import { commentRoute } from './comment.router';
import { scheduleRoute } from './schedule.router';
import { rankRoute } from './rank.router';
import { teamRoute } from './team.router';
export const v1Router = express.Router();

v1Router.use('/auth', authRoute);
v1Router.use('/user', userRoute);
v1Router.use('/shorts', shortsRoute);
v1Router.use('/post', postRoute);
v1Router.use('/comment', commentRoute);
v1Router.use('/schedule', scheduleRoute);
v1Router.use('/rank', rankRoute);
v1Router.use('/team', teamRoute);

