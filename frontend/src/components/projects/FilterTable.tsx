import { UserType } from "@/types/userType";

interface Props {
  filters: {
    projectType: string;
    manager: string;
    process: string;
    priority: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<Props["filters"]>>;
  managers: UserType[];
}

export default function FilterTable({ filters, setFilters, managers }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
      <h3 className="font-semibold mb-3">Table Filter</h3>
      <div className="flex gap-3">
        <select
          className="border p-2 rounded w-1/4 dark:bg-gray-700"
          value={filters.projectType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, projectType: e.target.value }))
          }
        >
          <option value="">All Types</option>
          <option value="ERP">ERP</option>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Application">Application</option>
          <option value="AI">AI</option>
        </select>

        <select
          className="border p-2 rounded w-1/4 dark:bg-gray-700"
          value={filters.manager}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, manager: e.target.value }))
          }
        >
          <option value="">All Managers</option>
          {managers.map((manager) => (
            <option value={manager.name + " " + manager.lastName}>
              {manager.name + " " + manager.lastName}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded w-1/4 dark:bg-gray-700"
          value={filters.process}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, process: e.target.value }))
          }
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="OnHold">On Hold</option>
        </select>

        <select
          className="border p-2 rounded w-1/4 dark:bg-gray-700"
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </div>
  );
}
