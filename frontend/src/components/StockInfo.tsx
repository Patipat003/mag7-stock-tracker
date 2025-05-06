import React, { useEffect, useState } from "react";
import { getStockBySymbol } from "../services/stockService";

const StockInfo: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [stock, setStock] = useState<any>(null);

  const fetchStockData = async () => {
    try {
      const data = await getStockBySymbol(symbol);
      setStock(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    fetchStockData();
    const intervalId = setInterval(fetchStockData, 10000);
    return () => clearInterval(intervalId);
  }, [symbol]);

  if (!stock) return <p className="text-center text-gray-500">Loading...</p>;

  const isPositive = stock.change >= 0;

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 shadow-lg rounded-xl h-full flex flex-col">
      <div className="mb-4 space-y-2">
        <h3 className="text-2xl font-bold text-white">{stock.name}</h3>
        <p className="text-gray-400 text-lg">({stock.symbol})</p>
      </div>

      <div className="mb-4 flex items-center justify-start space-x-4 font-semibold">
        <div className="text-xl text-white font-bold">
          USD<span>${stock.price?.toFixed(2)}</span>
        </div>
        <div className={isPositive ? "text-green-600" : "text-red-600"}>
          {isPositive ? "+" : ""}{stock.change?.toFixed(2)}%
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-white">
        <div>
          <span className="font-medium text-gray-400">High:</span> ${stock.high?.toFixed(2)}
        </div>
        <div>
          <span className="font-medium text-gray-400">Low:</span> ${stock.low?.toFixed(2)}
        </div>
        <div>
          <span className="font-medium text-gray-400">PE Ratio:</span> {stock.peRatio?.toFixed(2) || "N/A"}
        </div>
        <div>
          <span className="font-medium text-gray-400">Pre-market:</span> {stock.preMarket?.toFixed?.(2) || "N/A"}
        </div>
        <div>
          <span className="font-medium text-gray-400">Volume:</span> {Number(stock.volume).toLocaleString()}
        </div>
        <div>
          <span className="font-medium text-gray-400">Updated At:</span> {formatDate(stock.updatedAt)}
        </div>
      </div>
      <div className="mt-auto">
        <a href={`https://finance.yahoo.com/quote/${stock.symbol}/`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          More Data from Yahoo Finance
        </a>
      </div>
      
    </div>
  );
};

export default StockInfo;
