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
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full flex items-center justify-center group relative"
                      title="View Doctor"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9S3 17 3 12 7.03 3 12 3s9 4.03 9 9z" />
                      </svg>
                      <span className="sr-only">View</span>
                      <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-blue-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">View Doctor</span>
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-8 relative border-4 border-blue-200">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center border-b pb-4">Doctor Information</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-bold mb-3 text-blue-800 border-b pb-2">Profile</h3>
                <div className="flex items-center gap-4 mb-4">
                  {selectedDoctor.profilePicture ? (
                    <img src={selectedDoctor.profilePicture} alt="Profile" className="h-16 w-16 rounded-full border" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600 border">
                      {selectedDoctor.fullname ? selectedDoctor.fullname.split(' ').map(n => n[0]).join('').toUpperCase() : ''}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-lg">{selectedDoctor.fullname}</div>
                    <div className="text-sm text-gray-500">{selectedDoctor.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-base">
                  <div><span className="font-semibold">Phone:</span> {selectedDoctor.phone}</div>
                  <div><span className="font-semibold">Verified:</span> {selectedDoctor.isVerified ? <span className="text-green-600 font-bold">Yes</span> : <span className="text-red-600 font-bold">No</span>}</div>
                  <div><span className="font-semibold">Last Login:</span> {selectedDoctor.lastLogin ? new Date(selectedDoctor.lastLogin).toLocaleString() : '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
