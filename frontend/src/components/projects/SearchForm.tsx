interface SearchFormParams {
  addModelVisible: boolean;
  setAddModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  editModelVisible: boolean;
  setEditModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  deleteModelVisible: boolean;
  setDeleteModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  fetchProjects: () => void;
}

export default function SearchForm({
  addModelVisible,
  setAddModelVisible,
  editModelVisible,
  setEditModelVisible,
  deleteModelVisible,
  setDeleteModelVisible,
  search,
  setSearch,
  fetchProjects,
}: SearchFormParams) {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
      <input
        type="text"
        placeholder="Search By Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchProjects();
          }
        }}
        className="border px-3 py-2 rounded w-1/3 dark:bg-gray-700"
      />

      <div className="flex gap-3">
        <button
          onClick={() => setAddModelVisible((v) => !v)}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Add New
        </button>
        <button
          onClick={() => setEditModelVisible((v) => !v)}
          className="bg-gray-500 text-white px-3 py-2 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => setDeleteModelVisible((v) => !v)}
          className="bg-red-500 text-white px-3 py-2 rounded"
        >
          Delete
        </button>
        <button className="bg-green-500 text-white px-3 py-2 rounded">
          Export PDF
        </button>
      </div>
    </div>
  );
}
