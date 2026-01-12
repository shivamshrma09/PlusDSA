import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getContestStatus = async (contestID: string) => {
  const response = await axios.post(`${API_BASE_URL}/contest/status`, 
    { contestID }, { withCredentials: true });
  return response.data;
};

export const joinContest = async (contestID: string) => {
  const response = await axios.post(`${API_BASE_URL}/contest/join`,
    { contestID }, { withCredentials: true });
  return response.data;
};

export const startCodingRound = async (contestID: string) => {
  const response = await axios.post(`${API_BASE_URL}/contest/start-coding`,
    { contestID }, { withCredentials: true });
  return response.data;
};

export const trackActivity = async (contestID: string, activity: string) => {
  try {
    await axios.post(`${API_BASE_URL}/contest/track-activity`,
      { contestID, activity, timestamp: new Date().toISOString() },
      { withCredentials: true });
  } catch (error) {
    console.error('Activity tracking failed:', error);
  }
};

export const submitTest = async (contestID: string, questions: any[]) => {
  const response = await axios.post(`${API_BASE_URL}/contest/submit-test`,
    { contestID, questions }, { withCredentials: true });
  return response.data;
};