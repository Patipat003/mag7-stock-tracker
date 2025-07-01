import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStocks } from "../services/stockService";
import StockChart from "../components/StockChart";

const MainPage = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const stocksData = await getStocks();
      setStocks(stocksData);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden p-4">
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">Stock Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stocks.map((stock) => (
            <div className="cursor-pointer">
              <Link key={stock.symbol} to={`/stock/${stock.symbol}`}>
                <StockChart
                  symbol={stock.symbol}
                  showFilter={false}
                  height={100}
                  display={"none"}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
