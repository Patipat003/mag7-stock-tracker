import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface NewsItem {
    title: string;
    link: string;
    publisher: string;
    providerPublishTime: string;
}

export const getStocks = async () => {
  try {
    const response = await axios.get(`${apiUrl}/stocks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
};

export const getNews = async (symbol: string): Promise<NewsItem[]> => {
    try {
      const response = await axios.get<NewsItem[]>(`${apiUrl}/news/${symbol}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
};

export const getStockBySymbol = async (symbol: string) => {
  try {
    const response = await axios.get(`${apiUrl}/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock by symbol:', error);
    return null;
  }
};

export const fetchStockHistory = async (symbol: string, period: string) => {
    const res = await fetch(`${apiUrl}/stocks/history/${symbol}/${period}`);
    const json = await res.json();
    return json.quotes;
  };