"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useFormContext } from "@/context/formContext"
import { LuSquarePen, LuCalendarDays } from "react-icons/lu"
import { CiMail } from "react-icons/ci"
import { AiOutlineHome } from "react-icons/ai"
import { BsTelephone } from "react-icons/bs"
import { MdSensorOccupied } from "react-icons/md"
import { MdOutlinePersonOutline } from "react-icons/md"
import { Input } from "@/components/ui/input"

function PersonalData() {
  const router = useRouter()
  const { formData, updateFormData } = useFormContext()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    updateFormData({ [id]: value })
  }

  return (
    <section className="mt-8 md:mt-12 flex flex-col gap-4">
      <h1 className="text-lg md:text-xl flex items-center gap-2">
        <MdOutlinePersonOutline />
        Personal Information
      </h1>

      <div>
        <label htmlFor="fullname" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
          Full Name:
        </label>
        <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
          <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
            <LuSquarePen size={20} />
          </span>
          <Input 
            id="fullname" 
            type="text" 
            placeholder="ex: Adam" 
            required
            value={formData.fullname || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
          Email address:
        </label>
        <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
          <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
            <CiMail size={20} />
          </span>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            required
            value={formData.email || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="w-full sm:w-1/2">
          <label htmlFor="dob" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Date of Birth:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <LuCalendarDays size={20} />
            </span>
            <Input 
              id="dob" 
              type="date" 
              value={formData.dob || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <label htmlFor="address" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Home Address:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <AiOutlineHome size={20} />
            </span>
            <Input 
              id="address" 
              type="text" 
              placeholder="Enter your address" 
              value={formData.address || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="w-full sm:w-1/2">
          <label htmlFor="phone" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Phone Number:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <BsTelephone size={20} />
            </span>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="Enter your phone number" 
              required
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <label htmlFor="occupation" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Occupation:
          </label>
          <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1 focus-within:ring-gray-50">
            <span className="flex items-center justify-center px-2 md:px-3 text-gray-400">
              <MdSensorOccupied size={20} />
            </span>
            <Input 
              id="occupation" 
              type="text" 
              placeholder="Occupation"
              value={formData.occupation || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default PersonalData