import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import PrescriptionView from './components/prescription/PrescriptionView';

// Layout Components
import Header from './components/layout/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// Patient Components
import PatientList from './components/patient/PatientList';
import PatientForm from './components/patient/PatientForm';
import PatientView from './components/patient/PatientView';
import PatientHistory from './components/patient/PatientHistory';

// Medicine Components
import MedicineList from './components/medicine/MedicineList';
import MedicineForm from './components/medicine/MedicineForm';

// Prescription Components
import PrescriptionList from './components/prescription/PrescriptionList';
import PrescriptionForm from './components/prescription/PrescriptionForm';
import PrescriptionPrint from './components/prescription/PrescriptionPrint';
import DoctorRegister from './components/Register-login/DoctorRegister'
import DoctorLogin from './components/Register-login/Doctor-login'
import Home from './components/Home'
import Footer from "./components/layout/Footer";
function App() {
  
const [doctor, setDoctor] = useState(localStorage.getItem("doctor") || 0);

  useEffect(() => {
    setDoctor(localStorage.getItem("doctor"));
  }, [doctor]);
  return (
   <Router>
      <div className="App">
        {doctor && <Header />}

        <main>
          <Routes>
            <Route
              path="/"
              element={doctor ? <Home /> : <DoctorLogin />}
            />

            {/* Protected routes */}
            {doctor && (
              <>
                <Route path="/patients" element={<PatientList />} />
                <Route path="/patients/add" element={<PatientForm />} />
                <Route path="/patients/edit/:id" element={<PatientForm />} />
                <Route path="/patients/view/:id" element={<PatientView />} />
                <Route path="/patients/history/:id" element={<PatientHistory />} />

                <Route path="/medicines" element={<MedicineList />} />
                <Route path="/medicines/add" element={<MedicineForm />} />
                <Route path="/medicines/edit/:id" element={<MedicineForm />} />

                <Route path="/prescriptions" element={<PrescriptionList />} />
                <Route path="/prescriptions/add" element={<PrescriptionForm />} />
                <Route path="/prescriptions/edit/:id" element={<PrescriptionForm />} />
                <Route path="/prescriptions/view/:id" element={<PrescriptionView />} />
                <Route
                  path="/prescriptions/print/:id"
                  element={<PrescriptionPrint />}
                />
              </>
            )}

            {/* Public routes */}
            <Route path="/register" element={<DoctorRegister />} />
            <Route path="/login" element={<DoctorLogin />} />
          </Routes>
        </main>

        {doctor && <Footer />}
      </div>
    </Router>
    
  );
}

export default App;

