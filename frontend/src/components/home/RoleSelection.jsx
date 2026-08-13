import { BriefcaseBusiness, Users } from "lucide-react";
import { Link } from "react-router-dom";

function RoleSelection() {
  return (
    <section id="role-selection">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            What are you looking for?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
            Choose how you want to use JobSphere.
          </p>
        </div>

        {/* Role Cards */}
        <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2 md:gap-6">
          {/* Applicant Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:mt-6 sm:text-xl">
              Find a Job
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Search for jobs, explore opportunities, and apply to positions
              that match your skills.
            </p>

            <Link
              to="/register"
              state={{ role: "applicant" }}
              className="mt-5 inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 sm:mt-6 sm:w-auto"
            >
              Find Jobs
            </Link>
          </div>

          {/* Recruiter Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Users className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:mt-6 sm:text-xl">
              Hire Talent
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Post job opportunities and find candidates who match your hiring
              requirements.
            </p>

            <Link
              to="/register"
              state={{ role: "recruiter" }}
              className="mt-5 inline-flex w-full justify-center rounded-lg border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 sm:mt-6 sm:w-auto"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoleSelection;
