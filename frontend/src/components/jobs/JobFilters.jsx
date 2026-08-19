import { SlidersHorizontal } from "lucide-react";

function JobFilters({ filters, onFiltersChange }) {
  const handleChange = (field, value) => {
    onFiltersChange({
      [field]: value,
    });
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal size={20} className="text-gray-600" />

        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Company */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Company
          </label>

          <input
            type="text"
            value={filters.company}
            onChange={(event) => handleChange("company", event.target.value)}
            placeholder="Company name"
            className="
              w-full rounded-lg border border-gray-300
              px-3 py-2.5 text-sm
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Location
          </label>

          <input
            type="text"
            value={filters.location}
            onChange={(event) => handleChange("location", event.target.value)}
            placeholder="e.g. Gurugram"
            className="
              w-full rounded-lg border border-gray-300
              px-3 py-2.5 text-sm
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </div>

        {/* Experience */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Experience
          </label>

          <select
            value={filters.experience_level}
            onChange={(event) =>
              handleChange("experience_level", event.target.value)
            }
            className="
              w-full rounded-lg border border-gray-300
              bg-white px-3 py-2.5 text-sm
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="">Any experience</option>
            <option value="0">Fresher</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5+ years</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Sort By
          </label>

          <select
            value={filters.sort}
            onChange={(event) => handleChange("sort", event.target.value)}
            className="
              w-full rounded-lg border border-gray-300
              bg-white px-3 py-2.5 text-sm
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default JobFilters;
