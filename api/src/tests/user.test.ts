import app from '../app';
import supertest from "supertest";
import mongoose from "mongoose";
import argon2 from "argon2";
import connectDB from "../services/connectDB";
import UserModel from '../models/userModel';
import express, { Application } from 'express';
import configureServices from "../services/defRoutes";


describe('User controller', () => {
    let token:string;
    let userId:string;
    const app: Application= express();

    beforeAll(async () => {
        configureServices(app);
        await connectDB();
        await UserModel.deleteMany();

        const user = await UserModel.create({ 
            email: 'sarah2@gmail.com', 
            password: await argon2.hash('motdepasse'),
            role: false
        });
        userId = user._id;

        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'sarah2@gmail.com',
                password: 'motdepasse',
            });
        token = response.body.token; 
    });

    afterEach(async() => { 
        await UserModel.deleteMany();
    });

    afterAll(async () => {
        await UserModel.deleteMany();
        await mongoose.disconnect();
    });

    describe('POST /register', () => {
        it('should return 403 if the email is empty', async () => {
            const response = await supertest(app)
                .post('/register')
                .send({
                    password: 'test',
                });

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Tous les champs sont requis.');
        });

        it('should return 403 if the password is empty', async () => {
            const response = await supertest(app)
                .post('/register')
                .send({
                    email: 'sarahotmane@gmail.com',
                });

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Tous les champs sont requis.');
        });

        it('should return 403 if the email format is invalid', async () => {
            const response = await supertest(app)
                .post('/register')
                .send({
                    email: 'sarahotmane',
                    password: 'test'
                });

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Format d\'email invalide.');
        });

        it('should return 409 if the email is already used', async () => {
            await UserModel.create({
                email: 'sarah1@gmail.com',
                password: await argon2.hash('motdepasse'),
            });

            const response = await supertest(app)
                .post('/register')
                .send({
                    email: 'sarah1@gmail.com',
                    password: 'motdepasse',
                });

            expect(response.statusCode).toBe(409);
            expect(response.body.message).toBe('Cet email existe déjà.');
        });

        it('should return 201 when creating a new user', async () => {
            const response = await supertest(app)
                .post('/register')
                .send({
                    email: 'sarah1@gmail.com',
                    password: 'motdepasse',
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Utilisateur créé avec succès.');
        });
    });

    describe('POST /login', () => {
        it('should return 403 if the email is empty', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    password: 'test',
                });

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Tous les champs sont requis.');
        });

        it('should return 403 if the password is empty', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'sarahotmane@gmail.com',
                });

            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Tous les champs sont requis.');
        });

        it('should return 401 if the email is not found', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'nonexistent@gmail.com',
                    password: 'test',
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Identifiants invalides.');
        });

        it('should return 401 if the password is incorrect', async () => {
            await UserModel.create({
                email: 'sarah@gmail.com',
                password: await argon2.hash('correctpassword'),
            });

            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'sarah@gmail.com',
                    password: 'wrongpassword',
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Identifiants invalides.');
        });

        it('should return 200 and a token when login is successful', async () => {
            await UserModel.create({
                email: 'sarahhh@gmail.com',
                password: await argon2.hash('motdepasse'),
            });

            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'sarahhh@gmail.com',
                    password: 'motdepasse',
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });
    });

    describe('GET /admin/users', () => {
        it('should return 200 and an array of users', async () => {
            await UserModel.create({ email: 'user1@gmail.com', password: await argon2.hash('correctpassword') });
            await UserModel.create({ email: 'user2@gmail.com', password: await argon2.hash('correctpassword') });

            const response = await supertest(app)
                .get('/admin/users')
                .set('Authorization', token);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(2); 
        });

        it('should return 404 if no users are found', async () => {
            const response = await supertest(app)
                .get('/admin/users')
                .set('Authorization', token );

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Pas de données');
        });
    });

    describe('GET /admin/user/:id', () => {
        it('should return 200 and the user object when a user is found', async () => {
            const user = await UserModel.create({ email: 'user1@gmail.com', password: await argon2.hash('correctpassword') });

            const response = await supertest(app)
                .get(`/admin/user/${user._id}`)
                .set('Authorization', token );

            expect(response.statusCode).toBe(200);
            expect(response.body).toBe('user1@gmail.com');
        });

        it('should return 404 if the user does not exist', async () => {
            const response = await supertest(app)
                .get('/admin/user/605c72b8f1b2f7245c8c1d90') 
                .set('Authorization', token );

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('L utilisateur n existe pas');
        });
    });

    describe('DELETE /admin/user/:id', () => {
        it('should return 200 and delete the user if found', async () => {
            const user = await UserModel.create({ email: 'user1@gmail.com', password: await argon2.hash('correctpassword') });

            const response = await supertest(app)
                .delete(`/admin/user/${user._id}`)
                .set('Authorization', token);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('L utilisateur a été supprimé');

            const deletedUser = await UserModel.findById(user._id);
            expect(deletedUser).toBeNull();
        });

        it('should return 404 if the user does not exist', async () => {
            const response = await supertest(app)
                .delete('/admin/user/605c72b8f1b2f7245c8c1d90') 
                .set('Authorization', token); 

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('L utilisateur n existe pas');
        });
    });
});
