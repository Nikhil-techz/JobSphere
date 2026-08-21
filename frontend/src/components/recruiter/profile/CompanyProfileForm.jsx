import { useState } from "react";

import useCompanyProfileForm from "../../../hooks/useCompanyProfileForm";
import CompanyProfileFields from "./CompanyProfileFields";

const CompanyProfileForm = ({
  company = null,
  mode = "create",
  onSubmit,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const { formData, error, handleChange, handleSubmit } =
    useCompanyProfileForm(company);

  const isEditMode = mode === "edit";

  const submitForm = async (event) => {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    try {
      setLoading(true);

      await handleSubmit(onSubmit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Company Profile" : "Create Company Profile"}
          </h1>

          <p className="mt-2 text-gray-600">
            {isEditMode
              ? "Update your company information."
              : "Create your company profile to start hiring on JobSphere."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={submitForm}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Fields */}
          <CompanyProfileFields
            formData={formData}
            handleChange={handleChange}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            {isEditMode && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
