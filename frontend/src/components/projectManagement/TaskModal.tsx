import { UserType } from "@/types/userType";
import { useState } from "react";

interface TaskModalInterface {
    isOpen : boolean,
    onClose : () => void,
    users : Array<UserType>
}

export default function TaskModal({ isOpen, onClose, users } : TaskModalInterface) {
  const [task, setTask] = useState({
    name: "",
    label: "backend",
    priority: "Low",
    assigned: "",
    status: "ToDo",
    progress: 0,
  });

  const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Task Created:", task);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        
        <input name="name" type="text" placeholder="Task Name" 
          className="w-full p-2 border rounded mb-2" onChange={handleChange} />
        
        <select name="label" className="w-full p-2 border rounded mb-2" onChange={handleChange}>
          <option value="backend">Backend</option>
          <option value="frontend">Frontend</option>
          <option value="database">Database</option>
        </select>
        
        <select name="priority" className="w-full p-2 border rounded mb-2" onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="Critical">Critical</option>
        </select>
        
        <select name="assigned" className="w-full p-2 border rounded mb-2" onChange={handleChange}>
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>{user.name}</option>
          ))}
        </select>
        
        <select name="status" className="w-full p-2 border rounded mb-2" onChange={handleChange}>
          <option value="ToDo">ToDo</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        
        <input name="progress" type="number" min="0" max="100"
          className="w-full p-2 border rounded mb-2" onChange={handleChange} placeholder="Progress (%)" />
        
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-400 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>Add Task</button>
        </div>
      </div>
    </div>
  );
}
