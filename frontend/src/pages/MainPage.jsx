import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStocks } from "../services/stockService";
import StockChart from "../components/StockChart";
import StockChartSkeleton from "../components/ui/StockChartSkeleton";
import { IoMdRefresh } from "react-icons/io";

const MainPage = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const stocksData = await getStocks();
      setStocks(stocksData);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden p-4 px-10 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full space-y-4 relative z-10">
        <div className="flex justify-center sm:justify-between items-center">
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">
              Magnificent 7 Stocks Overview
            </h2>
          </div>

          <button
            className="group relative p-2 w-10 h-10 hidden sm:block rounded-xl overflow-hidden
                       bg-white/5 backdrop-blur-md border border-white/10
                       hover:bg-white/10 hover:border-white/20
                       transition-all duration-300 ease-out cursor-pointer
                       shadow-lg hover:shadow-xl hover:shadow-blue-500/20"
            onClick={() => window.location.reload()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <IoMdRefresh
              className="relative z-10 text-white text-xl 
                                   group-hover:rotate-180 transition-transform 
                                   duration-500 ease-in-out drop-shadow-lg"
            />

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 
                          bg-gradient-to-br from-blue-400/20 to-purple-400/20 
                          transition-opacity duration-300 blur-sm"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading || stocks.length === 0
            ? Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <StockChartSkeleton showFilter={false} height={100} />
                </div>
              ))
            : stocks.map((stock, index) => (
                <div
                  key={stock.symbol}
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link to={`/stock/${stock.symbol}`}>
                    <div
                      className="relative rounded-2xl overflow-hidden
                                  bg-white/2 backdrop-blur-md border border-white/10
                                  hover:bg-white/10 hover:border-white/20
                                  transition-all duration-300 ease-out
                                  shadow-lg hover:shadow-xl hover:shadow-blue-500/20
                                  hover:scale-[1.02] hover:-translate-y-1"
                    >
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                      <StockChart
                        symbol={stock.symbol}
                        dataFromParent={stock}
                        showFilter={false}
                        height={100}
                        display={"none"}
                      />

                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 
                                    bg-gradient-to-br from-blue-400/10 to-purple-400/10 
                                    transition-opacity duration-300 pointer-events-none"
                      />
                    </div>
                  </Link>
                </div>
              ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default MainPage;
