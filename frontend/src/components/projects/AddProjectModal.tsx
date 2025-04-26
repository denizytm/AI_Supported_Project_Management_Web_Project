"use client";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";

interface AddProjectModalParams {
  addModelVisible: boolean;
  setAddModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddProjectModal({
  addModelVisible,
  setAddModelVisible,
}: AddProjectModalParams) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectTypeId: 0,
    startDate: new Date().toISOString().split("T")[0],
    deadline: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    priorityName: "",
    statusName: "",
    managerId: 0,
    customerId: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<
    { id: number; name: string }[]
  >([]);

  const [clients, setClients] = useState<UserType[]>([]);
  const [managers, setManagers] = useState<UserType[]>([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:5110/api/projects/types"
      );

      if (response.status) {
        setProjectTypes(response.data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:5110/api/users/projectModal/add"
      );
      if (response.status) {
        setManagers(response.data.itManagers);
        setClients(response.data.clients);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:5110/api/projects/add",
        { ...formData }
      );
      if (response.status) {
        setAddModelVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = () => {
    setAddModelVisible(false);
  };

  if (!addModelVisible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add New Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block font-medium">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Project Name"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="projectTypeId" className="block font-medium">
              Project Type
            </label>
            <select
              id="projectTypeId"
              name="projectTypeId"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Type</option>
              {projectTypes.map((projectType) => (
                <option key={projectType.id} value={projectType.id}>
                  {projectType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block font-medium">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priorityName" className="block font-medium">
              Priority
            </label>
            <select
              id="priorityName"
              name="priorityName"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="statusName" className="block font-medium">
              Status
            </label>
            <select
              id="statusName"
              name="statusName"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="OnHold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Manager Seçimi */}
          <div>
            <label htmlFor="managerId" className="block font-medium">
              Manager (IT Manager)
            </label>
            <select
              id="managerId"
              name="managerId"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, managerId: +e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} {manager.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="customerId" className="block font-medium">
              Customer (Client)
            </label>
            <select
              id="customerId"
              name="customerId"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, customerId: +e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block font-medium">
              Budget
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              onChange={handleChange}
              placeholder="Budget"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
