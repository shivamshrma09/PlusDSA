import { io, Socket } from 'socket.io-client';
import { Message } from './communicationService';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;
    
    this.socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket']
    });

    this.socket.on('connect', () => {
      console.log(' Connected to server');
    });

    this.socket.on('connect_error', (error: any) => {
      console.log(' Connection error:', error.message);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinChannel(channelId: string) {
    if (this.socket) {
      this.socket.emit('join-channel', channelId);
    }
  }

  leaveChannel(channelId: string) {
    if (this.socket) {
      this.socket.emit('leave-channel', channelId);
    }
  }

  sendMessage(messageData: {
    channelId: string;
    content: string;
    messageType?: 'text' | 'image' | 'file';
    fileUrl?: string;
  }) {
    if (this.socket) {
      this.socket.emit('send-message', messageData);
    }
  }

  onNewMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  onUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  sendTyping(channelId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', { channelId, isTyping });
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners('new-message');
      this.socket.removeAllListeners('user-typing');
    }
  }
}

export const socketService = new SocketService();