import { createContext, useContext, useEffect, useState } from "react";
import { fetchStockHistory } from "../services/stockService";

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [data, setData] = useState({ quotes: [], meta: {} });
  const [period, setPeriod] = useState("1d");
  const [symbol, setSymbol] = useState("AAPL");

  const filterWeekends = (data) =>
    data.filter((q) => ![0, 6].includes(new Date(q.date).getDay()));

  useEffect(() => {
    const fetchData = () => {
      fetchStockHistory(symbol, period).then((history) => {
        const filteredQuotes =
          period === "1d"
            ? history.quotes
            : history.quotes.filter(
                (q) => ![0, 6].includes(new Date(q.date).getDay())
              );
        setData({
          quotes: filteredQuotes,
          meta: history.meta,
        });
      });
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [symbol, period]);

  return (
    <StockContext.Provider
      value={{
        data,
        period,
        setPeriod,
        symbol,
        setSymbol,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);
