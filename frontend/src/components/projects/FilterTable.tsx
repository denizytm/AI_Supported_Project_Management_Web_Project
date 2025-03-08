interface FilterTableProps {}

export default function FilterTable() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
      <h3 className="font-semibold mb-3">Table Filter</h3>
      <div className="flex gap-3">
        <select className="border p-2 rounded w-1/4 dark:bg-gray-700">
          <option>Project Type</option>
        </select>
        <select className="border p-2 rounded w-1/4 dark:bg-gray-700">
          <option>Manager</option>
        </select>
        <select className="border p-2 rounded w-1/4 dark:bg-gray-700">
          <option>Process</option>
        </select>
        <select className="border p-2 rounded w-1/4 dark:bg-gray-700">
          <option>Priority</option>
        </select>
      </div>
    </div>
  );
}
