const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/communication`;

export interface Channel {
  _id: string;
  name: string;
  description: string;
  image: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  members: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  channel: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string | Message;
  channels?: T;
  messages?: T;
  channel?: T;
}

class CommunicationService {
  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getChannels(): Promise<Channel[]> {
    const response = await this.makeRequest<ApiResponse<Channel[]>>(`${API_BASE}/channels`);
    return response.channels || [];
  }

  async createChannel(channelData: {
    name: string;
    description: string;
    image: string;
  }): Promise<Channel> {
    const response = await this.makeRequest<ApiResponse<Channel>>(`${API_BASE}/channels`, {
      method: 'POST',
      body: JSON.stringify(channelData),
    });
    return response.channel!;
  }

  async joinChannel(channelId: string): Promise<void> {
    await this.makeRequest(`${API_BASE}/channels/${channelId}/join`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async getChannelMessages(channelId: string, page: number = 1): Promise<Message[]> {
    const response = await this.makeRequest<ApiResponse<Message[]>>(
      `${API_BASE}/channels/${channelId}/messages?page=${page}`
    );
    return response.messages || [];
  }

  async sendMessage(messageData: {
    channelId: string;
    content: string;
    messageType?: 'text' | 'image' | 'file';
    fileUrl?: string;
  }): Promise<Message> {
    const response = await this.makeRequest<ApiResponse<Message>>(`${API_BASE}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    return response.message as Message;
  }
}

export const communicationService = new CommunicationService();