import api from './axios';

// Auth API services
export const authApi = {
  // Login user
  login: async (email: string, password: string) => {
    return api.post('/users/login', { email, password });
  },
  
  // Register new user
  register: async (userData: { 
    name: string, 
    email: string, 
    password: string,
    phone: string 
  }) => {
    return api.post('/users', userData);
  },
  
  // Get current user profile
  getProfile: async () => {
    return api.get('/users/profile');
  }
};

// Patient API services
export const patientApi = {
  // Get patient appointments
  getAppointments: async () => {
    return api.get('/appointments');
  },
  
  // Get my appointments (for regular users)
  getMyAppointments: async () => {
    return api.get('/appointments/myappointments');
  },

  // Get public appointments (for testing)
  getPublicAppointments: async () => {
    return api.get('/appointments/test');
  },
  
  // Create a new appointment
  createAppointment: async (appointmentData: any) => {
    return api.post('/appointments', appointmentData);
  },
  
  // Update an appointment
  updateAppointment: async (id: string, updateData: any) => {
    return api.put(`/appointments/${id}`, updateData);
  },
  
  // Delete an appointment
  deleteAppointment: async (id: string) => {
    return api.delete(`/appointments/${id}`);
  },
  
  // Get all patients (admin only)
  getAllPatients: async () => {
    return api.get('/patients');
  },
  
  // Get patient by ID
  getPatientById: async (id: string) => {
    return api.get(`/patients/${id}`);
  },
  
  // Get patient by email
  getPatientByEmail: async (email: string) => {
    return api.get(`/patients/email/${email}`);
  },

  // Get patient form data
  getPatientFormData: async (patientId: string) => {
    return api.get(`/patients/${patientId}/form-data`);
  }
};

// Export all API services
export default {
  auth: authApi,
  patient: patientApi
}; 