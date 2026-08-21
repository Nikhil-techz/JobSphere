import { useEffect, useState } from "react";

import {
  getCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
} from "../../services/api";

import CompanyProfileForm from "../../components/recruiter/profile/CompanyProfileForm";
import CompanyProfileView from "../../components/recruiter/profile/CompanyProfileView";

const RecruiterProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanyProfile();

      setCompany(data);
    } catch (error) {
      console.error("Error loading company profile:", error);

      if (error.response?.status === 404) {
        setCompany(null);
      } else {
        setError(
          error.response?.data?.detail || "Unable to load company profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleCreateProfile = async (formData) => {
    const data = await createCompanyProfile(formData);

    setCompany(data);

    showSuccessMessage("Company profile created successfully.");
  };

  const handleUpdateProfile = async (formData) => {
    const data = await updateCompanyProfile(formData);

    setCompany(data);
    setEditing(false);

    showSuccessMessage("Company profile updated successfully.");
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-600">Loading company profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success message */}
      {successMessage && (
        <div className="fixed right-5 top-5 z-50 rounded-md bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Create Profile */}
      {!company && (
        <CompanyProfileForm mode="create" onSubmit={handleCreateProfile} />
      )}

      {/* View Profile */}
      {company && !editing && (
        <CompanyProfileView company={company} onEdit={() => setEditing(true)} />
      )}

      {/* Edit Profile */}
      {company && editing && (
        <CompanyProfileForm
          company={company}
          mode="edit"
          onSubmit={handleUpdateProfile}
          onCancel={() => setEditing(false)}
        />
      )}
    </>
  );
};

export default RecruiterProfile;
