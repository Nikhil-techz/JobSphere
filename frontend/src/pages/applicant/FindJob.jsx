import JobSearchBar from "../../components/jobs/JobSearchBar";
import JobFilters from "../../components/jobs/JobFilters";
import JobList from "../../components/jobs/JobList";
import Pagination from "../../components/jobs/Pagination";

import useJobs from "../../hooks/useJobs";
import useJobApplication from "../../hooks/useJobApplication";

function Jobs() {
  const {
    jobs,
    filters,
    pagination,
    loading,
    error,
    handleSearch,
    handleFiltersChange,
    handlePageChange,
  } = useJobs();

  const { applyingJobId, appliedJobIds, handleApply } = useJobApplication();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Find Jobs
        </h1>

        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Search and find jobs that match your skills and experience.
        </p>
      </div>

      <div className="mb-5">
        <JobSearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-6">
        <JobFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {pagination.total} job
            {pagination.total === 1 ? "" : "s"} found
          </p>
        </div>
      )}

      <JobList
        jobs={jobs}
        loading={loading}
        onApply={handleApply}
        applyingJobId={applyingJobId}
        appliedJobIds={appliedJobIds}
      />

      {!loading && jobs.length > 0 && (
        <div className="mt-6 pb-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default Jobs;
