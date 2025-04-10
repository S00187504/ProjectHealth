import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to the database
connectDB();

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = await User.create({
      fullname: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      phone: '1234567890',
      isAdmin: true,
      role: 'admin',
      isVerified: true
    });
    
    console.log('Admin user created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123`);
    console.log('Please change the password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdminUser(); 