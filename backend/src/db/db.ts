import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDb = async (): Promise<void> => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }
        
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error: any) {
        process.exit(1);
    }
};

export default connectToDb;