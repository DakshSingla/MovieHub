import mongoose from "mongoose";

const connectDB = async () => {
    const rawUri = process.env.MONGODB_URI;
    if (!rawUri) {
        // Throw an error instead of calling process.exit so the caller can
        // handle the failure and serverless platforms don't abruptly terminate
        // the process with an opaque exit code.
        throw new Error('MONGODB_URI is not set. Please set process.env.MONGODB_URI (for example in .env or in the hosting environment).');
    }

    const dbName = 'Movie_Ticket_Booking';
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
    mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

    try {
        // Use options that make network/connect failures visible and fail fast
        await mongoose.connect(rawUri, {
            dbName,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            family: 4,
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error && error.message ? error.message : error);
        // rethrow so the caller (startup) can handle or crash visibly
        throw error;
    }
};

export default connectDB;