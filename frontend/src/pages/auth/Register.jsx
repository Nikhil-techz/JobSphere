import { useLocation } from "react-router-dom";

import AuthLayout from "../../components/common/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

function Register() {
  const location = useLocation();
  const role = location.state?.role;

  return (
    <AuthLayout>
      <RegisterForm role={role} />
    </AuthLayout>
  );
}

export default Register;
