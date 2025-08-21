import React from "react";
import moment from "moment";
import { X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
  appointmentDetails: {
    patient: any;
    date: string;
    time?: string;
    doctor?: { fullname?: string };
  };
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDelete, loading, appointmentDetails }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Permanently Delete Appointment
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-1 text-left ml-2">
          Are you sure you want to <span className="font-bold text-red-600">permanently delete</span> this appointment?
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-left ml-2">
          This action cannot be undone.
        </p>
        <div className="py-4 border-t border-b border-gray-200 dark:border-gray-700 text-left">
          <div className="mb-4">
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Patient:</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{appointmentDetails.patient.fullname}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Doctor:</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{appointmentDetails.doctor?.fullname || "N/A"}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Scheduled Date:</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{moment(appointmentDetails.date).isValid() ? moment(appointmentDetails.date).format('DD/MM/YYYY') : appointmentDetails.date}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Appointment Time:</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{appointmentDetails.time || "N/A"}</p>
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
            onClick={onDelete}
            disabled={loading}
            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Yes, Permanently Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
