import { useState } from "react";
import { Search } from "lucide-react";

function JobSearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch(search.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by job title..."
          className="
            w-full rounded-lg border border-gray-300
            bg-white py-3 pl-11 pr-4
            text-sm text-gray-900
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </div>

      <button
        type="submit"
        className="
          rounded-lg bg-blue-600 px-6 py-3
          text-sm font-medium text-white
          transition hover:bg-blue-700
        "
      >
        Search
      </button>
    </form>
  );
}

export default JobSearchBar;
