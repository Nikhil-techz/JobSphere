import { BriefcaseBusiness, MapPin, Clock } from "lucide-react";

function JobCard({ job, onApply, applying = false, applied = false }) {
  const handleApply = () => {
    if (applied || applying) {
      return;
    }

    if (typeof onApply !== "function") {
      console.error("JobCard: onApply is not a function");
      return;
    }

    onApply(job.id);
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <BriefcaseBusiness size={17} />
            <span>{job.company?.name || "Company not provided"}</span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={17} />
            <span>{job.location}</span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Clock size={17} />

            <span>
              {job.experience_level === 0
                ? "Fresher"
                : `${job.experience_level} year${
                    job.experience_level === 1 ? "" : "s"
                  } experience`}
            </span>
          </div>
        </div>

        {job.is_featured && (
          <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            Featured
          </span>
        )}
      </div>

      {job.description && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">
          {job.description}
        </p>
      )}

      {job.skills && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
            .slice(0, 5)
            .map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
              >
                {skill}
              </span>
            ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {job.salary && (
            <p className="text-sm font-medium text-gray-800">
              Salary: {job.salary}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={applying || applied}
            onClick={handleApply}
            className="
              rounded-lg bg-blue-600 px-4 py-2.5
              text-sm font-medium text-white
              transition hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {applying ? "Applying..." : applied ? "Applied" : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
