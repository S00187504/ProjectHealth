"use client"

import React, { useState, useEffect } from 'react';
import { CalendarIcon, X, Clock } from 'lucide-react';
import { patientApi } from '@/lib/api';

interface Patient {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientEmail?: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, patientEmail }) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmailState, setPatientEmailState] = useState('');
  const [doctor, setDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState('Regular');
  const [isOnline, setIsOnline] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [fetchingPatient, setFetchingPatient] = useState(false);

  // Define resetForm function before using it in useEffect
  const resetForm = () => {
    setDate('');
    setTime('');
    setPatientName('');
    setPatientEmailState('');
    setPatientPhone('');
    setDoctor('');
    setReason('');
    setType('Regular');
    setIsOnline(false);
    setMeetingLink('');
    setNotes('');
    setFormError(null);
  };

  // Fetch patient data if patientEmail is provided
  useEffect(() => {
    const fetchPatient = async () => {
      if (patientEmail && isOpen) {
        setFetchingPatient(true);
        try {
          const response = await patientApi.getPatientByEmail(patientEmail);
          if (response && response.data) {
            const patient = response.data;
            setPatientName(patient.fullname || '');
            setPatientEmailState(patient.email || '');
            setPatientPhone(patient.phone || '');
          }
        } catch (error) {
          console.error('Failed to fetch patient data:', error);
        } finally {
          setFetchingPatient(false);
        }
      }
    };

    fetchPatient();
  }, [patientEmail, isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Default time to current
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const defaultDate = `${year}-${month}-${day}`;
      setDate(defaultDate);
      
      // Pre-fill patient email from props if available
      if (patientEmail && !patientEmailState) {
        setPatientEmailState(patientEmail);
      }
    } else {
      resetForm();
    }
  }, [isOpen, patientEmail, patientEmailState]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !patientName || !patientEmailState) {
      setFormError('Please fill out all required fields');
      return;
    }
    
    try {
      setLoading(true);
      await patientApi.createAppointment({
        patientName,
        patientEmail: patientEmailState,
        patientPhone,
        doctor,
        appointmentDate: new Date(date),
        appointmentTime: time,
        appointmentType: type,
        reason,
        notes,
        isOnline,
        meetingLink: isOnline ? meetingLink : '',
        status: 'scheduled'
      });
      
      setLoading(false);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create appointment:', error);
      setFormError('Failed to create appointment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {patientEmail ? `Schedule Appointment for ${patientName}` : 'Schedule New Appointment'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {formError && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">
              {formError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Information */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 border-b pb-1">Patient Information</h3>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient Name *
              </label>
              <input
                id="patientName"
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                required
                disabled={fetchingPatient}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient Email *
              </label>
              <input
                id="patientEmail"
                type="email"
                value={patientEmailState}
                onChange={(e) => setPatientEmailState(e.target.value)}
                placeholder="Enter patient email"
                required
                disabled={fetchingPatient || Boolean(patientEmail)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient Phone
              </label>
              <input
                id="patientPhone"
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="Enter patient phone"
                disabled={fetchingPatient}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Doctor
              </label>
              <input
                id="doctor"
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                placeholder="Assign a doctor"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Appointment Details */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 border-b pb-1">Appointment Details</h3>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Date *
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Regular">Regular Check-up</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
                <option value="Specialized">Specialized</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="isOnline"
                  type="checkbox"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isOnline" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Online Appointment
                </label>
              </div>
            </div>
            
            {isOnline && (
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meeting Link
                </label>
                <input
                  id="meetingLink"
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="Enter meeting URL"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Visit
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for appointment"
                rows={2}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes"
                rows={2}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetchingPatient}
              className="py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scheduling...' : fetchingPatient ? 'Loading Patient...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;

