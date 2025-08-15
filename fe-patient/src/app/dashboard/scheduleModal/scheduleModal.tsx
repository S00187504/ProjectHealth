/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { toast } from "react-hot-toast";
import Select from "react-select";
import React, { useState, useEffect } from "react";
import { CalendarIcon, X, Clock } from "lucide-react";
import api, { patientApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientEmail?: string;
  setAppointments: (value: any) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  patientEmail,
  setAppointments,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [doctorOptions, setDoctorOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [patientOptions, setPatientOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [patient, setPatient] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmailState, setPatientEmailState] = useState("");
  const [doctor, setDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("Regular");
  const [isOnline, setIsOnline] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fetchingPatient, setFetchingPatient] = useState(false);

  // Define resetForm function before using it in useEffect
  const resetForm = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    setPatient("");
    setPatientName("");
    setPatientEmailState("");
    setPatientPhone("");
    setDoctor("");
    setReason("");
    setType("Regular");
    setIsOnline(false);
    setMeetingLink("");
    setNotes("");
    setFormError(null);
  };

  useEffect(() => {
    if (isOpen) {
      const fetchDoctors = async () => {
        try {
          const { data } = await api.doctor.getAllDoctors();
          setDoctorOptions(
            data.map((doc: any) => ({
              value: doc._id,
              label: doc.fullname,
            }))
          );
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      };
      const fetchPatients = async () => {
        const { data } = await api.patientPublic.getAllPatients();
        setPatientOptions(
          data.map((p: any) => ({
            value: p._id,
            label: `${p.fullname} (${p.email})`,
          }))
        );
      };
      fetchPatients();
      fetchDoctors();
    }
  }, [isOpen]);

  // Fetch patient data if patientEmail is provided
  useEffect(() => {
    const fetchPatient = async () => {
      if (patientEmail && isOpen) {
        setFetchingPatient(true);
        try {
          const response = await patientApi.getPatientByEmail(patientEmail);
          if (response && response.data) {
            const patient = response.data;
            setPatientName(patient.fullname || "");
            setPatientEmailState(patient.email || "");
            setPatientPhone(patient.phone || "");
          }
        } catch (error) {
          console.error("Failed to fetch patient data:", error);
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
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
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

  const toAmPm = (t24: string) => {
    if (!t24) return "";
    const [hStr, mStr] = t24.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setFormError(null);

  if (!user) {
    setFormError("Authentication required. Please log in.");
    setTimeout(() => router.push("/login"), 2000);
    return;
  }

  const selectedDoctor = user.role === "doctor" ? user._id : doctor;
  const selectedPatient = user.role === "patient" ? user._id : patient;

  if (!selectedDoctor || !selectedPatient) {
    setFormError("Doctor and patient are required.");
    return;
  }

  if (!date || !startTime || !endTime) {
    setFormError("Please provide date, start time, and end time.");
    return;
  }

  const toAmPm = (t24: string) => {
    const [hStr, mStr] = t24.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const startAmPm = toAmPm(startTime);
  const endAmPm = toAmPm(endTime);

  const toMinutes = (t: string) => {
    const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return NaN;
    let h = parseInt(match[1], 10) % 12;
    const m = parseInt(match[2], 10);
    if (match[3].toUpperCase() === "PM") h += 12;
    return h * 60 + m;
  };

  if (toMinutes(endAmPm) <= toMinutes(startAmPm)) {
    setFormError("End time must be after start time.");
    return;
  }

  // Conflict check
  try {
    const conflictRes = await patientApi.checkDoctorConflict(
      selectedDoctor,
      date,
      startAmPm,
      endAmPm
    );
    if (!conflictRes.data?.available) {
      setFormError(conflictRes.data?.message || "Doctor already booked.");
      return;
    }
  } catch (err: any) {
    if (err?.response?.status === 409) {
      setFormError(err.response.data.message || "Doctor already booked.");
    } else {
      console.error("Conflict check failed:", err);
      setFormError("Something went wrong while checking availability.");
    }
    return;
  }

  // Attempt to create appointment
  try {
    setLoading(true);

    const res = await patientApi.createAppointment({
      patient: selectedPatient,
      doctor: selectedDoctor,
      appointmentDate: new Date(date),
      startTime: startAmPm,
      endTime: endAmPm,
      appointmentType: type,
      reason,
      isOnline,
      notes,
      meetingLink: isOnline ? meetingLink : "",
      status: "scheduled",
    });

    if (res.status === 201) {
      setAppointments((prev: any) => [res.data, ...prev]);
      resetForm();
      onClose();
      // toast.success("Appointment booked successfully!");
    } else {
      console.error("Unexpected response:", res);
      setFormError("Failed to book appointment. Please try again.");
    }
  } catch (err: any) {
    console.error("API error:", err?.response || err);
    setFormError(
      err?.response?.data?.message ||
        "There was an error booking your appointment. Please try again."
    );
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {patientEmail
              ? `Schedule Appointment for ${patientName}`
              : "Schedule New Appointment"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Information */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 border-b pb-1">
                Patient Information
              </h3>
            </div>
            {user?.role !== "patient" && (
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="patient"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Patient
                </label>
                <Select
                  id="patient"
                  options={patientOptions}
                  value={
                    patientOptions.find((option) => option.value === patient) ||
                    null
                  }
                  onChange={(selectedOption) =>
                    setPatient(selectedOption?.value || "")
                  }
                  placeholder="Assign a patient"
                  className="text-gray-900 dark:text-gray-100"
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                      borderColor: "#d1d5db",
                      color: "#111827",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999, // ensures dropdown appears correctly in modal
                    }),
                  }}
                />
              </div>
            )}

            {user?.role !== "doctor" && (
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="doctor"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Doctor
                </label>
                <Select
                  id="doctor"
                  options={doctorOptions}
                  value={
                    doctorOptions.find((option) => option.value === doctor) ||
                    null
                  }
                  onChange={(selectedOption) =>
                    setDoctor(selectedOption?.value || "")
                  }
                  placeholder="Assign a doctor"
                  className="text-gray-900 dark:text-gray-100"
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                      borderColor: "#d1d5db",
                      color: "#111827",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999, // ensures dropdown appears correctly in modal
                    }),
                  }}
                />
              </div>
            )}

            {/* Appointment Details */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 border-b pb-1">
                Appointment Details
              </h3>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Start Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                End Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 pl-10 pr-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
                <option value="Other">Other</option>
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
                <label
                  htmlFor="isOnline"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Online Appointment
                </label>
              </div>
            </div>

            {isOnline && (
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="meetingLink"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
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
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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

          {formError && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">
              {formError}
            </div>
          )}

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
              {loading
                ? "Scheduling..."
                : fetchingPatient
                ? "Loading Patient..."
                : "Schedule Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
