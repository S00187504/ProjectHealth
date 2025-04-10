export interface Appointment {
    id: string
    patient: string
    date: string
    time?: string
    status: string
    doctor: string
    reason?: string
    type?: string
    isOnline?: boolean
    meetingLink?: string
    notes?: string
    patientId?: string
  }
  
  export interface BackendAppointment {
    _id: string
    patient: {
      _id: string
      fullname?: string
      name?: string
      email?: string
      phone?: string
    }
    appointmentDate: string
    appointmentTime: string
    appointmentType: string
    reason: string
    status: string
    notes: string
    isOnline: boolean
    meetingLink: string
    doctor: {
      _id: string
      fullname?: string
      name?: string
      email?: string
    }
  }
  
  