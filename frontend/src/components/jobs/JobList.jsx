import JobCard from "./JobCard";

function JobList({
  jobs,
  loading,
  onApply,
  applyingJobId,
  appliedJobIds = [],
}) {
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white">
        <p className="text-sm text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white px-5">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        const isApplied = appliedJobIds.includes(Number(job.id));

        return (
          <JobCard
            key={job.id}
            job={job}
            onApply={onApply}
            applying={applyingJobId === job.id}
            applied={isApplied}
          />
        );
      })}
    </div>
  );
}

export default JobList;
