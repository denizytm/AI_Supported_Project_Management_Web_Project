"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ProjectType } from "@/types/projectType";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import ClientChatModal from "@/components/projectManagement/chat/ClientChatModal";
import ClientChatComponent from "@/components/projectManagement/chat/ClientChatComponent";
import NewRequestModal from "@/components/client/NewRequestModal";
import { HiH1 } from "react-icons/hi2";

export default function CustomerDashboard() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [projectData, setProjectData] = useState<ProjectType | null>(null);

  const [showChat, setShowChat] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const res = await axios.get(
          `http://localhost:5110/api/projects/customer/projects?userId=${currentUser.id}`
        );
        if (res.status === 200) setProjects(res.data);
      })();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedProjectId) {
      (async () => {
        const res = await axios.get(
          `http://localhost:5110/api/projects/management?id=${selectedProjectId}`
        );
        if (res.status === 200) setProjectData(res.data.project);
      })();
    }
  }, [selectedProjectId]);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 ">
      <div className="mb-4">
        <label className="block mb-1 text-lg text-gray-200">
          Select Your Project:
        </label>
        <select
          className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          value={selectedProjectId ?? ""}
          onChange={(e) => setSelectedProjectId(+e.target.value)}
        >
          <option value="">-- Select --</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {projectData && (
        <div className="grid grid-cols-2 gap-6 relative">
          {/* Butonlar: sağ üst köşeye sabitlenmiş */}
          <div className="col-span-2 flex justify-end gap-3 mb-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
              onClick={() => setShowChat(true)}
            >
              💬 Chat
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
              onClick={() => setShowNewRequestModal(true)}
            >
              ➕ New Request
            </button>
          </div>

          {showChat && (
            <ClientChatModal onClose={() => setShowChat(false)}>
              <ClientChatComponent {...{ target: projectData.manager }} />
            </ClientChatModal>
          )}

          {showNewRequestModal && currentUser && projectData && (
            <NewRequestModal
              projectId={projectData.id}
              userId={currentUser.id}
              onClose={() => setShowNewRequestModal(false)}
            />
          )}

          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow col-span-2">
            <h4 className="font-bold text-gray-700 dark:text-white mb-3 text-lg">
              Project Overview
            </h4>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
              {/* Sol Bilgiler */}
              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Project Name:</span>{" "}
                  {projectData.name}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {projectData.statusName}
                </p>
                <p>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {projectData.startDate}
                </p>
                <p>
                  <span className="font-semibold">Deadline:</span>{" "}
                  {projectData.deadline}
                </p>
                <p>
                  <span className="font-semibold">Budget:</span> $
                  {projectData.budget}
                </p>
              </div>

              {/* Sağ Progress Bar */}
              <div className="flex flex-col justify-center">
                <p className="mb-1 font-medium">Progress</p>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${projectData.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-400">
                  {projectData.progress}% Complete
                </p>
              </div>
            </div>
          </div>

          {/* Requests */}
          <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded shadow mt-4">
            <h4 className="font-bold text-gray-700 dark:text-white mb-2">
              Your Previous Requests
            </h4>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="p-2">Critic</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {projectData.projectRequests &&
                  projectData.projectRequests.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <td className="p-2">{r.criticLevelName}</td>
                      <td className="p-2 truncate max-w-xs">{r.description}</td>
                      <td className="p-2">{r.isClosed ? "Closed" : "Open"}</td>
                      <td className="p-2">{r.createdAt}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
