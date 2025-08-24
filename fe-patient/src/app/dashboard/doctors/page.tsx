'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { doctorApi } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import { toast } from "react-hot-toast";

type Doctor = {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  profilePicture?: string;
  isVerified?: boolean;
  lastLogin?: string;
  specialization?: string;
  qualifications?: string;
  biography?: string;
  address?: string;
  dob?: string;
  occupation?: string;
  physician?: string;
  insurance?: string;
  policy?: string;
  allergies?: string;
  medications?: string;
  history?: string;
  familyHistory?: string;
  identificationType?: string;
  documentFileName?: string;
  documentFileSize?: number;
  consentTreatment?: boolean;
  consentDisclosure?: boolean;
  acknowledgePrivacy?: boolean;
};

export default function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorApi.getAllDoctors();
        setDoctors(res.data);
      } catch (error) {
        console.error('Failed to load doctors:', error);
      }
    };

    if (user?.role === 'admin') {
      fetchDoctors();
    }
  }, [user]);

  if (user?.role !== 'admin') return null;

  const openModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const openDeleteModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;
    try {
      await doctorApi.deleteDoctor(selectedDoctor._id);
      setDoctors(doctors.filter((doc) => doc._id !== selectedDoctor._id));
      setShowDeleteModal(false);
      setSelectedDoctor(null);
      toast.success('Doctor permanently deleted');
    } catch (err) {
      toast.error('Failed to delete doctor');
    }
  };

  const handleVerifyDoctor = async (doctor: Doctor) => {
    try {
      await doctorApi.verifyDoctor(doctor._id);
      setDoctors(doctors.map((doc) => doc._id === doctor._id ? { ...doc, isVerified: true } : doc));
      toast.success('Doctor verified');
    } catch (err) {
      toast.error('Failed to verify doctor');
    }
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold">Doctors</h1>
        <img src="/doctor.jpeg" alt="Doctor" className="w-10 h-10 object-cover rounded-full border-2 border-blue-200" />
      </div>
      <p className="mb-4">Visible to Admin only.</p>

      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id} className="border-t">
                  <td className="p-3">{doctor.fullname}</td>
                  <td className="p-3">{doctor.email}</td>
                  <td className="p-3">{doctor.phone}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 group relative"
                        title="View Doctor"
                        onClick={() => openModal(doctor)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                        <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-blue-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">View Doctor</span>
                      </Button>
                      <button
                        onClick={() => openDeleteModal(doctor)}
                        className="h-8 w-8 p-0 text-red-700 hover:text-red-800 hover:bg-red-100 rounded-full flex items-center justify-center group relative"
                        title="Permanently Delete Doctor"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="sr-only">Delete</span>
                        <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-red-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Delete Doctor</span>
                      </button>
                    </div>
                  </td>
      {showDeleteModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Are you sure you want to permanently delete this doctor?</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded border text-sm">
              <div><span className="font-semibold">Full Name:</span> {selectedDoctor.fullname}</div>
              <div><span className="font-semibold">Email:</span> {selectedDoctor.email}</div>
              <div><span className="font-semibold">Phone:</span> {selectedDoctor.phone}</div>
              <div><span className="font-semibold">Date of Birth:</span> {selectedDoctor.dob ? new Date(selectedDoctor.dob).toLocaleDateString() : '-'}</div>
              <div><span className="font-semibold">Occupation:</span> {selectedDoctor.occupation}</div>
            </div>
            <p className="mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteDoctor}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-5 relative border-4 border-blue-200 max-h-[87.5vh] overflow-y-auto scrollbar scrollbar-thumb-blue-600 scrollbar-track-blue-200">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-3xl font-extrabold mb-8 text-blue-900 tracking-wide text-center border-b pb-4">Patient Medical Board</h2>
            <div className="space-y-8">
              {/* Personal Info */}
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-bold mb-3 text-blue-800 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
                  <div><span className="font-semibold">Full Name:</span> {selectedDoctor.fullname}</div>
                  <div><span className="font-semibold">Email:</span> {selectedDoctor.email}</div>
                  <div><span className="font-semibold">Phone:</span> {selectedDoctor.phone}</div>
                  <div><span className="font-semibold">Date of Birth:</span> {selectedDoctor.dob ? new Date(selectedDoctor.dob).toLocaleDateString() : '-'}</div>
                  <div><span className="font-semibold">Occupation:</span> {selectedDoctor.occupation}</div>
                  <div><span className="font-semibold">Address:</span> {selectedDoctor.address || '-'}</div>
                  <div><span className="font-semibold">Physician:</span> {selectedDoctor.physician || '-'}</div>
                </div>
              </div>
              {/* Medical Info */}
              <div className="bg-green-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-bold mb-3 text-green-800 border-b pb-2">Medical Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
                  <div><span className="font-semibold">Allergies:</span> {selectedDoctor.allergies || '-'}</div>
                  <div><span className="font-semibold">Medications:</span> {selectedDoctor.medications || '-'}</div>
                  <div><span className="font-semibold">History:</span> {selectedDoctor.history || '-'}</div>
                  <div><span className="font-semibold">Family History:</span> {selectedDoctor.familyHistory || '-'}</div>
                </div>
              </div>
              {/* Insurance Info */}
              <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-bold mb-3 text-yellow-800 border-b pb-2">Insurance Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
                  <div><span className="font-semibold">Insurance:</span> {selectedDoctor.insurance || '-'}</div>
                  <div><span className="font-semibold">Policy:</span> {selectedDoctor.policy || '-'}</div>
                  <div><span className="font-semibold">ID Type:</span> {selectedDoctor.identificationType || '-'}</div>
                  <div><span className="font-semibold">Document:</span> {selectedDoctor.documentFileName ? `${selectedDoctor.documentFileName} (${selectedDoctor.documentFileSize} KB)` : '-'}</div>
                </div>
              </div>
              {/* Consents */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-bold mb-3 text-gray-800 border-b pb-2">Consents</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
                  <div><span className="font-semibold">Consent to Treatment:</span> <span className={`inline-block px-2 py-1 rounded font-bold ${selectedDoctor.consentTreatment ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{selectedDoctor.consentTreatment ? 'Yes' : 'No'}</span></div>
                  <div><span className="font-semibold">Consent to Disclosure:</span> <span className={`inline-block px-2 py-1 rounded font-bold ${selectedDoctor.consentDisclosure ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{selectedDoctor.consentDisclosure ? 'Yes' : 'No'}</span></div>
                  <div><span className="font-semibold">Privacy Acknowledged:</span> <span className={`inline-block px-2 py-1 rounded font-bold ${selectedDoctor.acknowledgePrivacy ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{selectedDoctor.acknowledgePrivacy ? 'Yes' : 'No'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
