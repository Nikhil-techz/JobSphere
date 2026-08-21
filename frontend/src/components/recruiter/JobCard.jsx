import { useNavigate } from "react-router-dom";

const JobCard = ({ job, onDelete, onFeature, featureLoading }) => {
  const navigate = useNavigate();

  const isFeatured = job.is_featured;

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>

          <p className="mt-1 text-sm text-gray-500">{job.location}</p>
        </div>

        {isFeatured && (
          <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
            ⭐ Featured
          </span>
        )}
      </div>

      {/* Job Information */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Salary: {job.salary}</span>

        <span>Experience: {job.experience_level} years</span>

        <span>Skills: {job.skills}</span>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-2 text-sm text-gray-600">
        {job.description}
      </p>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
        {/* Edit */}
        <button
          type="button"
          onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>

        {/* Applications */}
        <button
          type="button"
          onClick={() => navigate(`/recruiter/jobs/${job.id}/applications`)}
          className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          Applications
        </button>

        {/* Feature / Unfeature */}
        <button
          type="button"
          onClick={() => onFeature(job)}
          disabled={featureLoading === job.id}
          className="rounded-md border border-yellow-300 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50 disabled:opacity-50"
        >
          {featureLoading === job.id
            ? "Updating..."
            : isFeatured
            ? "Unfeature"
            : "Feature"}
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(job)}
          className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
