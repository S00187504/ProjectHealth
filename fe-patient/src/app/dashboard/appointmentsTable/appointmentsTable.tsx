"use client";

import { toast } from "react-hot-toast";
import moment from "moment";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Clock, X, Plus, Info, Ban, Trash } from "lucide-react";
import ScheduleModal from "../scheduleModal/scheduleModal";
import CancelModal from "../cancelModal/cancelModal";
import PatientDetailsModal from "../patientDetailsModal/patientDetailsModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { patientApi } from "@/lib/api";
import { Appointment } from "../appointment.interface";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface AppointmentsTableProps {
  appointments: Appointment[];
  setAppointments: (value: Appointment[]) => void;
}

const getInitials = (name: string) => {
  if (!name) return "U"; // Default for undefined
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getAvatarColor = (initials: string) => {
  const colors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

const renderStatus = (status: string) => {
  // Convert to lowercase for case-insensitive comparison
  const statusLower = status?.toLowerCase() || "";

  switch (statusLower) {
    case "scheduled":
      return (
        <div className="flex items-center text-green-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Scheduled</span>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center text-blue-500">
          <Check className="h-4 w-4 mr-1" />
          <span>Completed</span>
        </div>
      );
    case "cancelled":
    case "canceled":
      return (
        <div className="flex items-center text-red-500">
          <X className="h-4 w-4 mr-1" />
          <span>Cancelled</span>
        </div>
      );
    case "completed":
      return (
        <div className="flex items-center text-green-700">
          <Check className="h-4 w-4 mr-1 text-green-700" style={{ filter: 'brightness(0.85)' }} />
          <span className="font-semibold">Completed</span>
        </div>
      );
    case "no-show":
    case "noshow":
    case "no show":
      return (
        <div className="flex items-center text-orange-500">
          <Ban className="h-4 w-4 mr-1" />
          <span>No-Show</span>
        </div>
      );
    default:
      return <span>{status || "Unknown"}</span>;
  }
};

/**
 * Appointments Table Component
 *
 * Displays and manages appointment data in tabular format:
 * - Sortable columns for date, patient, and status
 * - Filtering by appointment status (scheduled, completed, cancelled)
 * - Action buttons for viewing details, rescheduling, and cancellation
 * - Pagination for handling large datasets
 * - Responsive design that adapts to different screen sizes
 *
 * Used primarily in the dashboard for appointment management.
 */
export default function AppointmentsTable({
  appointments,
  setAppointments,
}: AppointmentsTableProps) {
  const { user } = useAuth();
  const router = require('next/navigation').useRouter();

  function handleEditClick(appointment: Appointment) {
    router.push(`/dashboard/appointments/appointment/edit/${appointment._id}`);
  }
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] =
    useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [patientEmailForSchedule, setPatientEmailForSchedule] = useState<
    string | undefined
  >(undefined);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );

  // Debug information only
  useEffect(() => {
    console.log("Appointment data received in table:", appointments);
  }, [appointments]);

  const handleScheduleClick = () => {
    setIsScheduleModalOpen(true);
  };

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const handleDetailsClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  // Function to handle viewing patient details
  const handleViewPatientDetails = (appointment: Appointment) => {
    if (!appointment.patient._id) {
      console.error("No patient ID available for details");
      return;
    }

    setSelectedAppointment(appointment);
    setSelectedPatientId(appointment.patient._id);
    setIsPatientDetailsModalOpen(true);
  };

  // Function to schedule an appointment for a specific patient
  const handleScheduleForPatient = (email: string) => {
    setPatientEmailForSchedule(email);
    setIsScheduleModalOpen(true);
  };

  const handleModalClose = () => {
    setIsScheduleModalOpen(false);
    setIsCancelModalOpen(false);
    setSelectedAppointment(null);
    // Don't automatically fetch appointments on every modal close
    // as it can cause an infinite loop of API calls
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedAppointment(null);
  };

  // Calculate tab counts
  const pendingCount = appointments.filter(
    (apt) => apt.status.toLowerCase() === ""
  ).length;
  const scheduledCount = appointments.filter(
    (apt) => apt.status.toLowerCase() === "scheduled"
  ).length;
  const cancelledCount = appointments.filter(
    (apt) =>
      apt.status.toLowerCase() === "cancelled" ||
      apt.status.toLowerCase() === "canceled"
  ).length;

  // Filter appointments based on the selected tab
  const filteredAppointments = appointments.filter((appointment) => {
    const status = appointment.status.toLowerCase();
    switch (currentTab) {
      case "scheduled":
        return status === "scheduled";
      case "completed":
        return status === "completed";
      case "cancelled":
        return status === "cancelled" || status === "canceled";
      default:
        return true; // "all" tab
    }
  });

  // Helper function to render the appointments table
  function renderAppointmentsTable(appointments: Appointment[]) {
    if (appointments.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <p>No appointments found</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment, i) => (
              <TableRow
                key={`appointment_${i}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <TableCell className="p-2">
                  <Avatar
                    className={`h-9 w-9 ${getAvatarColor(
                      getInitials(appointment?.patient?.fullname)
                    )}`}
                  >
                    {appointment?.patient?.fullname ? (
                      <AvatarFallback>
                        {getInitials(appointment?.patient?.fullname)}
                      </AvatarFallback>
                    ) : (
                      <img
                        src="/placeholder.svg"
                        alt="User"
                        className="aspect-square size-full rounded-full"
                      />
                    )}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {appointment?.patient?.fullname || "Unknown Patient"}
                  </div>
                  {appointment.reason && (
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {appointment.reason}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {appointment.appointmentDate
                    ? moment(appointment.appointmentDate).format("DD/MM/YYYY")
                    : "No date set"}
                </TableCell>
                <TableCell>
                  {appointment.appointmentTime
                    ? appointment.appointmentTime
                    : appointment.startTime
                    ? appointment.startTime + (appointment.endTime ? ` - ${appointment.endTime}` : "")
                    : "No time set"}
                </TableCell>
                <TableCell>
                  {renderStatus(appointment.status)}
                </TableCell>
                <TableCell>
                  {appointment?.doctor?.fullname || "No doctor assigned"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {/* For others, show patient details icon. */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 group relative"
                      title="View Patient Details"
                      onClick={() => handleDetailsClick(appointment)}
                      disabled={false}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Patient Details</span>
                      <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">View Patient Details</span>
                    </Button>
                    {/* Edit, complete, revert, cancel, etc. for admin/doctor/patient */}
                    {user?.role === 'patient' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 group relative"
                          title="Edit Appointment"
                          onClick={() => handleEditClick(appointment)}
                          disabled={false}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l7-7a2.828 2.828 0 00-4-4l-7 7v3z" /></svg>
                          <span className="sr-only">Edit</span>
                          <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Edit Appointment</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Cancel Appointment"
                          onClick={async () => {
                            try {
                              const updated = { ...appointment, status: 'Cancelled' };
                              await patientApi.updateAppointment(appointment._id, {
                                status: 'Cancelled',
                              });
                              const updatedAppointments = appointments.map((apt) =>
                                apt._id === appointment._id ? updated : apt
                              );
                              setAppointments(updatedAppointments);
                              toast.success('Marked as Cancelled');
                            } catch (err) {
                              toast.error('Failed to update status');
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </>
                    )}
                    {['admin', 'doctor'].includes(user?.role || '') && (
                      <>
                        {/* Edit button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 group relative"
                          title="Edit Appointment"
                          onClick={() => handleEditClick(appointment)}
                          disabled={false}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l7-7a2.828 2.828 0 00-4-4l-7 7v3z" /></svg>
                          <span className="sr-only">Edit</span>
                          <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Edit Appointment</span>
                        </Button>
                        {/* Cancel button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Cancel Appointment"
                          onClick={async () => {
                            try {
                              const updated = { ...appointment, status: 'Cancelled' };
                              await patientApi.updateAppointment(appointment._id, {
                                status: 'Cancelled',
                              });
                              const updatedAppointments = appointments.map((apt) =>
                                apt._id === appointment._id ? updated : apt
                              );
                              setAppointments(updatedAppointments);
                              toast.success('Marked as Cancelled');
                            } catch (err) {
                              toast.error('Failed to update status');
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                        {/* Complete button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
                          title="Mark as Completed"
                          onClick={async () => {
                            try {
                              const updated = { ...appointment, status: 'Completed' };
                              await patientApi.updateAppointment(appointment._id, {
                                status: 'Completed',
                              });
                              const updatedAppointments = appointments.map((apt) =>
                                apt._id === appointment._id ? updated : apt
                              );
                              setAppointments(updatedAppointments);
                              toast.success('Marked as Completed');
                            } catch (err) {
                              toast.error('Failed to update status');
                            }
                          }}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Complete</span>
                        </Button>
                        {/* Revert button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                          title="Revert to Scheduled"
                          onClick={async () => {
                            try {
                              const updated = { ...appointment, status: 'Scheduled' };
                              await patientApi.updateAppointment(appointment._id, {
                                status: 'Scheduled',
                              });
                              const updatedAppointments = appointments.map((apt) =>
                                apt._id === appointment._id ? updated : apt
                              );
                              setAppointments(updatedAppointments);
                              toast.success('Reverted to Scheduled');
                            } catch (err) {
                              toast.error('Failed to update status');
                            }
                          }}
                        >
                          <Clock className="h-4 w-4" />
                          <span className="sr-only">Revert</span>
                        </Button>
                      </>
                    )}
                    {/* Status update icons for admin/doctor - removed duplicate permanent delete button */}
                    {['admin', 'doctor'].includes(user?.role || '') && ( 
                      <> 
                        {/* ...existing code for edit, complete, revert, cancel... */}
                        {/* Permanent delete button for admins */}
                        {user?.role === 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-700 hover:text-red-800 hover:bg-red-100 group relative"
                            title="Permanently Delete Appointment"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to permanently delete this appointment? This action cannot be undone.')) {
                                try {
                                  await patientApi.deleteAppointment(appointment._id);
                                  setAppointments(appointments.filter((apt) => apt._id !== appointment._id));
                                  toast.success('Appointment permanently deleted');
                                } catch (err) {
                                  toast.error('Failed to delete appointment');
                                }
                              }
                            }}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                            <span className="absolute left-1/2 -translate-x-1/2 mt-7 px-2 py-1 text-[9px] bg-red-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">Delete Appointment</span>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Function to handle PatientDetails component
  function PatientDetails({
    appointment,
    onClose,
  }: {
    appointment: Appointment;
    onClose: () => void;
  }) {
    const [patientData, setPatientData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    console.log("appointment", appointment);

    // Fetch patient data
    useEffect(() => {
      const fetchPatientData = async () => {
        if (!appointment.patient._id) return;

        setLoading(true);
        try {
          const response = await patientApi.getPatientById(
            appointment.patient._id
          );

          console.log("yes kh res", response);
          if (response && response.data) {
            setPatientData(response.data);
          }
        } catch (err) {
          console.error("Error fetching patient data:", err);
          setError("Failed to load patient data");
        } finally {
          setLoading(false);
        }
      };

      fetchPatientData();
    }, [appointment]);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-lg
        h-[95vh] overflow-y-scroll
        "
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Appointment Details</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {getInitials(appointment?.patient?.fullname)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg font-semibold">
                    {appointment?.patient?.fullname || "Unknown Patient"}
                  </h4>
                  <div className="text-sm text-gray-500">
                    {renderStatus(appointment.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p>
                    {moment(appointment.appointmentDate).format("DD/MM/YYYY") ||
                      "Not scheduled"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p>{appointment.appointmentTime || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p>{appointment?.doctor?.fullname || "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p>
                    {appointment.type || "Standard"}{" "}
                    {appointment.isOnline ? "(Online)" : "(In-person)"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Reason</p>
                <p className="border p-2 rounded-md mt-1 bg-gray-50 dark:bg-gray-700">
                  {appointment.reason || "No reason provided"}
                </p>
              </div>

              {appointment.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="border p-2 rounded-md mt-1 bg-gray-50 dark:bg-gray-700">
                    {appointment.notes}
                  </p>
                </div>
              )}

              {/* Patient Form Data Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Patient Form Data</h4>

                {loading && (
                  <div className="text-center py-4">
                    <p>Loading patient data...</p>
                  </div>
                )}

                {error && <div className="text-red-500 py-2">{error}</div>}

                {patientData && !loading && !error && (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {/* Personal Information */}
                    <div className="border p-3 rounded-md">
                      <h5 className="font-medium mb-2">Personal Information</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Full Name:</span>
                          <p>{patientData?.fullname || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <p>{patientData?.email || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date of Birth:</span>
                          <p>
                            {patientData.dob
                              ? new Date(patientData.dob).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <p>{patientData.phone || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Address:</span>
                          <p>{patientData.address || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Occupation:</span>
                          <p>{patientData.occupation || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="border p-3 rounded-md">
                      <h5 className="font-medium mb-2">Medical Information</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Allergies:</span>
                          <p className="border p-1 rounded bg-gray-50 dark:bg-gray-700 mt-1">
                            {patientData.allergies || "None reported"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Current Medications:
                          </span>
                          <p className="border p-1 rounded bg-gray-50 dark:bg-gray-700 mt-1">
                            {patientData.medications || "None reported"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Medical History:
                          </span>
                          <p className="border p-1 rounded bg-gray-50 dark:bg-gray-700 mt-1">
                            {patientData.history || "None reported"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Family History:</span>
                          <p className="border p-1 rounded bg-gray-50 dark:bg-gray-700 mt-1">
                            {patientData.familyHistory || "None reported"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Insurance Information */}
                    <div className="border p-3 rounded-md">
                      <h5 className="font-medium mb-2">
                        Insurance Information
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">
                            Primary Physician:
                          </span>
                          <p>{patientData.physician || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Insurance Provider:
                          </span>
                          <p>{patientData.insurance || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Policy Number:</span>
                          <p>{patientData.policy || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!patientData && !loading && !error && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No patient form data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={onClose} className="ml-2">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue="all" className="w-full">
        <div className="flex justify-between items-center px-6 pt-6">
          <h2 className="text-lg font-semibold">Appointments</h2>
          {user?.role === "patient" ? (
            <Link href="/dashboard/appointments/patient">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </Link>
          ) : (
            <Button onClick={handleScheduleClick} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          )}
        </div>
        {/* Optionally add TabsList and TabsTriggers here for navigation */}
        <div className="p-6 pt-2">
          <TabsContent value="all">
            {renderAppointmentsTable(filteredAppointments)}
          </TabsContent>
          <TabsContent value="scheduled">
            {renderAppointmentsTable(filteredAppointments.filter(apt => apt.status.toLowerCase() === "scheduled"))}
          </TabsContent>
          <TabsContent value="completed">
            {renderAppointmentsTable(filteredAppointments.filter(apt => apt.status.toLowerCase() === "completed"))}
          </TabsContent>
          <TabsContent value="cancelled">
            {renderAppointmentsTable(filteredAppointments.filter(apt => apt.status.toLowerCase() === "cancelled" || apt.status.toLowerCase() === "canceled"))}
          </TabsContent>
        </div>
      </Tabs>
      {showDetails && selectedAppointment && (
        <PatientDetails
          appointment={selectedAppointment}
          onClose={handleDetailsClose}
        />
      )}
      {/* Appointment Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={handleModalClose}
        patientEmail={patientEmailForSchedule}
        setAppointments={setAppointments}
      />

      {/* Appointment Cancel Modal */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={handleModalClose}
        appointmentId={selectedAppointment?._id || ""}
        appointmentDetails={{
          patient: selectedAppointment?.patient || "",
          date: selectedAppointment?.appointmentDate || "",
        }}
        setAppointments={setAppointments}
      />

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={isPatientDetailsModalOpen}
        onClose={() => setIsPatientDetailsModalOpen(false)}
        patientId={selectedPatientId || undefined}
      />
    </div>
  );
}
