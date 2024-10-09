import supertest from "supertest";
import mongoose from "mongoose";
import connectDB from "../services/connectDB";
import UserModel from '../models/userModel';
import TimerModel from '../models/timerModel';
import configureServices from "../services/defRoutes";
import argon2 from "argon2";
import express, { Application } from 'express';


describe('Timer controller', () => {
    let token:string;
    let id:string;
    const app: Application= express();

    beforeAll(async () => {
        configureServices(app);
        await connectDB();
        await UserModel.deleteMany();
        await TimerModel.deleteMany();

        const user = await UserModel.create({ 
            email: 'sarah3@gmail.com', 
            password: await argon2.hash('motdepasse'),
            role: false
        });
        id = user._id;

        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'sarah3@gmail.com',
                password: 'motdepasse',
            });

        token = response.body.token; 
    });

    afterEach(async() => { 
        await UserModel.deleteMany();
        await TimerModel.deleteMany();
    });

    afterAll(async () => { 
        await UserModel.deleteMany();
        await TimerModel.deleteMany();
        await mongoose.disconnect(); 
    });

    describe('POST /submit-reaction-time', () => {
        it('should create a timer and return it', async () => {
            const response = await supertest(app)
                .post('/submit-reaction-time')
                .set('Authorization', token)
                .send({
                    time: 123,
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.time).toBe(123);
            expect(response.body.user_id).toBeDefined();
        });
    });

    describe('GET /get-reaction-times', () => {
        it('should return all timers for the user', async () => {
            const time = await TimerModel.create({
                time: 150,
                user_id: id,
            });
            console.log(time);
            console.log('teeeeeeets', id);

            const response = await supertest(app)
                .get('/get-reaction-times')
                .set('Authorization', token);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        });

        it('should return 404 if no timers exist', async () => {
            await mongoose.connection.dropDatabase();

            const response = await supertest(app)
                .get('/get-reaction-times')
                .set('Authorization', token);

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Pas de données');
        });
    });
});
