function ApplicantProfileView({ profile, onEdit }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

          <p className="mt-1 text-sm text-gray-500">
            View your applicant profile information.
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <p className="text-sm text-gray-500">Full Name</p>

          <p className="mt-1 font-medium text-gray-900">{profile.full_name}</p>
        </div>

        {/* Contact */}
        <div>
          <p className="text-sm text-gray-500">Contact</p>

          <p className="mt-1 font-medium text-gray-900">{profile.contact}</p>
        </div>

        {/* Location */}
        <div>
          <p className="text-sm text-gray-500">Location</p>

          <p className="mt-1 font-medium text-gray-900">
            {profile.location || "Not provided"}
          </p>
        </div>

        {/* Experience */}
        <div>
          <p className="text-sm text-gray-500">Experience</p>

          <p className="mt-1 font-medium text-gray-900">
            {profile.experience || "Not provided"}
          </p>
        </div>

        {/* Education */}
        <div>
          <p className="text-sm text-gray-500">Education</p>

          <p className="mt-1 font-medium text-gray-900">
            {profile.education || "Not provided"}
          </p>
        </div>

        {/* LinkedIn */}
        <div>
          <p className="text-sm text-gray-500">LinkedIn</p>

          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-all font-medium text-blue-600 hover:underline"
            >
              View LinkedIn
            </a>
          ) : (
            <p className="mt-1 font-medium text-gray-900">Not provided</p>
          )}
        </div>

        {/* GitHub */}
        <div>
          <p className="text-sm text-gray-500">GitHub</p>

          {profile.github ? (
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-all font-medium text-blue-600 hover:underline"
            >
              View GitHub
            </a>
          ) : (
            <p className="mt-1 font-medium text-gray-900">Not provided</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicantProfileView;
