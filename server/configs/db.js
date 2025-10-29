import mongoose from "mongoose";

const connectDB = async () => {
    const rawUri = process.env.MONGODB_URI;
    if (!rawUri) {
        console.error('MONGODB_URI is not set. Please set process.env.MONGODB_URI (for example in .env or in the hosting environment).');
        // Exit early so the caller knows the service cannot start without DB
        process.exit(1);
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