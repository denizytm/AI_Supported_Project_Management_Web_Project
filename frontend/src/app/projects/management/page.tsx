"use client";

import { TaskType } from "@/types/taskType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Array<TaskType>>();
  const [taskMap, setTaskMap] = useState(new Map<string, Array<TaskType>>());
  const [taskTypes, setTaskTypes] = useState<Array<string>>([]);
  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      const id = searchParams.get("id");
      const response = await axios.get(
        `http://localhost:5110/api/tasks/get?projectId=${id}`
      );

      if (response.status) {
        const data: Array<TaskType> = response.data;

        let types: Array<string> = [];

        for (let i = 0; i < data.length; i++)
          if (!types.includes(data[i].typeName)) types.push(data[i].typeName);

        setTaskTypes(types);
        setTasks(response.data);
        setReady1(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (ready1 && tasks && tasks.length && taskTypes && taskTypes.length) {
      const newTaskMap = new Map<string, Array<TaskType>>();

      for (let typeName of taskTypes) {
        newTaskMap.set(
          typeName,
          tasks.filter((task) => task.typeName == typeName)
        );
      }

      setTaskMap(newTaskMap);
      setReady2(true);
    }
  }, [taskTypes]);

  if (!ready2) return <div>Loading...</div>;
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Başlık */}
      <div className="flex justify-end items-center mb-4">
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
          <div className="flex bg-gray-200 dark:bg-gray-700 p-2 rounded-md">
            <div className="w-1/6 flex gap-2">
              <button className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100">
                <Plus size={20} />
              </button>
              <button className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100">
                <Pencil size={20} />
              </button>
              <button className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100">
                <Trash2 size={20} />
              </button>
            </div>
            <div className="title w-3/5">
              <h2 className="text-2xl text-center font-bold text-gray-700 dark:text-white">
                Task Management
              </h2>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Task Name</th>
                <th className="p-3 border">Label</th>
                <th className="p-3 border">Priority</th>
                <th className="p-3 border">Assigned</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Progress</th>
                <th className="p-3 border">Note</th>
              </tr>
            </thead>
            <tbody>
              {tasks &&
                taskTypes.map((type, topIndex) => (
                  <>
                    <tr key={topIndex} className="border-b">
                      <td>{type}</td>
                      <td></td>
                      <td className="p-3"></td>
                      <td className="p-3 text-red-500"></td>
                      <td className="p-3"></td>
                      <td className="p-3 text-blue-500"></td>
                      <td className="p-3"></td>
                      <td className="p-3 text-blue-400 cursor-pointer">See</td>
                    </tr>
                    {taskMap.get(type)?.map((task, innerIndex) => (
                      <tr key={task.id} className="border-b">
                        <td>
                          {topIndex + 1}.{innerIndex + 1}
                        </td>
                        <td
                          className={`p-3 ${
                            task.taskLevelName === "High" ? "font-bold" : ""
                          }`}
                        >
                          {task.id ? ` ${task.id}. ` : ""} {task.taskName}
                        </td>
                        <td className="p-3">{task.taskLabel.label}</td>
                        <td className="p-3 text-red-500">
                          {task.priorityName}
                        </td>
                        <td className="p-3">
                          {task.assignedUser.name} {task.assignedUser.lastName}
                        </td>
                        <td className="p-3 text-blue-500">{task.statusName}</td>
                        <td className="p-3">{task.progress}%</td>
                        <td className="p-3 text-blue-400 cursor-pointer">
                          See
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
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
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">John Doe</td>
                <td className="p-2">Team Leader</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Jane Smith</td>
                <td className="p-2">Frontend</td>
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
