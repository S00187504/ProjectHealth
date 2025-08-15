import express from 'express';
import {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  checkDoctorConflict
} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test endpoint for debugging
router.get('/test', async (req, res) => {
  try {
    const Appointment = (await import('../models/Appointment.js')).default;

    console.log('TEST ENDPOINT: Getting all appointments without auth');

    const appointments = await Appointment.find({})
      .populate('patient', 'fullname email phone')
      .populate('doctor', 'fullname email');

    console.log(`TEST ENDPOINT: Found ${appointments.length} appointments`);

    const simplifiedAppointments = appointments.map(apt => ({
      id: apt._id,
      date: apt.appointmentDate,
      startTime: apt.startTime ?? null,
      endTime: apt.endTime ?? null,
      timeRange: apt.startTime && apt.endTime ? `${apt.startTime} - ${apt.endTime}` : null,
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
    console.error('Error in test endpoint:', error);
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
router.route('/doctorappointments').get(protect, getDoctorAppointments);

// NOTE: expects ?doctor=..&date=YYYY-MM-DD&startTime=..&endTime=..
router.route('/conflict-check').get(protect, checkDoctorConflict);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, admin, deleteAppointment);

export default router;
