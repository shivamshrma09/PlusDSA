import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getProfile() {
  try {
    const response = await axios.get(`${API_BASE_URL}/user-profile/get`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, message: 'Failed to fetch profile' };
  }
}

export async function updateProfile(profileData: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/user-profile/add`, profileData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: 'Failed to update profile' };
  }
}

export async function getUserProfile() {
  try {
    const response = await axios.get(`${API_BASE_URL}/user-profile/get`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, message: 'Failed to fetch user profile' };
  }
}

export async function submitFeedback(message: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/feedback/submit`, { message }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, message: 'Failed to submit feedback' };
  }
}
