function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:border-red-500 dark:focus:ring-red-900/30"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-900/30"
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default InputField;
