"use client"
import { Button } from "@/components/ui/button"
import { MdOutlineVerifiedUser, MdLogout, MdWarning, MdOutlineDescription } from "react-icons/md"
import { FiFileText } from "react-icons/fi"
import { useState, useEffect } from "react"

function UserIdentification() {
  const [userData, setUserData] = useState({
    identificationType: "",
    documentFileName: "",
    documentFileSize: 0,
    consentTreatment: false,
    consentDisclosure: false,
    acknowledgePrivacy: false
  })

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedData = localStorage.getItem('patientFormData')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData({
        identificationType: parsedData.identificationType || "",
        documentFileName: parsedData.documentFileName || "",
        documentFileSize: parsedData.documentFileSize || 0,
        consentTreatment: parsedData.consentTreatment || false,
        consentDisclosure: parsedData.consentDisclosure || false,
        acknowledgePrivacy: parsedData.acknowledgePrivacy || false
      })
    }
  }, [])

  const handleLogout = () => {
    // Implement actual logout logic here
    alert("Logging out user...")
    // For example: auth.signOut() or router.push('/login')
  }

  return (
    <main className="">
      <section className="container-fluid py-5 bg-gray-100 rounded-lg dark:bg-[#202020] my-5">
        <h1 className="text-lg md:text-xl font-medium flex items-center gap-2">
          <MdOutlineVerifiedUser className="text-primary" />
          Identification & Verification
        </h1>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10 mt-5">
          <div className="w-full md:w-1/2">
            <label htmlFor="identificationType" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
              Identification Type:
            </label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 bg-white dark:bg-[#202020]">
              {userData.identificationType || "Not provided"}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <label htmlFor="documentUpload" className="mb-1 text-gray-700 dark:text-gray-300 text-xs md:text-sm block">
              Uploaded Document:
            </label>
            {userData.documentFileName ? (
              <div className="w-full h-[180px] border border-dashed border-gray-200 dark:border-gray-600 rounded-sm flex flex-col items-center justify-center bg-white dark:bg-[#202020]">
                <FiFileText className="text-4xl text-blue-500 mb-2" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">{userData.documentFileName}</p>
                <p className="text-gray-500 text-sm mt-1">{(userData.documentFileSize / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="w-full h-[180px] border border-dashed border-gray-200 dark:border-gray-600 rounded-sm flex items-center justify-center">
                <span className="text-gray-400 text-sm">No document uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Consent Information */}
        <div className="mt-8">
          <h2 className="text-md font-medium flex items-center gap-2 mb-4">
            <MdOutlineDescription className="text-gray-600" />
            Consent Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#202020] p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-sm ${userData.consentTreatment ? "bg-green-500" : "bg-gray-300"}`}></div>
                <span className="ml-2 text-sm">Treatment Consent</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#202020] p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-sm ${userData.consentDisclosure ? "bg-green-500" : "bg-gray-300"}`}></div>
                <span className="ml-2 text-sm">Health Info Disclosure</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#202020] p-3 rounded border border-gray-200 dark:border-gray-600">
              <div className="flex items-center">
                <div className={`h-4 w-4 rounded-sm ${userData.acknowledgePrivacy ? "bg-green-500" : "bg-gray-300"}`}></div>
                <span className="ml-2 text-sm">Privacy Policy Agreement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional danger zone with logout option */}
        <div className="mt-10 pt-6">
          <div className="border border-red-500 bg-[#d45e5636] rounded-md p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <MdWarning className="h-5 w-5 text-red-600" aria-hidden="true" />
              </div>
              <div className="ml-3 w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-red-600">Security Zone</h3>
                    <p className="text-xs flex text-gray-400 mt-1">
                      Signing out will end your current session <span className="hidden md:block">and require re-authentication for future access. All
                        unsaved changes will be lost.</span>
                    </p>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    title="Sign out from your account"
                  >
                    <MdLogout />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default UserIdentification