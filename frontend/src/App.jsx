import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ApplicantDashboard from "./pages/applicant/ApplicantDashboard";
import ApplicantProfile from "./pages/applicant/ApplicantProfile";
import ApplicantResume from "./pages/applicant/ApplicantResume";
import MyApplications from "./pages/applicant/MyApplication";
import SavedJobs from "./pages/applicant/savedJobs";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";

import Jobs from "./pages/applicant/Findjob";

import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import ApplicantLayout from "./components/applicant/ApplicantLayout";

function App() {
  return (
    <Routes>
      {/* =========================
          Public Routes
      ========================= */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =========================
          Applicant Routes
      ========================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="applicant" />}>
          <Route element={<ApplicantLayout />}>
            {/* Applicant Dashboard */}
            <Route
              path="/applicant/dashboard"
              element={<ApplicantDashboard />}
            />

            {/* Find Jobs */}
            <Route path="/jobs" element={<Jobs />} />

            {/* My Applications */}
            <Route
              path="/applicant/applications"
              element={<MyApplications />}
            />

            {/* Saved Jobs */}
            <Route path="/applicant/saved-jobs" element={<SavedJobs />} />

            {/* Applicant Profile */}
            <Route path="/applicant/profile" element={<ApplicantProfile />} />

            {/* Applicant Resume */}
            <Route path="/applicant/resume" element={<ApplicantResume />} />
          </Route>
        </Route>
      </Route>

      {/* =========================
          Recruiter Routes
      ========================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="recruiter" />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
