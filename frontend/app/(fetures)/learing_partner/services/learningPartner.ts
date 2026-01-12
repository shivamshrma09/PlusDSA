const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

export const createLearningPartnerPost = async (postData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-partner/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(postData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create post error:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const getLearningPartnerPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-partner/all`, {
      method: 'GET',
      credentials: 'include'
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get posts error:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const sendConnectionRequest = async (recipientId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/learning-partner/send-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ recipientId })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Send request error:', error);
    return { success: false, error: (error as Error).message };
  }
};