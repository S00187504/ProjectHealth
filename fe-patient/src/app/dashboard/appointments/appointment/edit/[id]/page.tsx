/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CalendarIcon } from "lucide-react";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { LuSquarePen, LuChartBarIncreasing } from "react-icons/lu";
import { MdOutlineModeComment } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api, { patientApi } from "@/lib/api";
// import { ModeToggle } from "@/components/mode";
import { useAuth } from "@/context/AuthContext";

export default function EditAppointmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [doctorOptions, setDoctorOptions] = useState<{ value: string; label: string }[]>([]);
  const [appointmentData, setAppointmentData] = useState<any | null>(null);
  const [originalPatientId, setOriginalPatientId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [type, setType] = useState("Regular");
  const [isOnline, setIsOnline] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [doctor, setDoctor] = useState("");
  const [initialStartTime, setInitialStartTime] = useState<string>("");
  const [initialEndTime, setInitialEndTime] = useState<string>("");

  // Unwrap params for future Next.js compatibility
  // Next.js param migration: unwrap params if it's a promise
  // @ts-ignore
  const unwrappedParams = typeof params.then === 'function' ? React.use(params) : params;
  const appointmentId: string = (unwrappedParams as { id: string }).id;

  useEffect(() => {
    (async () => {
      try {
        const response = await patientApi.getAppointmentById(appointmentId);
        const data = response.data;
        setAppointmentData({
          fullname: data.patient?.fullname || "",
          reason: data.reason || "",
          additionalComments: data.notes || "",
        });
        setOriginalPatientId(data.patient?._id || "");
        setDate(data.appointmentDate ? data.appointmentDate.slice(0, 10) : "");
        setStartTime(data.startTime || "");
        setEndTime(data.endTime || "");
        setInitialStartTime(data.startTime || "");
        setInitialEndTime(data.endTime || "");
        setType(data.appointmentType || "Regular");
        setIsOnline(data.isOnline || false);
        setMeetingLink(data.meetingLink || "");
        setDoctor(data.doctor?._id || "");
      } catch (err) {
        setError("Failed to load appointment");
      }
      try {
        const { data } = await api.doctor.getAllDoctors();
        setDoctorOptions(
          data.map((doc: any) => ({ value: doc._id, label: doc.fullname }))
        );
      } catch (err) {
        // fallback: no doctor options
      }
    })();
  }, [appointmentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAppointmentData((prev: any) => ({ ...prev, [id]: value }));
  };

  // Converts "HH:mm" to "hh:mm AM/PM"
  function to12HourFormat(time: string) {
    if (!time) return "";
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, "0")}:${minuteStr} ${ampm}`;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!doctor) {
      setFormError("Please select a doctor.");
      return;
    }
    if (!date || !startTime || !endTime) {
      setFormError("Please choose date, start time, and end time.");
      return;
    }
    if (!user?._id || !doctor) {
      setFormError("Patient or doctor ID missing. Please log in and select a doctor.");
      return;
    }
    // Validate start time is before end time
    const start = startTime.split(":");
    const end = endTime.split(":");
    const startMinutes = parseInt(start[0], 10) * 60 + parseInt(start[1], 10);
    const endMinutes = parseInt(end[0], 10) * 60 + parseInt(end[1], 10);
    if (startMinutes >= endMinutes) {
      setFormError("Start time must be before end time.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const payload = {
        patient: originalPatientId || user?._id,
        appointmentDate: date,
        startTime: to12HourFormat(startTime),
        endTime: to12HourFormat(endTime),
        appointmentType: type,
        reason: appointmentData.reason,
        isOnline,
        notes: appointmentData.additionalComments,
        doctor,
        meetingLink: isOnline ? meetingLink : "",
      };
      console.log("Update payload:", payload);
      await patientApi.updateAppointment(appointmentId, payload);
      router.push("/dashboard/appointments");
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message;
      setError(backendMsg || "There was an error updating your appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !appointmentData) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full lg:w-1/2 p-6 md:p-12">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Edit Appointment</h1>
            {/* Removed ModeToggle */}
          </div>
          <section className="text-start w-full max-w-[600px]">
            <h2 className="text-xl mb-2">Edit your appointment details below.</h2>
            <p className="text-gray-700 mb-4 dark:text-gray-300">
              Update your appointment information and save changes.
            </p>
            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">{error}</div>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Doctor */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="doctor" className="block text-sm font-medium">Doctor</label>
                <Select
                  id="doctor"
                  options={doctorOptions}
                  value={doctorOptions.find((o) => o.value === doctor) || null}
                  onChange={(opt) => setDoctor(opt?.value || "")}
                  placeholder="Assign a doctor"
                  className="text-gray-900 dark:text-gray-100"
                  isSearchable
                  styles={{
                    control: (base) => ({ ...base, backgroundColor: "transparent", borderColor: "#d1d5db" }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
              {/* Full name */}
              <div>
                <label htmlFor="fullname" className="mb-1 text-md block">Full Name:</label>
                <div className="flex items-center border px-3 py-1  rounded-md focus-within:ring-1">
                  <LuSquarePen className="w-4 h-4 text-gray-400" />
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Enter your name"
                    value={appointmentData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium">Appointment Date *</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-md border pl-10 pr-3 py-2"
                    required
                  />
                </div>
              </div>
              {/* Start Time */}
              <div className="space-y-2">
                <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
                <div className="relative">
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-md border pr-3 py-2 pl-3" // added pl-3 for left padding
                    required
                  />
                  {initialStartTime && (
                    <div className="text-xs text-gray-500 mt-1">Original: {initialStartTime}</div>
                  )}
                </div>
              </div>
              {/* End Time */}
              <div className="space-y-2">
                <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
                <div className="relative">
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-md border pr-3 py-2 pl-3" // added pl-3 for left padding
                    required
                  />
                  {initialEndTime && (
                    <div className="text-xs text-gray-500 mt-1">Original: {initialEndTime}</div>
                  )}
                </div>
              </div>
              {/* Type */}
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium">Appointment Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="Regular">Regular Check-up</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Specialized">Specialized</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Online */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="isOnline"
                    type="checkbox"
                    checked={isOnline}
                    onChange={(e) => setIsOnline(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <label htmlFor="isOnline" className="ml-2 block text-sm">Online Appointment</label>
                </div>
              </div>
              {isOnline && (
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="meetingLink" className="block text-sm font-medium">Meeting Link</label>
                  <input
                    id="meetingLink"
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="Enter meeting URL"
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
              )}
              {/* Reason */}
              <div>
                <label htmlFor="reason" className="mb-1 text-md block">Reason for appointment:</label>
                <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1">
                  <LuChartBarIncreasing className="w-4 h-4 text-gray-400" />
                  <Input
                    id="reason"
                    type="text"
                    placeholder="Enter your reason"
                    value={appointmentData.reason}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* Additional comments */}
              <div>
                <label htmlFor="additionalComments" className="mb-1 text-md block">Additional comments:</label>
                <div className="flex items-center border px-3 py-1 rounded-md focus-within:ring-1">
                  <MdOutlineModeComment className="w-4 h-4 text-gray-400" />
                  <Input
                    id="additionalComments"
                    type="text"
                    placeholder="Enter your comments"
                    value={appointmentData.additionalComments}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {formError && (
                <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">{formError}</div>
              )}
              <Button
                type="submit"
                variant="default"
                className="w-full font-semibold py-5 sm:py-6 rounded-md mt-3"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" className="ml-2" onClick={() => router.push("/dashboard/appointments/patient")}>Cancel</Button>
            </form>
          </section>
        </section>
      </div>
      <div className="hidden md:block lg:w-1/2">
        <Image height={400} width={400} className="w-full h-screen object-cover sticky top-0" src="/doctor.jpeg" alt="Doctor" />
      </div>
    </div>
  );
}
