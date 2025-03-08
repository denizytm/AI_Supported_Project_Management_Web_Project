import { UserType } from "@/types/userType";
import axios from "axios";
import { useState } from "react";

interface TaskModalInterface {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  usersData: Array<UserType>;
  projectId: string;
}

export default function CreateTaskModal({
  isModalOpen,
  setIsModalOpen,
  usersData,
  projectId,
}: TaskModalInterface) {
  const [formData, setFormData] = useState({
    taskName: "",
    typeName: "Resarch",
    taskLabelId: 1,
    priorityName: "Low",
    assigned: 0,
    statusName: "ToDo",
    projectId,
    note: "",
    dueDate: "2025-08-26T13:00:17.9108202",
    estimatedHours: 11.22,
    progress: 0,
    taskLevelName: "Expert",
    taskId : null
  });

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const result = await axios.post("http://localhost:5110/api/tasks/add", {
      ...formData,
    });
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <label htmlFor="name">Task Name</label>
        <input
          name="taskName"
          type="text"
          placeholder="Task Name"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />

        <label htmlFor="typeName">Task Type</label>
        <select
          name="typeName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="Resarch">Resarch</option>
          <option value="Development">Development</option>
          <option value="Bugfix">Bug Fix</option>
          <option value="Testing">Testing</option>
        </select>

        <label htmlFor="taksLabelId">Task Label</label>
        <select
          name="taskLabelId"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value={1}>design</option>
          <option value={2}>frontend</option>
          <option value={3}>backend</option>
          <option value={4}>database</option>
        </select>

        <label htmlFor="priorityName">Priority</label>
        <select
          name="priorityName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="Critical">Critical</option>
        </select>

        <label htmlFor="taskLevelName">Task Level</label>
        <select
          name="taskLevelName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>

        <label htmlFor="userId">Assign to</label>
        <select
          name="userId"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="">Select User</option>
          {usersData.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} {user.lastName}
            </option>
          ))}
        </select>

        <label htmlFor="statusName">Status</label>
        <select
          name="statusName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="ToDo">To do</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-400 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
