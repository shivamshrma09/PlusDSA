import mongoose, { Schema, Document } from 'mongoose';

interface ILearningPartner extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  college: string;
  year: string;
  profileImage: string;
  linkedinUrl: string;
  githubUrl: string;
  leetcodeUrl: string;
  tags: string[];
  description: string;
  isActive: boolean;
  createdAt: Date;
}

const LearningPartnerSchema = new Schema<ILearningPartner>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  college: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  profileImage: { type: String, trim: true },
  linkedinUrl: { type: String, trim: true },
  githubUrl: { type: String, trim: true },
  leetcodeUrl: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  description: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const LearningPartnerModel = mongoose.model<ILearningPartner>('LearningPartner', LearningPartnerSchema);