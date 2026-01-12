import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  isVerified: boolean;
  authProvider: 'email' | 'google' | 'otp';
  points: number;
  profile: any[];
  AllsheetData: any[];
  progressTracker: any;
  playlists: any[];
  Testdata: any[];
  reports: string[];
  generateAuthToken(): string;
  cleanSolvedQuestions(): boolean;
}

interface IUserModel extends Model<IUser> {
}

const playlist = new Schema({
    playlistId: { type: String, required: true, unique: true },
    playlistName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    questions: [{
        sheetname: { type: String, required: true, trim: true },
        questionNumber: { type: String, required: true, trim: true },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
        addedAt: { type: Date, default: Date.now }
    }],
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const profile = new Schema({
    username: { type: String, trim: true },
    collegeName: { type: String, trim: true },
    About:{type: String , trim : true},
    skills: [{ type: String, trim: true }],
    resume: { type: String, trim: true },
    avatar: { type: String, trim: true },
    githubLink: { type: String, trim: true },
    linkedinLink: { type: String, trim: true },
    leetcodeLink: { type: String, trim: true },
    isPaid: { type: Boolean, default: false },
    balance: { type: Number, default: 0, min: 0 },
    education:[{
        passoutyear :{type :String },
        branchName : {type : String }
    }],
    problems_per_day:{type :Number},
    reminders_per_day:{type :Number},
    reminders_enabled:{type : Boolean , default : false},
    weekly_report_enabled:{type : Boolean , default : false},
    Want_update_of_new_courses:[{type : String , default : false}]
});



const weeklyTest = new Schema({
        WeeklytestName: { type: String },
        EasyQ: { type: Number, default: 0 },
        MedQ: { type: Number, default: 0 },
        HardQ: { type: Number, default: 0 },
        visitedDate: [{ type: Date }],
        solvedquestions: [{
            questionNumber: { type: String, trim: true },
            solvedAt: { type: Date, default: Date.now }
        }],
        notequestions: [{
            Qnumber: { type: String, trim: true },
            noteText: { type: String, trim: true }
        }],
        
        bookmarkedquestions: [{ type: String, trim: true }],
        timers: [{
            Qnumber: { type: String, trim: true },
            time: { type: Number }
        }],
        isActive: { type: Boolean, default: false },
        weekStartDate: { type: Date },
        testQuestions: [{ type: Number }],
        completedAt: { type: Date },
        score: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
})

const SpaceRepetition = new Schema({
    SpaceRepetitionName: { type: String },
        EasyQ: { type: Number, default: 0 },
        MedQ: { type: Number, default: 0 },
        HardQ: { type: Number, default: 0 },
        visitedDate: [{ type: Date }],
        solvedquestions: [{
            questionNumber: { type: String, trim: true },
            solvedAt: { type: Date, default: Date.now }
        }],
        notequestions: [{
            Qnumber: { type: String, trim: true },
            noteText: { type: String, trim: true }
        }],
        bookmarkedquestions: [{ type: String, trim: true }],
        timers: [{
            Qnumber: { type: String, trim: true },
            time: { type: Number }
        }],
        isActive: { type: Boolean, default: false },
        weekStartDate: { type: Date },
        testQuestions: [{ type: Number }],
        completedAt: { type: Date },
        score: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
})




const progressTracker = new Schema({
    weeklyTest:[weeklyTest],
    SpaceRepetition:[SpaceRepetition],
    weekareas:[{
      questionNumber:{type:String , trim:true},
      difficulty:{type:String , enum:['Easy' , 'Medium' , 'Hard']},
      topic:{type:String , trim:true}
    }]
});




const AllsheetData = new Schema({
    sheetname:{type:String , required:true},
    EasyQ:{type:Number},
    MedQ:{type:Number},
    HardQ:{type:Number},
    visitedDate:[{type:Date , default: null}],
    solvedquestions: [{
        questionNumber: { type: String, trim: true },
        solvedAt: { type: Date, default: Date.now }
    }],
    notequestions:[{
        Qnumber:{type:String , trim:true},
        noteText:{type:String , trim:true}
    }],
    bookmarkedquestions:[{type:String , trim:true}],
    timers:[{
        Qnumber:{type:String , trim:true},
        time:{type:Number}
    }]
});




const Testdata = new Schema({
  sheetname: { type: String, required: true, trim: true },
  questontitle: { type: String },
  QuestionNumber: { type: String },
  Difficulty: { type: String },
  Topic: { type: String },
  correctQuestion: { type: String },
  isEmailsend: { type: String },
  Emailcontent: { type: String },
  Emailsubject: { type: String },
  Emailsendtime: { type: Date },
  testdata: { type: String }
})

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  avatar: { type: String, trim: true },
  googleId: { type: String, trim: true },
  isVerified: { type: Boolean, default: false },
  authProvider: { type: String, enum: ['email', 'google', 'otp'], default: 'otp' },
  points: { type: Number, default: 0 }, 
  profile: [profile],
  AllsheetData: [AllsheetData],
  progressTracker: [progressTracker],
  playlists: [playlist],
  Testdata:[Testdata],
  reports: [{ type: String, trim: true }],
}, { timestamps: true, strict: false });









UserSchema.pre('save', function() {
  if (this.isNew && (!this.AllsheetData || this.AllsheetData.length === 0)) {
    this.AllsheetData = [{
      sheetname: "striversheetdata",
      EasyQ: 0,
      MedQ: 0, 
      HardQ: 0,
      visitedDate: [],
      solvedquestions: [],
      notequestions: [],
      bookmarkedquestions: [],
      timers: []
    }];
  }
  
  if (this.AllsheetData) {
    this.AllsheetData.forEach((sheet: any) => {
      if (sheet.solvedquestions && Array.isArray(sheet.solvedquestions)) {
        sheet.solvedquestions = sheet.solvedquestions.filter((q: any) => 
          typeof q === 'object' && q !== null && q.questionNumber
        );
      }
    });
  }
  
  if (this.progressTracker) {
    this.progressTracker.forEach((tracker: any) => {
      if (tracker.weeklyTest) {
        tracker.weeklyTest.forEach((wt: any) => {
          if (wt.solvedquestions && Array.isArray(wt.solvedquestions)) {
            wt.solvedquestions = wt.solvedquestions.filter((q: any) => 
              typeof q === 'object' && q !== null && q.questionNumber
            );
          }
        });
      }
      
      if (tracker.SpaceRepetition) {
        tracker.SpaceRepetition.forEach((sr: any) => {
          if (sr.solvedquestions && Array.isArray(sr.solvedquestions)) {
            sr.solvedquestions = sr.solvedquestions.filter((q: any) => 
              typeof q === 'object' && q !== null && q.questionNumber
            );
          }
        });
      }
    });
  }
});













UserSchema.methods.cleanSolvedQuestions = function() {
  let cleaned = false;
  
  if (this.AllsheetData) {
    this.AllsheetData.forEach((sheet: any) => {
      if (sheet.solvedquestions && Array.isArray(sheet.solvedquestions)) {
        const originalLength = sheet.solvedquestions.length;
        sheet.solvedquestions = sheet.solvedquestions.filter((q: any) => 
          typeof q === 'object' && q !== null && q.questionNumber
        );
        if (sheet.solvedquestions.length !== originalLength) cleaned = true;
      }
    });
  }
  
  if (this.progressTracker) {
    this.progressTracker.forEach((tracker: any) => {
      if (tracker.weeklyTest) {
        tracker.weeklyTest.forEach((wt: any) => {
          if (wt.solvedquestions && Array.isArray(wt.solvedquestions)) {
            const originalLength = wt.solvedquestions.length;
            wt.solvedquestions = wt.solvedquestions.filter((q: any) => 
              typeof q === 'object' && q !== null && q.questionNumber
            );
            if (wt.solvedquestions.length !== originalLength) cleaned = true;
          }
        });
      }
      
      if (tracker.SpaceRepetition) {
        tracker.SpaceRepetition.forEach((sr: any) => {
          if (sr.solvedquestions && Array.isArray(sr.solvedquestions)) {
            const originalLength = sr.solvedquestions.length;
            sr.solvedquestions = sr.solvedquestions.filter((q: any) => 
              typeof q === 'object' && q !== null && q.questionNumber
            );
            if (sr.solvedquestions.length !== originalLength) cleaned = true;
          }
        });
      }
    });
  }
  
  return cleaned;
};

UserSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
};

export const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);