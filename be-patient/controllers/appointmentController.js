/**
 * Appointment Controller
 * 
 * Manages all appointment-related operations:
 * - Creating new appointments
 * - Retrieving appointments (all, by ID, by patient)
 * - Updating appointment details and status
 * - Cancelling appointments
 * - Filtering and sorting appointment data
 * 
 * Implements business logic for appointment management with proper
 * validation, error handling, and database interactions.
 */
import Appointment from '../models/Appointment.js';

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const {
      patient,
      appointmentDate,
      appointmentTime,
      appointmentType,
      reason,
      isOnline,
      doctor
    } = req.body;

    const appointment = await Appointment.create({
      patient,
      appointmentDate,
      appointmentTime,
      appointmentType,
      reason,
      status: 'Scheduled',
      isOnline,
      doctor
    });

    if (appointment) {
      res.status(201).json(appointment);
    } else {
      res.status(400);
      throw new Error('Invalid appointment data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = async (req, res) => {
  try {
    console.log("Getting all appointments as admin");
    
    // More detailed logging for debugging
    console.log("Admin user:", req.user._id);
    
    // Try to find all appointments with detailed patient and doctor info
    const appointments = await Appointment.find({})
      .populate('patient', 'fullname email phone')
      .populate('doctor', 'fullname email');
    
    console.log(`Found ${appointments.length} appointments`);
    
    // Log some details about each appointment
    appointments.forEach((apt, index) => {
      console.log(`Appointment ${index+1}:`, {
        id: apt._id,
        date: apt.appointmentDate,
        patientRef: apt.patient,
        patientId: apt.patient?._id || 'No ID',
        patientName: apt.patient?.fullname || 'No Name',
        doctorName: apt.doctor?.fullname || 'Unassigned'
      });
    });
    
    // Always return a valid response, even if empty
    res.json(appointments);
  } catch (error) {
    console.error("Error getting appointments:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/myappointments
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    console.log("Getting appointments for user:", req.user._id);
    
    // Find appointments associated with the current user (as patient)
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'fullname email')
      .sort({ appointmentDate: 1 });
    
    console.log(`Found ${appointments.length} appointments for user`);
    
    // Log each appointment's details
    appointments.forEach((apt, index) => {
      console.log(`User Appointment ${index+1}:`, {
        id: apt._id,
        date: new Date(apt.appointmentDate).toLocaleDateString(),
        time: apt.appointmentTime,
        status: apt.status,
        doctor: apt.doctor?.fullname || 'Unassigned'
      });
    });
    
    // Always return a valid response, even if empty
    res.json(appointments);
  } catch (error) {
    console.error("Error getting user appointments:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'fullname email phone address')
      .populate('doctor', 'fullname email');

    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404);
      throw new Error('Appointment not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.patient = req.body.patient || appointment.patient;
      appointment.appointmentDate = req.body.appointmentDate || appointment.appointmentDate;
      appointment.appointmentTime = req.body.appointmentTime || appointment.appointmentTime;
      appointment.appointmentType = req.body.appointmentType || appointment.appointmentType;
      appointment.reason = req.body.reason || appointment.reason;
      appointment.status = req.body.status || appointment.status;
      appointment.notes = req.body.notes || appointment.notes;
      appointment.isOnline = req.body.isOnline !== undefined ? req.body.isOnline : appointment.isOnline;
      appointment.meetingLink = req.body.meetingLink || appointment.meetingLink;
      appointment.doctor = req.body.doctor || appointment.doctor;

      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404);
      throw new Error('Appointment not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      await appointment.deleteOne();
      res.json({ message: 'Appointment removed' });
    } else {
      res.status(404);
      throw new Error('Appointment not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};
