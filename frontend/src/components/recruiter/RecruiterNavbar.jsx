import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const RecruiterNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      path: "/recruiter/dashboard",
    },
    {
      label: "My Jobs",
      path: "/recruiter/jobs",
    },
    {
      label: "Post Job",
      path: "/recruiter/jobs/create",
    },

    {
      label: "Profile",
      path: "/recruiter/profile",
    },
  ];

  const getNavLinkClass = ({ isActive }) => {
    return `
      rounded-md px-3 py-2 text-sm font-medium transition-colors
      ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
      }
    `;
  };

  const handleLogout = () => {
    // We will connect your existing logout logic here later.
    navigate("/login");
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/recruiter/dashboard"
            className="text-xl font-bold text-blue-600"
          >
            JobSphere
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={getNavLinkClass}
              >
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600"
            >
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="border-t py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default RecruiterNavbar;
