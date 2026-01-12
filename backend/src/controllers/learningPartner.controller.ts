import { Request, Response } from 'express';
import { LearningPartnerModel } from '../models/LearningPartner.model';
import { UserModel } from '../models/User.model';
import { sendEmail } from '../services/sendemail.services';

const createConnectionRequestEmail = (recipientName: string, senderName: string, senderCollege: string, senderYear: string, senderTags: string[], senderDescription: string, senderLinkedin: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 24px; margin: 0 0 10px;">Learning Partner Request!</h1>
            <p style="color: #666; font-size: 16px; margin: 0;">Hi <strong>${recipientName}</strong></p>
        </div>
        
        <div style="background: linear-gradient(135deg, #0340aa, #0056d6); color: white; text-align: center; padding: 30px 20px; border-radius: 16px; margin: 30px 0;">
            <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 10px;">${senderName}</h2>
            <p style="font-size: 14px; margin: 0 0 5px; opacity: 0.9;">${senderCollege}, ${senderYear}</p>
            <p style="font-size: 14px; margin: 0; opacity: 0.9;">Interested in: <strong>${senderTags.join(', ')}</strong></p>
        </div>
        
        <div style="background: #f9f9f9; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: #333; font-size: 16px; margin: 0 0 15px;">About them:</h3>
            <p style="color: #555; font-size: 14px; margin: 0; line-height: 1.6;">
                ${senderDescription}
            </p>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
            <a href="${senderLinkedin}" style="display: inline-block; background: #0077b5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px;">Connect on LinkedIn</a>
        </div>
        
        <div style="text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
                Check your email and LinkedIn for connecting with peer<br>
                <strong>The PlusDSA Team</strong>
            </p>
        </div>
    </div>
</body>
</html>`;
};
const createMatchNotificationEmail = (matchedUserName: string, newUserName: string, newUserDescription: string, matchingTags: string[]) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 24px; margin: 0 0 10px;">New Learning Partner Match!</h1>
            <p style="color: #666; font-size: 16px; margin: 0;">Hi <strong>${matchedUserName}</strong></p>
        </div>
        
        <div style="background: linear-gradient(135deg, #0340aa, #0056d6); color: white; text-align: center; padding: 30px 20px; border-radius: 16px; margin: 30px 0;">
            <h2 style="font-size: 20px; font-weight: bold; margin: 0 0 10px;">${newUserName}</h2>
            <p style="font-size: 14px; margin: 0; opacity: 0.9;">also wants to partner for: <strong>${matchingTags.join(', ')}</strong></p>
        </div>
        
        <div style="background: #f9f9f9; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: #333; font-size: 16px; margin: 0 0 15px;">Their Description:</h3>
            <p style="color: #555; font-size: 14px; margin: 0; line-height: 1.6;">
                ${newUserDescription}
            </p>
        </div>
        
        <div style="text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
                Check the Learning Partner section to connect!<br>
                <strong>The PlusDSA Team</strong>
            </p>
        </div>
    </div>
</body>
</html>`;
};

export const createLearningPartnerPost = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { college, year, tags, description } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = user.profile && user.profile.length > 0 ? user.profile[0] : null;
    
    const learningPartnerPost = await LearningPartnerModel.create({
      userId,
      name: user.name,
      email: user.email,
      college: college || profile?.collegeName || '',
      year,
      profileImage: profile?.avatar || '',
      linkedinUrl: profile?.linkedinLink || '',
      githubUrl: profile?.githubLink || '',
      leetcodeUrl: profile?.leetcodeLink || '',
      tags,
      description
    });


    const matchingPosts = await LearningPartnerModel.find({
      isActive: true,
      userId: { $ne: userId },
      tags: { $in: tags }
    });


    
    for (const matchedPost of matchingPosts) {
      const matchingTags = tags.filter((tag: string) => matchedPost.tags.includes(tag));
      if (matchingTags.length > 0) {
        
        const emailHtml = createMatchNotificationEmail(
          matchedPost.name,
          user.name,
          description,
          matchingTags
        );
        
        sendEmail(
          matchedPost.email,
          'New Learning Partner Match Found!',
          emailHtml
        ).catch(err => console.error('Match notification email failed:', err));
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Learning partner post created successfully',
      data: learningPartnerPost
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create learning partner post',
      error: error.message
    });
  }
};

export const getAllLearningPartners = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    

    const allPosts = await LearningPartnerModel.find({ isActive: true });
    const partners = await LearningPartnerModel.find({ 
      isActive: true

    }).sort({ createdAt: -1 });

    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error: any) {
    console.error('Get learning partners error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch learning partners',
      error: error.message
    });
  }
};

export const getUserLearningPartnerPosts = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    
    const userPosts = await LearningPartnerModel.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: userPosts
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user posts',
      error: error.message
    });
  }
};

export const sendConnectionRequest = async (req: any, res: Response): Promise<Response> => {
  try {
    const senderId = req.userId;
    const { recipientId } = req.body;


    const sender = await UserModel.findById(senderId);
    if (!sender) {
      return res.status(404).json({ success: false, message: 'Sender not found' });
    }


    const recipient = await LearningPartnerModel.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    const senderProfile = sender.profile && sender.profile.length > 0 ? sender.profile[0] : null;
    
    const emailHtml = createConnectionRequestEmail(
      recipient.name,
      sender.name,
      senderProfile?.collegeName || 'College',
      senderProfile?.year || 'Year',
      senderProfile?.skills || [],
      senderProfile?.About || 'No description available',
      senderProfile?.linkedinLink || '#'
    );
    
    sendEmail(
      recipient.email,
      'Learning Partner Connection Request',
      emailHtml
    ).catch(err => console.error('Connection request email failed:', err));

    return res.status(200).json({
      success: true,
      message: 'Connection request sent successfully'
    });
  } catch (error: any) {
    console.error('Send connection request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send connection request',
      error: error.message
    });
  }
};

export const deleteLearningPartnerPost = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const post = await LearningPartnerModel.findOneAndDelete({
      _id: postId,
      userId
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or unauthorized'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
};