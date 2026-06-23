import mongoose from 'mongoose';

const connectDB = async () => {
  // If database is already connected or connecting, skip reconnection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const connStr = process.env.MONGODB_URI;
    
    if (!connStr || connStr.includes('cluster0.example.mongodb.net')) {
      console.warn('\n======================================================================');
      console.warn('WARNING: Using placeholder MONGODB_URI. Online MongoDB connection may fail.');
      console.warn('Please update the MONGODB_URI in backend/.env with your MongoDB Atlas URI.');
      console.warn('======================================================================\n');
    }

    const conn = await mongoose.connect(connStr || 'mongodb://localhost:27017/building_constructor');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
