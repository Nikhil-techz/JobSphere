const CompanyProfileFields = ({ formData, handleChange }) => {
  return (
    <>
      {/* Company Name */}
      <div className="mb-5">
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Company Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter company name"
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Company Description
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell candidates about your company"
          rows={5}
          required
          className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Website */}
      <div className="mb-5">
        <label
          htmlFor="website"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Company Website
        </label>

        <input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Industry */}
      <div className="mb-5">
        <label
          htmlFor="industry"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Industry
        </label>

        <input
          id="industry"
          name="industry"
          type="text"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g. Information Technology"
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Company Size */}
      {/* Company Size */}
      <div className="mb-5">
        <label
          htmlFor="company_size"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Company Size
        </label>

        <select
          id="company_size"
          name="company_size"
          value={formData.company_size}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Select company size</option>

          <option value="1-10">1-10 employees</option>

          <option value="11-50">11-50 employees</option>

          <option value="51-200">51-200 employees</option>

          <option value="201-500">201-500 employees</option>

          <option value="501-1000">501-1000 employees</option>

          <option value="1000+">1000+ employees</option>
        </select>
      </div>
      {/* Location */}
      <div className="mb-5">
        <label
          htmlFor="location"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Location
        </label>

        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Bangalore, India"
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Logo */}
      <div className="mb-6">
        <label
          htmlFor="logo"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Company Logo URL
        </label>

        <input
          id="logo"
          name="logo"
          type="url"
          value={formData.logo}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </>
  );
};

export default CompanyProfileFields;
