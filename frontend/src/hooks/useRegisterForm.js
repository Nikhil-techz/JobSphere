import { useState } from "react";

import { registerUser } from "../services/api";
import { validateRegister } from "../utils/validation";

function useRegisterForm(role) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setApiError("");
    setSuccessMessage("");
  };

  const handleTermsChange = (event) => {
    setTermsAccepted(event.target.checked);

    setErrors((previous) => ({
      ...previous,
      terms: "",
    }));

    setApiError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setApiError("");
    setSuccessMessage("");

    const validationErrors = validateRegister(formData, role, termsAccepted);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });

      setSuccessMessage(response.message);
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTermsAccepted(false);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    termsAccepted,
    errors,
    apiError,
    successMessage,
    isLoading,
    handleChange,
    handleTermsChange,
    handleSubmit,
  };
}

export default useRegisterForm;
