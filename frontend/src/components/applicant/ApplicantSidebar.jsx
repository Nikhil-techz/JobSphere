import {
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  User,
  File,
  LogOut,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ApplicantSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/applicant/dashboard",
    },
    {
      label: "Find Jobs",
      icon: Search,
      path: "/jobs",
    },
    {
      label: "Saved Jobs",
      icon: Bookmark,
      path: "/applicant/saved-jobs",
    },
    {
      label: "My Applications",
      icon: FileText,
      path: "/applicant/applications",
    },
    {
      label: "Profile",
      icon: User,
      path: "/applicant/profile",
    },
    {
      label: "Resume",
      icon: File,
      path: "/applicant/resume",
    },
  ];

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r bg-white transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b px-5">
          <h2 className="text-xl font-bold text-gray-900">
            Job<span className="text-blue-600">Sphere</span>
          </h2>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className="
                  flex items-center gap-3 rounded-lg px-4 py-3
                  text-sm font-medium text-gray-600
                  transition
                  hover:bg-blue-50 hover:text-blue-600
                "
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3 rounded-lg
              px-4 py-3 text-sm font-medium text-red-600
              transition hover:bg-red-50
            "
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default ApplicantSidebar;
