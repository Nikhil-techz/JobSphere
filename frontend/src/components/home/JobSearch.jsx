import { MapPin, Search } from "lucide-react";

function JobSearch() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 pb-14 sm:pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-2xl border border-indigo-100 bg-white p-3 shadow-md shadow-indigo-100/40">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            {/* Job Search Input */}
            <div className="flex min-w-0 items-center gap-3 rounded-lg border border-indigo-100 bg-indigo-50/40 px-4 py-3 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
              <Search className="h-5 w-5 shrink-0 text-indigo-500" />

              <input
                type="text"
                placeholder="Job title, skills, or company"
                className="min-w-0 w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:font-medium placeholder:text-slate-500"
              />
            </div>

            {/* Location Input */}
            <div className="flex min-w-0 items-center gap-3 rounded-lg border border-violet-100 bg-violet-50/40 px-4 py-3 transition focus-within:border-violet-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100">
              <MapPin className="h-5 w-5 shrink-0 text-violet-500" />

              <input
                type="text"
                placeholder="City, state, or remote"
                className="min-w-0 w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:font-medium placeholder:text-slate-500"
              />
            </div>

            {/* Search Button */}
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 md:w-auto"
            >
              <Search className="h-4 w-4" />
              Search Jobs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JobSearch;
