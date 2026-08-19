import ApplicationCard from "./ApplicationCard";

function ApplicationList({ applications, loading, error }) {
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white">
        <p className="text-sm text-gray-600">Loading your applications...</p>
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

  if (!applications || applications.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white px-5">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            No applications yet
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            You have not applied for any jobs yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}

export default ApplicationList;
