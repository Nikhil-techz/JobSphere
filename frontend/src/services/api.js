import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// AUTH APIs

// Register user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// Login user
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  return response.data;
};

// Get currently logged-in user's profile
export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

// APPLICANT PROFILE APIs

// Get applicant profile
export const getApplicantProfile = async () => {
  const response = await api.get("/applicant/profile");

  return response.data;
};

// Create applicant profile
export const createApplicantProfile = async (profileData) => {
  const response = await api.post("/applicant/profile", profileData);

  return response.data;
};

// Update applicant profile
export const updateApplicantProfile = async (profileData) => {
  const response = await api.patch("/applicant/profile", profileData);

  return response.data;
};

// APPLICANT DASHBOARD APIs

// Get applicant dashboard
export const getApplicantDashboard = async () => {
  const response = await api.get("/applicant/dashboard");

  return response.data;
};

// JOB APIs

// Get all jobs with search, filters, sorting and pagination
export const getJobs = async (params = {}) => {
  const cleanParams = {};

  Object.entries(params).forEach(([key, value]) => {
    // Ignore empty, null and undefined values
    if (value === "" || value === null || value === undefined) {
      return;
    }

    // Trim string values
    if (typeof value === "string") {
      const trimmedValue = value.trim();

      if (trimmedValue !== "") {
        cleanParams[key] = trimmedValue;
      }

      return;
    }

    // Keep numbers and other valid values
    cleanParams[key] = value;
  });

  const response = await api.get("/jobs/", {
    params: cleanParams,
  });

  return response.data;
};

// Get single job by ID
export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);

  return response.data;
};

// Get featured jobs
export const getFeaturedJobs = async () => {
  const response = await api.get("/jobs/featured");

  return response.data;
};

// APPLICATION APIs

// Apply for a job
export const applyForJob = async (jobId) => {
  const response = await api.post("/Applications/", {
    job_id: jobId,
  });

  return response.data;
};

// Get my applications
export const getMyApplications = async () => {
  const response = await api.get("/Applications/my-applications");

  return response.data;
};

// SAVED JOBS APIs

// Save a job
export const saveJob = async (jobId) => {
  const response = await api.post(`/saved-jobs/${jobId}`);

  return response.data;
};

// Unsave a job
export const unsaveJob = async (jobId) => {
  const response = await api.delete(`/saved-jobs/${jobId}`);

  return response.data;
};

// Get all saved jobs
export const getSavedJobs = async () => {
  const response = await api.get("/saved-jobs/");

  return response.data;
};

// RESUME APIs

// Upload / Replace resume
export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/resume/upload-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Get current resume
export const getResume = async () => {
  const response = await api.get("/resume/");

  return response.data;
};

// Delete resume
export const deleteResume = async () => {
  const response = await api.delete("/resume/");

  return response.data;
};

export default api;
