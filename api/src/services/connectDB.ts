const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    // Vérifier l'environnement actuel
    const isTestEnv = process.env.NODE_ENV === 'test';

    // Choisir les bonnes variables selon l'environnement
    const dbName = isTestEnv ? process.env.DB_NAME_TEST : process.env.DB_NAME;

    try {
        await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@db:27017/${dbName}?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to MongoDB ${dbName}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

module.exports = connectDB;
