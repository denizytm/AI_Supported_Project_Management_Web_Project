"use client";

import { ProjectType } from "@/types/projectType";
import axios from "axios";
import { useState } from "react";

interface DeleteProjectModalParams {
  deleteModelVisible: boolean;
  setDeleteModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  projects: ProjectType[];
  fetchProjects: () => void;
}

export default function DeleteProjectModal({
  deleteModelVisible,
  setDeleteModelVisible,
  projects,
  fetchProjects,
}: DeleteProjectModalParams) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  const handleDelete = async () => {
    if (selectedProjectId === null) return;
    try {
      await axios.delete("http://localhost:5110/api/projects/delete", {
        params: { id: selectedProjectId },
      });
      fetchProjects();
      setDeleteModelVisible(false);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const onClose = () => {
    setDeleteModelVisible(false);
  };

  if (!deleteModelVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Delete Project
        </h2>
        <div className="mb-4">
          <label htmlFor="projectSelect" className="block font-medium mb-1">
            Select a Project
          </label>
          <select
            id="projectSelect"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedProjectId ?? ""}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
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
            type="button"
            onClick={handleDelete}
            disabled={selectedProjectId === null}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
