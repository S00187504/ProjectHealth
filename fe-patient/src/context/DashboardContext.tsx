'use client';

import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { patientApi } from '@/lib/api';
import { useAuth } from './AuthContext';
import { Appointment, BackendAppointment } from '@/app/(panel)/dashboard/appointment.interface';

// Define patient interface
export interface Patient {
  _id: string;
  fullname: string;
  email: string;
  dob?: string;
  address?: string;
  phone?: string;
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
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define dashboard context type
type DashboardContextType = {
  appointments: Appointment[];
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<Appointment[]>;
  createAppointment: (appointmentData: any) => Promise<void>;
  updateAppointment: (id: string, status: string) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  fetchAllPatients: () => Promise<void>;
  fetchPatientById: (id: string) => Promise<Patient | null>;
  fetchPatientByEmail: (email: string) => Promise<Patient | null>;
  setSelectedPatient: (patient: Patient | null) => void;
};

// Create context
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Custom hook to use dashboard context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

// Provider component
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const MIN_FETCH_INTERVAL = 2000; // Minimum 2 seconds between fetches
  
  // Track patients fetch state separately
  const isFetchingPatientsRef = useRef(false);
  const lastPatientsFetchTimeRef = useRef(0);

  // Fetch all patients (admin only)
  const fetchAllPatients = async () => {
    // Remove admin check and always allow fetching patients
    // Prevent concurrent fetchAllPatients calls
    if (isFetchingPatientsRef.current) {
      console.log('Already fetching patients, skipping duplicate request');
      return;
    }

    // Add debounce to prevent rapid successive calls
    const now = Date.now();
    if (now - lastPatientsFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      console.log(`Skipping patients fetch - last fetch was less than ${MIN_FETCH_INTERVAL}ms ago`);
      return;
    }
    
    lastPatientsFetchTimeRef.current = now;
    
    try {
      isFetchingPatientsRef.current = true;
      setLoading(true);
      setError(null);
      
      const response = await patientApi.getAllPatients();
      
      if (response && response.data) {
        setPatients(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch patients:", err);
      setError(err.response?.data?.message || 'Failed to load patients. Please try again later.');
    } finally {
      setLoading(false);
      isFetchingPatientsRef.current = false;
    }
  };

  // Fetch patient by ID
  const fetchPatientById = async (id: string): Promise<Patient | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientApi.getPatientById(id);
      
      if (response && response.data) {
        setSelectedPatient(response.data);
        return response.data;
      }
      return null;
    } catch (err: any) {
      console.error("Failed to fetch patient by ID:", err);
      setError(err.response?.data?.message || 'Failed to load patient. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient by email
  const fetchPatientByEmail = async (email: string): Promise<Patient | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientApi.getPatientByEmail(email);
      
      if (response && response.data) {
        setSelectedPatient(response.data);
        return response.data;
      }
      return null;
    } catch (err: any) {
      console.error("Failed to fetch patient by email:", err);
      setError(err.response?.data?.message || 'Failed to load patient. Please try again later.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments
  const fetchAppointments = async (): Promise<Appointment[]> => {
    // Prevent concurrent fetchAppointments calls
    if (isFetchingRef.current) {
      console.log('Already fetching appointments, skipping duplicate request');
      return appointments;
    }

    // Add debounce to prevent rapid successive calls
    const now = Date.now();
    if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      console.log(`Skipping fetch - last fetch was less than ${MIN_FETCH_INTERVAL}ms ago`);
      return appointments;
    }
    
    lastFetchTimeRef.current = now;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      console.log('Fetching public appointments with axios...');
      
      // Always use the public endpoint regardless of user status
      let appointmentsData = [];
      let response = null;
      
      try {
        response = await patientApi.getPublicAppointments();
        console.log('Public API response:', response);
        appointmentsData = response?.data?.appointments || [];
        console.log(`Received ${appointmentsData.length} appointments`, appointmentsData);
      } catch (err) {
        console.error('Public fetch error:', err);
        throw err;
      }
      
      // Ensure we got data
      if (!appointmentsData || !Array.isArray(appointmentsData)) {
        console.error('Invalid appointments data format', appointmentsData);
        setError('Received invalid data format from API');
        setAppointments([]);
        return [];
      }
      
      // Map backend appointment format to frontend format
      const mappedAppointments: Appointment[] = appointmentsData.map((appt: BackendAppointment) => ({
        id: appt._id,
        patient: appt.patient?.fullname || appt.patient?.name || 'Unknown Patient',
        patientId: appt.patient?._id,
        date: appt.appointmentDate,
        time: appt.appointmentTime,
        status: appt.status,
        doctor: appt.doctor?.fullname || appt.doctor?.name || 'Unknown Doctor',
        reason: appt.reason,
        type: appt.appointmentType,
        isOnline: appt.isOnline,
        meetingLink: appt.meetingLink,
        notes: appt.notes
      }));
      
      // Update state with the new appointments
      setAppointments(mappedAppointments);
      
      // Return the mapped appointments for immediate use
      return mappedAppointments;
    } catch (err: any) {
      console.error("Failed to fetch appointments:", err);
      setError(err.response?.data?.message || 'Failed to load appointments. Please try again later.');
      setAppointments([]);
      return [];
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Create a new appointment
  const createAppointment = async (appointmentData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientApi.createAppointment(appointmentData);
      
      // Only fetch appointments if the create was successful
      if (response) {
        await fetchAppointments();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create appointment. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointment = async (id: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientApi.updateAppointment(id, { status });
      
      // Only fetch appointments if the update was successful
      if (response) {
        await fetchAppointments();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update appointment. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await patientApi.updateAppointment(id, { status: 'Cancelled' });
      
      // Only fetch appointments if the update was successful
      if (response) {
        await fetchAppointments();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel appointment. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    appointments,
    patients,
    selectedPatient,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    fetchAllPatients,
    fetchPatientById,
    fetchPatientByEmail,
    setSelectedPatient,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
} 