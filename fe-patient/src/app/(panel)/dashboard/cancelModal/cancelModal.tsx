/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { patientApi } from '@/lib/api';
import moment from 'moment';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  setAppointments: (value: any) => void;
  appointmentId: string;
  appointmentDetails: {
    patient: any;
    date: string;
  };
}

const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  appointmentDetails,
  setAppointments,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCancel = async () => {
    try {
      setLoading(true);
      const res = await patientApi.updateAppointment(appointmentId, {
        status: 'Cancelled',
      });
      console.log('res', res);
      console.log('res', res.data);
      setAppointments((prev: any) => {
        return prev.map((item: any) => {
          if (item._id === res.data._id) {
            return res.data;
          } else {
            return item;
          }
        });
      });
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Cancel Appointment
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to cancel this appointment?
        </p>

        <div className="py-4 border-t border-b border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Patient:
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {appointmentDetails.patient.fullname}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Scheduled Date:
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {moment(appointmentDetails.date).format('DD/MM/YYYY')}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
          >
            No, Keep It
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cancelling...' : 'Yes, Cancel Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
