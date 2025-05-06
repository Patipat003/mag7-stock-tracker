import mongoose from "mongoose";

export interface StockDocument extends mongoose.Document {
    symbol: string;  // เช่น AAPL
    name: string;    // เช่น Apple Inc.
    price: number;
    change: number;  // +/- การเปลี่ยนแปลง
    open: number;    // ราคาเปิด
    high: number;    // ราคาสูงสุด
    low: number;     // ราคาต่ำสุด
    volume: number;  // ปริมาณการซื้อขาย
    peRatio: number; // P/E ratio
    preMarket: number; // ราคา pre-market
    updatedAt: Date;
}

const stockSchema = new mongoose.Schema<StockDocument>({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    change: { type: Number, required: true },
    open: { type: Number, required: false },   // ราคาเปิด
    high: { type: Number, required: false },   // ราคาสูงสุด
    low: { type: Number, required: false },    // ราคาต่ำสุด
    volume: { type: Number, required: false }, // ปริมาณการซื้อขาย
    peRatio: { type: Number, required: false },// P/E ratio
    preMarket: { type: Number, required: false }, // ราคา pre-market
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const Stock = mongoose.model<StockDocument>('Stock', stockSchema);
