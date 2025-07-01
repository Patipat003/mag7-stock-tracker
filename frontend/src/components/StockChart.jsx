import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Box, Button, Typography, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchStockHistory } from "../services/stockService";

const StockChart = ({ symbol, showFilter = true, height = 300 }) => {
  const [data, setData] = useState({ quotes: [], meta: {} });
  const [period, setPeriod] = useState("1d");

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

  const [marketSession, setMarketSession] = useState("");

  const quotes = data?.quotes ?? [];
  const meta = data?.meta ?? {};

  const min = quotes.length > 0 ? Math.min(...quotes.map((d) => d.close)) : 0;
  const max = quotes.length > 0 ? Math.max(...quotes.map((d) => d.close)) : 0;
  const padding = (max - min) * 0.05;

  const regularMarketPrice = meta.regularMarketPrice || 0;
  const previousPrice = quotes[0]?.close || 0;
  const priceChange = regularMarketPrice - previousPrice;
  let previousClose = meta.previousClose;
  if (!previousClose || previousClose === 0) {
    previousClose = quotes[0]?.close || 0;
  }

  const percentChange =
    previousClose !== 0
      ? ((regularMarketPrice - previousClose) / previousClose) * 100
      : 0;

  const isPositive = percentChange >= 0;
  const lineColor = isPositive ? "#34C759" : "#FF3B30";
  const changeColor = isPositive ? "#34C759" : "#FF3B30";

  const periods = [
    { key: "1d", label: "1D" },
    { key: "1w", label: "1W" },
    { key: "1m", label: "1M" },
    { key: "3m", label: "3M" },
    { key: "6m", label: "6M" },
    { key: "1y", label: "1Y" },
    { key: "5y", label: "5Y" },
  ];

  useEffect(() => {
    const updateMarketSession = () => {
      const now = new Date();
      const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

      const preMarketStart = 8 * 60;
      const marketOpen = 13 * 60 + 30;
      const marketClose = 20 * 60;

      let session = "After-hours";
      if (utcMinutes >= preMarketStart && utcMinutes < marketOpen) {
        session = "Pre-market";
      } else if (utcMinutes >= marketOpen && utcMinutes < marketClose) {
        session = "";
      }
      setMarketSession(session);
    };

    updateMarketSession();
    const interval = setInterval(updateMarketSession, 60000);
    return () => clearInterval(interval);
  }, []);

  let lastHour = -1;
  let lastDay = -1;
  let lastMonth = "";

  const formatDate = (date, format = "day") => {
    const d = new Date(date);
    const day = d.getDate();
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    switch (format) {
      case "1d":
        if (lastHour !== Number(hours)) {
          lastHour = parseInt(hours, 10);
          return `${hours}:${minutes}`;
        }
        return "";
      case "1w":
      case "1m":
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
        return `${String(day).padStart(2, "0")} ${
          months[monthIndex]
        } ${year} ${hours}:${minutes}`;
      case "dayYearMonth":
        return `${String(day).padStart(2, "0")} ${months[monthIndex]} ${year}`;
      default:
        return `${String(day).padStart(2, "0")}/${String(
          monthIndex + 1
        ).padStart(2, "0")}/${year}`;
    }
  };

  return (
    <Box
      sx={{
        color: "white",
        borderRadius: 2,
        overflow: "hidden",
        minHeight: height + 100,
      }}
    >
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: "1.5rem",
            mb: 0.5,
            color: "white",
          }}
        >
          {symbol}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 500, fontSize: "20px", mb: 0.5, color: "white" }}
          >
            ${regularMarketPrice.toFixed(2)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{ color: changeColor, fontWeight: 500, fontSize: "1rem" }}
            >
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)} ({isPositive ? "+" : ""}
              {percentChange.toFixed(2)}%)
            </Typography>
            <Chip
              label={marketSession}
              size="small"
              sx={{
                color: "#6A6A6AFF",
                fontSize: "1rem",
                height: "20px",
                fontWeight: 500,
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Box>
        </Box>
        {showFilter && (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              bgcolor: "#1C1C1E",
              borderRadius: 2,
              p: 0.5,
              width: "fit-content",
            }}
          >
            {periods.map((p) => (
              <Button
                key={p.key}
                size="small"
                onClick={() => setPeriod(p.key)}
                sx={{
                  minWidth: "45px",
                  height: "32px",
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: period === p.key ? "black" : "#8E8E93",
                  bgcolor: period === p.key ? "white" : "transparent",
                  "&:hover": {
                    bgcolor: period === p.key ? "white" : "#2C2C2E",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {p.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={quotes}
            margin={{ top: 5, right: 5, left: 5, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#2C2C2E"
              strokeWidth={0.5}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                if (period === "1d") return formatDate(value, "1d");
                if (["1w", "1m"].includes(period))
                  return formatDate(value, "1w");
                if (["3m", "6m", "1y"].includes(period))
                  return formatDate(value, "month");
                if (period === "5y") return formatDate(value, "year");
                return value;
              }}
              tick={{ fontSize: 12, fill: "#8E8E93", fontWeight: 400, dy: 20 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[min - padding, max + padding]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${Math.round(value)}`}
              tick={{ fontSize: 12, fill: "#8E8E93", fontWeight: 400 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1C1C1E",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                padding: "12px 16px",
              }}
              labelStyle={{
                color: "#8E8E93",
                fontSize: "12px",
                fontWeight: 400,
                marginBottom: "4px",
              }}
              labelFormatter={(value) => {
                if (["1d", "1w", "1m"].includes(period))
                  return formatDate(value, "dayYearMonthTime");
                if (["3m", "6m", "1y"].includes(period))
                  return formatDate(value, "dayYearMonth");
                if (period === "5y") return formatDate(value, "year");
                return value;
              }}
              formatter={(value) => [
                <span
                  style={{ color: "white", fontSize: "14px", fontWeight: 500 }}
                >
                  ${value.toFixed(2)}
                </span>,
                "",
              ]}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: lineColor,
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default StockChart;
