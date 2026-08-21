import { useEffect, useState } from "react";

const initialFormData = {
  name: "",
  description: "",
  website: "",
  industry: "",
  company_size: "",
  location: "",
  logo: "",
};

const useCompanyProfileForm = (company = null) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        industry: company.industry || "",
        company_size: company.company_size || "",
        location: company.location || "",
        logo: company.logo || "",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [company]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Company name is required.";
    }

    if (!formData.description.trim()) {
      return "Company description is required.";
    }

    if (!formData.industry.trim()) {
      return "Industry is required.";
    }

    if (!formData.company_size.trim()) {
      return "Company size is required.";
    }

    if (!formData.location.trim()) {
      return "Location is required.";
    }

    return "";
  };

  const handleSubmit = async (onSubmit) => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return false;
    }

    try {
      setError("");

      await onSubmit(formData);

      return true;
    } catch (error) {
      console.error("Company profile error:", error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((item) => item.msg).join(", "));
      } else {
        setError(detail || "Unable to save company profile.");
      }

      return false;
    }
  };

  return {
    formData,
    error,
    setError,
    handleChange,
    handleSubmit,
  };
};

export default useCompanyProfileForm;
