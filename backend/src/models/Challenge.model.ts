import mongoose, { Schema, Document } from 'mongoose';

interface IContest extends Document {
  contestName: string;
  company_Name: string;
  role: string;
  description: string;
  roundDetails: any[];
  candidateDetails: any[];
  roundData: any[];
  rawData: any[];
  status: string;
}

const ContestSchema = new Schema<IContest>({
  contestName: { type: String, required: true, trim: true },
  company_Name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  roundDetails: [{
    roundNumber: { type: Number, required: true },
    roundName: { type: String, required: true },
    roundType: { type: String, default: 'general' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    resultDate: { type: Date },
    duration: { type: String },
    totalQuestions: { type: Number, default: 0 },
    description: { type: String },
    instructions: { type: String },
    status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
    type: { type: String, default: 'online' }
  }],
  candidateDetails: [{
    candidateID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    dateOfEnrollment: { type: Date, default: Date.now },
    resume: { type: String },
    status: { type: String, enum: ['enrolled', 'registered', 'qualified', 'disqualified'], default: 'enrolled' }
  }],
  roundData: [{
    roundNumber: { type: Number, required: true },
    roundName: { type: String, required: true },
    passedCandidateIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    totalParticipants: { type: Number, default: 0 }
  }],
  rawData: [{
    roundNumber: { type: Number, required: true },
    roundName: { type: String, required: true },
    students: [{
      candidateID: { type: Schema.Types.ObjectId, ref: 'User' },
      candidateName: { type: String },
      candidateEmail: { type: String },
      questions: [{
        question: { type: String },
        answer: { type: String },
        timestamp: { type: Date, default: Date.now }
      }],
      suspiciousActivity: [{
        title: { type: String },
        img: { type: String },
        video: { type: String },
        timestamp: { type: Date, default: Date.now }
      }]
    }]
  }],
  status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' }
}, { timestamps: true });

export const ContestModel = mongoose.model<IContest>('Contest', ContestSchema);