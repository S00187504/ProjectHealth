import express from 'express';
import {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add a test endpoint for debugging
router.get('/test', async (req, res) => {
  try {
    // Import Appointment model directly here since we don't want to modify the controller
    const Appointment = (await import('../models/Appointment.js')).default;
    
    console.log("TEST ENDPOINT: Getting all appointments without auth");
    
    // Find all appointments with detailed patient and doctor info
    const appointments = await Appointment.find({})
      .populate('patient', 'fullname email phone')
      .populate('doctor', 'fullname email');
    
    console.log(`TEST ENDPOINT: Found ${appointments.length} appointments`);
    
    // Return basic info about each appointment
    const simplifiedAppointments = appointments.map(apt => ({
      id: apt._id,
      date: apt.appointmentDate,
      time: apt.appointmentTime,
      status: apt.status,
      patientId: apt.patient?._id || null,
      patientName: apt.patient?.fullname || 'Unknown Patient',
      doctorName: apt.doctor?.fullname || 'Unassigned'
    }));
    
    res.json({
      message: 'Test endpoint results',
      count: appointments.length,
      appointments: simplifiedAppointments
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    res.status(500).json({ 
      message: 'Error in test endpoint', 
      error: error.message 
    });
  }
});

router.route('/')
  .post(protect, createAppointment)
  .get(protect, admin, getAppointments);

router.route('/myappointments').get(protect, getMyAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, admin, deleteAppointment);

export default router; 