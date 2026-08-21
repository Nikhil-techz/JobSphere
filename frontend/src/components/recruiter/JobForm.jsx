const JobForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  loading,
  submitText = "Save Job",
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-lg border bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Job Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Location
        </label>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Salary
        </label>

        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Experience Level
        </label>

        <input
          type="number"
          name="experience_level"
          min="0"
          value={formData.experience_level}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Skills
        </label>

        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          rows="6"
          value={formData.description}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
