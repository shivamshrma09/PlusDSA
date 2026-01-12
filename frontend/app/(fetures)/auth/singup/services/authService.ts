import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const sendSignupOTP = async (email: string, name: string) => {

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
      email,
      name
    });
    return response.data;
  } catch (error: any) {
    console.error("Full Error:", error);
    console.error("Error Response:", error.response);
    console.error("Error Message:", error.message);
    
    if (error.response) {
      return { 
        success: false, 
        message: error.response.data?.message || 'Server error' 
      };
    } else if (error.request) {
      return { 
        success: false, 
        message: 'Network error - cannot reach server' 
      };
    } else {
      return { 
        success: false, 
        message: 'Request setup error' 
      };
    }
  }
};

export const verifySignupOTP = async (email: string, otp: string, name: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      email,
      otp,
      name
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'OTP verification failed' 
    };
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