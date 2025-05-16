/**
 * Appointment Model
 * 
 * Defines the schema for appointment data:
 * - Patient and doctor references
 * - Appointment date and time
 * - Appointment type and reason
 * - Status tracking (scheduled, completed, cancelled)
 * - Online/in-person designation
 * 
 * Includes timestamps for creation and updates, and
 * references to related models (Patient, User).
 */
import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String, // Stored as "10:00 AM", "2:30 PM", etc.
      required: true,
    },
    appointmentType: {
      type: String,
      enum: ['Consultation', 'Follow-up', 'Emergency', 'Regular Checkup', 'Other'],
      default: 'Consultation',
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      default: '',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    // Doctor assigned to this appointment (if applicable)
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming doctors are Users with isAdmin or isDoctor flag
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment; 
