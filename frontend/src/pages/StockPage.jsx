import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StockChart from "../components/StockChart";
import StockInfo from "../components/StockInfo";
import NewsCard from "../components/NewsCard";
import { getStockBySymbol, getNews } from "../services/stockService";
import Loading from "../components/ui/Loading";

const StockPage = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [news, setNews] = useState([]);

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

  if (!stock) return <Loading />;

  return (
    <div className="flex flex-1 overflow-hidden p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="w-full space-y-4 m-4 relative z-10">
        <div className="relative animate-fade-in">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            {stock.name} ({stock.symbol})
          </h2>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div
            className="md:col-span-3 relative rounded-2xl overflow-hidden
                        bg-white/2 backdrop-blur-md border border-white/10
                        shadow-lg hover:shadow-xl hover:shadow-blue-500/20
                        transition-all duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <StockChart symbol={stock.symbol} />
          </div>

          <div
            className="md:col-span-1 relative rounded-2xl overflow-hidden
                        bg-white/2 backdrop-blur-md border border-white/10
                        shadow-lg hover:shadow-xl hover:shadow-purple-500/20
                        transition-all duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <StockInfo symbol={stock.symbol} />
          </div>
        </div>

        <div
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative">
            <h3 className="text-2xl font-semibold text-white drop-shadow-lg">
              News
            </h3>
          </div>

          {news.length > 0 ? (
            <div className="space-y-4">
              {news.map((newsItem, index) => (
                <div
                  key={newsItem.id || index}
                  className="relative rounded-2xl p-4 backdrop-blur-md border border-white/10 hover:bg-white/5 hover:border-white/20 hover:cursor-pointer shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 ease-outhover:scale-[1.01] hover:-translate-y-0.5 animate-fade-in"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <NewsCard news={newsItem} />

                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 
                                bg-gradient-to-br from-blue-400/10 to-purple-400/10 
                                transition-opacity duration-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="relative rounded-2xl overflow-hidden p-8
                          bg-white/5 backdrop-blur-md border border-white/10
                          shadow-lg text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <p className="text-white/60 text-lg relative z-10">
                No news available.
              </p>
            </div>
          )}
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
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default StockPage;
