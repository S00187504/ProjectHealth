"use client"

import { useFormContext } from "@/context/formContext"
import { LuBriefcaseMedical } from "react-icons/lu"
import { GrUserManager } from "react-icons/gr"
import { RiPagesLine } from "react-icons/ri"
import { MdOutlinePolicy, MdOutlineMedicalInformation, MdOutlineFamilyRestroom } from "react-icons/md"
import { FaAllergies, FaBookMedical } from "react-icons/fa"
import { Input } from "@/components/ui/input"

function MedicalData() {
  const { formData, updateFormData } = useFormContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    updateFormData({ [id]: value })
  }

  return (
    <section className="mt-8 md:mt-12 flex flex-col gap-4">
      <h1 className="text-lg md:text-xl flex items-center gap-2">
        <LuBriefcaseMedical />
        Medical Information
      </h1>

      <div>
        <label htmlFor="physician" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
          Primary Care Physician:
        </label>
        <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
          <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
            <GrUserManager size={20} />
          </span>
          <Input 
            id="physician" 
            type="text" 
            placeholder="Enter your physician"
            value={formData.physician || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="w-full sm:w-1/2">
          <label htmlFor="insurance" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Insurance Provider:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <RiPagesLine size={20} />
            </span>
            <Input 
              id="insurance" 
              type="text" 
              placeholder="ex: BlueCross"
              value={formData.insurance || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <label htmlFor="policy" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Insurance Policy:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <MdOutlinePolicy size={20} />
            </span>
            <Input 
              id="policy" 
              type="text" 
              placeholder="ex: ADE789"
              value={formData.policy || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="w-full sm:w-1/2">
          <label htmlFor="allergies" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Allergies (if any):
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <FaAllergies size={20} />
            </span>
            <Input 
              id="allergies" 
              type="text" 
              placeholder="Yes / No"
              value={formData.allergies || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <label htmlFor="medications" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Current Medications:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <MdOutlineMedicalInformation size={20} />
            </span>
            <Input 
              id="medications" 
              type="text" 
              placeholder="Enter your medications"
              value={formData.medications || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="w-full sm:w-1/2">
          <label htmlFor="history" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Past Medical History:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <FaBookMedical size={20} />
            </span>
            <Input 
              id="history" 
              type="text" 
              placeholder="if any"
              value={formData.history || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <label htmlFor="familyHistory" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Family Medical History:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <MdOutlineFamilyRestroom size={20} />
            </span>
            <Input 
              id="familyHistory" 
              type="text" 
              placeholder="if any"
              value={formData.familyHistory || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MedicalData