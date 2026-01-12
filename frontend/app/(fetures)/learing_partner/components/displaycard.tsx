"use client"
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { TbSend2 } from "react-icons/tb";
import { sendConnectionRequest } from '../services/learningPartner';

interface DisplayCardProps {
  postId: string;
  name: string;
  email: string;
  college: string;
  year: string;
  profileImage: string;
  linkedinUrl: string;
  githubUrl: string;
  leetcodeUrl?: string;
  tags: string[];
  description: string;
}

function DisplayCard({ 
  postId,
  name, 
  email,
  college, 
  year, 
  profileImage, 
  linkedinUrl, 
  githubUrl, 
  leetcodeUrl,
  tags, 
  description 
}: DisplayCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [sending, setSending] = useState(false);
  
  const trimmedDescription = description.length > 150 ? description.slice(0, 150) + "..." : description;
  
  const handleSendRequest = async () => {
    setSending(true);
    try {
      const response = await sendConnectionRequest(postId);
      if (response.success) {
        toast.success('Connection request sent successfully! Check your email and LinkedIn for connecting with peer.');
      } else {
        toast.error('Failed to send request: ' + response.error);
      }
    } catch (error) {
      console.error('Send request error:', error);
      toast.error('Failed to send request');
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className='p-6 border border-neutral-500/20 rounded-xl bg-neutral-800/20 max-w-4xl'>
      <div className='flex gap-6'>
        <div className='flex-shrink-0'>
          <img 
            src={profileImage || "https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"}
            alt='User Profile'
            className='w-40 h-40 rounded-full object-cover border border-neutral-500/20'
          />
        </div>
        
        <div className='flex-1 flex flex-col gap-1'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-7'>
              <h3 className='text-white text-xl font-semibold'>{name}</h3>
              <div className='flex gap-2'>
                {linkedinUrl && (
                  <a href={linkedinUrl} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:text-blue-400 transition-colors'>
                    <FaLinkedin className='text-xl' />
                  </a>
                )}
                {githubUrl && (
                  <a href={githubUrl} target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-gray-300 transition-colors'>
                    <FaGithub className='text-xl' />
                  </a>
                )}
                {leetcodeUrl && (
                  <a href={leetcodeUrl} target='_blank' rel='noopener noreferrer' className='text-yellow-500  transition-colors'>
                    <SiLeetcode className='text-xl' />
                  </a>
                )}
              </div>
            </div>
            <p className='text-neutral-400 text-base'>{college}, {year}</p>
            <div className='flex gap-2 flex-wrap'>
              {tags.map((tag: any, index: any) => (
                <span key={index} className='px-3 py-1 bg-blue-400 text-white text-sm rounded-full'>{tag}</span>
              ))}
            </div>
          </div>
          
          <div className='mt-3'>
            <p className='text-neutral-300 text-base leading-relaxed'>
              {showFullDescription ? description : trimmedDescription}
              {description.length > 150 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className='text-blue-500 hover:text-blue-400 ml-2 text-sm font-medium'
                >
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              )}
            </p>
          </div>
          
          <div className='mt-2 flex flex-row'>
            <button 
              onClick={handleSendRequest}
              disabled={sending}
              className='px-4 py-1 flex flex-row items-center gap-2 bg-green-600 lg:ml-120 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50'
            >
              {sending ? 'Sending...' : 'Send Request'} <TbSend2/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisplayCard