import mongoose from 'mongoose';

const activityEntrySchema = new mongoose.Schema({
  date: {
    type: String,  
    required: true
  },
  visitCount: {
    type: Number,
    default: 1
  },
  lastVisitTime: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  activities: [activityEntrySchema]
}, {
  timestamps: true
});

export default mongoose.model('UserActivity', userActivitySchema);