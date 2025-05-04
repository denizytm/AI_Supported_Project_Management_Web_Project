"use client";

import { ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";

interface EditProjectModalParams {
  editModelVisible: boolean;
  setEditModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  projects: ProjectType[];
  fetchProjects : () => void
}

export default function EditProjectModal({
  editModelVisible,
  setEditModelVisible,
  projects,
  fetchProjects
}: EditProjectModalParams) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectTypeId: 0,
    startDate: "",
    deadline: "",
    priorityName: "",
    statusName: "",
    managerId: 0,
    customerId: 0,
    budget: 0,
  });

  const [projectTypes, setProjectTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [clients, setClients] = useState<UserType[]>([]);
  const [managers, setManagers] = useState<UserType[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null
  );

  useEffect(() => {
    if (selectedProject) {
      setFormData({
        name: selectedProject.name,
        description: selectedProject.description,
        projectTypeId: selectedProject.projectType.id,
        startDate: selectedProject.startDate.split("T")[0],
        deadline: selectedProject.deadline.split("T")[0],
        priorityName: selectedProject.priorityName,
        statusName: selectedProject.statusName,
        managerId: selectedProject.manager.id,
        customerId: selectedProject.customer.id,
        budget: selectedProject.budget,
      });
    }
  }, [selectedProject]);

  useEffect(() => {
    (async () => {
      const res1 = await axios.get("http://localhost:5110/api/projects/types");
      const res2 = await axios.get(
        "http://localhost:5110/api/users/projectModal/add"
      );
      if (res1.status) setProjectTypes(res1.data);
      if (res2.status) {
        setManagers(res2.data.itManagers);
        setClients(res2.data.clients);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5110/api/projects/update",
        formData,
        {
          params: { id: selectedProject?.id },
        }
      );

      if (response.status) {
        setEditModelVisible(false);
        fetchProjects();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = () => {
    setEditModelVisible(false);
  };

  if (!editModelVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 max-h-[85vh] overflow-y-auto p-6 rounded-lg shadow-lg w-[90%] max-w-xl mt-[80px]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Edit Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="selectProject" className="block font-medium">
              Select Project
            </label>
            <select
              id="selectProject"
              onChange={(e) => {
                const project = projects.find((p) => p.id === +e.target.value);
                setSelectedProject(project || null);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Choose a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <>
              <div>
                <label htmlFor="name" className="block font-medium">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
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
                  value={formData.description}
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
                  value={formData.projectTypeId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Type</option>
                  {projectTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
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
                  value={formData.startDate}
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
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="priorityName" className="block font-medium">
                  Priority
                </label>
                <select
                  id="priorityName"
                  name="priorityName"
                  value={formData.priorityName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="statusName" className="block font-medium">
                  Status
                </label>
                <select
                  id="statusName"
                  name="statusName"
                  value={formData.statusName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="OnHold">OnHold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="managerId" className="block font-medium">
                  Manager (IT Manager)
                </label>
                <select
                  id="managerId"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Manager</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.lastName}
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
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block font-medium">
                  Budget
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </>
          )}

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
              disabled={!selectedProject}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
