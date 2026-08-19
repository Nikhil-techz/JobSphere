import { useEffect, useState } from "react";
import { getSavedJobs, saveJob, unsaveJob } from "../services/api";

function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savingJobId, setSavingJobId] = useState(null);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(true);

  // Load saved jobs
  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        setLoadingSavedJobs(true);

        const response = await getSavedJobs();

        console.log("Saved jobs API response:", response);

        const jobs = Array.isArray(response) ? response : [];

        setSavedJobs(jobs);

        const savedIds = jobs
          .map((savedJob) => savedJob.job?.id)
          .filter((id) => id !== undefined && id !== null)
          .map(Number);

        setSavedJobIds(savedIds);
      } catch (error) {
        console.error("Unable to load saved jobs:", error);

        setSavedJobs([]);
        setSavedJobIds([]);
      } finally {
        setLoadingSavedJobs(false);
      }
    };

    loadSavedJobs();
  }, []);

  // Save job
  const handleSave = async (jobId) => {
    if (savingJobId !== null) {
      return;
    }

    try {
      setSavingJobId(jobId);

      console.log("Saving job:", jobId);

      const response = await saveJob(jobId);

      console.log("Save job response:", response);

      // Update saved job IDs
      setSavedJobIds((previous) => {
        if (previous.includes(Number(jobId))) {
          return previous;
        }

        return [...previous, Number(jobId)];
      });

      alert("Job saved successfully!");
    } catch (error) {
      console.error("Save job error:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        const message = detail
          .map((item) =>
            typeof item === "string" ? item : item?.msg || "Unable to save job"
          )
          .filter(Boolean)
          .join(", ");

        alert(message);
      } else if (typeof detail === "string") {
        alert(detail);
      } else {
        alert("Unable to save this job.");
      }
    } finally {
      setSavingJobId(null);
    }
  };

  // Unsave job
  const handleUnsave = async (jobId) => {
    if (savingJobId !== null) {
      return;
    }

    try {
      setSavingJobId(jobId);

      console.log("Unsaving job:", jobId);

      await unsaveJob(jobId);

      // Remove from saved jobs
      setSavedJobs((previous) =>
        previous.filter(
          (savedJob) => Number(savedJob.job?.id) !== Number(jobId)
        )
      );

      // Remove from saved IDs
      setSavedJobIds((previous) =>
        previous.filter((id) => id !== Number(jobId))
      );

      alert("Job removed from saved jobs.");
    } catch (error) {
      console.error("Unsave job error:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        const message = detail
          .map((item) =>
            typeof item === "string"
              ? item
              : item?.msg || "Unable to remove saved job"
          )
          .filter(Boolean)
          .join(", ");

        alert(message);
      } else if (typeof detail === "string") {
        alert(detail);
      } else {
        alert("Unable to remove this saved job.");
      }
    } finally {
      setSavingJobId(null);
    }
  };
  console.log("USE SAVED JOBS RETURN:", {
    savedJobIds,
    savingJobId,
    handleSave,
    handleUnsave,
    handleSaveType: typeof handleSave,
    handleUnsaveType: typeof handleUnsave,
  });

  return {
    savedJobs,
    savedJobIds,
    savingJobId,
    loadingSavedJobs,
    handleSave,
    handleUnsave,
  };
}

export default useSavedJobs;
