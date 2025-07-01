import express from "express";
import { getNews } from "../Controllers/news.js";

const newsRouter = express.Router();

newsRouter.get("/news/:symbol", getNews);

export default newsRouter;
