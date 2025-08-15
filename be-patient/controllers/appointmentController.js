/**
 * Appointment Controller
 *
 *
 * Uses startTime/endTime (e.g., "10:00 AM") instead of appointmentTime.
 * Overlap rule: existing.start < new.end && existing.end > new.start
 */
import Appointment from '../models/Appointment.js';

/** -------- helpers -------- */
const toMinutes = (t) => {
  // "hh:mm AM/PM" -> minutes since midnight
  // tolerant to lowercase/extra spaces
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*([APap][Mm])$/);
  if (!m) return NaN;
  let [ , hh, mm, ampm ] = m;
  let h = parseInt(hh, 10) % 12;
  const minutes = parseInt(mm, 10);
  if (ampm.toUpperCase() === 'PM') h += 12;
  return h * 60 + minutes;
};

const sameDayRange = (dateLike) => {
  const d = new Date(dateLike);
  const start = new Date(d); start.setHours(0, 0, 0, 0);
  const end   = new Date(d); end.setHours(23, 59, 59, 999);
  return { start, end };
};

const hasConflict = (existing, startTime, endTime) => {
  const sNew = toMinutes(startTime);
  const eNew = toMinutes(endTime);
  if (isNaN(sNew) || isNaN(eNew)) return true; // treat invalid time as conflict
  return existing.some(a => {
    const sOld = toMinutes(a.startTime);
    const eOld = toMinutes(a.endTime);
    return sOld < eNew && eOld > sNew; // overlap
  });
};

/** -------- create -------- */
// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const {
      patient,
      appointmentDate,
      startTime,
      endTime,
      appointmentType,
      reason,
      isOnline,
      doctor,
      notes,
      meetingLink
    } = req.body;

    // Basic validation
    if (!patient || !appointmentDate || !startTime || !endTime || !doctor) {
      return res.status(400).json({ message: 'patient, doctor, appointmentDate, startTime and endTime are required.' });
    }
    const sMin = toMinutes(startTime);
    const eMin = toMinutes(endTime);
    if (isNaN(sMin) || isNaN(eMin)) {
      return res.status(400).json({ message: 'Invalid time format. Use "hh:mm AM/PM".' });
    }
    if (eMin <= sMin) {
      return res.status(400).json({ message: 'endTime must be after startTime.' });
    }

    // Conflict check (same doctor, same day, non-cancelled)
    const { start, end } = sameDayRange(appointmentDate);
    const sameDayAppointments = await Appointment.find({
      doctor,
      status: { $ne: 'Cancelled' },
      appointmentDate: { $gte: start, $lte: end }
    }).select('startTime endTime');

    if (hasConflict(sameDayAppointments, startTime, endTime)) {
      return res.status(409).json({ message: 'Time slot already booked for this doctor.' });
    }

    // Create
    const appointment = await Appointment.create({
      patient,
      appointmentDate,
      startTime,
      endTime,
      appointmentType,
      reason,
      status: 'Scheduled',
      isOnline,
      meetingLink,
      doctor,
      notes,
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'fullname email phone')
      .populate('doctor', 'fullname email');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating appointment:', error);
    console.error('Error creating appointment:', error);
    res.status(400).json({ message: error.message });
  }
};

/** -------- list -------- */
const getAppointments = async (_req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'fullname email phone')
      .populate('doctor', 'fullname email');
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
};

// @route   GET /api/appointments/myappointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('patient', 'fullname email phone')
      .populate('patient', 'fullname email phone')
      .populate('doctor', 'fullname email')
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error getting user appointments:', error);
    res.status(400).json({ message: error.message });
  }
};

// @route   GET /api/appointments/doctorappointments
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'fullname email phone')
      .populate('doctor', 'fullname email')
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    res.status(400).json({ message: error.message });
  }
};

/** -------- single -------- */
// @route   GET /api/appointments/:id
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'fullname email phone address')
      .populate('doctor', 'fullname email');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** -------- update -------- */
// @route   PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const next = {
      patient: req.body.patient ?? appointment.patient,
      appointmentDate: req.body.appointmentDate ?? appointment.appointmentDate,
      startTime: req.body.startTime ?? appointment.startTime,
      endTime: req.body.endTime ?? appointment.endTime,
      appointmentType: req.body.appointmentType ?? appointment.appointmentType,
      reason: req.body.reason ?? appointment.reason,
      status: req.body.status ?? appointment.status,
      notes: req.body.notes ?? appointment.notes,
      isOnline: req.body.isOnline ?? appointment.isOnline,
      meetingLink: req.body.meetingLink ?? appointment.meetingLink,
      doctor: req.body.doctor ?? appointment.doctor,
    };

    // Validate times if changed
    const sMin = toMinutes(next.startTime);
    const eMin = toMinutes(next.endTime);
    if (isNaN(sMin) || isNaN(eMin)) {
      return res.status(400).json({ message: 'Invalid time format. Use "hh:mm AM/PM".' });
    }
    if (eMin <= sMin) {
      return res.status(400).json({ message: 'endTime must be after startTime.' });
    }

    // Conflict check excluding current appointment
    const { start, end } = sameDayRange(next.appointmentDate);
    const sameDayAppointments = await Appointment.find({
      _id: { $ne: appointment._id },
      doctor: next.doctor,
      status: { $ne: 'Cancelled' },
      appointmentDate: { $gte: start, $lte: end }
    }).select('startTime endTime');

    if (hasConflict(sameDayAppointments, next.startTime, next.endTime)) {
      return res.status(409).json({ message: 'Time slot already booked for this doctor.' });
    }

    Object.assign(appointment, next);
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'fullname email phone')
      .populate('doctor', 'fullname email');

    res.json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** -------- delete -------- */
// @route   DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** -------- conflict check API -------- */
// @desc    Check if a doctor has a conflicting appointment
// @route   GET /api/appointments/conflict-check?doctor=..&date=YYYY-MM-DD&startTime=..&endTime=..
// @access  Private
const checkDoctorConflict = async (req, res) => {
  try {
    const { doctor, date, startTime, endTime } = req.query;

    if (!doctor || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing doctor, date, startTime or endTime.' });
    }

    const sMin = toMinutes(String(startTime));
    const eMin = toMinutes(String(endTime));
    if (isNaN(sMin) || isNaN(eMin) || eMin <= sMin) {
      return res.status(400).json({ message: 'Invalid time range.' });
    }

    const { start, end } = sameDayRange(String(date));
    const sameDayAppointments = await Appointment.find({
      doctor,
      status: { $ne: 'Cancelled' },
      appointmentDate: { $gte: start, $lte: end }
    }).select('startTime endTime');

    const conflict = hasConflict(sameDayAppointments, String(startTime), String(endTime));
    return res.json({ available: !conflict, message: conflict ? 'This doctor is already booked in that time range.' : 'Available.' });
  } catch (error) {
    console.error('Conflict check error:', error);
    res.status(500).json({ message: 'Server error checking conflict.' });
  }
};

export {
  createAppointment,
  getAppointments,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  checkDoctorConflict
};
