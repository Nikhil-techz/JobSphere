import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { getRecruiterDashboard } from "../../services/api";
import StatCard from "../../components/recruiter/StatCard";

const RecruiterDashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecruiterDashboard();
      setDashboard(data);
    } catch (error) {
      console.error("Failed to load recruiter dashboard:", error);

      setError(error?.response?.data?.detail || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
        {error}

        <button onClick={loadDashboard} className="ml-3 font-medium underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || "Recruiter"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your recruitment activity.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Jobs" value={dashboard.active_jobs} />

        <StatCard title="Closed Jobs" value={dashboard.closed_jobs} />

        <StatCard title="Total Applicants" value={dashboard.total_applicants} />
      </div>
    </div>
  );
};

export default RecruiterDashboard;
