import InputField from "../common/InputField";
import PasswordInput from "../common/PasswordInput";

function RegisterFields({
  formData,
  termsAccepted,
  errors,
  handleChange,
  handleTermsChange,
}) {
  return (
    <>
      {/* Full Name */}
      <InputField
        id="name"
        label="Full name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        required
        error={errors.name}
      />

      {/* Email */}
      <InputField
        id="email"
        label="Email address"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
        error={errors.email}
      />

      {/* Password */}
      <PasswordInput
        id="password"
        label="Password"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        required
        error={errors.password}
      />

      {/* Confirm Password */}
      <PasswordInput
        id="confirmPassword"
        label="Confirm password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        error={errors.confirmPassword}
      />

      {/* Terms */}
      <div>
        <div className="flex items-start gap-3">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={handleTermsChange}
            className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
          />

          <label
            htmlFor="terms"
            className="cursor-pointer text-sm text-gray-600 dark:text-gray-400"
          >
            I agree to the Terms of Service and Privacy Policy.
          </label>
        </div>

        {errors.terms && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.terms}
          </p>
        )}
      </div>
    </>
  );
}

export default RegisterFields;
