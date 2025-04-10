"use client"
import { useEffect, useState, useCallback } from "react"
import DashboardHeader from "./dashboardHeader/dashboardHeader"
import KpiCards from "./kpiCards/kpiCards"
import AppointmentsTable from "./appointmentsTable/appointmentsTable"
import { useRouter } from "next/navigation"
import PatientDetailsModal from "./patientDetailsModal/patientDetailsModal"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { patientApi } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data without authentication
  const loadInitialData = useCallback(async () => {
    // Prevent loading if already loaded or currently loading
    if (dataLoaded || loading) return;
    
    try {
      setLoading(true);
      console.log("Dashboard mounted, loading data directly");
      
      // Load appointment data directly from the public test endpoint
      const response = await patientApi.getPublicAppointments();
      if (response && response.data && response.data.appointments) {
        // Transform backend appointments to the format expected by the components
        const formattedAppointments = response.data.appointments.map((appt: any) => {
          // Parse the appointment date if available
          let formattedDate = "No date";
          try {
            if (appt.appointmentDate) {
              const dateObj = new Date(appt.appointmentDate);
              if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString();
              }
            }
          } catch (error) {
            console.warn("Error parsing date:", error);
          }

          return {
            id: appt._id,
            patient: appt.patient?.fullname || appt.patient?.name || "Unknown Patient",
            patientId: appt.patient?._id,
            date: formattedDate,
            time: appt.appointmentTime || "No time",
            status: appt.status || "Unknown",
            doctor: appt.doctor?.fullname || appt.doctor?.name || "Unknown Doctor",
            reason: appt.reason || "",
            type: appt.appointmentType || "Standard",
            isOnline: Boolean(appt.isOnline),
            meetingLink: appt.meetingLink || "",
            notes: appt.notes || ""
          };
        });
        
        setAppointments(formattedAppointments);
        console.log(`Loaded ${formattedAppointments.length} appointments`);
      }
      
      // Mark data as loaded to prevent repeated API calls
      setDataLoaded(true);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load appointments. Please try again later.");
      // Don't set dataLoaded to true on error to allow retrying
    } finally {
      setLoading(false);
    }
  }, [dataLoaded, loading]);

  // Load data once when component mounts
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Function to manually retry loading data if needed
  const handleRetry = () => {
    console.log("Manually refreshing data...");
    setDataLoaded(false); // Reset the loaded state to trigger a new fetch
    loadInitialData(); // Force reload
  };

  return (
    <div className="container-fluid">
      <DashboardHeader />
      <main className="">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-400">
              Appointment Management System
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
            <p className="font-medium">Error Loading Data</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <p>Loading appointments...</p>
          </div>
        ) : (
          <>
            {/* Only render KpiCards if appointments array is not empty */}
            {appointments && appointments.length > 0 ? (
              <KpiCards appointments={appointments} />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 mb-6">
                <p className="font-medium">No appointments found</p>
                <p className="text-sm">There are no appointments in the system. Try refreshing the data.</p>
              </div>
            )}

            <div className="mt-10">
              <AppointmentsTable appointments={appointments || []} />
            </div>
          </>
        )}
        
        {/* Patient Details Modal */}
        <PatientDetailsModal 
          isOpen={isPatientDetailsModalOpen}
          onClose={() => setIsPatientDetailsModalOpen(false)}
        />
      </main>
    </div>
  )
}
