import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStocks } from "../services/stockService";
import StockChart from "../components/StockChart";

const MainPage: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const stocksData: any = await getStocks();
      setStocks(stocksData);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden p-4">
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold">Stock Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {stocks.map((stock) => (
            <Link
              key={stock.symbol}
              to={`/stock/${stock.symbol}`}
            >
              <StockChart symbol={stock.symbol} showFilter={false} height={200} display={"none"} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
