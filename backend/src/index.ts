import express from 'express';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import morgan from 'morgan';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import ConnectDB from './Config/db';
import { updateStocksFromAPI } from './Controllers/stock';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://mag7-stock-tracker-dgqz.vercel.app',
      'https://www.mag7tracker.xyz'
    ],
    methods: ['GET', 'POST']
  }
});

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 5000;

ConnectDB();

app.use(morgan('dev'));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mag7-stock-tracker-dgqz.vercel.app',
    'https://www.mag7tracker.xyz'
  ],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));

readdirSync('./src/Routes').map((r) =>
  app.use('/', require('./Routes/' + r).default)
);

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { username: string };
  } catch (error) {
    return null;
  }
};

app.get('/', (req, res) => {
  res.send('Chat server is running!');
});

io.on('connection', (socket: any) => {
  socket.on('authenticate', (token: any) => {
    const decoded = verifyToken(token);
    if (!decoded) {
      socket.emit('unauthorized', { message: 'Invalid or expired token.' });
      socket.disconnect();
      return;
    }
    socket.data.username = decoded.username;
    socket.emit('authenticated', { message: 'Authentication successful' });
  });

  socket.on("join_room", (roomName: any) => {
    if (socket.room) {
      socket.leave(socket.room);
      console.log(`${socket.data.username} left room: ${socket.room}`);
    }
    socket.join(roomName);
    socket.room = roomName;
    console.log(`${socket.data.username} joined room: ${roomName}`);
  });

  socket.on('chat_message', (message: any) => {
    if (!socket.data.username) {
      socket.emit('chat_message', {
        message: 'User not authenticated',
        username: 'System'
      });
      return;
    }

    const room = socket.room;
    if (!room) {
      socket.emit('chat_message', {
        message: 'You must join a room first.',
        username: 'System'
      });
      return;
    }

    io.to(room).emit('chat_message', {
      message,
      username: socket.data.username
    });

    console.log(`[ROOM: ${room}] ${socket.data.username}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(Number(PORT), HOST, () => {
  console.log(`Server is running on port ${PORT}`);
  updateStocksFromAPI();
  setInterval(updateStocksFromAPI, 60 * 1000); // อัปเดตทุก 1 นาที
});
