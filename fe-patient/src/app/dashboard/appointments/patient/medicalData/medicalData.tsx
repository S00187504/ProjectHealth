
"use client"

import React from "react";

import { useFormContext } from "@/context/formContext"
import { LuBriefcaseMedical } from "react-icons/lu"
import { GrUserManager } from "react-icons/gr"
import { RiPagesLine } from "react-icons/ri"
import { MdOutlinePolicy, MdOutlineMedicalInformation, MdOutlineFamilyRestroom } from "react-icons/md"
import { FaAllergies, FaBookMedical } from "react-icons/fa"
import { Input } from "@/components/ui/input"

function MedicalData() {
  const { formData, updateFormData } = useFormContext();
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const allergyOptions = ["Peanuts", "Shellfish", "Penicillin", "Latex", "Pollen", "Other"];
  const insuranceProviders = ["Aviva", "BlueCross", "Aetna", "UnitedHealth", "Other"];
  const [showAllergyDropdown, setShowAllergyDropdown] = React.useState(false);
  // Set allergies default to 'No' on mount
  React.useEffect(() => {
    if (!formData.allergies) {
      updateFormData({ allergies: "No" });
    }
  }, []);
  const [showInsuranceDropdown, setShowInsuranceDropdown] = React.useState(false);

  React.useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await require('@/lib/api').doctorApi.getAllDoctors();
        setDoctors(res.data || []);
      } catch (err) {
        setDoctors([]);
      }
    }
    fetchDoctors();
  }, []);

  // Handlers for always-visible textboxes and dropdowns
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    updateFormData({ [id]: value });
  };

  const handleAllergyDropdownSelect = (value: string) => {
    updateFormData({ allergies: value });
    setShowAllergyDropdown(false);
  };

  const handleInsuranceDropdownSelect = (value: string) => {
    updateFormData({ insuranceProvider: value });
    setShowInsuranceDropdown(false);
  };

  return (
    <section className="mt-8 md:mt-12 flex flex-col gap-4">
      <h1 className="text-lg md:text-xl flex items-center gap-2">
        <LuBriefcaseMedical /> Medical Information
      </h1>

      {/* Primary Care Physician */}
      <div>
        <label htmlFor="physician" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">Primary Care Physician:</label>
        <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
          <span className="flex items-center justify-center px-2 md:px-3 text-gray-400"><GrUserManager size={20} /></span>
          <select
            id="physician"
            value={formData.physician || ''}
            onChange={handleInputChange}
            className="w-full bg-transparent outline-none border-none text-gray-900 dark:text-gray-100 px-2 py-1"
          >
            <option value="">Select a doctor</option>
            {doctors.map((doc: any) => (
              <option key={doc._id} value={doc.fullname}>{doc.fullname}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Insurance Provider */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="w-full sm:w-1/2 relative">
          <label className="mb-1 text-gray-700 dark:text-gray-300 text-md block">Insurance Provider:</label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400"><RiPagesLine size={20} /></span>
            <Input
              id="insuranceProvider"
              type="text"
              placeholder="Type or choose provider"
              value={formData.insuranceProvider || ''}
              onFocus={() => setShowInsuranceDropdown(true)}
              onBlur={() => setTimeout(() => setShowInsuranceDropdown(false), 200)}
              onChange={handleInputChange}
            />
          </div>
          {showInsuranceDropdown && (
            <ul className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-40 overflow-y-auto">
              {insuranceProviders.map((prov) => (
                <li key={prov} className="px-3 py-2 hover:bg-blue-100 cursor-pointer" onMouseDown={() => handleInsuranceDropdownSelect(prov)}>{prov}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-full sm:w-1/2">
          <label htmlFor="policy" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">Insurance Policy:</label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400"><MdOutlinePolicy size={20} /></span>
            <Input id="policy" type="text" placeholder="ex: ADE789" value={formData.policy || ''} onChange={handleInputChange} />
          </div>
        </div>
      </div>

      {/* Allergies & Current Medications */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="w-full sm:w-1/2 relative">
          <label className="mb-1 text-gray-700 dark:text-gray-300 text-md block">Allergies (default: No):</label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400"><FaAllergies size={20} /></span>
            <Input
              id="allergies"
              type="text"
              placeholder="Type or choose allergy (leave as 'No' if none)"
              value={formData.allergies || 'No'}
              onFocus={() => setShowAllergyDropdown(true)}
              onBlur={() => setTimeout(() => setShowAllergyDropdown(false), 200)}
              onChange={handleInputChange}
            />
          </div>
          {showAllergyDropdown && (
            <ul className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-40 overflow-y-auto">
              {allergyOptions.map((opt) => (
                <li key={opt} className="px-3 py-2 hover:bg-blue-100 cursor-pointer" onMouseDown={() => handleAllergyDropdownSelect(opt)}>{opt}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-full sm:w-1/2">
          <label className="mb-1 text-gray-700 dark:text-gray-300 text-md block">Current Medications:</label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400"><MdOutlineMedicalInformation size={20} /></span>
            <Input id="medicationsDetails" type="text" placeholder="Enter your medications" value={formData.medicationsDetails || ''} onChange={handleInputChange} />
          </div>
        </div>
      </div>

      {/* Past Medical History & Family Medical History */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="w-full sm:w-1/2">
          <label className="mb-1 text-gray-700 dark:text-gray-300 text-md block">Past Medical History:</label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400"><FaBookMedical size={20} /></span>
            <Input id="historyDetails" type="text" placeholder="Type here" value={formData.historyDetails || ''} onChange={handleInputChange} />
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <label className="mb-1 text-gray-700 dark:text-gray-300 text-md block">Family Medical History:</label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400"><MdOutlineFamilyRestroom size={20} /></span>
            <Input id="familyHistoryDetails" type="text" placeholder="Type here" value={formData.familyHistoryDetails || ''} onChange={handleInputChange} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MedicalData