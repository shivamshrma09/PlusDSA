"use client"
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Sidebar from '../../shared/components/Sidebar'
import { MdArrowForwardIos } from "react-icons/md";
import { IoInformationCircleOutline } from "react-icons/io5";
import ChannelList from './components/ChannelList';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import CreateChannelModal from './components/CreateChannelModal';
import { Channel } from './services/communicationService';
import { socketService } from './services/socketService';
import { useAuth } from './services/useAuth';

function page() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
      toast.success('Connected to community!');
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const handleCreateChannel = () => {
    setShowCreateModal(true);
  };

  const handleChannelCreated = () => {
    toast.success('Channel created successfully!');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className='h-screen max-w-screen bg-black overflow-hidden flex items-center justify-center'>
        <div className='text-white text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
          <p className='text-gray-400'>Loading...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className='h-screen max-w-screen bg-black overflow-hidden flex items-center justify-center'>
        <div className='text-white text-center'>
          <h2 className='text-2xl mb-4'>Please log in to access Community</h2>
          <p className='text-gray-400'>You need to be authenticated to use the communication system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen max-w-screen bg-black overflow-hidden'>
      <div className='flex flex-row h-full'>
        <div className='sticky top-0 h-screen'>
          <Sidebar/>
        </div>
        
        <div className='flex flex-col flex-1 h-full'>
          <div className='w-full h-18 border border-b flex gap-2 items-center text-xl border-neutral-500/30'>
            <span className='text-neutral-500 ml-5'>Community</span>
            <MdArrowForwardIos className='text-neutral-500' />
            <span>{selectedChannel ? selectedChannel.name : 'Select a channel'}</span>
          </div>

          <div className='flex flex-row flex-1 overflow-hidden'>
            <ChannelList
              selectedChannelId={selectedChannel?._id || null}
              onChannelSelect={handleChannelSelect}
            />
           
            <div className='flex-1 flex flex-col h-full'>
              {selectedChannel ? (
                <>
                  <div className='flex gap-2 p-3 border-b border-neutral-500/30 flex-shrink-0'>
                    <input 
                      type='text' 
                      placeholder='Search messages...' 
                      value={searchQuery}
                      onChange={(e: any) => setSearchQuery(e.target.value)}
                      className='w-64 bg-black text-white p-2 text-sm rounded-xl border border-neutral-500/30 focus:outline-none focus:border-blue-500'
                    />
                    <button className='text-white p-1 rounded-full hover:bg-neutral-500/30'>
                      <IoInformationCircleOutline className='text-lg' />
                    </button>
                  </div>
                  
                  <div className='flex-1 overflow-y-auto'>
                    <MessageList channelId={selectedChannel._id} />
                  </div>
                  
                  <div className='flex-shrink-0 p-3 border-t border-neutral-500/30'>
                    <MessageInput channelId={selectedChannel._id} />
                  </div>
                </>
              ) : (
                <div className='flex-1 flex items-center justify-center'>
                  <div className='text-center text-gray-400'>
                    <h3 className='text-xl mb-2'>Welcome to Community</h3>
                    <p>Select a channel to start chatting or create a new one!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onChannelCreated={handleChannelCreated}
      />
    </div>
  )
}

export default page
