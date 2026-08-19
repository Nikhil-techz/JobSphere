import { useEffect, useState } from "react";
import { getMyApplications } from "../services/api";

function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyApplications();

      console.log("My applications API response:", response);

      setApplications(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Unable to load applications:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        const message = detail
          .map((item) =>
            typeof item === "string"
              ? item
              : item?.msg || "Unable to load applications"
          )
          .filter(Boolean)
          .join(", ");

        setError(message);
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Unable to load your applications.");
      }

      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    loadApplications,
  };
}

export default useApplications;
