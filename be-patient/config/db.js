/**
 * Database Connection Configuration
 * 
 * Establishes and manages the MongoDB connection:
 * - Connects to MongoDB using the URI from environment variables
 * - Implements connection error handling
 * - Provides connection success logging
 * - Sets Mongoose configuration options for optimal performance
 * 
 * Used by the main server file to initialize the database connection.
 */
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; 
