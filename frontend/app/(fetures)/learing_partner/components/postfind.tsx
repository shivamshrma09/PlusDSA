"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { createLearningPartnerPost } from '../services/learningPartner'

interface PostFindProps {
  findopen: boolean;
  onPostCreated: () => void;
}

function PostFind({ findopen, onPostCreated }: PostFindProps) {
  const [formData, setFormData] = useState({
    college: '',
    year: '',

    tags: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.college || !formData.year || !formData.description || !formData.tags) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        college: formData.college,
        year: formData.year,
        tags: [formData.tags],
        description: formData.description
      };

      const response = await createLearningPartnerPost(postData);
      if (response.success) {
        alert('Post created successfully!');
        setFormData({ college: '', year: '', tags: '', description: '' });
        onPostCreated();
      } else {
        alert('Failed to create post: ' + response.error);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
         {findopen &&(
           <div className='flex rounded-xl text-white text-2xl p-6 font-semibold'>
            <div className='flex flex-col gap-3 h-full w-full'>
              <div className='flex flex-row gap-2 h-1/2'>
                <Image 
                  src="https://ik.imagekit.io/qwzhnpeqg/mockround.ai%20imges%20public/candidate.jpg?updatedAt=1767107537991"
                  width={200}
                  height={200}
                  alt='Profile'
                  className='object-cover border border-neutral-500/30 rounded-full'
                />
        
                <div className='flex flex-col w-full gap-1'>
                  <div>
                    <input 
                      type='text' 
                      placeholder='College Name' 
                      value={formData.college}
                      onChange={(e: any) => handleInputChange('college', e.target.value)}
                      className='w-64 p-2 rounded-lg bg-black border border-neutral-500/30 focus:outline-none focus:border-blue-500/30 text-sm text-white'
                    />
                  </div>
        
                  <div>
                    <input 
                      type='text' 
                      placeholder='Year (e.g., 3rd Year)' 
                      value={formData.year}
                      onChange={(e: any) => handleInputChange('year', e.target.value)}
                      className='w-64 p-2 rounded-lg bg-black border border-neutral-500/30 focus:outline-none focus:border-blue-500/30 text-sm text-white'
                    />
                  </div>
        
                  <div>
                    <select 
                      value={formData.tags}
                      onChange={(e: any) => handleInputChange('tags', e.target.value)}
                      className='w-64 p-2 rounded-lg bg-neutral-800 border border-neutral-500/30 focus:outline-none focus:border-blue-500/30 text-sm text-white'
                    >
                      <option value="" className='bg-neutral-800 text-white'>Select Interest</option>
                      <option value="Hackathon" className='bg-neutral-800 text-white'>Hackathon</option>
                      <option value="Competition" className='bg-neutral-800 text-white'>Competition</option>
                      <option value="Peer Learning" className='bg-neutral-800 text-white'>Peer Learning</option>
                      <option value="Internship" className='bg-neutral-800 text-white'>Internship</option>
                      <option value="Placement Prep" className='bg-neutral-800 text-white'>Placement Prep</option>
                      <option value="DSA Practice" className='bg-neutral-800 text-white'>DSA Practice</option>
                    </select>
                  </div>
                </div>
              </div>
        
              <div className='w-full'>
                <textarea 
                  placeholder='Describe what you are looking for in a learning partner...' 
                  value={formData.description}
                  onChange={(e: any) => handleInputChange('description', e.target.value)}
                  className='w-full h-32 p-3 rounded-lg bg-black border border-neutral-500/30 focus:outline-none focus:border-blue-500/30 text-sm text-white resize-none' 
                />
              </div>
              
              <div className='w-full flex justify-end'>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className='px-5 py-1 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50'
                >
                  {loading ? 'Creating...' : 'Start Finding'}
                </button>
              </div>
            </div>
           </div>
         )}
    </div>
  )
}

export default PostFind
