import { Link } from "react-router-dom";
import RegisterFields from "./RegisterFields";
import useRegisterForm from "../../hooks/useRegisterForm";

function RegisterForm({ role }) {
  const {
    formData,
    termsAccepted,
    errors,
    apiError,
    successMessage,
    isLoading,
    handleChange,
    handleTermsChange,
    handleSubmit,
  } = useRegisterForm(role);

  return (
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          {role === "recruiter"
            ? "Create your recruiter account"
            : "Create your applicant account"}
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          {apiError}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed right-5 top-5 z-50 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-5 py-3 text-sm font-medium text-green-600 shadow-lg dark:border-green-800 dark:bg-green-950 dark:text-green-400">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <RegisterFields
          formData={formData}
          termsAccepted={termsAccepted}
          errors={errors}
          handleChange={handleChange}
          handleTermsChange={handleTermsChange}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* Login */}
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="cursor-pointer font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
