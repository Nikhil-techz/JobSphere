import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getApplicantDashboard } from "../../services/api";

function ApplicantDashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getApplicantDashboard();

        setDashboard(data);
      } catch (error) {
        setError(error.response?.data?.detail || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-64 items-center justify-center px-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Welcome section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h2>

        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Find your next opportunity and manage your applications.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Applications */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Applications</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboard.total_applications}
          </h3>

          <p className="mt-2 text-sm text-gray-500">Total applications</p>
        </div>

        {/* Saved Jobs */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Saved Jobs</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboard.saved_jobs}
          </h3>

          <p className="mt-2 text-sm text-gray-500">Jobs saved</p>
        </div>

        {/* Under Review */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Under Review</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboard.under_review}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Applications under review
          </p>
        </div>

        {/* Shortlisted */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Shortlisted</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboard.shortlisted}
          </h3>

          <p className="mt-2 text-sm text-gray-500">Applications shortlisted</p>
        </div>

        {/* Rejected */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Rejected</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {dashboard.rejected}
          </h3>

          <p className="mt-2 text-sm text-gray-500">Applications rejected</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        {/* Header */}
        <div className="border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Applications
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Your latest job applications will appear here.
          </p>
        </div>

        {/* Empty state */}
        <div className="flex min-h-48 items-center justify-center px-5 py-8">
          <div className="max-w-md text-center">
            <p className="text-sm font-medium text-gray-700">
              No applications yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Start exploring jobs and apply to positions that match your
              skills.
            </p>

            <button
              type="button"
              className="
                mt-4 rounded-lg bg-blue-600 px-5 py-2.5
                text-sm font-medium text-white
                transition hover:bg-blue-700
              "
            >
              Find Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantDashboard;
