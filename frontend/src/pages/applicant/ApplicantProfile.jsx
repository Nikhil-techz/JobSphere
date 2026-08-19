import { useEffect, useState } from "react";

import { getApplicantProfile } from "../../services/api";

import ApplicantProfileForm from "../../components/applicant/ApplicantProfileForm";
import ApplicantProfileView from "../../components/applicant/ApplicantProfileView";

function ApplicantProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
          const detail = error.response?.data?.detail;

          if (Array.isArray(detail)) {
            setError(detail.map((item) => item.msg).join(", "));
          } else {
            setError(detail || "Unable to load profile.");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center px-4">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-64 items-center justify-center px-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Profile does not exist
  if (!profile) {
    return (
      <ApplicantProfileForm
        onProfileCreated={(createdProfile) => {
          setProfile(createdProfile);
        }}
      />
    );
  }

  // Edit profile
  if (isEditing) {
    return (
      <ApplicantProfileForm
        initialProfile={profile}
        onProfileUpdated={(updatedProfile) => {
          setProfile(updatedProfile);
          setIsEditing(false);
        }}
        onCancel={() => {
          setIsEditing(false);
        }}
      />
    );
  }

  // View profile
  return (
    <ApplicantProfileView
      profile={profile}
      onEdit={() => {
        setIsEditing(true);
      }}
    />
  );
}

export default ApplicantProfile;
