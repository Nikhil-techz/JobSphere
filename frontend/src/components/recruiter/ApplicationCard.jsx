const ApplicationCard = ({ application, onStatusChange, updating }) => {
  const {
    application_id,
    applicant_name,
    applicant_email,
    status,
    applied_at,
    resume_url,
  } = application;

  const formattedDate = new Date(applied_at).toLocaleDateString();

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      {/* Applicant information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {applicant_name}
        </h2>

        <p className="mt-1 text-sm text-gray-500">{applicant_email}</p>

        <p className="mt-2 text-sm text-gray-500">
          Applied on: {formattedDate}
        </p>
      </div>

      {/* Resume */}
      <div className="mt-4">
        <a
          href={resume_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View Resume
        </a>
      </div>

      {/* Status */}
      <div className="mt-4 flex items-center gap-3">
        <label
          htmlFor={`status-${application_id}`}
          className="text-sm font-medium text-gray-700"
        >
          Status:
        </label>

        <select
          id={`status-${application_id}`}
          value={status}
          disabled={updating}
          onChange={(event) =>
            onStatusChange(application_id, event.target.value)
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="pending">Pending</option>

          <option value="shortlisted">Shortlisted</option>

          <option value="hired">hired</option>

          <option value="rejected">Rejected</option>
        </select>

        {updating && <span className="text-sm text-gray-500">Updating...</span>}
      </div>
    </div>
  );
};

export default ApplicationCard;
