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