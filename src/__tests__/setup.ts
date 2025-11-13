import mongoose from 'mongoose';

// Close database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// Clear all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

