import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getJobApplications,
  updateApplicationStatus,
} from "../../services/api";

import ApplicationCard from "../../components/recruiter/ApplicationCard";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Load applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobApplications(jobId);

      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);

      setError(error?.response?.data?.detail || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  // Update application status
  const handleStatusChange = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      const updatedApplication = await updateApplicationStatus(
        applicationId,
        status
      );

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.application_id === applicationId
            ? {
                ...application,
                status: updatedApplication.status,
              }
            : application
        )
      );
    } catch (error) {
      console.error("Failed to update application:", error);

      setError(
        error?.response?.data?.detail || "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>

          <p className="mt-1 text-sm text-gray-500">
            Review applicants for this job.
          </p>
        </div>

        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to My Jobs
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!error && applications.length === 0 && (
        <div className="rounded-lg border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No applications yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            No applicants have applied for this job yet.
          </p>
        </div>
      )}

      {/* Applications */}
      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard
            key={application.application_id}
            application={application}
            onStatusChange={handleStatusChange}
            updating={updatingId === application.application_id}
          />
        ))}
      </div>
    </div>
  );
};

export default JobApplications;
