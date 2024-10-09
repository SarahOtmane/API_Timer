import supertest from "supertest";
import mongoose from "mongoose";
import connectDB from "../services/connectDB";

import app from '../app'

describe('JWT Middleware - verifyToken', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    let token: string;

    beforeAll(async () => {
        const userResponse = await supertest(app)
            .post('/register')
            .send({
                email: 'testuser@gmail.com',
                password: 'testpassword'
            });

        const loginResponse = await supertest(app)
            .post('/login')
            .send({
                email: 'testuser@gmail.com',
                password: 'testpassword'
            });

        token = loginResponse.body.token;
    });

    it('should verify a valid token and call next', async () => {
        const response = await supertest(app)
            .get('/submit-reaction-time')
            .set('Authorization', token) 
            .send({ time: 123 });

        expect(response.statusCode).toBe(200);
    });

    it('should return 403 if no token is provided', async () => {
        const response = await supertest(app)
            .get('/submit-reaction-time')
            .send({ time: 123 });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe("Accès interdit: token manquant");
    });

    it('should return 403 if the token is invalid', async () => {
        const response = await supertest(app)
            .get('/submit-reaction-time')
            .set('Authorization', 'invalidtoken')
            .send({ time: 123 });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe("Accès interdit: token invalide");
    });
});
