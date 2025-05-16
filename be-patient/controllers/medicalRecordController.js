/**
 * Medical Record Controller
 * 
 * Manages all medical record operations:
 * - Creating new medical records
 * - Retrieving records (all, by ID, by patient)
 * - Updating medical record information
 * - Deleting medical records
 * - Handling attachments and documents
 * 
 * Implements proper access control to ensure only authorized
 * personnel can access sensitive medical information.
 */
import MedicalRecord from '../models/MedicalRecord.js';

// @desc    Create a new medical record
// @route   POST /api/medicalrecords
// @access  Private
const createMedicalRecord = async (req, res) => {
  try {
    const {
      patient,
      appointment,
      diagnosis,
      symptoms,
      vitalSigns,
      treatment,
      medications,
      labResults,
      notes,
      attachments,
      followUpNeeded,
      followUpDate
    } = req.body;

    const medicalRecord = await MedicalRecord.create({
      patient,
      appointment,
      recordDate: new Date(),
      diagnosis,
      symptoms,
      vitalSigns,
      treatment,
      medications,
      labResults,
      notes,
      attachments,
      doctor: req.user._id,
      followUpNeeded,
      followUpDate
    });

    if (medicalRecord) {
      res.status(201).json(medicalRecord);
    } else {
      res.status(400);
      throw new Error('Invalid medical record data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all medical records
// @route   GET /api/medicalrecords
// @access  Private/Admin
const getMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find({})
      .populate('patient', 'fullname email')
      .populate('doctor', 'fullname email')
      .populate('appointment');
    res.json(medicalRecords);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get medical records by patient ID
// @route   GET /api/medicalrecords/patient/:patientId
// @access  Private
const getMedicalRecordsByPatient = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'fullname email')
      .populate('appointment')
      .sort({ recordDate: -1 });
    
    res.json(medicalRecords);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get medical record by ID
// @route   GET /api/medicalrecords/:id
// @access  Private
const getMedicalRecordById = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'fullname email dob address phone')
      .populate('doctor', 'fullname email')
      .populate('appointment');

    if (medicalRecord) {
      res.json(medicalRecord);
    } else {
      res.status(404);
      throw new Error('Medical record not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update medical record
// @route   PUT /api/medicalrecords/:id
// @access  Private
const updateMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (medicalRecord) {
      medicalRecord.diagnosis = req.body.diagnosis || medicalRecord.diagnosis;
      medicalRecord.symptoms = req.body.symptoms || medicalRecord.symptoms;
      medicalRecord.vitalSigns = req.body.vitalSigns || medicalRecord.vitalSigns;
      medicalRecord.treatment = req.body.treatment || medicalRecord.treatment;
      medicalRecord.medications = req.body.medications || medicalRecord.medications;
      medicalRecord.labResults = req.body.labResults || medicalRecord.labResults;
      medicalRecord.notes = req.body.notes || medicalRecord.notes;
      medicalRecord.attachments = req.body.attachments || medicalRecord.attachments;
      medicalRecord.followUpNeeded = req.body.followUpNeeded !== undefined ? req.body.followUpNeeded : medicalRecord.followUpNeeded;
      medicalRecord.followUpDate = req.body.followUpDate || medicalRecord.followUpDate;

      const updatedMedicalRecord = await medicalRecord.save();
      res.json(updatedMedicalRecord);
    } else {
      res.status(404);
      throw new Error('Medical record not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete medical record
// @route   DELETE /api/medicalrecords/:id
// @access  Private/Admin
const deleteMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (medicalRecord) {
      await medicalRecord.deleteOne();
      res.json({ message: 'Medical record removed' });
    } else {
      res.status(404);
      throw new Error('Medical record not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordsByPatient,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord
}; 
