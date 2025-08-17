// src/app/dashboard/doctor-overview/page.tsx
export default function DoctorOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <div className="flex flex-col md:flex-row items-center mb-6 p-6 bg-blue-50 rounded-lg shadow">
        <img src="/doctor.jpeg" alt="Doctor" className="w-32 h-32 object-cover rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-200" />
        <div>
          <p className="font-semibold text-lg mb-2">About ProjectHealth</p>
          <p className="text-sm mb-2">ProjectHealth is a healthcare management platform for secure appointment scheduling, patient management, and communication between doctors, patients, and administrators.</p>
          <p className="font-semibold text-lg mt-2 mb-1">About this dashboard</p>
          <p className="text-sm mb-2">This dashboard allows doctors to view and manage their appointments, mark them as completed or no-show, and access patient details and medical records.</p>
          <div className="mt-4">
            <p className="font-semibold mb-1">How to use:</p>
            <ol className="list-decimal list-inside text-sm mb-2">
              <li>Review your upcoming appointments in the dashboard table.</li>
              <li>Click on an appointment to view patient details and medical history.</li>
              <li>Use the action buttons to mark appointments as completed or no-show.</li>
              <li>Access patient records for more information.</li>
            </ol>
            <p className="font-semibold mb-1">Features:</p>
            <ul className="list-disc list-inside text-sm">
              <li>View and manage appointments</li>
              <li>Mark appointments as completed or no-show</li>
              <li>Access patient details and medical records</li>
              <li>Dashboard KPIs and statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
