import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/api";

import AuthLayout from "../../components/common/AuthLayout";
import InputField from "../../components/common/InputField";
import PasswordInput from "../../components/common/PasswordInput";

function Login() {
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Store login error message
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message when user starts typing again
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
    setErrorMessage("");

    try {
      // Login request
      await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Get currently logged-in user's profile
      await loadUser();

      // Navigate after successful login
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      // Show FastAPI error message
      setErrorMessage(
        error.response?.data?.detail || "Invalid email or password"
      );

      // Hide error message after 3 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Login to continue to JobSphere
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <InputField
            id="email"
            name="email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>

        {/* Login Error Toast */}
        {errorMessage && (
          <div className="fixed right-5 top-5 z-50 rounded-lg bg-red-50 px-5 py-3 text-sm font-medium text-red-600 shadow-lg">
            {errorMessage}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default Login;
