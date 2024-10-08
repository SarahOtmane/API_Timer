import { Request, Response } from 'express';
import Timer from '../models/timerModel';
import dotenv from 'dotenv';

dotenv.config();
export const createATimer = async (req: Request, res: Response) => {
    try {

        const newTime = new Timer({ time: req.body.time, user_id: req.user?.id });

        const time = await newTime.save();
        res.status(200).json(time);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const listAllTimes = async (req: Request, res: Response) => {
    try {
        const times = await Timer.find({ user_id: req.user?.id });
        if(times.length < 0){
            res.status(404).json({ message: 'Pas de données' });
            return
        }
        res.status(200).json(times);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
