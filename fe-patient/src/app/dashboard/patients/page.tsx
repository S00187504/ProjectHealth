'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { patientApi } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Trash, Eye } from "lucide-react";
import { toast } from "react-hot-toast";

type Patient = {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  dob: string;
  occupation: string;
  address?: string;
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

type UserWithRole = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
  role?: string;
};

export default function PatientsPage() {
  const { user } = useAuth() as { user: UserWithRole | null };
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientApi.getAllPatients();
        setPatients(response.data);
      } catch (err) {
        console.error('Failed to load patients:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin' || user?.role === 'doctor') {
      fetchPatients();
    }
  }, [user]);

  if (user?.role !== 'admin' && user?.role !== 'doctor') return null;

  const openModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Patients</h1>
      <p className="mb-4">Visible to Admin and Doctors.</p>

      {loading ? (
        <p>Loading...</p>
      ) : patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">DOB</th>
                <th className="p-3">Occupation</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.fullname}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.phone}</td>
                  <td className="p-3">{new Date(p.dob).toLocaleDateString()}</td>
                  <td className="p-3">{p.occupation}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 group relative"
                        title="View Patient"
                        onClick={() => openModal(p)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                        <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-blue-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">View Patient</span>
                      </Button>
                      {user?.role === 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-700 hover:text-red-800 hover:bg-red-100 group relative"
                          title="Permanently Delete Patient"
                          onClick={() => {
                            setSelectedPatient(p);
                            setShowPermanentDeleteModal(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                          <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-red-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Delete Patient</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative border-4 border-blue-200">
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
                  <div><span className="font-semibold">Full Name:</span> {selectedPatient.fullname}</div>
                  <div><span className="font-semibold">Email:</span> {selectedPatient.email}</div>
                  <div><span className="font-semibold">Phone:</span> {selectedPatient.phone}</div>
                  <div><span className="font-semibold">Date of Birth:</span> {selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString() : '-'}</div>
                  <div><span className="font-semibold">Occupation:</span> {selectedPatient.occupation}</div>
                  <div><span className="font-semibold">Address:</span> {selectedPatient.address || '-'}</div>
                  <div><span className="font-semibold">Physician:</span> {selectedPatient.physician || '-'}</div>
                </div>
              </div>
              {/* Medical Info */}
              <div className="bg-green-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-bold mb-3 text-green-800 border-b pb-2">Medical Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
                  <div><span className="font-semibold">Allergies:</span> {selectedPatient.allergies || '-'}</div>
                  <div><span className="font-semibold">Medications:</span> {selectedPatient.medications || '-'}</div>
                  <div><span className="font-semibold">History:</span> {selectedPatient.history || '-'}</div>
                  <div><span className="font-semibold">Family History:</span> {selectedPatient.familyHistory || '-'}</div>
                </div>
              </div>
              {/* Insurance Info */}
              <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-bold mb-3 text-yellow-800 border-b pb-2">Insurance Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
                  <div><span className="font-semibold">Insurance:</span> {selectedPatient.insurance || '-'}</div>
                  <div><span className="font-semibold">Policy:</span> {selectedPatient.policy || '-'}</div>
                  <div><span className="font-semibold">ID Type:</span> {selectedPatient.identificationType || '-'}</div>
                  <div><span className="font-semibold">Document:</span> {selectedPatient.documentFileName ? `${selectedPatient.documentFileName} (${selectedPatient.documentFileSize} KB)` : '-'}</div>
                </div>
              </div>
              {/* Consents */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-bold mb-3 text-gray-800 border-b pb-2">Consents</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
                  <div><span className="font-semibold">Consent to Treatment:</span> <span className={`inline-block px-2 py-1 rounded font-bold ${selectedPatient.consentTreatment ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{selectedPatient.consentTreatment ? 'Yes' : 'No'}</span></div>
                  <div><span className="font-semibold">Consent to Disclosure:</span> <span className={`inline-block px-2 py-1 rounded font-bold ${selectedPatient.consentDisclosure ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{selectedPatient.consentDisclosure ? 'Yes' : 'No'}</span></div>
                  <div><span className="font-semibold">Privacy Acknowledged:</span> <span className={`inline-block px-2 py-1 rounded font-bold ${selectedPatient.acknowledgePrivacy ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>{selectedPatient.acknowledgePrivacy ? 'Yes' : 'No'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPermanentDeleteModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Are you sure you want to permanently delete this patient?</h3>
            <p className="mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPermanentDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    await patientApi.deletePatient(selectedPatient._id);
                    setPatients(patients.filter((pat) => pat._id !== selectedPatient._id));
                    setShowPermanentDeleteModal(false);
                    toast.success('Patient permanently deleted');
                  } catch (err) {
                    toast.error('Failed to delete patient');
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
