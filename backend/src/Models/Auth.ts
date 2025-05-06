import mongoose from "mongoose";

export interface AuthDocument extends mongoose.Document {
    username: string;
    password: string;
    createdAt: Date;
}

const authSchema = new mongoose.Schema<AuthDocument>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
},{
    timestamps: true
});

export const Auth = mongoose.model<AuthDocument>('Auth', authSchema);