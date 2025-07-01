import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const getStocks = async () => {
  try {
    const response = await axios.get(`${apiUrl}/stocks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return [];
  }
};

export const getNews = async (symbol) => {
  try {
    const response = await axios.get(`${apiUrl}/news/${symbol}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const getStockBySymbol = async (symbol) => {
  try {
    const response = await axios.get(`${apiUrl}/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock by symbol:", error);
    return null;
  }
};

export const fetchStockHistory = async (symbol, period) => {
  const res = await fetch(`${apiUrl}/stocks/history/${symbol}/${period}`);
  const json = await res.json();
  return json.quotes;
};
