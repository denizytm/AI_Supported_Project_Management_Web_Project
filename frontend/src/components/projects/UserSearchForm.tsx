import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface UserSearchFormProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  fetchProjects: () => void;
}

export default function UserSearchForm({
  search,
  setSearch,
  fetchProjects,
}: UserSearchFormProps) {
  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
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
        className="border px-3 py-2 rounded w-1/3 dark:bg-gray-700"
      />
    </div>
  );
}
