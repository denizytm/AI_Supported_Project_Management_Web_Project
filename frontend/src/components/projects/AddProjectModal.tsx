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
    userId: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<
    { id: number; name: string }[]
  >([]);

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
        "http://localhost:5110/api/projects/nonProjectManagers"
      );
      if (response.status) {
        setUsersData(response.data);
      }
    })();
  }, []);

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
        {...formData}
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
              <option>Project Type</option>
              {projectTypes.map((projectType) => (
                <option value={+projectType.id}>{projectType.name}</option>
              ))}
            </select>
          </div>

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

          <div>
            <label htmlFor="priorityName" className="block font-medium">
              Priority
            </label>
            <input
              type="text"
              id="priorityName"
              name="priorityName"
              placeholder="Priority"
              onChange={handleChange}
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
              onChange={handleChange}
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
              placeholder="Select Manager"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {filteredUsers.length > 0 && (
              <ul
                className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg max-h-40 overflow-auto"
              >
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    value={user.id}
                    onClick={() => {
                        handleSelectUser(user);
                        setFormData(oD => ({...oD,userId : +user.id}));
                    }}
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
