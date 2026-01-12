import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.model';

const router = express.Router();

router.get('/auth/google', (req, res) => {
  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.REDIRECT_URI}&` +
    `scope=email profile&` +
    `response_type=code&` +
    `access_type=offline`;
  
  res.redirect(googleAuthURL);
});

router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI
      })
    });
    
    const tokenData = await tokenResponse.json() as any;
    console.log(' Token response:', tokenData.access_token ? 'Success' : 'Failed');
    
    if (!tokenData.access_token) {
      console.error('Token exchange failed:', tokenData);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
    }
    
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
    const userData = await userResponse.json() as any;
    
    let user = await UserModel.findOne({ email: userData.email });
    
    if (user) {
      user.avatar = userData.picture;
      user.isVerified = true;
      if (!user.googleId) user.googleId = userData.id;
      await user.save();
    } else {
      user = new UserModel({
        name: userData.name,
        email: userData.email,
        avatar: userData.picture,
        googleId: userData.id,
        isVerified: true,
        authProvider: 'google'
      });
      await user.save();
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
    
    console.log('Redirecting to frontend with token');
    res.redirect(`${process.env.FRONTEND_URL}/home?token=${token}&user=${encodeURIComponent(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }))}`);
    
  } catch (error) {
    console.error(' Google auth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
});

export default router;
