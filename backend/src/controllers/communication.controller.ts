import { Request, Response } from 'express';
import Channel from '../models/Channel.model';
import Message from '../models/Message.model';

interface AuthRequest extends Request {
  user?: any;
}


export const getChannels = async (req: AuthRequest, res: Response) => {
  try {
    const channels = await Channel.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, channels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch channels' });
  }
};


export const createChannel = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, image } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const channel = new Channel({
      name,
      description,
      image,
      createdBy: userId,
      members: [userId]
    });

    await channel.save();
    await channel.populate('createdBy', 'name email');
    
    res.json({ success: true, channel });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create channel' });
  }
};


export const getChannelMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ channel: channelId })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};


export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId, content, messageType = 'text', fileUrl } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const message = new Message({
      content,
      sender: userId,
      channel: channelId,
      messageType,
      fileUrl
    });

    await message.save();
    await message.populate('sender', 'name email');
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};


export const joinChannel = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    await Channel.findByIdAndUpdate(
      channelId,
      { $addToSet: { members: userId } }
    );

    res.json({ success: true, message: 'Joined channel successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to join channel' });
  }
};