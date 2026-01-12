import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Channel, communicationService } from '../services/communicationService';

interface ChannelListProps {
  selectedChannelId: string | null;
  onChannelSelect: (channel: Channel) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
  selectedChannelId,
  onChannelSelect
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const channelData = await communicationService.getChannels();
      setChannels(channelData);
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="border-r border-neutral-500/30 p-2 w-20">
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_: any, i: any) => (
            <div key={i} className="w-12 h-12 bg-neutral-700 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-r border-neutral-500/30 p-2 flex flex-col gap-3">
      {channels.map((channel: any) => (
        <button
          key={channel._id}
          onClick={() => onChannelSelect(channel)}
          className={`relative group ${
            selectedChannelId === channel._id ? 'ring-2 ring-blue-500' : ''
          }`}
          title={channel.name}
        >
          <Image
            src={channel.image || '/default-channel.png'}
            width={50}
            height={50}
            alt={channel.name}
            className="rounded-full border border-neutral-500/50 aspect-square object-cover hover:border-blue-500 transition-colors"
          />
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {channel.name}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChannelList;