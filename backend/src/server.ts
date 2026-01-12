import dotenv from 'dotenv';
dotenv.config();

process.env.TZ = 'Asia/Kolkata';

import app from './app';
import mongoose from 'mongoose';
import connectDB from './db/db';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { initializeSocket } from './services/socket.service';

const PORT = process.env.PORT ;
const INSTANCE_ID = process.env.RENDER_INSTANCE_ID || `instance-${Date.now()}`;


const init = async () => {
  try {
    await connectDB();
    
    const server = createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    initializeSocket(io);
    
    server.listen(PORT, () => {});

    process.on('SIGTERM', () => {
      server.close(() => {
        mongoose.connection.close();
        process.exit(0);
      });
    });

  } catch (error: any) {
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: any) => {
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  process.exit(1);
});

init();