import {
  CalendarDays,
  FileText,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
} from "lucide-react";
import ApplicationStatus from "./ApplicationStatus";

function ApplicationCard({ application }) {
  const formattedDate = application.applied_at
    ? new Date(application.applied_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date not available";

  const job = application.job;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {job?.title || "Job title not available"}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <BriefcaseBusiness size={17} />
            <span>Application #{application.id}</span>
          </div>
        </div>

        <ApplicationStatus status={application.status} />
      </div>

      {/* Job Details */}
      <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-2">
        {/* Location */}
        {job?.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={17} />
            <span>{job.location}</span>
          </div>
        )}

        {/* Salary */}
        {job?.salary && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IndianRupee size={17} />
            <span>{job.salary}</span>
          </div>
        )}

        {/* Applied Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays size={17} />
          <span>Applied: {formattedDate}</span>
        </div>

        {/* Resume */}
        {application.resume_url && (
          <a
            href={application.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            <FileText size={17} />
            View Resume
          </a>
        )}
      </div>
    </div>
  );
}

export default ApplicationCard;
