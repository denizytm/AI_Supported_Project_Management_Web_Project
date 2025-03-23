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
    projectTypeName: "",
    startdate: "",
    deadline: "",
    priorityName: "",
    statusName: "",
    userId: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = usersData.filter(
        (user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.lastName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleSelectUser = (user: UserType) => {
    setSearchTerm(`${user.name} ${user.lastName}`);
    setSelectedUser(`${user.name} ${user.lastName}`);
    setFilteredUsers([]);
    setFormData((prev) => ({ ...prev, userId: +user.id }));
  };
  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:5110/api/projects/nonProjectManagers"
      );
      if (response.status) {
        setUsersData(response.data);
      }
    })();
  }, []);

  const onClose = () => {
    setAddModelVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:5110/api/projects/add",
        { createProjectDto: formData }
      );
      if (response.status) {
        setAddModelVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!addModelVisible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Project Name"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="projectTypeName" className="block font-medium">
              Project Type
            </label>
            <input
              type="text"
              id="projectTypeName"
              name="projectTypeName"
              placeholder="Project Type"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block font-medium">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="priorityName" className="block font-medium">
              Priority
            </label>
            <input
              type="text"
              id="priorityName"
              name="priorityName"
              placeholder="Priority"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="statusName" className="block font-medium">
              Status
            </label>
            <input
              type="text"
              id="statusName"
              name="statusName"
              placeholder="Status"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="relative">
            <label htmlFor="userId" className="block font-medium">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              placeholder="Select Manager"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {filteredUsers.length > 0 && (
              <ul className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg max-h-40 overflow-auto">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    {user.name} {user.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
