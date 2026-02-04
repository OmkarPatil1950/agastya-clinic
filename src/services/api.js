import axios from 'axios';

// const resolveApiBase = () => {
//   if (typeof window !== 'undefined') {
//     const host = window.location.hostname;
//     if (host.endsWith('vercel.app')) return '/api';
//   }
//   const envUrl = process.env.REACT_APP_API_URL;
//   if (envUrl) return envUrl;
//   return process.env.NODE_ENV = 'https://agastya-clinic-1-0-0.onrender.com/api';
// };
// const API_URL = resolveApiBase();

const apiClient = axios.create({
  baseURL: "https://agastya-clinic-1-0-0.onrender.com/api",
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

const api = {
  // Patient APIs
  getAllPatients: () => apiClient.get('/patients'),
  getPatientById: (id) => apiClient.get(`/patients/${id}`),
  createPatient: (patient) => apiClient.post('/patients', patient),
  updatePatient: (id, patient) => apiClient.put(`/patients/${id}`, patient),
  deletePatient: (id) => apiClient.delete(`/patients/${id}`),

  // Medicine APIs
  getAllMedicines: () => apiClient.get('/medicines'),
  getMedicineById: (id) => apiClient.get(`/medicines/${id}`),
  createMedicine: (medicine) => apiClient.post('/medicines', medicine),
  updateMedicine: (id, medicine) => apiClient.put(`/medicines/${id}`, medicine),
  deleteMedicine: (id) => apiClient.delete(`/medicines/${id}`),
  getActiveMedicines: () => apiClient.get('/medicines/active'),

  // Prescription APIs
  getAllPrescriptions: () => apiClient.get('/prescriptions'),
  getPrescriptionById: (id) => apiClient.get(`/prescriptions/api/${id}`),
  createPrescription: (prescription) => apiClient.post('/prescriptions', prescription),
  updatePrescription: (id, prescription) => apiClient.put(`/prescriptions/${id}`, prescription),
  deletePrescription: (id) => apiClient.delete(`/prescriptions/${id}`),
  getPrescriptionsByPatientId: (patientId) => apiClient.get(`/prescriptions/patient/${patientId}`),
  searchPrescriptionsByDateRange: (startDate, endDate) => apiClient.get('/prescriptions/search/date-range', { params: { startDate, endDate } }),
  searchPrescriptionsByPatientAndDateRange: (patientId, startDate, endDate) => apiClient.get(`/prescriptions/search/patient/${patientId}/date-range`, { params: { startDate, endDate } }),
  getPrescriptionsOlderThanYears: (patientId, years) => apiClient.get(`/prescriptions/search/patient/${patientId}/older-than/${years}`),
  // Add to your api.js
createDoctor: (doctor) => apiClient.post("/doctor/register", doctor),
doctorLogin: (doctor) => apiClient.post("/doctor/login", doctor),
getById: (id) => apiClient.get(`/doctor/find/${id}`),
updateDoctor: (id,doctor) => apiClient.put(`/doctor/${id}`, doctor),
resetPassword: (data) => apiClient.put("/doctor/update-password", data),
getPatientDocById: (id) => apiClient.get(`/patients/getBydocId/${id}`),

};

export default api;
