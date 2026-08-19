import { useEffect, useState } from "react";
import { uploadResume, getResume, deleteResume } from "../../services/api";

function ResumeManager() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await getResume();
        setResume(data);
      } catch (error) {
        if (error.response?.status !== 404) {
          setError(error.response?.data?.detail || "Unable to load resume.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume.");
      return;
    }

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      const data = await uploadResume(file);

      setResume(data);
      setFile(null);
      setMessage(data.message);
    } catch (error) {
      setError(error.response?.data?.detail || "Unable to upload resume.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your resume?")) {
      return;
    }

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      const data = await deleteResume();

      setResume(null);
      setMessage(data.message);
    } catch (error) {
      setError(error.response?.data?.detail || "Unable to delete resume.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-gray-600">Loading resume...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Resume</h2>

      <p className="mt-1 text-sm text-gray-500">Upload your latest resume.</p>

      {message && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {resume && (
        <div className="mt-5 flex flex-col gap-3 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-gray-900">Resume uploaded</p>

            <a
              href={resume.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View Resume
            </a>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={processing}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {processing ? "Processing..." : "Delete"}
          </button>
        </div>
      )}

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {resume ? "Replace Resume" : "Upload Resume"}
        </label>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(event) => {
            setFile(event.target.files[0] || null);
            setError("");
          }}
          className="w-full rounded-lg border p-2 text-sm"
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || processing}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {processing
            ? "Uploading..."
            : resume
            ? "Replace Resume"
            : "Upload Resume"}
        </button>
      </div>
    </div>
  );
}

export default ResumeManager;
