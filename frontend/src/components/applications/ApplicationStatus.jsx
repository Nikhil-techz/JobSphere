function ApplicationStatus({ status }) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-700",
    },
    reviewing: {
      label: "Under Review",
      className: "bg-blue-50 text-blue-700",
    },
    shortlisted: {
      label: "Shortlisted",
      className: "bg-green-50 text-green-700",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-700",
    },
    hired: {
      label: "Hired",
      className: "bg-emerald-50 text-emerald-700",
    },
  };

  const currentStatus = statusConfig[status] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${currentStatus.className}`}
    >
      {currentStatus.label}
    </span>
  );
}

export default ApplicationStatus;
