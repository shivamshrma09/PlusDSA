"use client"
import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../../shared/components/Sidebar'
import { MdArrowForwardIos } from "react-icons/md";
import { RiGeminiFill } from "react-icons/ri";
import { FaArrowUp } from "react-icons/fa";
import PostFind from './components/postfind';
import DisplayCard from './components/displaycard';
import { getLearningPartnerPosts } from './services/learningPartner';
import { getAIRecommendation } from './services/aiService';

function page() {
    const [findopen, setFindopen] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
      name: '',
      tag: ''
    });
    const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
    const [openai, setOpenai] = useState(false);
    const [messages, setMessages] = useState<Array<{sender: string; text: string}>>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    
    useEffect(() => {
      fetchPosts();
    }, []);

    useEffect(() => {
      filterPosts();
    }, [posts, filters]);

    const filterPosts = () => {
      let filtered = posts;
      
      if (filters.name) {
        filtered = filtered.filter(post => 
          post.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      
      if (filters.tag) {
        filtered = filtered.filter(post => 
          post.tags.some((tag: string) => tag.toLowerCase().includes(filters.tag.toLowerCase()))
        );
      }
      
      setFilteredPosts(filtered);
    };

    const handleFilterChange = (field: string, value: string) => {
      setFilters(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const sendMessageToAI = async (message: string) => {
      if (!message.trim()) return;
      
      setMessages(prev => [...prev, { sender: 'user', text: message }]);
      setInput('');
      
      try {
        const response = await getAIRecommendation(message + '. Please provide detailed response with examples and suggestions.', posts);
        if (response.success) {
          let aiResponse = response.recommendation;
          if (aiResponse.length > 1000) {
            aiResponse = aiResponse.substring(0, 997) + '...';
          }
          setMessages(prev => [...prev, { 
            sender: 'ai', 
            text: aiResponse
          }]);
        } else {
          setMessages(prev => [...prev, { 
            sender: 'ai', 
            text: 'I apologize, but I am unable to provide detailed recommendations at this moment. Please try again or rephrase your question for better assistance.'
          }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: 'I am here to help you find the perfect learning partners based on your interests, skills, and learning goals. Please tell me what specific topics, technologies, or skills you would like to learn or practice with others, and I will provide detailed recommendations and suggestions.'
        }]);
      }
    };

    const renderMessage = (text: string) => {
      return <span>{text}</span>;
    };

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await getLearningPartnerPosts();
        if (response.success) {
          setPosts(response.data || []);
        } else {
          console.error('Failed to fetch posts:', response.error);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    const handlePostCreated = () => {
      setFindopen(false);
      fetchPosts();
    };
    
  return (
    <div className='h-screen max-w-screen bg-black overflow-hidden'>
      <div className='flex flex-row h-full'>
        <div className='sticky top-0 h-screen  lg:block z-50'>
          <Sidebar/>
        </div>
        <div className='flex flex-col flex-1 h-full'>
          <div className='sticky top-0 z-10 w-full flex flex-col lg:flex-row lg:justify-between border border-b gap-3 lg:gap-2 p-3 lg:pt-5 lg:pb-6 border-neutral-500/30 bg-black'>
          <div className='flex gap-2 items-center text-base lg:text-xl'>
            <span className='text-neutral-500 lg:ml-5'>Learning Partner</span>
            <MdArrowForwardIos className='text-neutral-500 text-sm lg:text-base' />
            <span>Find peer</span>
          </div>
          
          <div className='flex flex-wrap gap-2 lg:gap-3 items-center'>
            <input 
              type='text'
              placeholder='Filter by name'
              value={filters.name}
              onChange={(e: any) => handleFilterChange('name', e.target.value)}
              className='flex-1 min-w-[120px] px-3 py-1 bg-black border border-neutral-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500'
            />
            <select
              value={filters.tag}
              onChange={(e: any) => handleFilterChange('tag', e.target.value)}
              className='flex-1 min-w-[120px] px-3 py-1 bg-black border border-neutral-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500'
            >
              <option value=''>All Tags</option>
              <option value='Hackathon'>Hackathon</option>
              <option value='Competition'>Competition</option>
              <option value='Peer Learning'>Peer Learning</option>
              <option value='Internship'>Internship</option>
              <option value='Placement Prep'>Placement Prep</option>
              <option value='DSA Practice'>DSA Practice</option>
            </select>
          
              <button onClick={() => setFindopen(!findopen)} className='flex items-center px-4 lg:px-5 py-1 gap-2 font-semibold border border-[#0340aa] shadow-xl bg-[#0340aa] rounded-xl text-sm lg:text-base'>
                    Find 
                </button>

                <button 
                  onClick={() => setOpenai(!openai)}
                  className='flex items-center px-3 lg:px-4 py-1 gap-2 font-semibold border border-[#0340aa] rounded-xl text-sm lg:text-base whitespace-nowrap'
                >
                    <span className='hidden sm:inline'>Find With AI</span>
                    <span className='sm:hidden'>AI</span>
                    <RiGeminiFill className='text-[#0340aa]'/>
                </button>
          </div>
          </div>
          
          <div className='flex-1 p-2 overflow-y-auto' style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div>
              <PostFind findopen={findopen} onPostCreated={handlePostCreated} />
            </div>

            {openai && (
              <div 
                className='fixed top-20 right-2 left-2 sm:left-auto sm:right-6 sm:w-80 md:w-96 z-50 rounded-2xl shadow-2xl flex flex-col h-[28rem] bg-black border border-neutral-500/30 backdrop-blur-xl'
                suppressHydrationWarning
              >
                <div className='flex items-center justify-between p-3 sm:p-4 border-b border-neutral-500/30'>
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <div className='w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse'></div>
                    <h3 className='text-white font-semibold text-sm sm:text-base'>Find with PlusAI </h3>
                  </div>
                  <button 
                    onClick={() => setOpenai(false)}
                    className='text-neutral-400 hover:text-white transition-colors'
                  >
                    ✕
                  </button>
                </div>

                <div className='flex-1 p-3 sm:p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent'>
                  {messages.length === 0 && (
                    <div className='text-center text-neutral-400 mt-8'>
                      <RiGeminiFill className='text-3xl sm:text-4xl mx-auto mb-3 text-blue-500' />
                      <p className='text-xs sm:text-sm'>Ask me to help you find the perfect learning partner!</p>
                    </div>
                  )}
                  {messages.map((msg: any, index: any) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end mb-3 sm:mb-4' : 'justify-start mb-3 sm:mb-4'}`}>
                      <div className={`max-w-[85%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                          : 'bg-gradient-to-r from-neutral-700 to-neutral-600 text-neutral-100 rounded-bl-md border border-neutral-600/50'
                      }`}>
                        {renderMessage(msg.text)}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className='p-3 sm:p-4 border-t border-neutral-700/50'>
                  <div className='relative flex items-center bg-neutral-800/50 rounded-xl border border-neutral-600/50 focus-within:border-blue-500/50 transition-colors'>
                    <input 
                      type='text' 
                      value={input}
                      onChange={(e: any) => setInput(e.target.value)}
                      onKeyDown={(e: any) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessageToAI(input);
                        }
                      }}
                      placeholder="Find learning partners..."
                      className='flex-1 bg-transparent text-white px-3 sm:px-4 py-2 sm:py-3 outline-none placeholder-neutral-400 text-sm'
                    />
                    <button
                      onClick={() => sendMessageToAI(input)}
                      disabled={!input.trim()}
                      className='p-2 m-1.5 sm:m-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors'
                    >
                      <FaArrowUp className='text-xs sm:text-sm' />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className='space-y-4'>
              {loading ? (
                <div className='text-center text-neutral-400 py-8'>
                  Loading posts...
                </div>
              ) : posts.length === 0 ? (
                <div className='text-center text-neutral-400 py-8'>
                  No learning partner posts yet. Be the first to create one!
                </div>
              ) : (
                filteredPosts.map((post: any) => (
                  <DisplayCard 
                    key={post._id}
                    postId={post._id}
                    name={post.name}
                    email={post.email}
                    college={post.college}
                    year={post.year}
                    profileImage={post.profileImage}
                    linkedinUrl={post.linkedinUrl}
                    githubUrl={post.githubUrl}
                    leetcodeUrl={post.leetcodeUrl}
                    tags={post.tags}
                    description={post.description}
                  />
                ))
              )}
            </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default page
