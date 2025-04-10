"use client"

import { useState, useEffect } from "react"
import { useFormContext } from "@/context/formContext"
import { MdOutlineVerifiedUser } from "react-icons/md"
import { MdOutlineLock } from "react-icons/md"
import { Input } from "@/components/ui/input"
import { FiUpload } from "react-icons/fi"
import { Check } from "lucide-react"

function IdentificationData() {
  const { formData, updateFormData } = useFormContext()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileInfo, setFileInfo] = useState<{name: string, size: number} | null>(null)

  // Initialize states from context
  useEffect(() => {
    // Check if we have file info stored
    if (formData.documentFileName && formData.documentFileSize) {
      setFileInfo({
        name: formData.documentFileName,
        size: formData.documentFileSize
      })
    } else {
      setFileInfo(null)
    }
  }, [formData.documentFileName, formData.documentFileSize])

  // Custom checkbox component with simplified implementation
  const CustomCheckbox = ({
    id,
    checked,
    onChange,
    label,
  }: {
    id: string
    checked: boolean
    onChange: (checked: boolean) => void
    label: string
  }) => {
    return (
      <div className="flex items-start space-x-3">
        <div
          className={`h-4 w-4 shrink-0 rounded-sm border cursor-pointer ${checked ? "bg-green-500 border-green-500" : "border-gray-300"}`}
          onClick={() => onChange(!checked)}
        >
          {checked && <Check className="h-4 w-4 text-white" />}
        </div>
        <label
          htmlFor={id}
          className="text-md text-gray-700 dark:text-gray-300 leading-none cursor-pointer"
          onClick={() => onChange(!checked)}
        > 
          {label}
        </label>
      </div>
    )
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy"
    }
    setIsDragging(true)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setUploadedFile(file)
      processFile(file)
      
      // You can also trigger the file input change event if needed
      const fileInput = document.getElementById("idDocument") as HTMLInputElement
      if (fileInput) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInput.files = dataTransfer.files
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setUploadedFile(file)
      processFile(file)
    }
  }

  // Process and store file information
  const processFile = (file: File) => {
    setFileInfo({
      name: file.name,
      size: file.size
    })
    
    // Store file information in context
    updateFormData({ 
      documentFileName: file.name,
      documentFileSize: file.size,
      // We can't store the actual File object in localStorage, so we're storing metadata instead
    })
    
    // If you need to actually handle the file (upload to server, etc.)
    // you would do that here
  }

  const handleIdentificationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ identificationType: e.target.value })
  }

  // Handle checkbox changes
  const handleConsentTreatmentChange = (checked: boolean) => {
    updateFormData({ consentTreatment: checked })
  }

  const handleConsentDisclosureChange = (checked: boolean) => {
    updateFormData({ consentDisclosure: checked })
  }

  const handleAcknowledgePrivacyChange = (checked: boolean) => {
    updateFormData({ acknowledgePrivacy: checked })
  }

  return (
    <>
      {/* Identification & Verification */}
      <section className="mt-8 md:mt-12 flex flex-col gap-4">
        <h1 className="text-lg md:text-xl flex items-center gap-2">
          <MdOutlineVerifiedUser />
          Identification & Verification
        </h1>

        <div>
          <label htmlFor="idType" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Identification Type:
          </label>
          <select
            className="w-full p-3 rounded-md border border-gray-200 dark:border-zinc-800"
            value={formData.identificationType || "Licance"}
            name="identification"
            id="identification"
            onChange={handleIdentificationTypeChange}
          >
            <option className="dark:bg-[#0A0A0A]" value="Licance">
              Licance
            </option>
            <option className="dark:bg-[#0A0A0A]" value="Birth Certificate">
              Birth Certificate
            </option>
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="idDocument" className="mb-1 text-gray-700 dark:text-gray-300 text-md block">
            Upload Identification Document:
          </label>
          <div
            className={`border-2 border-dashed rounded-md p-6 mt-1 flex flex-col items-center justify-center cursor-pointer ${
              isDragging ? "bg-[#999999]/30 border-primary" : "hover:bg-[#999999]/20"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("idDocument")?.click()}
          >
            {fileInfo ? (
              <>
                <Check className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-md text-center text-gray-700">{fileInfo.name}</p>
                <p className="text-sm text-center text-gray-400 mt-1">{(fileInfo.size / 1024).toFixed(2)} KB</p>
              </>
            ) : (
              <>
                <span className="flex items-center justify-center text-gray-400 mb-2">
                  <FiUpload size={24} />
                </span>
                <p className="text-md text-center text-gray-500">
                  {isDragging ? "Drop your file here" : "Drag and drop your document here"}
                </p>
                <p className="text-sm text-center text-gray-400 mt-1">or click to browse files</p>
              </>
            )}
            <Input
              id="idDocument"
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileInputChange}
            />
          </div>
        </div>
      </section>

      {/* Consent & Privacy */}
      <section className="mt-8 md:mt-12 mb-6">
        <h1 className="text-lg md:text-xl flex items-center gap-2 mb-4">
          <MdOutlineLock />
          Consent & Privacy
        </h1>

        <div className="space-y-4 mb-6 text-md text-gray-400">
          <CustomCheckbox
            id="consent-treatment"
            checked={formData.consentTreatment || false}
            onChange={handleConsentTreatmentChange}
            label="I consent to receive treatment for my health condition."
          />

          <CustomCheckbox
            id="consent-disclosure"
            checked={formData.consentDisclosure || false}
            onChange={handleConsentDisclosureChange}
            label="I consent to the use and disclosure of my health information for treatment purposes."
          />

          <CustomCheckbox
            id="acknowledge-privacy"
            checked={formData.acknowledgePrivacy || false}
            onChange={handleAcknowledgePrivacyChange}
            label="I acknowledge that I have reviewed and agree to the privacy policy"
          />
        </div>
      </section>
    </>
  )
}

export default IdentificationData