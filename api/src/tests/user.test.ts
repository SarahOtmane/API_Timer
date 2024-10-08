import supertest from "supertest";
import mongoose from "mongoose";
import argon2  from "argon2";
import connectDB from "../services/connectDB";
import configureServices from '../services/defRoutes';
import UserModel from '../models/userModel';
import express, { Application } from "express";

const app: Application = express();
configureServices(app)

describe('User controller', () => {
    beforeAll(async()=>{
        await connectDB();
    })

    afterEach(async () => { 
        await mongoose.connection.dropDatabase();
    });

    afterAll(async () => { 
        await mongoose.disconnect(); 
    });

    describe('POST /register', () => {
        it('should return 403 if the email is empty', async() => {
            const response = await supertest(app)
                .post('/register')
                .send({
                    password: 'test',
                });
    
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Tous les champs sont requis.');
        });

        it('should return 403 if the password is empty', async() => {
            const response = await supertest(app)
                .post('/register')
                .send({
                    email: 'sarahotmane@gmail.com',
                });
    
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Tous les champs sont requis.');
        });

        it('should return 403 if the email is not correct', async() => {
            const response = await supertest(app)
                .post('/register')
                .send({
                    email: 'sarahotmane',
                    password: 'test'
                });
    
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Format d\'email invalide.');
        });

        it('should return 409 if the email is already used', async() => {
            await UserModel.create({
                email: 'sarah1@gmail.com',
                password: 'motdepasse',
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

        it('should return 201 when creating a new user', async() => {
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

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Tous les champs sont requis.');
        });

        it('should return 403 if the password is empty', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'sarahotmane@gmail.com',
                });

            expect(response.statusCode).toBe(400);
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
                email: 'sarah1@gmail.com',
                password: await argon2.hash('correctpassword'),
            });

            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'sarah1@gmail.com',
                    password: 'wrongpassword',
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Identifiants invalides.');
        });

        it('should return 200 and a token when login is successful', async () => {
            await UserModel.create({
                email: 'sarah1@gmail.com',
                password: await argon2.hash('motdepasse'),
            });

            const response = await supertest(app)
                .post('/login')
                .send({
                    email: 'sarah1@gmail.com',
                    password: 'motdepasse',
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });
    });
    
});

