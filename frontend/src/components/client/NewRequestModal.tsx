import { useState } from "react";
import axios from "axios";

export default function NewRequestModal({ projectId, userId, onClose }: any) {
  const [description, setDescription] = useState("");
  const [criticalLevel, setCriticalLevel] = useState("Low");

  const handleSubmit = async () => {
    console.log({
      description,
      criticLevellName: criticalLevel,
      projectId,
      requestedById: userId,
      isClosed: false,
    });
    try {
      await axios.post("http://localhost:5110/api/project/requests/create-request", {
        description,
        criticLevelName: criticalLevel,
        projectId,
        requestedById: userId,
        isClosed: false,
        createdAt: new Date().toISOString(),
      });
      onClose(); // Modalı kapat
    } catch (err) {
      console.error("Request submission failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-96 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          New Project Request
        </h3>

        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
          Description
        </label>
        <textarea
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          placeholder="Describe your request..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
          Critical Level
        </label>
        <select
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={criticalLevel}
          onChange={(e) => setCriticalLevel(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-400 px-4 py-1 rounded text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 px-4 py-1 rounded text-white"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
