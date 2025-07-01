import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    change: { type: Number, required: true },
    open: { type: Number, required: false }, // ราคาเปิด
    high: { type: Number, required: false }, // ราคาสูงสุด
    low: { type: Number, required: false }, // ราคาต่ำสุด
    volume: { type: Number, required: false }, // ปริมาณการซื้อขาย
    peRatio: { type: Number, required: false }, // P/E ratio
    preMarket: { type: Number, required: false }, // ราคา pre-market
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Stock = mongoose.model("Stock", stockSchema);
