"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Button } from "@heroui/react";
import { loginUser, verifyLoginOtp, handleGoogleLogin } from './services/authService';
import { useRouter } from 'next/navigation';
import Socialbutton from '../components/Socialbutton';
import { authUtils } from '@/lib/auth';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  });
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');
    
    if (token && userStr) {
      try {
        authUtils.setToken(token);
        setTimeout(() => {
          window.location.href = '/home/striver-a2z-dsa-course';
        }, 100);
      } catch (error) {
        console.error('Error processing Google auth:', error);
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (step === 'email') {
        const result = await loginUser(formData.email);
        if (result.success) {
          toast.success(result.message || 'OTP sent to your email');
          setStep('otp');
        } else {
          toast.error(result.message || 'Failed to send OTP');
        }
      } else {
        const result = await verifyLoginOtp(formData.email, formData.otp);
        if (result.success) {
          if (result.token) {
            authUtils.setToken(result.token);
            toast.success('Login successful!');
            setTimeout(() => {
              window.location.href = '/home/striver-a2z-dsa-course';
            }, 100);
          }
        } else {
          toast.error(result.message || 'Invalid OTP');
        }
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
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
          
          <h1 className="text-white text-xl lg:text-2xl mt-3 font-semibold">Welcome Back</h1>
          <h3 className="text-gray-400 text-sm mt-1">Master algorithms with interactive learning</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {step === 'email' ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="block w-full border-2 border-gray-600 rounded-lg text-white px-4 py-3 text-base focus:border-[#5079be] focus:outline-none bg-transparent"
                required
              />
            ) : (
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
          </div>

          <Button
            type="submit"
            disabled={loading}
            color="default"
            className="w-full bg-[#0340aa] hover:bg-[#083a91] text-white rounded-lg font-bold shadow-lg py-3"
          >
            {loading ? (step === 'email' ? 'Sending OTP...' : 'Verifying...') : (step === 'email' ? 'Send OTP' : 'Verify & Login')}
          </Button>

          {step === 'email' && (
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
              Don't have an account?{" "}
              <a href="/auth/singup" className="text-[#0340aa] hover:underline font-medium">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;