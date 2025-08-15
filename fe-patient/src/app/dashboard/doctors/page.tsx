'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { doctorApi } from '@/lib/api'; // adjust path if needed

type Doctor = {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  profilePicture?: string;
  isVerified?: boolean;
  lastLogin?: string;
};

export default function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
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

  const closeModal = () => {
    setSelectedDoctor(null);
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Doctors</h1>
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
                    <button
                      onClick={() => openModal(doctor)}
                      className="text-blue-600 underline hover:text-blue-800"
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

      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Doctor Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {selectedDoctor.fullname}</div>
              <div><strong>Email:</strong> {selectedDoctor.email}</div>
              <div><strong>Phone:</strong> {selectedDoctor.phone}</div>
              <div><strong>Verified:</strong> {selectedDoctor.isVerified ? 'Yes' : 'No'}</div>
              <div><strong>Last Login:</strong> {selectedDoctor.lastLogin ? new Date(selectedDoctor.lastLogin).toLocaleString() : 'N/A'}</div>
              {selectedDoctor.profilePicture && (
                <div className="col-span-2">
                  <strong>Profile Picture:</strong><br />
                  <img
                    src={selectedDoctor.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded mt-1 border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
