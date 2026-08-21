import { Outlet } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar";

const RecruiterLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Recruiter Navigation */}
      <RecruiterNavbar />

      {/* Recruiter Page Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;
