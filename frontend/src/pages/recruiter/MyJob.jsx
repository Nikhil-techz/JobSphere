import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyJobs, deleteJob, featureJob } from "../../services/api";

import JobCard from "../../components/recruiter/JobCard";
import DeleteJobModal from "../../components/recruiter/DeleteJobModel";

const MyJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [featureLoading, setFeatureLoading] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs();

      setJobs(data.data || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);

      setError(error?.response?.data?.detail || "Unable to load your jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Delete job
  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteJob(deleteTarget.id);

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== deleteTarget.id)
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete job:", error);

      setError(error?.response?.data?.detail || "Unable to delete the job.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Feature / Unfeature job
  const handleFeature = async (job) => {
    try {
      setFeatureLoading(job.id);

      const updatedJob = await featureJob(job.id, !job.is_featured);

      setJobs((previousJobs) =>
        previousJobs.map((item) => (item.id === job.id ? updatedJob : item))
      );
    } catch (error) {
      console.error("Failed to update featured status:", error);

      setError(
        error?.response?.data?.detail || "Unable to update featured status."
      );
    } finally {
      setFeatureLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading your jobs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the jobs you have posted.
          </p>
        </div>

        <button
          onClick={() => navigate("/recruiter/jobs/create")}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Post New Job
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}

          <button onClick={loadJobs} className="ml-3 font-medium underline">
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && jobs.length === 0 && (
        <div className="rounded-lg border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No jobs posted yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Start by posting your first job.
          </p>

          <button
            onClick={() => navigate("/recruiter/jobs/create")}
            className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Post a Job
          </button>
        </div>
      )}

      {/* Jobs */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={setDeleteTarget}
            onFeature={handleFeature}
            featureLoading={featureLoading}
          />
        ))}
      </div>

      {/* Delete confirmation */}
      <DeleteJobModal
        job={deleteTarget}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MyJobs;
