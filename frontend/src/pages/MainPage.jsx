import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStocks } from "../services/stockService";
import StockChart from "../components/StockChart";
import { IoMdRefresh } from "react-icons/io";

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
    <div className="flex flex-1 overflow-hidden p-4 px-10">
      <div className="w-full space-y-4">
        <div className="flex justify-center sm:justify-between items-center ">
          <h2 className="text-2xl font-bold text-white mb-6">
            Magnificent 7 Stocks Overview
          </h2>
          <button
            className="group p-2 w-10 h-10 hidden sm:block rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 backdrop-blur-sm cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <IoMdRefresh className="text-white text-xl group-hover:rotate-180 transition-transform duration-500 ease-in-out" />
          </button>
        </div>

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
