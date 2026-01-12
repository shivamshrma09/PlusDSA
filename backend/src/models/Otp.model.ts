import mongoose, { Schema, Document } from 'mongoose';

interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true, trim: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }
});

export const OtpModel = mongoose.model<IOtp>('Otp', OtpSchema);