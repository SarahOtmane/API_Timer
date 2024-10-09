import supertest from "supertest";
import mongoose from "mongoose";
import connectDB from "../services/connectDB";
import UserModel from '../models/userModel';
import TimerModel from '../models/timerModel';
import app from '../app'


describe('Timer controller', () => {
    let token: string;

    beforeAll(async () => {
        await connectDB();

        const user = await UserModel.create({
            email: 'sarah1@gmail.com',
            password: 'motdepasse',
        });

        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'sarah1@gmail.com',
                password: 'motdepasse',
            });

        token = response.body.token; 
    });

    afterEach(async () => { 
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => { 
        await mongoose.disconnect(); 
    });

    describe('POST /submit-reaction-time', () => {
        it('should create a timer and return it', async () => {
            const response = await supertest(app)
                .post('/submit-reaction-time')
                .set('Authorization', `Bearer ${token}`)
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
            await TimerModel.create({
                time: 150,
                user_id: 'sarah1@gmail.com',
            });

            const response = await supertest(app)
                .get('/get-reaction-times')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return 404 if no timers exist', async () => {
            await mongoose.connection.dropDatabase();

            const response = await supertest(app)
                .get('/get-reaction-times')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Pas de données');
        });
    });
});
