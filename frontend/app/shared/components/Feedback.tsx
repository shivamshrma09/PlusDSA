"use client";
import React, { useState } from 'react';
import { feedbackService } from '../services/feedbackService';
import Image from 'next/image'
import toast from 'react-hot-toast';
function Feedback() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await feedbackService.submitFeedback(message.trim());

      if (response.success) {
        setSuccess(true);
        setMessage('');
        toast.success('Feedback submitted successfully!');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        if (response.errors && response.errors.length > 0) {
          toast.error(response.errors[0].message);
          setError(response.errors[0].message);
        } else {
          toast.error(response.message || 'Failed to submit feedback');
          setError(response.message || 'Failed to submit feedback');
        }
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-100 bg-black border border-neutral-500/20 p-6 rounded-2xl shadow-2xl flex flex-col justify-center items-center text-white relative overflow-hidden'>
      <div className="relative z-10 w-full flex flex-col items-center">
        <Image
          src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png"
          alt="Logo"
          width={160}
          height={45}
          className="h-12 rounded-lg border border-neutral-600/50 mb-4 shadow-lg"
        /> 
        
        <div className="text-center mb-6">
          <h1 className='text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent '>Share Your Feedback</h1>
          <p className='text-[#0340aa] text-lg  font-semibold'>Help us improve your coding experience</p>
        </div>

        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          <div className="relative">
            <textarea 
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
              placeholder='Share your thoughts, suggestions, or report issues...'
              className='w-full h-32 bg-black border border-neutral-600/50 p-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#0340aa] focus:ring-2 focus:ring-[#0340aa]/20 rounded-xl transition-all duration-200 resize-none backdrop-blur-sm'
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {message.length}/500
            </div>
          </div>

          {error && (
            <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-3'>
              <p className='text-red-400 text-sm flex items-center gap-2'>
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                {error}
              </p>
            </div>
          )}

       

          <button 
            type='submit'
            disabled={loading || !message.trim()}
            className='p-3 bg-gradient-to-r from-[#0340aa] to-blue-600 hover:from-[#0340aa]/90 hover:to-blue-600/90 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="border-2 bg-green-500 border-neutral-500/20 py-2 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
                <div className=" border-2 bg-green-500 border-neutral-500/20 py-2 border-t-white rounded-full animate-spin">
                             Submit Feedback
                      </div>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Feedback