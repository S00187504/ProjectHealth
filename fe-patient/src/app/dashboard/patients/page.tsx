'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { patientApi } from '@/lib/api'; // adjust import path

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
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // ...existing code...

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
                    <button
                      onClick={() => openModal(p)}
                      className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(selectedPatient).map(([key, value]) => {
                if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return null;
                return (
                  <div key={key}>
                    <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                    <span>
                      {typeof value === 'boolean'
                        ? value
                          ? 'Yes'
                          : 'No'
                        : key === 'dob' && value
                        ? new Date(value as string).toLocaleDateString()
                        : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* ...existing code... */}
    </div>
  );
}
