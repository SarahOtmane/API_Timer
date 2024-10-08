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
    
    
});

