"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Button } from "@heroui/react";
import { sendSignupOTP, verifySignupOTP, handleGoogleLogin } from './services/authService';
import { useRouter } from 'next/navigation';
import Socialbutton from '../components/Socialbutton';
import { authUtils } from '@/lib/auth';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: ''
  });

  const [step, setStep] = useState('details');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (step === 'details') {
        const result = await sendSignupOTP(formData.email, formData.name);
        if (result.success) {
          toast.success(result.message || 'OTP sent to your email');
          setStep('otp');
        } else {
          toast.error(result.message);
        }
      } else if (step === 'otp') {
        const result = await verifySignupOTP(formData.email, formData.otp, formData.name);
        if (result.success) {
          if (result.token) {
            authUtils.setToken(result.token);
            toast.success('Registration successful!');
            setTimeout(() => {
              window.location.href = '/home/striver-a2z-dsa-course';
            }, 100);
          }
        } else {
          toast.error(result.message || 'Invalid OTP');
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-6">
          <Image
            src="https://ik.imagekit.io/qwzhnpeqg/PlusDSA/Screenshot%202026-01-02%20202958.png"
            alt="Logo"
            width={230}
            height={230}
            className="mx-auto mb-10 h-10 md:h-15"
          />
          
          <h1 className="text-white text-xl lg:text-2xl mt-3 font-semibold">Create Account</h1>
          <h3 className="text-gray-400 text-sm mt-1">Join us to master algorithms</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 'details' && (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="block w-full border-2 border-gray-600 rounded-lg text-white px-4 py-3 text-base focus:border-[#5079be] focus:outline-none bg-transparent"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="block w-full border-2 border-gray-600 rounded-lg text-white px-4 py-3 text-base focus:border-[#5079be] focus:outline-none bg-transparent"
                required
              />
             
            </>
          )}

          {step === 'otp' && (
            <div className="relative">
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="block w-full border-2 border-gray-600 rounded-lg text-white px-4 py-3 text-base focus:border-[#5079be] focus:outline-none bg-transparent"
                required
              />
              <p className="text-gray-400 text-xs mt-1">Check inbox and spam for OTP</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            color="default"
            className="w-full bg-[#0340aa] hover:bg-[#083a91] text-white rounded-lg font-bold shadow-lg py-3"
          >
            {loading ? 
              (step === 'details' ? 'Sending OTP...' : 'Creating Account...') : 
              (step === 'details' ? 'Send OTP' : 'Verify & Create Account')
            }
          </Button>

          {step === 'details' && (
            <>
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-600"></div>
                <span className="px-3 text-gray-400 text-sm">or</span>
                <div className="flex-1 border-t border-gray-600"></div>
              </div>

              <div className="flex justify-center space-x-4 mt-4">
                <Socialbutton onClick={handleGoogleLogin} />
              </div>
            </>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <a href="/auth/login" className="text-[#0340aa] hover:underline font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;