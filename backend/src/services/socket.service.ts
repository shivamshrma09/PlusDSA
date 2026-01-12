import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message.model';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (io: Server) => {
  io.use(async (socket: any, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      let userId = 'anonymous-' + Date.now();
      
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          const token = tokenMatch[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          
          const { UserModel } = await import('../models/User.model');
          const user = await UserModel.findById(decoded._id || decoded.userId);
          
          if (user) {
            userId = user._id.toString();
            socket.userName = user.name;
            socket.userEmail = user.email;
          }
        }
      }
      
      socket.userId = userId;
      next();
    } catch (err) {
      socket.userId = 'anonymous-' + Date.now();
      next();
    }
  });

  io.on('connection', (socket: any) => {

    socket.on('join-channel', (channelId: string) => {
      socket.join(channelId);
    });

    socket.on('leave-channel', (channelId: string) => {
      socket.leave(channelId);
    });

    socket.on('send-message', async (data: {
      channelId: string;
      content: string;
      messageType?: string;
      fileUrl?: string;
    }) => {
      try {
        const message = new Message({
          content: data.content,
          sender: socket.userId, 
          channel: data.channelId,
          messageType: data.messageType || 'text',
          fileUrl: data.fileUrl
        });

        await message.save();
        await message.populate('sender', 'name email');

        io.to(data.channelId).emit('new-message', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', (data: { channelId: string; isTyping: boolean }) => {
      socket.to(data.channelId).emit('user-typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {});
  });
};