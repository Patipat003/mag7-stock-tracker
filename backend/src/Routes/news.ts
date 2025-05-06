import express from 'express';
import { getNews } from '../Controllers/news.ts';

const newsRouter = express.Router();

newsRouter.get('/news/:symbol', getNews);

export default newsRouter;