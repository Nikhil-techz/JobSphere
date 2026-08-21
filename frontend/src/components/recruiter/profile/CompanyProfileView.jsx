const CompanyProfileView = ({ company, onEdit }) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Company Profile
            </h1>

            <p className="mt-1 text-gray-600">
              Manage your company information.
            </p>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>

        {/* Company Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Company Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-5">
              {/* Logo */}
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {company.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {company.name}
                </h2>

                <p className="mt-1 text-gray-600">{company.industry}</p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="p-6">
            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                About Company
              </h3>

              <p className="leading-7 text-gray-600">{company.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Industry</p>

                <p className="mt-1 text-gray-900">{company.industry}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Company Size
                </p>

                <p className="mt-1 text-gray-900">{company.company_size}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>

                <p className="mt-1 text-gray-900">{company.location}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Website</p>

                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                ) : (
                  <p className="mt-1 text-gray-500">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileView;
