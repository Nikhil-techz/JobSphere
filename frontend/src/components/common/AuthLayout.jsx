import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto w-full max-w-lg">
        {/* Back to Home */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <BriefcaseBusiness size={22} />
            </div>

            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              JobSphere
            </span>
          </Link>
        </div>

        {/* Page Content */}
        {children}

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} JobSphere. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
