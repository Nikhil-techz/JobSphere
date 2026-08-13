import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleSignUpClick() {
    closeMobileMenu();

    const rolesSection = document.getElementById("role-selection");

    if (rolesSection) {
      rolesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navbar Header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-xl font-bold text-gray-900"
          >
            JobSphere
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/jobs"
              className="px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Jobs
            </Link>

            <Link
              to="/companies"
              className="px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Companies
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
            >
              Login
            </Link>

            {/* Sign Up */}
            <button
              type="button"
              onClick={handleSignUpClick}
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                to="/jobs"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Jobs
              </Link>

              <Link
                to="/companies"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Companies
              </Link>

              {/* Mobile Login */}
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-3 text-center text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                Login
              </Link>

              {/* Mobile Sign Up */}
              <button
                type="button"
                onClick={handleSignUpClick}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
