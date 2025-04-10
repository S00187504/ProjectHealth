import mongoose from 'mongoose';

const medicalRecordSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: false, // Not all records may be tied to appointments
    },
    recordDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    vitalSigns: {
      temperature: { type: Number, default: null },
      bloodPressure: { type: String, default: '' }, // e.g. "120/80"
      heartRate: { type: Number, default: null },
      respiratoryRate: { type: Number, default: null },
      oxygenSaturation: { type: Number, default: null },
    },
    treatment: {
      type: String,
      default: '',
    },
    medications: [{
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      instructions: { type: String, default: '' },
    }],
    labResults: [{
      testName: { type: String, required: true },
      result: { type: String, required: true },
      referenceRange: { type: String, default: '' },
      notes: { type: String, default: '' },
    }],
    notes: {
      type: String,
      default: '',
    },
    attachments: [{
      fileName: { type: String, required: true },
      fileType: { type: String, required: true },
      fileSize: { type: Number, required: true },
      filePath: { type: String, required: true },
      uploadDate: { type: Date, default: Date.now },
    }],
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming doctors are Users with isAdmin or isDoctor flag
      required: true,
    },
    followUpNeeded: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord; 