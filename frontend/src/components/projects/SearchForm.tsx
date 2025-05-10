import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface SearchFormParams {
  setAddModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setEditModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  fetchProjects: () => void;
}

export default function SearchForm({
  setAddModelVisible,
  setEditModelVisible,
  setDeleteModelVisible,
  search,
  setSearch,
  fetchProjects,
}: SearchFormParams) {
  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
      <div className="flex gap-2 w-1/3">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchProjects();
            }
          }}
          className="border px-3 py-2 rounded flex-1 dark:bg-gray-700"
        />
        <button
          onClick={fetchProjects}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Search
        </button>
      </div>

      {(currentUser?.roleName === "Admin" ||
        currentUser?.roleName === "ProjectManager") && (
        <div className="flex gap-3">
          <button
            onClick={() => setAddModelVisible((v) => !v)}
            className="bg-green-500 text-white px-3 py-2 rounded"
          >
            Add New
          </button>
          <button
            onClick={() => setEditModelVisible((v) => !v)}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteModelVisible((v) => !v)}
            className="bg-red-500 text-white px-3 py-2 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
