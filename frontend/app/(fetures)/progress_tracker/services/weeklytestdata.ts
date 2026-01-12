import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const progressTrackerService = {
  getLatest: async (type: 'weeklytest' | 'spacerepetition') => {
    const response = await axios.get(`${API_BASE_URL}/${type}/latest`, {
      withCredentials: true
    });
    return response.data;
  },

  addQuestion: async (type: 'weeklytest' | 'spacerepetition', name: string, questionNumber: string, difficulty: string) => {
    const payload = type === 'weeklytest' 
      ? { WeeklytestName: name, questionNumber, difficulty }
      : { SpaceRepetitionName: name, questionNumber, difficulty };
    
    const response = await axios.post(`${API_BASE_URL}/${type}/addquestion`, payload, {
      withCredentials: true
    });
    return response.data;
  },

  addNote: async (type: 'weeklytest' | 'spacerepetition', name: string, questionNumber: string, noteText: string) => {
    const payload = type === 'weeklytest'
      ? { WeeklytestName: name, questionNumber, noteText }
      : { SpaceRepetitionName: name, questionNumber, noteText };
    
    const response = await axios.post(`${API_BASE_URL}/${type}/addnote`, payload, {
      withCredentials: true
    });
    return response.data;
  },

  addBookmark: async (type: 'weeklytest' | 'spacerepetition', name: string, questionNumber: string) => {
    const payload = type === 'weeklytest'
      ? { WeeklytestName: name, questionNumber }
      : { SpaceRepetitionName: name, questionNumber };
    
    const response = await axios.post(`${API_BASE_URL}/${type}/addbookmark`, payload, {
      withCredentials: true
    });
    return response.data;
  },

  addTimer: async (type: 'weeklytest' | 'spacerepetition', name: string, questionNumber: string, time: number) => {
    const payload = type === 'weeklytest'
      ? { WeeklytestName: name, questionNumber, time }
      : { SpaceRepetitionName: name, questionNumber, time };
    
    const response = await axios.post(`${API_BASE_URL}/${type}/addtimer`, payload, {
      withCredentials: true
    });
    return response.data;
  },

  getData: async (type: 'weeklytest' | 'spacerepetition', name: string) => {
    const response = await axios.get(`${API_BASE_URL}/${type}/data/${name}`, {
      withCredentials: true
    });
    return response.data;
  },

  getAll: async (type: 'weeklytest' | 'spacerepetition') => {
    const response = await axios.get(`${API_BASE_URL}/${type}/all`, {
      withCredentials: true
    });
    return response.data;
  }
};


export const getWeekAreaData = async () => {
  const response = await axios.get(`${API_BASE_URL}/weak-areas`, {
    withCredentials: true
  });


  return response.data;
};