import React, { useState, useRef } from 'react';
import { RiUpload2Line } from 'react-icons/ri';
import { socketService } from '../services/socketService';

interface MessageInputProps {
  channelId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ channelId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socketService.sendTyping(channelId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.sendTyping(channelId, false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);
      
      socketService.sendMessage({
        channelId,
        content: message.trim(),
        messageType: 'text'
      });

      setMessage('');
      
      if (isTyping) {
        setIsTyping(false);
        socketService.sendTyping(channelId, false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

  return (
    <div className="relative">
      <input 
        type="text" 
        placeholder="Type a message..." 
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={sending}
        className="w-full bg-black text-white p-3 pr-12 rounded-lg border border-neutral-500/30 focus:outline-none focus:border-blue-500 disabled:opacity-50"
      />
      <button 
        onClick={handleFileUpload}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
        title="Upload file"
      >
        <RiUpload2Line className="text-xl" />
      </button>
    </div>
  );
};

export default MessageInput;