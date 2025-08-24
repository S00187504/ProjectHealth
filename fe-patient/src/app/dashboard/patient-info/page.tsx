"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormContext } from '@/context/formContext'
import PersonalData from '../appointments/patient/personalData/personalData'
import MedicalData from '../appointments/patient/medicalData/medicalData'
import { Button } from '@/components/ui/button'
// import { ModeToggle } from '@/components/mode'

export default function PatientInfoPage() {
    const router = useRouter()
    const { submitForm, loading, error, formData, updateFormData } = useFormContext()
    const [submitError, setSubmitError] = useState<string | null>(null)
    const { user } = require('@/context/AuthContext').useAuth();

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
            await submitForm()
            router.push('/dashboard')
        } catch (err) {
            console.error("Error submitting form:", err)
            setSubmitError("There was an error submitting your information. Please try again.")
        }
    }

    // Only allow patients to access
    if (user?.role !== 'patient') {
        return <div className="p-12 text-center text-red-600 font-bold">Access denied. Only patients can view and update their info here.</div>;
    }

    const dashboardIntro = (
        <div className="flex flex-col md:flex-row items-center mb-6 p-6 bg-blue-50 rounded-lg shadow">
                        <span className="w-32 h-32 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="35" y="10" width="20" height="70" rx="5" fill="#e3342f"/>
                                <rect x="10" y="35" width="70" height="20" rx="5" fill="#e3342f"/>
                            </svg>
                        </span>
            <div>
                <p className="font-semibold text-lg mb-2">Patient Self-Registration</p>
                <p className="text-sm mb-2">Patients can manage their own medical and personal information for appointments and record keeping.</p>
                <p className="font-semibold text-lg mt-2 mb-1">About this dashboard</p>
                <p className="text-sm mb-2">This dashboard enables patients to manage their profile, schedule appointments, and access medical records.</p>
                <div className="mt-4">
                    <p className="font-semibold mb-1">How to use:</p>
                    <ol className="list-decimal list-inside text-sm mb-2">
                        <li>Complete your personal and medical information below.</li>
                        <li>Submit the form to save your profile.</li>
                        <li>Schedule appointments.</li>
                        <li>Access your own medical records.</li>
                    </ol>
                </div>
            </div>
        </div>
    );

    return (
        <div className='flex'>
            <div className='w-full border p-12'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Patient Info</h1>
                    {/* Removed ModeToggle */}
                </div>
                {dashboardIntro}
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
                <Button 
                    className="w-full mt-6"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Save & Continue'}
                </Button>
            </div>
        </div>
    )
}
