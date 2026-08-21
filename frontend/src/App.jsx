import { Routes, Route } from "react-router-dom";
import OAuthCallback from "./components/auth/OAuthCallback";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./components/auth/VerifyEmail";

// Applicant pages
import ApplicantDashboard from "./pages/applicant/ApplicantDashboard";
import ApplicantProfile from "./pages/applicant/ApplicantProfile";
import ApplicantResume from "./pages/applicant/ApplicantResume";
import MyApplications from "./pages/applicant/MyApplication";
import SavedJobs from "./pages/applicant/savedJobs";
import Jobs from "./pages/applicant/Findjob";

// Recruiter pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import PostJob from "./pages/recruiter/PostJob";
import MyJobs from "./pages/recruiter/MyJob";
import EditJob from "./pages/recruiter/EditJob";
import JobApplications from "./pages/recruiter/JobApplications";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";

// Layouts
import ApplicantLayout from "./components/applicant/ApplicantLayout";
import RecruiterLayout from "./components/recruiter/RecruiterLayout";

// Route protection
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";

function App() {
  return (
    <Routes>
      {/* 
                PUBLIC ROUTES
            */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* 
                APPLICANT ROUTES
           */}

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="applicant" />}>
          <Route element={<ApplicantLayout />}>
            <Route
              path="/applicant/dashboard"
              element={<ApplicantDashboard />}
            />

            <Route path="/jobs" element={<Jobs />} />

            <Route
              path="/applicant/applications"
              element={<MyApplications />}
            />

            <Route path="/applicant/saved-jobs" element={<SavedJobs />} />

            <Route path="/applicant/profile" element={<ApplicantProfile />} />

            <Route path="/applicant/resume" element={<ApplicantResume />} />
          </Route>
        </Route>
      </Route>

      {/* =========================
                RECRUITER ROUTES
            ========================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="recruiter" />}>
          <Route element={<RecruiterLayout />}>
            {/* Recruiter Dashboard */}
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />

            {/* My Jobs */}
            <Route path="/recruiter/jobs" element={<MyJobs />} />

            {/* Post Job */}
            <Route path="/recruiter/jobs/create" element={<PostJob />} />

            {/* Edit Job */}
            <Route path="/recruiter/jobs/edit/:jobId" element={<EditJob />} />

            {/* Job Applications */}
            <Route
              path="/recruiter/jobs/:jobId/applications"
              element={<JobApplications />}
            />

            {/* Recruiter Profile */}
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
