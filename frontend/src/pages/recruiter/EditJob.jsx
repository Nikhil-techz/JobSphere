import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getJobById, updateJob } from "../../services/api";
import JobForm from "../../components/recruiter/JobForm";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    experience_level: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        const job = await getJobById(jobId);

        setFormData({
          title: job.title || "",
          description: job.description || "",
          location: job.location || "",
          salary: job.salary || "",
          experience_level: job.experience_level ?? "",
          skills: job.skills || "",
        });
      } catch (error) {
        setError(error?.response?.data?.detail || "Unable to load this job.");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await updateJob(jobId, {
        ...formData,
        experience_level: Number(formData.experience_level),
      });

      setMessage("Job updated successfully.");

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 800);
    } catch (error) {
      setError(error?.response?.data?.detail || "Unable to update the job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">Loading job...</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>

        <p className="mt-1 text-sm text-gray-500">Update your job listing.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-600">
          {message}
        </div>
      )}

      <JobForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/recruiter/jobs")}
        loading={saving}
        submitText="Save Changes"
      />
    </div>
  );
};

export default EditJob;
