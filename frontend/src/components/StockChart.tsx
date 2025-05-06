import React, { useEffect, useState } from "react";
import { fetchStockHistory } from "../services/stockService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Box, Button, Typography } from "@mui/material";

interface Quote {
  date: string;
  close: number;
}

interface StockChartProps {
  symbol: string;
  showFilter?: boolean;
  height?: number;
  display?: string;
}

const StockChart: React.FC<StockChartProps> = ({ symbol, showFilter = true, height = 340, display = "block" }) => {
  const [data, setData] = useState<Quote[]>([]);
  const [period, setPeriod] = useState("1d");
  const [marketSession, setMarketSession] = useState("Pre-market");

  const periods = ["1d", "1w", "3m", "6m", "ytd", "1y", "5y"];

  const filterWeekends = (data: Quote[]) =>
    data.filter((q) => ![0, 6].includes(new Date(q.date).getDay()));

  useEffect(() => {
    fetchStockHistory(symbol, period).then((history) => {
      setData(filterWeekends(history));
    });
  }, [symbol, period]);

  const min = Math.min(...data.map((d) => d.close));
  const max = Math.max(...data.map((d) => d.close));
  const padding = (max - min) * 0.08;
  const regularMarketPrice = data[data.length - 1]?.close || 0;

  let lastHour = -1;
  let lastDay = -1;
  let lastMonth = "";

  const formatDate = (date: string, format: string = "day") => {
    const d = new Date(date);
    const day = d.getDate();
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    switch (format) {
      case "1d":
        if (lastHour !== Number(hours)) {
          lastHour = parseInt(hours, 10);
          return `${hours}`;
        }
        return "";
      case "1w":
        if (lastDay !== day) {
          lastDay = day;
          return `${day}`;
        }
        return "";
      case "month":
        const currentMonth = months[monthIndex];
        if (lastMonth !== currentMonth) {
          lastMonth = currentMonth;
          return currentMonth;
        }
        return "";
      case "year":
        return `${year}`;
      case "dayYearMonthTime":
        return `${String(day).padStart(2, "0")} ${months[monthIndex]} ${year} ${hours}:${minutes}`;
      case "dayYearMonth":
        return `${String(day).padStart(2, "0")} ${months[monthIndex]} ${year}`;
      default:
        return `${String(day).padStart(2, "0")}/${String(monthIndex + 1).padStart(2, "0")}/${year}`;
    }
  };

  const determineLineColor = () => {
    const latestPrice = data[data.length - 1]?.close;
    const previousPrice = data[data.length - 2]?.close;
    return latestPrice > previousPrice ? "#32CD32" : "#FF6347";
  };

  useEffect(() => {
    const updateMarketSession = () => {
      const now = new Date();
      const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

      const preMarketStart = 8 * 60;         // 08:00 UTC
      const marketOpen = 13 * 60 + 30;       // 13:30 UTC
      const marketClose = 20 * 60;           // 20:00 UTC
  
      let session = "After-hours";
      if (utcMinutes >= preMarketStart && utcMinutes < marketOpen) {
        session = "Pre-market";
      } else if (utcMinutes >= marketOpen && utcMinutes < marketClose) {
        session = "Open";
      }
      setMarketSession(session);
    };
  
    updateMarketSession();
    const interval = setInterval(updateMarketSession, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2, bgcolor: "#0f0f0f", borderRadius: 3, boxShadow: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        rowGap={1}
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={2} sx={{ flex: 1, minWidth: "200px" }}>
          <Typography variant="h6" fontWeight="semibold">Stock: {symbol}</Typography>
          <Typography fontWeight="semibold">
            {marketSession}: ${regularMarketPrice}
          </Typography>
        </Box>

        {showFilter && (
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent={{ xs: "flex-start", sm: "flex-end" }}
            sx={{ mt: { xs: 1, sm: 0 } }}
          >
            {periods.map((p) => (
              <Button
                key={p}
                size="small"
                variant={period === p ? "contained" : "outlined"}
                onClick={() => setPeriod(p)}
                color={period === p ? "primary" : "inherit"}
                sx={{ m: 0.5, textTransform: "none", minWidth: 50 }}
              >
                {p}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#555" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              if (period === "1d") return formatDate(value, "1d");
              if (period === "1w") return formatDate(value, "1w");
              if (["3m", "6m", "ytd", "1y"].includes(period)) return formatDate(value, "month");
              if (period === "5y") return formatDate(value, "year");
              return value;
            }}
            tick={{ 
              fontSize: 16,
              display: display
            }}
          />
          <YAxis
            domain={[min - padding, max + padding]}
            tickFormatter={(value) =>
              value === Math.round(min - padding) ? "" : `$${Math.round(value)}`
            }
            tick={{ fontSize: 16 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f0f0f", border: "1px solid #ccc" }}
            labelFormatter={(value) => {
              if (["1d", "1w"].includes(period)) return formatDate(value, "dayYearMonthTime");
              if (["3m", "6m", "ytd", "1y"].includes(period)) return formatDate(value, "dayYearMonth");
              if (period === "5y") return formatDate(value, "year");
              return value;
            }}
            labelClassName="text-white"
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Close"]}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke={determineLineColor()}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockChart;
