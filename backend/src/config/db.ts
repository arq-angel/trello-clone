import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    const MONGO_URI = process.env.MONGODB_URI;

    if (!MONGO_URI) {
        console.error('MONGODB_URI is not defined in environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI, {
            // Optional: settings to avoid warnings
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process on failure
    }
};
