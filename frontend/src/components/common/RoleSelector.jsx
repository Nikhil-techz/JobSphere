import { Building2, UserRound } from "lucide-react";

function RoleSelector({ role, onChange }) {
  const roles = [
    {
      value: "applicant",
      title: "Find a job",
      description: "I'm looking for a job",
      icon: UserRound,
    },
    {
      value: "recruiter",
      title: "Hire talent",
      description: "I'm hiring employees",
      icon: Building2,
    },
  ];

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-700">
        I want to
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {roles.map((item) => {
          const Icon = item.icon;
          const selected = role === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`rounded-xl border-2 p-4 text-left transition ${
                selected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RoleSelector;
