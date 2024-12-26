import request from 'supertest';
import { app } from './src/app.js';
import { connect, connection } from 'mongoose';
import { User } from './src/models/user.models.js';
import { Book } from './src/models/book.models.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// Connect to a test database before running tests
beforeAll(async () => {
    // Establish the database connection before running tests
    await connect(`${process.env.MONGODB_URI}/test_database_library_management`);
});

afterAll(async () => {
    // Close the database connection after all tests
    await connection.close();
});

// Test Case to check the DB connection
describe('Database Connection', () => {
    it('should successfully connect to MongoDB', async () => {
        // Check the connection state
        const connectionState = connection.readyState;

        // Mongoose connection states:
        // 0: disconnected
        // 1: connected
        // 2: connecting
        // 3: disconnecting
        expect(connectionState).toBe(1); // 1 indicates the connection is successful
    });
});

// Test Case to check user registration and login
describe('User Registration and Login', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/v1/users/register')
            .send({
                email: 'test@example.com',
                username: 'testuser',
                fullname: 'Test User',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('username', 'testuser');
        expect(response.body.message).toBe("User registered Sucessfully");
        expect(response.body.sucess).toBe(true);
    });

    it('should login an existing user', async () => {
        // First, register a user
        await request(app)
            .post('/api/v1/users/register')
            .send({
                email: 'test@example.com',
                username: 'testuser',
                fullname: 'Test User',
                password: 'password123',
            });

        // Then, login the user
        const response = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
        expect(response.body.message).toBe("User logged in Sucessfully");
        expect(response.body.sucess).toBe(true);
    });
});