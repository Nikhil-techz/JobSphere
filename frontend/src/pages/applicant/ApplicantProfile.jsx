import { useEffect, useState } from "react";

import { getApplicantProfile } from "../../services/api";

import ApplicantProfileForm from "../../components/applicant/ApplicantProfileForm";

import ApplicantProfileView from "../../components/applicant/ApplicantProfileView";
function ApplicantProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getApplicantProfile();

        setProfile(data);
      } catch (error) {
        if (error.response?.status === 404) {
          // Applicant profile does not exist yet.
          setProfile(null);
        } else {
          setError(error.response?.data?.detail || "Unable to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Profile doesn't exist
  if (!profile) {
    return <ApplicantProfileForm onProfileCreated={setProfile} />;
  }

  // Profile exists
  return <ApplicantProfileView profile={profile} />;
}

export default ApplicantProfile;
