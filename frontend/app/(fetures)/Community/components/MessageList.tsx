import React, { useState, useEffect, useRef } from 'react';
import { Message, communicationService } from '../services/communicationService';
import { socketService } from '../services/socketService';

interface MessageListProps {
  channelId: string;
}

const MessageList: React.FC<MessageListProps> = ({ channelId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!channelId) return;

    socketService.removeAllListeners();
    socketService.joinChannel(channelId);
    
    socketService.onNewMessage((message: Message) => {
      if (message.channel === channelId) {
        setMessages(prev => {
          if (prev.find(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    });

    socketService.onUserTyping(({ userId, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    return () => {
      socketService.leaveChannel(channelId);
    };
  }, [channelId]);

  useEffect(() => {
    if (channelId) {
      loadMessages();
    }
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messageData = await communicationService.getChannelMessages(channelId);
      setMessages(messageData);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hr ago`;
    return date.toLocaleDateString();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-yellow-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500',
      'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-rose-500',
      'bg-emerald-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_: any, i: any) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-700 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
      <div className="space-y-4">
        {messages.map((message: any) => {
          if (!message.sender) {
            return (
              <div key={message._id} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-semibold">Anonymous</p>
                    <span className="text-gray-500 text-xs">{formatTime(message.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{message.content}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={message._id} className="flex gap-3">
              <div className={`w-8 h-8 ${getAvatarColor(message.sender.name)} rounded-full flex items-center justify-center text-white text-sm flex-shrink-0`}>
                {message.sender.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-semibold">{message.sender.name}</p>
                  <span className="text-gray-500 text-xs">{formatTime(message.createdAt)}</span>
                </div>
                {message.messageType === 'text' ? (
                  <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ 
                    __html: message.content.replace(/\n/g, '<br/>') 
                  }}></p>
                ) : message.messageType === 'file' && message.fileUrl ? (
                  <div className="mt-1">
                    <p className="text-gray-300 text-sm mb-2">{message.content}</p>
                    <a 
                      href={message.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                      View File
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        
        {typingUsers.size > 0 && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Someone is typing...</p>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;