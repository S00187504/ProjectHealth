"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

// Define the structure of our form data
interface FormDataType {
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
  documentFile?: File | null
  documentFileName?: string
  documentFileSize?: number
  consentTreatment?: boolean
  consentDisclosure?: boolean
  acknowledgePrivacy?: boolean
}

// Define the context structure
interface FormContextType {
  formData: FormDataType
  updateFormData: (newData: Partial<FormDataType>) => void
  submitForm: () => Promise<void>
  loading: boolean
  error: string | null
}

// Create the context with default values
const FormContext = createContext<FormContextType>({
  formData: {},
  updateFormData: () => {},
  submitForm: async () => {},
  loading: false,
  error: null
})

// Hook for using the form context
export const useFormContext = () => useContext(FormContext)

// Context provider component
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormDataType>({
    consentTreatment: true,
    acknowledgePrivacy: true,
    consentDisclosure: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load data from localStorage on initial mount
  useEffect(() => {
    const storedData = localStorage.getItem('patientFormData')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setFormData(prevData => ({
          ...prevData,
          ...parsedData
        }))
      } catch (error) {
        console.error("Error parsing stored form data:", error)
      }
    }
  }, [])

  // Update form data function
  const updateFormData = (newData: Partial<FormDataType>) => {
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      }
      
      // Save to localStorage after each update for real-time persistence
      localStorage.setItem('patientFormData', JSON.stringify(updatedData))
      
      return updatedData
    })
  }

  // Form submission function
  const submitForm = async () => {
    if (!user) {
      setError("You must be logged in to submit patient data")
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Ensure the form data is saved to localStorage
      localStorage.setItem('patientFormData', JSON.stringify(formData))
      
      // Also save to backend
      const response = await axios.post('http://localhost:5000/api/patients', {
        userId: user._id,
        fullname: formData.fullname,
        email: formData.email,
        dateOfBirth: formData.dob,
        address: formData.address,
        phone: formData.phone,
        occupation: formData.occupation,
        
        // Medical data
        primaryPhysician: formData.physician,
        insuranceProvider: formData.insurance,
        policyNumber: formData.policy,
        allergies: formData.allergies,
        medications: formData.medications,
        medicalHistory: formData.history,
        familyHistory: formData.familyHistory,
        
        // Identification
        identificationType: formData.identificationType,
        consents: {
          treatment: formData.consentTreatment,
          disclosure: formData.consentDisclosure,
          privacyPolicy: formData.acknowledgePrivacy
        }
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      console.log("Form submitted and saved to backend:", response.data)
      
    } catch (err: any) {
      console.error("Error submitting patient data:", err)
      setError(err.response?.data?.message || "Failed to save patient data")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormContext.Provider value={{ formData, updateFormData, submitForm, loading, error }}>
      {children}
    </FormContext.Provider>
  )
}