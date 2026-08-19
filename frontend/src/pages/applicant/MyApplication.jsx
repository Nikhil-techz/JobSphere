import ApplicationList from "../../components/applications/ApplicationList";
import useApplications from "../../hooks/useApplication";

function MyApplications() {
  const { applications, loading, error, loadApplications } = useApplications();

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          My Applications
        </h1>

        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Track the jobs you have applied for and check your application status.
        </p>
      </div>

      {/* Refresh */}
      {!loading && (
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={loadApplications}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Application List */}
      <ApplicationList
        applications={applications}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default MyApplications;
