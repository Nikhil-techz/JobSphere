import { Menu, Bell, UserCircle } from "lucide-react";

function ApplicantNavbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm sm:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Job<span className="text-blue-600">Sphere</span>
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={22} />

          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
        >
          <UserCircle size={30} className="text-gray-600" />

          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            Applicant
          </span>
        </button>
      </div>
    </header>
  );
}

export default ApplicantNavbar;
