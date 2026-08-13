import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ApplicantDashboard from "./pages/applicant/ApplicantDashboard";
import ApplicantProfile from "./pages/applicant/ApplicantProfile";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import ApplicantLayout from "./components/applicant/ApplicantLayout";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Applicant Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="applicant" />}>
          {/* Applicant Layout */}
          <Route element={<ApplicantLayout />}>
            <Route
              path="/applicant/dashboard"
              element={<ApplicantDashboard />}
            />

            <Route path="/profile" element={<ApplicantProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Recruiter Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="recruiter" />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
