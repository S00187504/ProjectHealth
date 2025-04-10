import express from 'express';
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordsByPatient,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../controllers/medicalRecordController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMedicalRecord)
  .get(protect, getMedicalRecords);

router.route('/patient/:patientId')
  .get(protect, getMedicalRecordsByPatient);

router.route('/:id')
  .get(protect, getMedicalRecordById)
  .put(protect, updateMedicalRecord)
  .delete(protect, deleteMedicalRecord);

export default router; 