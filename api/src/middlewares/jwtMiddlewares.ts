import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Définir l'interface UserPayload
interface UserPayload {
    id: string; // ou ObjectId si vous utilisez Mongoose ObjectId
}

// Étendre l'interface Express.Request pour ajouter `user`
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload; // User est facultatif
        }
    }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers['authorization'];

        if (token) {
            const payload = await new Promise<any>((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY as string, (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            req.user = payload; 
            next();
        } else {
            res.status(403).json({ message: "Accès interdit: token manquant" });
        }
    } catch (error) {
        console.error(error); 
        res.status(403).json({ message: "Accès interdit: token invalide" });
    }
};
