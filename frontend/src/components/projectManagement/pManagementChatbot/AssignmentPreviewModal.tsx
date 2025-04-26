"use client";

import React, { useState } from "react";

interface AssignmentPreviewModalProps {
  assignments: {
    taskId: number;
    taskDescription: string;
    assignedTo: number;
    taskLevel: string;
  }[];
  users: { 
    id: number; 
    name: string; 
    proficiencyLevelName: string;
    statusName : string
  }[];
  onClose: () => void;
  onConfirm: (
    finalAssignments: { taskId: number; assignedUserId: number }[]
  ) => void;
}

const AssignmentPreviewModal: React.FC<AssignmentPreviewModalProps> = ({
  assignments,
  users,
  onClose,
  onConfirm,
}) => {
  const [localAssignments, setLocalAssignments] = useState(assignments);

  const handleChange = (taskId: number, newUserId: number) => {
    setLocalAssignments((prev) =>
      prev.map((a) =>
        a.taskId === taskId ? { ...a, assignedTo: newUserId } : a
      )
    );
  };

  const handleConfirm = () => {
    const formatted = localAssignments.map((a) => ({
      taskId: a.taskId,
      assignedUserId: a.assignedTo,
    }));
    onConfirm(formatted);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[600px] max-h-[80vh] overflow-auto shadow-xl">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          AI Task Assignments
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
              <th className="pb-2">Task</th>
              <th className="pb-2">Assigned User</th>
            </tr>
          </thead>
          <tbody>
            {localAssignments.map((assignment) => {
              console.log(assignment);
              return (
                <tr
                  key={assignment.taskId}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td
                    className={`py-2 pr-4 text-gray-800 dark:text-gray-100 ${
                      assignment.taskLevel == "Beginner"
                        ? "text-green-500"
                        : assignment.taskLevel == "Intermediate"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {assignment.taskDescription}
                  </td>
                  <td className="py-2">
                    <select
                      className="p-1 rounded border bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                      value={assignment.assignedTo}
                      onChange={(e) =>
                        handleChange(
                          assignment.taskId,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {assignment.taskLevel == "Expert"
                        ? users
                            .filter(
                              (user) => user.statusName == "Available" && (user.proficiencyLevelName == "Expert")
                            )
                            .map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name} ({user.proficiencyLevelName})
                              </option>
                            ))
                        : assignment.taskLevel == "Intermediate"
                        ? users
                            .filter(
                              (user) =>  user.statusName == "Available" &&  (user.proficiencyLevelName != "Beginner")
                            )
                            .map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name} ({user.proficiencyLevelName})
                              </option>
                            ))
                        : users
                        .filter(
                            (user) =>  user.statusName == "Available" 
                          )
                        .map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.proficiencyLevelName})
                            </option>
                          ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPreviewModal;
