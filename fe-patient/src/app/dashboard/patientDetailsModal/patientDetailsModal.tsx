"use client"

import React, { useEffect, useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { patientApi } from "@/lib/api"

// Define the Patient interface
export interface Patient {
  _id: string;
  fullname: string;
  email: string;
  dob?: string;
  address?: string;
  phone?: string;
  occupation?: string;
  physician?: string;
  insurance?: string;
  policy?: string;
  allergies?: string;
  medications?: string;
  history?: string;
  familyHistory?: string;
  identificationType?: string;
  documentFileName?: string;
  documentFileSize?: number;
  consentTreatment?: boolean;
  consentDisclosure?: boolean;
  acknowledgePrivacy?: boolean;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the form data structure
interface PatientFormData {
  // Personal Information
  fullname?: string
  email?: string
  dob?: string
  address?: string
  phone?: string
  occupation?: string
  
  // Medical Information
  physician?: string
  insurance?: string
  policy?: string
  allergies?: string
  medications?: string
  history?: string
  familyHistory?: string
  
  // Identification & Verification
  identificationType?: string
  documentFileName?: string
  documentFileSize?: number
  consentTreatment?: boolean
  consentDisclosure?: boolean
  acknowledgePrivacy?: boolean
}

interface PatientDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  patientId?: string
  patientEmail?: string
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId, 
  patientEmail 
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadPatientData = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      setError(null);
      
      try {
        if (patientId) {
          const response = await patientApi.getPatientById(patientId);
          if (response && response.data) {
            setSelectedPatient(response.data);
          }
        } else if (patientEmail) {
          const response = await patientApi.getPatientByEmail(patientEmail);
          if (response && response.data) {
            setSelectedPatient(response.data);
          }
        } else {
          // If no specific patient is requested, selectedPatient may already be set
          // by the parent component that opened this modal
          console.log("No patient ID or email provided");
        }
      } catch (err: any) {
        console.error("Error loading patient data:", err);
        setError(err.response?.data?.message || "Failed to load patient data");
        setSelectedPatient(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadPatientData();
  }, [isOpen, patientId, patientEmail]);

  if (!isOpen) return null;

  // Display loading state
  if (loading && !selectedPatient) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Patient Details</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2 text-gray-500">Loading patient information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error && !selectedPatient) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Patient Details</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            <p>Error loading patient data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Get patient data
  const patientData: Patient = selectedPatient || {} as Patient;
  
  // If no patient data and not loading, show empty state
  if (!selectedPatient || Object.keys(selectedPatient).length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Patient Details</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">No patient information available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Patient Details {patientData._id ? `#${patientData._id.slice(-6)}` : ''}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="font-medium">{patientData.fullname || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{patientData.email || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p>{patientData.dob ? new Date(patientData.dob).toLocaleDateString() : 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{patientData.phone || 'Not provided'}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>{patientData.address || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Occupation</p>
                <p>{patientData.occupation || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-3">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Physician</p>
                <p>{patientData.physician || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Insurance</p>
                <p>{patientData.insurance || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Policy Number</p>
                <p>{patientData.policy || 'Not provided'}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Allergies</p>
                <p className="whitespace-pre-wrap">{patientData.allergies || 'None reported'}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Current Medications</p>
                <p className="whitespace-pre-wrap">{patientData.medications || 'None reported'}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Medical History</p>
                <p className="whitespace-pre-wrap">{patientData.history || 'None reported'}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Family Medical History</p>
                <p className="whitespace-pre-wrap">{patientData.familyHistory || 'None reported'}</p>
              </div>
            </div>
          </div>

          {/* Identification & Verification Section */}
          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-3">Identification & Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Identification Type</p>
                <p>{patientData.identificationType || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Document File</p>
                <p>
                  {patientData.documentFileName 
                    ? `${patientData.documentFileName} (${Math.round((patientData.documentFileSize || 0) / 1024)} KB)` 
                    : 'No file uploaded'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Consent to Treatment</p>
                <p>{patientData.consentTreatment ? 'Provided' : 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Consent to Disclosure</p>
                <p>{patientData.consentDisclosure ? 'Provided' : 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Acknowledge Privacy Policy</p>
                <p>{patientData.acknowledgePrivacy ? 'Acknowledged' : 'Not acknowledged'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsModal; 