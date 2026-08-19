import { useEffect, useState } from "react";
import {
  createApplicantProfile,
  updateApplicantProfile,
} from "../../services/api";

function ApplicantProfileForm({
  initialProfile = null,
  onProfileCreated,
  onProfileUpdated,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    full_name: "",
    contact: "",
    location: "",
    experience: "",
    education: "",
    linkedin: "",
    github: "",
    profile_picture: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = Boolean(initialProfile);

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        full_name: initialProfile.full_name || "",
        contact: initialProfile.contact || "",
        location: initialProfile.location || "",
        experience: initialProfile.experience || "",
        education: initialProfile.education || "",
        linkedin: initialProfile.linkedin || "",
        github: initialProfile.github || "",
        profile_picture: initialProfile.profile_picture || "",
      });
    }
  }, [initialProfile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      let profile;

      if (isEditMode) {
        profile = await updateApplicantProfile(formData);

        if (onProfileUpdated) {
          onProfileUpdated(profile);
        }
      } else {
        profile = await createApplicantProfile(formData);

        if (onProfileCreated) {
          onProfileCreated(profile);
        }
      }
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .filter(Boolean)
            .join(", ")
        );
      } else {
        setError(
          detail || `Unable to ${isEditMode ? "update" : "create"} profile.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Your Profile" : "Create Your Profile"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update your applicant profile information."
                : "Complete your applicant profile."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Full Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name *
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contact *
              </label>

              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="Enter your contact number"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Experience
              </label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 2 years"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Education */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Education
              </label>

              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. MCA"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                LinkedIn
              </label>

              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                GitHub
              </label>

              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Profile Picture URL
              </label>

              <input
                type="url"
                name="profile_picture"
                value={formData.profile_picture}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? isEditMode
                    ? "Saving Changes..."
                    : "Creating Profile..."
                  : isEditMode
                  ? "Save Changes"
                  : "Create Profile"}
              </button>

              {isEditMode && onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplicantProfileForm;
