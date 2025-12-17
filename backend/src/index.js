import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { readdirSync } from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import ConnectDB from "./Config/db.js";
import { updateStocksFromAPI } from "./Controllers/stock.js";
import http from "http";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

ConnectDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mag7-stock-tracker-dgqz.vercel.app",
      "https://www.mag7tracker.xyz",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "10mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.join(__dirname, "Routes");

for (const file of readdirSync(routesPath)) {
  const filePath = path.join(routesPath, file);
  const fileUrl = pathToFileURL(filePath).href;

  const routeModule = await import(fileUrl);
  app.use("/", routeModule.default);
}

app.get("/", (req, res) => {
  res.send("Server is running!");
});

server.listen(Number(PORT), HOST, () => {
  console.log(`Server is running on port ${PORT}`);
  updateStocksFromAPI();
  setInterval(updateStocksFromAPI, 10 * 60 * 1000); // ทุก 10 นาที
});
