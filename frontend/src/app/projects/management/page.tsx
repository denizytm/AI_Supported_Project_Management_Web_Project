"use client";

import { TaskType } from "@/types/taskType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Array<TaskType>>();
  const [ready, setReady] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      const id = searchParams.get("id");
      const response = await axios.get(
        `http://localhost:5110/api/tasks/get?projectId=${id}`
      );

      if (response.status) {
        console.log(response.data);
        setTasks(response.data);
        setReady(true);
      }
    })();
  }, []);

  if (!ready) return <div>Loading...</div>;
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Başlık */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
          Task Management
        </h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
        >
          Go Back
        </button>
      </div>

      {/* Task Table ve Gantt Chart Container */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sol Taraf (Task Table) */}
        <div className="col-span-2 bg-white dark:bg-gray-800 p-4 shadow-md rounded-md overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2">Task Name</th>
                <th className="p-2">Label</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Task Level</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Assigned</th>
                <th className="p-2">Status</th>
                <th className="p-2">Progress</th>
                <th className="p-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {tasks &&
                tasks.map((task) => (
                  <tr className="border-b">
                    <td className="p-2">{task.taskName.slice(0,15)}...</td>
                    <td className="p-2">{task.label.slice(0,15)}...</td>
                    <td className="p-2">{task.dueDate.toString().slice(0,10)}</td>
                    <td className="p-2 text-green-500">{task.taskLevelName}</td>
                    <td className="p-2 text-red-500">{task.priorityName}</td>
                    <td className="p-2">
                      {task.assignedUser.name} {task.assignedUser.lastName}
                    </td>
                    <td className="p-2 text-blue-500">{task.statusName}</td>
                    <td className="p-2">{task.progress}%</td>
                    <td className="p-2 text-blue-400 cursor-pointer">See</td>
                  </tr>
                ))}
              {/* Diğer satırlar buraya eklenebilir */}
            </tbody>
          </table>
        </div>

        {/* Sağ Taraf - Genel Bilgiler */}
        <div className="col-span-1 space-y-4">
          {/* General Information */}
          <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md">
            <h3 className="font-bold text-gray-700 dark:text-white mb-2">
              General Information
            </h3>
            <p className="text-gray-500 dark:text-gray-300">
              <strong>Project Name:</strong> Cloud Infrastructure Migration
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              <strong>Project Code:</strong> IT-CIM-2024
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              <strong>Project Manager:</strong> Michael Reed
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              <strong>Completion:</strong> 62%
            </p>
          </div>

          {/* Client Information */}
          <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md">
            <h3 className="font-bold text-gray-700 dark:text-white mb-2">
              Client Information
            </h3>
            <p className="text-gray-500 dark:text-gray-300">
              <strong>Name:</strong> John Doe
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              <strong>Company:</strong> Tech Solutions Inc.
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              <strong>Email:</strong> john.doe@example.com
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              <strong>Phone:</strong> +123 456 7890
            </p>
          </div>
        </div>
      </div>

      {/* Alt Kısım - Project Team & Client Requests */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Project Team */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md">
          <h3 className="font-bold text-gray-700 dark:text-white mb-2">
            Project Team
          </h3>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Task</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">John Doe</td>
                <td className="p-2">Team Leader</td>
                <td className="p-2">Market Analysis</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Jane Smith</td>
                <td className="p-2">Frontend</td>
                <td className="p-2">Target Markets</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Client Requests */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md">
          <h3 className="font-bold text-gray-700 dark:text-white mb-2">
            Client Requests
          </h3>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2">Critic</th>
                <th className="p-2">Request</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 text-red-500">High</td>
                <td className="p-2">Integrate payment gateway</td>
                <td className="p-2 text-blue-400 cursor-pointer">See</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 text-red-500">High</td>
                <td className="p-2">Mobile app design revision</td>
                <td className="p-2 text-blue-400 cursor-pointer">See</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
