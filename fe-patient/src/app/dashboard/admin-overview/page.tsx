// src/app/dashboard/admin-overview/page.tsx
export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex flex-col md:flex-row items-center mb-6 p-6 bg-blue-50 rounded-lg shadow">
  <img src="/staff.avif" alt="Admin" className="w-32 h-32 object-cover rounded-full mb-4 md:mb-0 md:mr-6 border-4 border-blue-200" />
        <div>
          <p className="font-semibold text-lg mb-2">About ProjectHealth</p>
          <p className="text-sm mb-2">ProjectHealth is a healthcare management platform for secure appointment scheduling, patient management, and communication between doctors, patients, and administrators.</p>
          <p className="font-semibold text-lg mt-2 mb-1">About this dashboard</p>
          <p className="text-sm mb-2">This dashboard provides administrators with a comprehensive overview of all appointments, user management, and key performance indicators for clinic operations.</p>
          <div className="mt-4">
            <p className="font-semibold mb-1">How to use:</p>
            <ol className="list-decimal list-inside text-sm mb-2">
              <li>Monitor all appointments and their statuses in the dashboard table.</li>
              <li>Manage users (patients and doctors) from the admin panel.</li>
              <li>View KPIs and statistics for clinic performance.</li>
              <li>Access and update appointment details as needed.</li>
            </ol>
            <p className="font-semibold mb-1">Features:</p>
            <ul className="list-disc list-inside text-sm">
              <li>Comprehensive appointment management</li>
              <li>User management (patients, doctors)</li>
              <li>Dashboard KPIs and statistics</li>
              <li>Clinic performance monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
