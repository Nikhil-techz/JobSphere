import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

// Get currently logged-in user's profile
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Get applicant profile
export const getApplicantProfile = async () => {
  const response = await api.get("/applicant-profile/");
  return response.data;
};

// create applicant profile
export const createApplicantProfile = async (profileData) => {
  const response = await api.post("/applicant-profile/", profileData);
  return response.data;
};

// Update applicant profile
export const updateApplicantProfile = async (profileData) => {
  const response = await api.patch("/applicant-profile/", profileData);

  return response.data;
};
// applicant dashboard
export const getApplicantDashboard = async () => {
  const response = await api.get("/applicant/dashboard");
  return response.data;
};

export default api;
