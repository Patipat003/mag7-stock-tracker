import { Stock } from "../Models/Stock.js";
import yahooFinance from "yahoo-finance2";

const symbols = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA"];

yahooFinance.suppressNotices(["yahooSurvey"]);

export const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase(),
    });
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stock" });
  }
};

export const updateStocksFromAPI = async () => {
  try {
    for (const symbol of symbols) {
      const quote = await yahooFinance.quote(symbol);
      const {
        regularMarketPrice,
        regularMarketChange,
        longName,
        regularMarketOpen, // ราคาเปิด
        regularMarketDayHigh, // ราคาสูงสุด
        regularMarketDayLow, // ราคาต่ำสุด
        regularMarketVolume, // ปริมาณการซื้อขาย
        trailingPE, // P/E ratio
        preMarketPrice, // ราคา pre-market
      } = quote;

      if (regularMarketPrice !== undefined && regularMarketPrice !== null) {
        await Stock.findOneAndUpdate(
          { symbol },
          {
            symbol,
            name: longName || symbol,
            price: regularMarketPrice,
            change: regularMarketChange,
            open: regularMarketOpen,
            high: regularMarketDayHigh,
            low: regularMarketDayLow,
            volume: regularMarketVolume,
            peRatio: trailingPE,
            preMarket: preMarketPrice,
            updatedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      }
    }
    console.log("Stocks updated successfully.");
  } catch (error) {
    console.error("Error updating stocks:", error);
  }
};

export const getStockHistory = async (req, res) => {
  const { symbol, period } = req.params;
  console.log(`Fetching history for symbol: ${symbol} with period: ${period}`);

  try {
    const now = new Date();
    const startDate = new Date();
    let interval;

    switch (period) {
      case "1d":
        startDate.setHours(now.getHours() - 1);
        interval = "5m";
        break;
      case "1w":
        startDate.setDate(now.getDate() - 7);
        interval = "15m";
        break;
      case "1m":
        startDate.setMonth(now.getMonth() - 1);
        interval = "1h";
        break;
      case "3m":
      case "6m":
        startDate.setMonth(now.getMonth() - (period === "3m" ? 3 : 6));
        interval = "1d";
        break;
      case "ytd":
        startDate.setMonth(0);
        startDate.setDate(1);
        interval = "1d";
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        interval = "1d";
        break;
      case "5y":
        startDate.setFullYear(now.getFullYear() - 5);
        interval = "1wk";
        break;
      default:
        throw new Error("Invalid period provided");
    }

    const fetchHistory = async (start) => {
      return await yahooFinance.chart(symbol, {
        period1: start.toISOString(),
        period2: now.toISOString(),
        interval: interval,
      });
    };

    let history = await fetchHistory(startDate);

    if (period === "1d" && !history?.quotes?.length) {
      console.log("No data found for today. Trying previous day...");
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const endYesterday = new Date(yesterday);
      endYesterday.setHours(23, 59, 59, 999);

      history = await yahooFinance.chart(symbol, {
        period1: yesterday.toISOString(),
        period2: endYesterday.toISOString(),
        interval: "5m",
      });
    }

    res.json(history);
  } catch (error) {
    console.error("Error fetching stock history:", error);
    res.status(500).json({
      message: "Error fetching stock history",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
