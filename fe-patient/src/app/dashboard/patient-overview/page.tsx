// src/app/dashboard/patient-overview/page.tsx
export default function PatientOverviewPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center mb-6 p-6 bg-blue-50 rounded-lg shadow">
        <img src="/placeholder.svg" alt="Patient" className="w-32 h-32 object-cover rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-200" />
        <div>
          <p className="font-semibold text-lg mb-2">About Practice Manager</p>
          <p className="text-sm mb-2">Practice Manager is a healthcare management platform for secure appointment scheduling, patient management, and communication between doctors, patients, and administrators.</p>
          <p className="font-semibold text-lg mt-2 mb-1">About this dashboard</p>
          <p className="text-sm mb-2">This dashboard enables patients to view and schedule appointments, access their medical records, and receive notifications about changes or updates.</p>
          <div className="mt-4">
            <p className="font-semibold mb-1">How to use:</p>
            <ol className="list-decimal list-inside text-sm mb-2">
              <li>View your upcoming and past appointments in the dashboard table.</li>
              <li>Schedule a new appointment using the 'New Appointment' button.</li>
              <li>Access your medical records and personal information.</li>
              <li>Receive notifications about appointment changes or updates.</li>
            </ol>
            <p className="font-semibold mb-1">Features:</p>
            <ul className="list-disc list-inside text-sm">
              <li>View and schedule appointments</li>
              <li>Access medical records</li>
              <li>Receive notifications and updates</li>
              <li>Personal information management</li>
            </ul>
          </div>
        </div>
      </div>
     
    </div>
  );
}
