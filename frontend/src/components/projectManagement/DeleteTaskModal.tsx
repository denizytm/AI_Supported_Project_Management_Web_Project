"use client";

import { TaskType } from "@/types/taskType";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface DeleteTaskModalProps {
  modalVisibleStatus: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  setModalVisibleStatus: React.Dispatch<
    React.SetStateAction<{
      create: boolean;
      edit: boolean;
      delete: boolean;
    }>
  >;
  tasks: TaskType[];
}

const DeleteTaskModal = ({
  tasks,
  modalVisibleStatus,

  setModalVisibleStatus,
}: DeleteTaskModalProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const onClose = () => {
    setModalVisibleStatus((oD) => ({ ...oD, delete: false }));
  };

  const onDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:5110/api/tasks/delete?id=${id}`);
      if(response.status){
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!modalVisibleStatus.delete) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Delete Task</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Task
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={selectedTaskId ?? ""}
          onChange={(e) => setSelectedTaskId(Number(e.target.value))}
        >
          <option value="" disabled>
            Choose a task to delete
          </option>
          {tasks.map((task) => (
            <option
              className={
                task.taskLevelName == "Beginner"
                  ? "text-green-500"
                  : task.taskLevelName == "Intermediate"
                  ? "text-yellow-500"
                  : "text-red-500"
              }
              value={task.id}
            >
              {task.description} ({task.taskLevelName}) ({task.taskType.name} /{" "}
              {task.taskLabel.label}) (
              {task.startDateString + "  " + task.dueDateString})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedTaskId !== null && onDelete(selectedTaskId)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={selectedTaskId === null}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
