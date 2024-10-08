import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    // Vérifier l'environnement actuel
    const isTestEnv: boolean = process.env.NODE_ENV === 'test';

    // Choisir les bonnes variables selon l'environnement
    const dbName: string = isTestEnv ? process.env.DB_NAME_TEST as string : process.env.DB_NAME as string;

    try {
        await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@db:27017/${dbName}?authSource=admin`);
        console.log(`Connected to MongoDB ${dbName}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

export default connectDB;
