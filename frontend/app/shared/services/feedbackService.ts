const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/feedback`;

export interface FeedbackResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class FeedbackService {
  async submitFeedback(message: string): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }
}

export const feedbackService = new FeedbackService();