// src/constants/sidebarLinks.ts
export const SIDEBAR_LINKS = {
  admin: [
  { label: 'Dashboard', href: '/dashboard/admin-overview' },
  { label: 'Patients', href: '/dashboard/patients' },
  { label: 'Doctors', href: '/dashboard/doctors' },
  { label: 'Appointments', href: '/dashboard/appointments' },
  { label: 'Doctor/Admin Info', href: '/dashboard/appointments/doctor' },
  ],
  doctor: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Patients', href: '/dashboard/patients' },
    { label: 'Appointments', href: '/dashboard/appointments' },
    { label: 'Doctor Patient Info', href: '/dashboard/appointments/doctor' },
  ],
  patient: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Appointments', href: '/dashboard/appointments' },
  { label: 'Patient Information', href: '/dashboard/patient-info' },
    // { label: 'Update Biography', href: '/dashboard/biography' },
  ],
};
