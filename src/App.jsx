import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Home from "./pages/Home.jsx";
import Layout from "./components/layout/Layout.jsx";

import PatientDashboard from "./pages/patient/Dashboard.jsx";
import PatientAppointments from "./pages/patient/Appointments.jsx";
import PatientMedicalRecords from "./pages/patient/MedicalRecords.jsx";

import DoctorDashboard from "./pages/doctor/Dashboard.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import BookAppointment from "./pages/patient/BookAppointment.jsx";
import PatientProfile from "./pages/patient/PatientProfile.jsx";
import DoctorAppointments from "./pages/doctor/Appointments.jsx";
import DoctorProfile from "./pages/doctor/DoctorProfile.jsx";
import DoctorMedicalRecords from "./pages/doctor/MedicalRecords.jsx";
import DoctorAvailability from "./pages/doctor/Availability.jsx";
import ManageDoctors from "./pages/admin/ManageDoctors.jsx";
import ManageAppointments from "./pages/admin/Appointments.jsx";
import ManagePatients from "./pages/admin/ManagePatients.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
          } />
        <Route path="/register" element={
          <PublicRoute>
          <Register />
          </PublicRoute>
          } />
        <Route path="/unauthorized" element={<Unauthorized/>} />

        {/* Patient Routes */}
        <Route path="/patient" element={
          <ProtectedRoute requirRole="patient">
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="medical-records" element={<PatientMedicalRecords />} />
          <Route path="book-appointment" element={<BookAppointment/>} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={
          <ProtectedRoute requirRole="doctor">
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="availability" element={<DoctorAvailability />} />
          <Route path="medical-records" element={<DoctorMedicalRecords />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requirRole="admin">
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<ManageDoctors/>} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="appointments" element={<ManageAppointments />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;