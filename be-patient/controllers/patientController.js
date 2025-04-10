import Patient from '../models/Patient.js';

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private
const createPatient = async (req, res) => {
  try {
    const {
      userId,
      fullname,
      email,
      dateOfBirth,
      address,
      phone,
      occupation,
      primaryPhysician,
      insuranceProvider,
      policyNumber,
      allergies,
      medications,
      medicalHistory,
      familyHistory,
      identificationType,
      documentFileName,
      documentFileSize,
      consents,
    } = req.body;

    // Check if existing patient for this user
    const patientExists = await Patient.findOne({ user: userId || req.user._id });

    // If patient exists, update instead of creating
    if (patientExists) {
      patientExists.fullname = fullname || patientExists.fullname;
      patientExists.email = email || patientExists.email;
      patientExists.dob = dateOfBirth || patientExists.dob;
      patientExists.address = address || patientExists.address;
      patientExists.phone = phone || patientExists.phone;
      patientExists.occupation = occupation || patientExists.occupation;
      patientExists.physician = primaryPhysician || patientExists.physician;
      patientExists.insurance = insuranceProvider || patientExists.insurance;
      patientExists.policy = policyNumber || patientExists.policy;
      patientExists.allergies = allergies || patientExists.allergies;
      patientExists.medications = medications || patientExists.medications;
      patientExists.history = medicalHistory || patientExists.history;
      patientExists.familyHistory = familyHistory || patientExists.familyHistory;
      patientExists.identificationType = identificationType || patientExists.identificationType;
      patientExists.documentFileName = documentFileName || patientExists.documentFileName;
      patientExists.documentFileSize = documentFileSize || patientExists.documentFileSize;
      
      // Handle consents
      if (consents) {
        patientExists.consentTreatment = consents.treatment !== undefined ? consents.treatment : patientExists.consentTreatment;
        patientExists.consentDisclosure = consents.disclosure !== undefined ? consents.disclosure : patientExists.consentDisclosure;
        patientExists.acknowledgePrivacy = consents.privacyPolicy !== undefined ? consents.privacyPolicy : patientExists.acknowledgePrivacy;
      }

      const updatedPatient = await patientExists.save();
      return res.status(200).json(updatedPatient);
    }

    // Create new patient
    const patient = await Patient.create({
      fullname,
      email,
      dob: dateOfBirth,
      address,
      phone,
      occupation,
      physician: primaryPhysician,
      insurance: insuranceProvider,
      policy: policyNumber,
      allergies,
      medications,
      history: medicalHistory,
      familyHistory,
      identificationType,
      documentFileName,
      documentFileSize,
      consentTreatment: consents?.treatment,
      consentDisclosure: consents?.disclosure,
      acknowledgePrivacy: consents?.privacyPolicy,
      user: userId || req.user._id, // Link to the logged-in user
    });

    if (patient) {
      res.status(201).json(patient);
    } else {
      res.status(400);
      throw new Error('Invalid patient data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({});
    // Always return the patients array, even if empty
    res.json(patients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      res.json(patient);
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      patient.fullname = req.body.fullname || patient.fullname;
      patient.email = req.body.email || patient.email;
      patient.dob = req.body.dob || patient.dob;
      patient.address = req.body.address || patient.address;
      patient.phone = req.body.phone || patient.phone;
      patient.occupation = req.body.occupation || patient.occupation;
      patient.physician = req.body.physician || patient.physician;
      patient.insurance = req.body.insurance || patient.insurance;
      patient.policy = req.body.policy || patient.policy;
      patient.allergies = req.body.allergies || patient.allergies;
      patient.medications = req.body.medications || patient.medications;
      patient.history = req.body.history || patient.history;
      patient.familyHistory = req.body.familyHistory || patient.familyHistory;
      patient.identificationType = req.body.identificationType || patient.identificationType;
      patient.documentFileName = req.body.documentFileName || patient.documentFileName;
      patient.documentFileSize = req.body.documentFileSize || patient.documentFileSize;
      patient.consentTreatment = req.body.consentTreatment !== undefined ? req.body.consentTreatment : patient.consentTreatment;
      patient.consentDisclosure = req.body.consentDisclosure !== undefined ? req.body.consentDisclosure : patient.consentDisclosure;
      patient.acknowledgePrivacy = req.body.acknowledgePrivacy !== undefined ? req.body.acknowledgePrivacy : patient.acknowledgePrivacy;

      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      await patient.deleteOne();
      res.json({ message: 'Patient removed' });
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createPatient, getPatients, getPatientById, updatePatient, deletePatient }; 