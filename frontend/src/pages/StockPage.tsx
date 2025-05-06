import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StockChart from "../components/StockChart";
import StockInfo from "../components/StockInfo";
import NewsCard from "../components/NewsCard";
import { getStockBySymbol, getNews } from "../services/stockService";

const StockPage: React.FC = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!symbol) return;
      try {
        const stockData = await getStockBySymbol(symbol);
        const newsData = await getNews(symbol);
        setStock(stockData);
        setNews(newsData);
      } catch (error) {
        console.error("Error fetching stock or news data:", error);
      }
    }

    fetchData();
  }, [symbol]);

  if (!stock) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 overflow-hidden p-4">
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold">{stock.name} ({stock.symbol})</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <StockChart symbol={stock.symbol} />
          </div>
          <div className="md:col-span-1">
            <StockInfo symbol={stock.symbol} />
          </div>
        </div>

        
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">News</h3>
          {news.length > 0 ? (
            news.map((newsItem: any) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))
          ) : (
            <p>No news available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockPage;
