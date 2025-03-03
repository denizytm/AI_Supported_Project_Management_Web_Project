"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function ProjectManagement() {
  const [selectedPage, setSelectedPage] = useState(2);

  const projects = [
    {
      name: "ERP Migration (System Upgrade)",
      manager: "Michael Scott",
      deadline: "2024-01-15",
      process: "95%",
      status: "In Progress",
      priority: "Medium",
    },
    {
      name: "Mobile App Development (Customer Portal)",
      manager: "Sarah Connor",
      deadline: "2024-02-20",
      process: "100%",
      status: "Completed",
      priority: "Low",
    },
    {
      name: "Website Redesign (Company Rebranding)",
      manager: "John Doe",
      deadline: "2024-03-10",
      process: "76%",
      status: "On Hold",
      priority: "Critical",
    },
    {
      name: "Data Warehouse Implementation (Analytics)",
      manager: "Emily Davis",
      deadline: "2024-01-30",
      process: "56%",
      status: "In Progress",
      priority: "Medium",
    },
    {
      name: "Social Media Campaign (Marketing)",
      manager: "William Johnson",
      deadline: "2024-04-05",
      process: "25%",
      status: "Pending",
      priority: "High",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-6 bg-red-500 dark:bg-gray-900 text-gray-800 dark:text-white">
          <h2 className="text-2xl font-semibold mb-4">Project Management</h2>

          {/* Genel Bilgiler ve Dağılım */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">General Information</h3>
              <ul className="text-sm">
                <li>Total Projects: 13</li>
                <li>Finished Projects: 22</li>
                <li>Ongoing Projects: 11</li>
                <li>Delayed Projects: 1</li>
                <li>Projects on Risk: 3</li>
                <li>Total Connections: 27</li>
                <li>Total Errors: 12</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">
                Distribution by Project Type
              </h3>
              <ul className="text-sm">
                <li>ERP: 1</li>
                <li>Web: 2</li>
                <li>Mobile: 1</li>
                <li>Application: 2</li>
                <li>AI: 5</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Time Line</h3>
              <p className="text-sm">Start Date: 05/05/1998</p>
              <p className="text-sm">End Date: 31/12/2025</p>
            </div>
          </div>

          {/* Filtreleme Bölümü */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
            <h3 className="font-semibold mb-3">Table Filter</h3>
            <div className="flex gap-3">
              <select className="border p-2 rounded w-1/4 dark:bg-gray-700">
                <option>Project Type</option>
              </select>
              <select className="border p-2 rounded w-1/4 dark:bg-gray-700">
                <option>Manager</option>
              </select>
              <select className="border p-2 rounded w-1/4 dark:bg-gray-700">
                <option>Process</option>
              </select>
              <select className="border p-2 rounded w-1/4 dark:bg-gray-700">
                <option>Priority</option>
              </select>
            </div>
          </div>

          {/* Arama ve Butonlar */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-6">
            <input
              type="text"
              placeholder="Search By Name"
              className="border px-3 py-2 rounded w-1/3 dark:bg-gray-700"
            />
            <div className="flex gap-3">
              <button className="bg-blue-500 text-white px-3 py-2 rounded">
                Add New
              </button>
              <button className="bg-gray-500 text-white px-3 py-2 rounded">
                Edit
              </button>
              <button className="bg-red-500 text-white px-3 py-2 rounded">
                Delete
              </button>
              <button className="bg-green-500 text-white px-3 py-2 rounded">
                Export PDF
              </button>
            </div>
          </div>

          {/* Proje Tablosu */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Project</th>
                  <th className="p-2">Manager</th>
                  <th className="p-2">Deadline</th>
                  <th className="p-2">Process</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Priority</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <td className="p-2">{project.name}</td>
                    <td className="p-2">{project.manager}</td>
                    <td className="p-2">{project.deadline}</td>
                    <td className="p-2">{project.process}</td>
                    <td className="p-2">{project.status}</td>
                    <td className="p-2">{project.priority}</td>
                    <td className="p-2 text-blue-500 cursor-pointer">
                      details
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sayfalandırma (Pagination) */}
          <div className="flex justify-center mt-6">
            <button className="px-3 py-2 border rounded-l-md">{"<"}</button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-3 py-2 border ${
                  selectedPage === page ? "bg-blue-500 text-white" : "bg-white"
                }`}
                onClick={() => setSelectedPage(page)}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 border rounded-r-md">{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
