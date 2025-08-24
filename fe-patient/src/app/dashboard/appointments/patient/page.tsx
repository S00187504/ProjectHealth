"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormContext } from '@/context/formContext'
import PersonalData from './personalData/personalData'
import MedicalData from './medicalData/medicalData'
//import IdentificationData from './identification/identificationData'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
// import { ModeToggle } from '@/components/mode'

/**
 * Patient Registration Page
 * 
 * Multi-section form for collecting comprehensive patient information:
 * - Personal data (name, contact, demographics)
 * - Medical data (history, allergies, current medications)
 * - Identification verification (document upload)
 * 
 * Features form validation, error handling, and submission to backend API.
 * Includes theme toggle for accessibility and visual preference.
 */
export default function PatientPage() {
        const router = useRouter()
        const { submitForm, loading, error, formData, updateFormData } = useFormContext()
        const [submitError, setSubmitError] = useState<string | null>(null)
        const { user } = require('@/context/AuthContext').useAuth();

            // Dashboard introduction
            const dashboardIntro = (
                <div className="flex flex-col md:flex-row items-center mb-6 p-6 bg-blue-50 rounded-lg shadow">
                    <img src="/placeholder.svg" alt="Patient" className="w-32 h-32 object-cover rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-200" />
                    <div>
                        <p className="font-semibold text-lg mb-2">About ProjectHealth</p>
                        <p className="text-sm mb-2">ProjectHealth is a healthcare management platform for secure appointment scheduling, patient management, and communication between doctors, patients, and administrators.</p>
                        <p className="font-semibold text-lg mt-2 mb-1">About this dashboard</p>
                        <p className="text-sm mb-2">This dashboard enables patients to view and schedule appointments, access their medical records, and receive notifications about changes or updates.</p>
                        <div className="mt-4">
                            <p className="font-semibold mb-1">How to use:</p>
                            <ol className="list-decimal list-inside text-sm mb-2">
                                <li>View your upcoming and past appointments in the dashboard table.</li>
                                <li>Schedule a new appointment using the 'New Appointment' button.</li>
                                <li>Access your medical records and personal information.</li>
                                <li>Receive notifications about appointment changes or updates.</li>
                            </ol>
                            <p className="font-semibold mb-1">Features:</p>
                            <ul className="list-disc list-inside text-sm">
                                <li>View and schedule appointments</li>
                                <li>Access medical records</li>
                                <li>Receive notifications and updates</li>
                                <li>Personal information management</li>
                            </ul>
                        </div>
                    </div>
                </div>
            );

    // Pre-fill form with logged-in user info on mount
    React.useEffect(() => {
        async function fetchPatientInfo() {
            if (user) {
                try {
                    const res = await require('@/lib/api').patientApi.getPatientByUserId(user._id);
                    const patient = res.data;
                    if (patient && patient._id) {
                        updateFormData({
                            fullname: patient.fullname,
                            email: patient.email,
                            phone: patient.phone || '',
                            dob: patient.dob ? patient.dob.substring(0,10) : '',
                            address: patient.address || '',
                            occupation: patient.occupation || '',
                            physician: patient.physician || '',
                            insurance: patient.insurance || '',
                            policy: patient.policy || '',
                            allergies: patient.allergies || '',
                            medications: patient.medications || '',
                            history: patient.history || '',
                            familyHistory: patient.familyHistory || '',
                            identificationType: patient.identificationType || '',
                            documentFileName: patient.documentFileName || '',
                            documentFileSize: patient.documentFileSize || 0,
                            consentTreatment: patient.consentTreatment,
                            consentDisclosure: patient.consentDisclosure,
                            acknowledgePrivacy: patient.acknowledgePrivacy,
                        });
                    } else {
                        setSubmitError("No patient record found. Please complete your profile or contact support.");
                        updateFormData({
                            fullname: user.name,
                            email: user.email,
                            phone: user.phone || '',
                        });
                    }
                } catch (err) {
                    setSubmitError("Unable to load patient record. Please try again or contact support.");
                    updateFormData({
                        fullname: user.name,
                        email: user.email,
                        phone: user.phone || '',
                    });
                }
            }
        }
        fetchPatientInfo();
    }, [user]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setSubmitError(null)
        
        try {
            // Submit the form data to context and backend
            await submitForm()
            // Navigate to appointment page
            router.push('/dashboard/appointments/appointment')
        } catch (err) {
            console.error("Error submitting form:", err)
            setSubmitError("There was an error submitting your information. Please try again.")
        }
    }

    return (
        <>
            <div className='flex'>
                {/* <div className='w-full lg:w-1/2 border p-12'> */}
                <div className='w-full border p-12'>
                    {/* Add a header with the theme toggle */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold">Patient Information</h1>
                        {/* Removed ModeToggle */}
                    </div>
                    
                    {(error || submitError) && (
                        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
                            {error || submitError}
                        </div>
                    )}
                    {submitError && (
                        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-center">
                            {submitError}
                            <div className="mt-2">
                                <span className="font-semibold">It looks like this is your first time here.</span><br />
                                Please complete your profile to get started with appointments and medical records.
                            </div>
                        </div>
                    )}
                    
                    <PersonalData />
                                        <MedicalData />
                                                            {/* Consent Options as Checkboxes */}
                                                                                <div className="mt-8 space-y-4">
                                                                                    <label className="flex items-center gap-2">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={!!formData.consentTreatment}
                                                                                            onChange={e => updateFormData({ consentTreatment: e.target.checked })}
                                                                                            className="accent-green-600 h-4 w-4"
                                                                                        />
                                                                                        <span className="text-sm font-medium text-gray-500">Consent to Treatment</span>
                                                                                    </label>
                                                                                    <label className="flex items-center gap-2">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={!!formData.consentDisclosure}
                                                                                            onChange={e => updateFormData({ consentDisclosure: e.target.checked })}
                                                                                            className="accent-green-600 h-4 w-4"
                                                                                        />
                                                                                        <span className="text-sm font-medium text-gray-500">Consent to Disclosure</span>
                                                                                    </label>
                                                                                    <label className="flex items-center gap-2">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={!!formData.acknowledgePrivacy}
                                                                                            onChange={e => updateFormData({ acknowledgePrivacy: e.target.checked })}
                                                                                            className="accent-green-600 h-4 w-4"
                                                                                        />
                                                                                        <span className="text-sm font-medium text-gray-500">Acknowledge Privacy Policy</span>
                                                                                    </label>
                                                                                </div>
                                        {/* <IdentificationData /> */}
                                        <Button 
                                                className="w-full mt-6" // Added margin-top for spacing
                                                onClick={handleSubmit}
                                                disabled={loading}
                                        >
                                                {loading ? 'Submitting...' : 'Submit & Continue'}
                                        </Button>
                </div>
                {/* <div className='w-0 lg:w-1/2 h-0 lg:h-screen border overflow-hidden sticky top-0'>
                    <Image src={"/doctor.jpeg"} alt='photo' width={700} height={100} />
                </div> */}
            </div>
        </>
    )
}
