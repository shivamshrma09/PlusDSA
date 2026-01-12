const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

export const createLearningPartnerPost = async (postData) => {
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
    return { success: false, error: error.message };
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
    return { success: false, error: error.message };
  }
};