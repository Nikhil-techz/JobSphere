import { useState } from "react";
import { Outlet } from "react-router-dom";

import ApplicantSidebar from "./ApplicantSidebar";
import ApplicantNavbar from "./ApplicantNavbar";

function ApplicantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ApplicantSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ApplicantNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ApplicantLayout;
