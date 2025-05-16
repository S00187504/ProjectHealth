/**
 * Submission Confirmation Page
 * 
 * Displays after successful form submission (appointment booking or patient registration).
 * Features:
 * - Success message with confirmation details
 * - Navigation options to return to dashboard or make another appointment
 * - Animated success indicator for visual feedback
 * 
 * This page serves as a final step in form submission workflows.
 */
"use client"
import React, { useEffect, useState } from 'react'
import { GoVerified } from "react-icons/go";
import { MdLogout } from "react-icons/md"; // Import logout icon
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { patientApi } from '@/lib/api';
import { Appointment } from '../dashboard/appointment.interface';
import { ModeToggle } from '@/components/mode'; // Import the ModeToggle component

function Submitted() {
  const { user, logout } = useAuth(); // Get logout function from AuthContext
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect admin users to the dashboard
    if (user && user.isAdmin) {
      router.push('/dashboard');
      return;
    }

    // Fetch user's appointments if they are logged in
    if (user && !user.isAdmin) {
      fetchMyAppointments();
    }
  }, [user, router]);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const response = await patientApi.getMyAppointments();
      
      // Transform the backend data to match our frontend interface
      const formattedAppointments = response.data.map((apt: any) => ({
        id: apt._id,
        patient: apt.patient?.name || user?.name || "You",
        date: new Date(apt.appointmentDate).toLocaleDateString(),
        status: apt.status.toLowerCase(),
        doctor: apt.doctor?.name || "Unassigned",
        reason: apt.reason
      }));
      
      setAppointments(formattedAppointments);
    } catch (err: any) {
      console.error("Failed to fetch appointments:", err);
      setError(err.response?.data?.message || "Failed to load your appointments");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container-fluid text-center py-10">
        <h1 className="text-xl font-semibold mb-4">Please log in</h1>
        <p>You need to be logged in to view your appointments.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen px-6 py-10'>
      {/* Header with logout button and theme toggle */}
      <div className="flex justify-between items-center mb-6">
        <ModeToggle />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="flex items-center gap-2"
        >
          <MdLogout className="w-4 h-4" />
          Logout
        </Button>
      </div>
      
      <div className='flex flex-col gap-5 items-center text-center mb-10'>
        <GoVerified className='text-green-400' size={60} />
        <h1 className='text-3xl px-4 text-gray-700 dark:text-gray-300'>Your appointment request has been<br /><span className='text-green-400'>successfully submitted.</span></h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm'>We'll get in touch soon to confirm your appointment details.</p>
      </div>
      
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-2xl font-semibold mb-4'>Your Appointments</h2>
        
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-6">
            <p>Loading your appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Doctor</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b dark:border-gray-700">
                    <td className="py-3 px-4">{appointment.date}</td>
                    <td className="py-3 px-4">{appointment.doctor}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{appointment.reason || 'Not specified'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p>You don't have any appointments yet.</p>
          </div>
        )}

        <div className='flex flex-col md:flex-row gap-4 mt-6 justify-center'>
          <Link href="/patient" className=''>
            <Button variant="default" className="w-full">
              Book New Appointment
            </Button>
          </Link>
          
          <Link href="/" className=''>
            <Button variant="outline" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Submitted
