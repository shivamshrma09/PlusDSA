import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const loginUser = async (email: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
  }
};

export const verifyLoginOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-login`, {
      email,
      otp
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'OTP verification failed' };
  }
};


export const handleGoogleLogin = async () => {
  try {
    window.location.href = `${API_BASE_URL}/auth/google`;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};