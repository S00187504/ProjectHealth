import mongoose from 'mongoose';

const patientSchema = mongoose.Schema(
  {
    // Personal Information
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      default: '',
    },
    
    // Medical Information
    physician: {
      type: String,
      default: '',
    },
    insurance: {
      type: String,
      default: '',
    },
    policy: {
      type: String,
      default: '',
    },
    allergies: {
      type: String,
      default: '',
    },
    medications: {
      type: String,
      default: '',
    },
    history: {
      type: String,
      default: '',
    },
    familyHistory: {
      type: String,
      default: '',
    },
    
    // Identification & Verification
    identificationType: {
      type: String,
      enum: ['Licance', 'Birth Certificate'],
      default: 'Licance',
    },
    documentFileName: {
      type: String,
      default: '',
    },
    documentFileSize: {
      type: Number,
      default: 0,
    },
    
    // Consent & Privacy
    consentTreatment: {
      type: Boolean,
      default: false,
    },
    consentDisclosure: {
      type: Boolean,
      default: false,
    },
    acknowledgePrivacy: {
      type: Boolean,
      default: false,
    },
    
    // Reference to user if the patient is also a registered user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient; 