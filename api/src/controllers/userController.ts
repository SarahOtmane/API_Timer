import { Request, Response } from 'express';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import User from '../models/userModel';

dotenv.config();

export const registerAUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            res.status(403).json({ message: 'Tous les champs sont requis.' });
            return;
        }

        // Check for valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(403).json({ message: 'Format d\'email invalide.' });
            return;
        }

        // Vérification de l'existence de l'email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.status(409).json({ message: 'Cet email existe déjà.' });
            return;
        }

        // Hachage du mot de passe
        const hashedPassword = await argon2.hash(password);

        // Création de l'utilisateur
        const newUser = new User({
            email: email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } 
    catch (error) {
        console.error('Error during user creation:', error); // Logging the error for debugging
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
    }
};
