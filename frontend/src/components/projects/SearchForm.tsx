
interface SearchFormParams {
  addModelVisible : boolean,
  setAddModelVisible : React.Dispatch<React.SetStateAction<boolean>>
  editModelVisible : boolean,
  setEditModelVisible : React.Dispatch<React.SetStateAction<boolean>>
}

export default function SearchForm({addModelVisible,setAddModelVisible,editModelVisible,setEditModelVisible} : SearchFormParams) {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
      <input
        type="text"
        placeholder="Search By Name"
        className="border px-3 py-2 rounded w-1/3 dark:bg-gray-700"
      />
      <div className="flex gap-3">
        <button onClick={()=>setAddModelVisible(v => !v)} className="bg-blue-500 text-white px-3 py-2 rounded">
          Add New
        </button>
        <button onClick={()=>setEditModelVisible(v => !v)} className="bg-gray-500 text-white px-3 py-2 rounded">
          Edit
        </button>
        <button className="bg-red-500 text-white px-3 py-2 rounded">
          Delete
        </button>
        <button className="bg-green-500 text-white px-3 py-2 rounded">
          Export PDF
        </button>
      </div>
    </div>
  );
}
