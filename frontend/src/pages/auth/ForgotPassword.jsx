import { useState } from "react";
import { Link } from "react-router-dom";

import { forgotPassword } from "../../services/api";

import AuthLayout from "../../components/common/AuthLayout";
import InputField from "../../components/common/InputField";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      await forgotPassword(email);

      setMessage(
        "If an account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      console.error("Forgot password failed:", error);

      setErrorMessage(
        error?.response?.data?.detail ||
          "Unable to process your request. Please try again."
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <InputField
            id="email"
            name="email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="cursor-pointer font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Login
          </Link>
        </p>

        {/* Error Toast */}
        {errorMessage && (
          <div className="fixed right-5 top-5 z-50 rounded-lg bg-red-50 px-5 py-3 text-sm font-medium text-red-600 shadow-lg">
            {errorMessage}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
