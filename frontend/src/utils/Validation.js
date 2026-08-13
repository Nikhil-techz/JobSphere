export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push("Password is required.");
    return errors;
  }

  if (password.length < 8 || password.length > 12) {
    errors.push("Password must be between 8 and 12 characters.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return errors;
};

export const validateRegister = (formData, role, termsAccepted) => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  const passwordErrors = validatePassword(formData.password);

  if (passwordErrors.length > 0) {
    errors.password = passwordErrors;
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!role) {
    errors.role = "Please select a role.";
  }

  if (!termsAccepted) {
    errors.terms = "You must accept the terms and privacy policy.";
  }

  return errors;
};

export const validateLogin = (formData) => {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  }

  return errors;
};
