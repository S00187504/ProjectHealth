/**
 * Main Server Entry Point
 * 
 * Initializes and configures the Express application:
 * - Environment configuration with dotenv
 * - Database connection setup
 * - Middleware configuration (CORS, JSON parsing, etc.)
 * - Route registration for all API endpoints
 * - Error handling middleware
 * - Server startup on configured port
 * 
 * This is the main file that bootstraps the entire backend application.
 */
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicalRecordRoutes from './routes/medicalRecordRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Direct route to get appointments without authentication
app.get('/api/public/appointments', async (req, res) => {
  try {
    console.log("Getting static mock appointments through public endpoint");
    
    // Static mock data
    const mockAppointments = [
      {
        _id: "appointment1",
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
        _id: "appointment2",
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
        _id: "appointment3",
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
        _id: "appointment4",
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
        _id: "appointment5",
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
    
    console.log(`Returning ${mockAppointments.length} mock appointments (public route)`);
    res.json(mockAppointments);
  } catch (error) {
    console.error("Error returning public appointments:", error);
    res.status(400).json({ message: error.message });
  }
});

// Import routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicalrecords', medicalRecordRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
