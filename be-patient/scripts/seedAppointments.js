import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from '../models/Appointment.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to database
await connectDB();

console.log('Starting to seed appointments...');

// Clear existing appointments
await Appointment.deleteMany({});

// Create mock appointment data
const mockAppointments = [
  {
    appointmentDate: new Date('2023-06-15'),
    appointmentTime: '09:00 AM',
    appointmentType: 'Consultation',
    reason: 'Annual checkup',
    status: 'Completed',
    notes: 'Patient is in good health',
    isOnline: false,
    patient: { fullname: 'John Doe', email: 'john@example.com', phone: '555-123-4567' },
    doctor: { fullname: 'Dr. Smith', email: 'drsmith@example.com' },
  },
  {
    appointmentDate: new Date('2023-06-20'),
    appointmentTime: '10:30 AM',
    appointmentType: 'Follow-up',
    reason: 'Follow up on medication',
    status: 'Scheduled',
    notes: '',
    isOnline: true,
    patient: { fullname: 'Jane Smith', email: 'jane@example.com', phone: '555-234-5678' },
    doctor: { fullname: 'Dr. Johnson', email: 'drjohnson@example.com' },
  },
  {
    appointmentDate: new Date('2023-06-22'),
    appointmentTime: '02:00 PM',
    appointmentType: 'Emergency',
    reason: 'Severe back pain',
    status: 'Cancelled',
    notes: 'Patient rescheduled',
    isOnline: false,
    patient: { fullname: 'Michael Johnson', email: 'michael@example.com', phone: '555-345-6789' },
    doctor: { fullname: 'Dr. Williams', email: 'drwilliams@example.com' },
  },
  {
    appointmentDate: new Date('2023-06-25'),
    appointmentTime: '11:15 AM',
    appointmentType: 'Regular Checkup',
    reason: 'Blood pressure monitoring',
    status: 'Pending',
    notes: '',
    isOnline: false,
    patient: { fullname: 'Emily Davis', email: 'emily@example.com', phone: '555-456-7890' },
    doctor: { fullname: 'Dr. Brown', email: 'drbrown@example.com' },
  },
  {
    appointmentDate: new Date('2023-06-28'),
    appointmentTime: '03:30 PM',
    appointmentType: 'Consultation',
    reason: 'Skin rash',
    status: 'Scheduled',
    notes: '',
    isOnline: true,
    patient: { fullname: 'Robert Wilson', email: 'robert@example.com', phone: '555-567-8901' },
    doctor: { fullname: 'Dr. Jones', email: 'drjones@example.com' },
  },
];

try {
  // Insert appointments
  await Appointment.insertMany(mockAppointments);
  console.log('Mock appointments inserted successfully');
} catch (error) {
  console.error('Error inserting mock appointments:', error);
} finally {
  // Close the database connection
  mongoose.disconnect();
  console.log('Database connection closed');
}

console.log('Seeding completed successfully!'); 