import { Request, Response } from 'express';
import { UserModel } from '../models/User.model';
import { OtpModel } from '../models/Otp.model';
import { sendEmail } from '../services/sendemail.services';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.deleteOne({ email });
    await OtpModel.create({ email, otp });

    const subject = 'Your OTP for PlusDSA';
    const html = `<h2>Your OTP: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`;

    await sendEmail(email, subject, html);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please sign up first.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.deleteOne({ email });
    await OtpModel.create({ email, otp });

    const subject = 'Login OTP for PlusDSA';
    const html = `<h2>Your Login OTP: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`;

    await sendEmail(email, subject, html);

    res.json({ success: true, message: 'Login OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const otpRecord = await OtpModel.findOne({ email });
    
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    let user = await UserModel.findOne({ email });
    
    if (user) {
      user.isVerified = true;
      await user.save();
    } else {
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required for signup' });
      }
      
      user = await UserModel.create({
        name,
        email,
        isVerified: true,
        authProvider: 'otp'
      });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await OtpModel.deleteOne({ email });

    const response = {
      success: true,
      message: user.isNew ? 'Signup successful' : 'Login successful',
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error(' Error in verifyOTP:', error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};