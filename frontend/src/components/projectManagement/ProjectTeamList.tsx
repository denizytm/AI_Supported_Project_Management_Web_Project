"use client";

import { ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";

interface ProjectTeamListProps {
  projectData: ProjectType;
  usersData: Array<UserType>;
}

export default function ProjectTeamList({
  projectData,
  usersData,
}: ProjectTeamListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [otherUsers, setOtherUsers] = useState<UserType[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5110/api/projects/unassigned-developers?id=${projectData.id}`
      );
      if (response.status) {
        setOtherUsers(response.data);
      }
    })();
  }, []);

  const handleSelectUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId); // seçiliyse kaldır
      } else {
        return [...prev, userId]; // değilse ekle
      }
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5110/api/projects/add-users-to-project?id=${projectData.id}`,
        selectedUserIds
      );

      if (response.status) {
        setShowAddModal(false);
        setSelectedUserIds([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md h-96 overflow-y-scroll relative">
      {/* Başlık + Sağ Üst Ekle Butonu */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-700 dark:text-white">
          Project Team
        </h3>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add
        </button>
      </div>

      {/* Mevcut Liste */}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Proficiency</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">
              {projectData?.manager.name} {projectData?.manager.lastName}
            </td>
            <td className="p-2">Project Manager</td>
          </tr>
          {usersData.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">
                {user.name} {user.lastName}
              </td>
              <td className="p-2">{user.taskRoleName}</td>
              <td
                className={
                  "p-2" + user.proficiencyLevelName == "Expert"
                    ? "text-red-500"
                    : user.proficiencyLevelName == "Intermediate"
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              >
                {user.proficiencyLevelName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-96 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Add Team Members
            </h3>

            {/* Kullanıcı Listesi */}
            <div className="max-h-64 overflow-y-auto">
              {otherUsers.map((user: any) => (
                <div
                  key={user.id}
                  className={`flex justify-between items-center mb-2 p-2 rounded cursor-pointer ${
                    selectedUserIds.includes(user.id)
                      ? "bg-green-600 dark:bg-green-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => handleSelectUser(user.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {user.name} {user.lastName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.taskRoleName}
                    </span>
                  </div>
                  <button
                    className={`text-sm font-bold ${
                      selectedUserIds.includes(user.id)
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {selectedUserIds.includes(user.id) ? "➖" : "➕"}
                  </button>
                </div>
              ))}
            </div>

            {/* Alt Butonlar */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedUserIds([]);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
