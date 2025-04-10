"use client"

import React, { useEffect, useState } from "react"
import { MdOutlinePersonOutline } from "react-icons/md"

function UserPersonal() {
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    dob: "",
    address: "",
    phone: "",
    occupation: ""
  })

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedData = localStorage.getItem('patientFormData')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData({
        fullname: parsedData.fullname || "",
        email: parsedData.email || "",
        dob: parsedData.dob || "",
        address: parsedData.address || "",
        phone: parsedData.phone || "",
        occupation: parsedData.occupation || ""
      })
    }
  }, [])

  return (
    <section className="container-fluid py-5 bg-gray-100 rounded-lg dark:bg-[#202020] my-5">
      <h1 className="text-lg md:text-xl flex items-center gap-2 font-semibold">
        <MdOutlinePersonOutline className="text-xl md:text-2xl" />
        Personal Information
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4 md:gap-6">
        <div className="w-full">
          <label htmlFor="fullname" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Full Name:
          </label>
<div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">            {userData.fullname || "Not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="email" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Email address:
          </label>
<div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">            {userData.email || "Not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="dob" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            DOB (date of birth):
          </label>
<div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">            {userData.dob || "Not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="address" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Home address:
          </label>
<div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">            {userData.address || "Not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="phone" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Phone number:
          </label>
<div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">            {userData.phone || "Not provided"}
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="occupation" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
            Occupation:
          </label>
<div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">            {userData.occupation || "Not provided"}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserPersonal