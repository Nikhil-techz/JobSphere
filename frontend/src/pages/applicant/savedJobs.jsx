import { useEffect, useState } from "react";
import { getSavedJobs } from "../../services/api";
import JobCard from "../../components/jobs/JobCard";
import useJobApplication from "../../hooks/useJobApplication";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { applyingJobId, handleApply } = useJobApplication();

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const response = await getSavedJobs();
        setSavedJobs(response || []);
      } catch (error) {
        console.error("Unable to load saved jobs:", error);
        setError("Unable to load saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-gray-600">Loading saved jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Saved Jobs
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Jobs you have saved for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white">
          <p className="text-sm text-gray-500">
            You haven't saved any jobs yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((savedJob) => (
            <JobCard
              key={savedJob.id}
              job={savedJob.job}
              onApply={handleApply}
              applying={applyingJobId === savedJob.job.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;
