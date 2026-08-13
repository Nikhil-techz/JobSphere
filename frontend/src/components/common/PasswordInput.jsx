import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((previous) => !previous)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && (
        <div className="mt-2 space-y-1">
          {Array.isArray(error) ? (
            error.map((message, index) => (
              <p key={index} className="text-sm text-red-600">
                {message}
              </p>
            ))
          ) : (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PasswordInput;
