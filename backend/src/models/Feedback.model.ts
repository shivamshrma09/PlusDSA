import mongoose, { Schema, Document } from 'mongoose';

interface IFeedback extends Document {
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  userId: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true }
}, { timestamps: true });

export const FeedbackModel = mongoose.model<IFeedback>('Feedback', FeedbackSchema);