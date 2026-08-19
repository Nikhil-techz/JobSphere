import { useState } from "react";
import { applyForJob } from "../services/api";

function useJobApplication() {
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const handleApply = async (jobId) => {
    if (applyingJobId !== null) {
      return;
    }

    // Prevent another click if already applied
    if (appliedJobIds.includes(Number(jobId))) {
      return;
    }

    try {
      setApplyingJobId(jobId);

      await applyForJob(jobId);

      // Mark job as applied only after successful API response
      setAppliedJobIds((previous) => {
        if (previous.includes(Number(jobId))) {
          return previous;
        }

        return [...previous, Number(jobId)];
      });

      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);

      const detail = error.response?.data?.detail;

      // If backend says user already applied,
      // consider this job as already applied.
      if (error.response?.status === 409) {
        setAppliedJobIds((previous) => {
          if (previous.includes(Number(jobId))) {
            return previous;
          }

          return [...previous, Number(jobId)];
        });

        alert(
          typeof detail === "string"
            ? detail
            : "You have already applied for this job."
        );
      } else if (Array.isArray(detail)) {
        const message = detail
          .map((item) =>
            typeof item === "string"
              ? item
              : item?.msg || "Unable to apply for this job."
          )
          .filter(Boolean)
          .join(", ");

        alert(message);
      } else if (typeof detail === "string") {
        alert(detail);
      } else {
        alert("Unable to apply for this job.");
      }
    } finally {
      setApplyingJobId(null);
    }
  };

  return {
    applyingJobId,
    appliedJobIds,
    handleApply,
  };
}

export default useJobApplication;
