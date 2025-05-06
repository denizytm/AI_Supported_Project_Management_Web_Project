"use client";

import { ProjectType } from "@/types/projectType";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function FinancePage() {
  const [projects, SetProjects] = useState<ProjectType[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:5110/api/projects/finance/get-all"
        );
        if (response.status) {
          SetProjects(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (projects.length) {
      setTotalBudget(projects.reduce((acc, p) => acc + p.budget, 0));
      setTotalSpent(projects.reduce((acc, p) => acc + p.spentBudget, 0));
      setRemaining(
        projects.reduce((acc, p) => acc + p.budget, 0) -
          projects.reduce((acc, p) => acc + p.spentBudget, 0)
      );
    }
  }, [projects]);

  if (!projects.length) return <>Loading...</>;
  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        💼 Finance Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Budget
          </p>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${totalBudget.toLocaleString()}
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Spent
          </p>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${totalSpent.toLocaleString()}
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${remaining.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="text-left px-4 py-2">Project</th>
              <th className="text-left px-4 py-2">Manager</th>
              <th className="text-left px-4 py-2">Budget</th>
              <th className="text-left px-4 py-2">Spent</th>
              <th className="text-left px-4 py-2">Remaining</th>
              <th className="text-left px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, idx) => {
              const remaining = project.budget - project.spentBudget;
              return (
                <tr
                  key={idx}
                  className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200 font-medium">
                    {project.name}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    {project.manager.name} {project.manager.lastName}
                  </td>
                  <td className="px-4 py-2 text-green-600 dark:text-green-400 font-semibold">
                    ${project.budget.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-red-600 dark:text-red-400 font-semibold">
                    ${project.spentBudget.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-blue-600 dark:text-blue-400 font-semibold">
                    ${remaining.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-bold ${
                        project.statusName === "Active"
                          ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : project.statusName === "On Hold"
                          ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                          : "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                      }`}
                    >
                      {project.statusName}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
