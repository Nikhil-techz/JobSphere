import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/api";

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    experience_level: "",
    skills: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (Object.values(formData).some((value) => !value.trim())) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await createJob({
        ...formData,
        experience_level: Number(formData.experience_level),
      });

      setMessage("Job posted successfully!");

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1000);
    } catch (error) {
      console.error("Create job error:", error);

      setMessage(
        error?.response?.data?.detail || "Failed to post job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>

        <p className="mt-1 text-sm text-gray-600">
          Create a job listing for candidates.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border bg-white p-6 shadow-sm"
      >
        <input
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />

        <input
          name="salary"
          placeholder="Salary (e.g. 6-10 LPA)"
          value={formData.salary}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />

        <input
          name="experience_level"
          type="number"
          min="0"
          placeholder="Experience in years"
          value={formData.experience_level}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />

        <input
          name="skills"
          placeholder="Skills (e.g. Python, FastAPI, PostgreSQL)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />

        <textarea
          name="description"
          rows="6"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5"
        />

        {message && <p className="text-sm text-gray-600">{message}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/recruiter/dashboard")}
            className="rounded-md border px-5 py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
