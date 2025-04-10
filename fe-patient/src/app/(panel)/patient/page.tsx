"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormContext } from '@/context/formContext'
import PersonalData from './personalData/personalData'
import MedicalData from './medicalData/medicalData'
import IdentificationData from './identification/identificationData'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function Page() {
    const router = useRouter()
    const { submitForm, loading, error } = useFormContext()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setSubmitError(null)
        
        try {
            // Submit the form data to context and backend
            await submitForm()
            // Navigate to appointment page
            router.push('/appointment')
        } catch (err) {
            console.error("Error submitting form:", err)
            setSubmitError("There was an error submitting your information. Please try again.")
        }
    }

    return (
        <>
            <div className='flex'>
                <div className='w-full lg:w-1/2 border p-12'>
                    {(error || submitError) && (
                        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
                            {error || submitError}
                        </div>
                    )}
                    
                    <PersonalData />
                    <MedicalData />
                    <IdentificationData />
                    <Button 
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit & Continue'}
                    </Button>
                </div>
                <div className='w-0 lg:w-1/2 h-0 lg:h-screen border overflow-hidden sticky top-0'>
                    <Image src={"/doctor.jpeg"} alt='photo' width={700} height={100} />
                </div>
            </div>
        </>
    )
}

export default Page