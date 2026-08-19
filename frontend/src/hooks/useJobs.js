import { useEffect, useState } from "react";
import { getJobs } from "../services/api";

function useJobs() {
  const [jobs, setJobs] = useState([]);

  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    experience_level: "",
    sort: "latest",
  });

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJobs({
          title: filters.title,
          company: filters.company,
          location: filters.location,
          experience_level:
            filters.experience_level === ""
              ? undefined
              : Number(filters.experience_level),
          sort: filters.sort,
          page,
          limit: 10,
        });

        setJobs(response.data || []);

        setPagination({
          total: response.total || 0,
          page: response.page || page,
          limit: response.limit || 10,
          total_pages: response.total_pages || 1,
        });
      } catch (error) {
        const detail = error.response?.data?.detail;

        if (Array.isArray(detail)) {
          const message = detail
            .map((item) => {
              if (typeof item === "string") {
                return item;
              }

              return item?.msg || "Invalid request";
            })
            .filter(Boolean)
            .join(", ");

          setError(message);
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Unable to load jobs.");
        }

        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [filters, page]);

  const handleSearch = (searchValue) => {
    setFilters((previous) => ({
      ...previous,
      title: searchValue,
    }));

    setPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters((previous) => ({
      ...previous,
      ...newFilters,
    }));

    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return {
    jobs,
    filters,
    pagination,
    loading,
    error,
    handleSearch,
    handleFiltersChange,
    handlePageChange,
  };
}

export default useJobs;
