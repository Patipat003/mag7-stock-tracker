import express from "express";
import {
  getStocks,
  getStockBySymbol,
  updateStocksFromAPI,
  getStockHistory,
} from "../Controllers/stock.js";

const stockRouter = express.Router();

stockRouter.get("/stocks", getStocks);
stockRouter.get("/stocks/:symbol", getStockBySymbol);
stockRouter.post("/stocks/update", updateStocksFromAPI);
stockRouter.get("/stocks/history/:symbol/:period", getStockHistory);

export default stockRouter;
