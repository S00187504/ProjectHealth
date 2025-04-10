"use client"
import { CiMedicalCase } from "react-icons/ci"
import { useEffect, useState } from "react"

function UserMedical() {
  const [userData, setUserData] = useState({
    physician: "",
    insurance: "",
    policy: "",
    allergies: "",
    medications: "",
    history: "",
    familyHistory: ""
  })
  useEffect(() => {
    // Load data from localStorage on component mount
    const storedData = localStorage.getItem('patientFormData')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData({
        physician: parsedData.physician || "",
        insurance: parsedData.insurance || "",
        policy: parsedData.policy || "",
        allergies: parsedData.allergies || "",
        medications: parsedData.medications || "",
        history: parsedData.history || "",
        familyHistory: parsedData.familyHistory || ""
      })
    }
  }, [])


  return (
    <section className=" container-fluid py-5 bg-gray-100 rounded-lg dark:bg-[#202020]  my-5">
      <h1 className="text-lg md:text-xl flex items-center gap-2 font-medium">
        <CiMedicalCase className="text-xl md:text-2xl" />
        Medical 
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4 md:gap-6">
        <div className="w-full">
          <label htmlFor="physician" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Primary Care Physician:
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">
            {userData.physician || "Patient not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="insurance" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Insurance Provider:
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">
            {userData.insurance || "Patient not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="policy" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Insurance Policy:
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">
            {userData.policy || "Patient not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="allergies" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Allergies:
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">
            {userData.allergies || "Patient not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="medications" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Current Medications:
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">
             {userData.medications || "Patient not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="medical-history" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Past Medical History:
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">
             {userData.history || "Patient not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="family-history" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Family Medical History:
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">
             {userData.familyHistory || "Patient not provided"}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserMedical

