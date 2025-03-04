"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedPage, setSelectedPage] = useState(
    Number(searchParams.get("page"))
  );
  const [projects, setProjects] = useState<
    Array<{
      name: string;
      manager: string;
      deadline: string;
      process: string;
      status: string;
      priority: string;
    }>
  >([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5110/api/projects/all?page=${selectedPage}`
      );
      if (response.status) {
        if (!response.data.length)
          setSelectedPage(selectedPage - 1)
        setProjects(response.data);
      }
    })();
  }, [selectedPage]);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        {!projects.length ? (
          <div className="mt-5 ml-5"> Loading... </div>
        ) : (
          <div className=" mx-auto mt-20 w-10/12  dark:bg-gray-900 text-gray-800 dark:text-white">
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
                      <td className="p-2">{project.deadline.slice(0, 10)}</td>
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
              {selectedPage != 1 && (
                <button
                  className={`px-3 py-2 border`}
                  onClick={() => setSelectedPage(selectedPage - 1)}
                >
                  {selectedPage - 1}
                </button>
              )}
              <button
                className={`px-3 py-2 border`}
                onClick={() => setSelectedPage(selectedPage)}
              >
                {selectedPage}
              </button>
              <button
                className={`px-3 py-2 border`}
                onClick={() => setSelectedPage(selectedPage + 1)}
              >
                {selectedPage + 1}
              </button>
              <button className="px-3 py-2 border rounded-r-md">{">"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
