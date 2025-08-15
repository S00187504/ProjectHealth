/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CalendarIcon, Clock } from "lucide-react";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { LuSquarePen, LuChartBarIncreasing } from "react-icons/lu";
import { MdOutlineModeComment } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFormContext } from "@/context/formContext";
import { useAuth } from "@/context/AuthContext";
import api, { patientApi } from "@/lib/api";
import { ModeToggle } from "@/components/mode";

// 24h "HH:MM" -> "h:MM AM/PM"
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

function AppointmentPage() {
  const router = useRouter();
  const { formData } = useFormContext();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [appointmentData, setAppointmentData] = useState({
    fullname: formData.fullname || "",
    reason: "",
    additionalComments: "",
  });

  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>(""); // "HH:MM"
  const [endTime, setEndTime] = useState<string>(""); // "HH:MM"
  const [type, setType] = useState("Regular");
  const [isOnline, setIsOnline] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctorOptions, setDoctorOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.doctor.getAllDoctors();
        setDoctorOptions(
          data.map((doc: any) => ({ value: doc._id, label: doc.fullname }))
        );
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!user) {
      setError("Authentication required. Please log in to book an appointment.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    if (!doctor) {
      setFormError("Please select a doctor.");
      return;
    }
    if (!date || !startTime || !endTime) {
      setFormError("Please choose date, start time, and end time.");
      return;
    }

    // Convert to API format
    const startAmPm = toAmPm(startTime);
    const endAmPm = toAmPm(endTime);

    // Quick client-side range check
    if (startAmPm === endAmPm) {
      setFormError("Start and end time cannot be the same.");
      return;
    }
    // (Optional) stricter check by minutes:
    const toMinutes = (t: string) => {
      const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!m) return NaN;
      let h = parseInt(m[1], 10) % 12;
      const mm = parseInt(m[2], 10);
      if (m[3].toUpperCase() === "PM") h += 12;
      return h * 60 + mm;
    };
    if (toMinutes(endAmPm) <= toMinutes(startAmPm)) {
      setFormError("End time must be after start time.");
      return;
    }

    // Conflict check
    try {
      const doctorId = user?.role === "doctor" ? user._id : doctor;
      const res = await patientApi.checkDoctorConflict(
        doctorId,
        date,
        startAmPm,
        endAmPm
      );
      if (!res.data?.available) {
        setFormError(res.data?.message || "Doctor already booked.");
        return;
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setFormError(err.response.data.message || "Doctor already booked.");
        return;
      }
      console.error("Unexpected error checking conflict:", err);
      setFormError("Something went wrong while checking availability.");
      return;
    }

    // Create appointment
    try {
      setLoading(true);
      setError(null);

      await patientApi.createAppointment({
        patient: user._id,
        appointmentDate: new Date(date),
        startTime: startAmPm,
        endTime: endAmPm,
        appointmentType: type,
        reason: appointmentData.reason,
        isOnline,
        notes: appointmentData.additionalComments,
        doctor,
        meetingLink: isOnline ? meetingLink : "",
      });

      router.push("/dashboard/appointments");
    } catch (err) {
      console.error("Failed to book appointment:", err);
      setError("There was an error booking your appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full lg:w-1/2 p-6 md:p-12">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Schedule Appointment</h1>
            <ModeToggle />
          </div>

          <section className="text-start w-full max-w-[600px]">
            <h2 className="text-xl mb-2">Hello!!</h2>
            <p className="text-gray-700 mb-4 dark:text-gray-300">
              Get started with Appointments.
            </p>

            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Doctor */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="doctor" className="block text-sm font-medium">
                  Doctor
                </label>
                <Select
                  id="doctor"
                  options={doctorOptions}
                  value={doctorOptions.find((o) => o.value === doctor) || null}
                  onChange={(opt) => setDoctor(opt?.value || "")}
                  placeholder="Assign a doctor"
                  className="text-gray-900 dark:text-gray-100"
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                      borderColor: "#d1d5db",
                    }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>

              {/* Full name */}
              <div>
                <label htmlFor="fullname" className="mb-1 text-md block">
                  Full Name:
                </label>
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
                <label htmlFor="date" className="block text-sm font-medium">
                  Appointment Date *
                </label>
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
                <label htmlFor="startTime" className="block text-sm font-medium">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-md border pl-10 pr-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label htmlFor="endTime" className="block text-sm font-medium">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-md border pl-10 pr-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium">
                  Appointment Type
                </label>
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
                  <label htmlFor="isOnline" className="ml-2 block text-sm">
                    Online Appointment
                  </label>
                </div>
              </div>

              {isOnline && (
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="meetingLink" className="block text-sm font-medium">
                    Meeting Link
                  </label>
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
                <label htmlFor="reason" className="mb-1 text-md block">
                  Reason for appointment:
                </label>
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
                <label htmlFor="additionalComments" className="mb-1 text-md block">
                  Additional comments:
                </label>
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
                <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">
                  {formError}
                </div>
              )}

              <Button
                type="submit"
                variant="default"
                className="w-full font-semibold py-5 sm:py-6 rounded-md mt-3"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit and Continue"}
              </Button>
            </form>
          </section>
        </section>
      </div>

      <div className="hidden md:block lg:w-1/2">
        <Image
          height={400}
          width={400}
          className="w-full h-screen object-cover sticky top-0"
          src="/doctor.jpeg"
          alt="Doctor"
        />
      </div>
    </div>
  );
}

export default AppointmentPage;
