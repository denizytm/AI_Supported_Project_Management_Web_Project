"use client";

import { RootState } from "@/redux/store";
import { ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ClientChatModal from "./chat/ClientChatModal";
import ClientChatComponent from "./chat/ClientChatComponent";
import { useChatContext } from "@/context/ChatContext";

interface ProjectTeamListProps {
  projectData: ProjectType;
  usersData: Array<UserType>;
}

export default function ProjectTeamList({
  projectData,
  usersData,
}: ProjectTeamListProps) {
  const [showManageModal, setShowManageModal] = useState(false);
  const [otherUsers, setOtherUsers] = useState<UserType[]>([]);
  const [selectedAddUserIds, setSelectedAddUserIds] = useState<number[]>([]);
  const [selectedRemoveUserIds, setSelectedRemoveUserIds] = useState<number[]>(
    []
  );

  const [showChat, setShowChat] = useState(false);
  const [targetUser, setTargetUser] = useState<UserType | null>(null);

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  const { setIsChatOpen } = useChatContext();

  useEffect(() => {
    if (showChat) {
      setIsChatOpen(true);
    } else {
      setIsChatOpen(false);
    }
  }, [showChat]);

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

  const handleAddSelect = (userId: number) => {
    setSelectedAddUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleRemoveSelect = (userId: number) => {
    setSelectedRemoveUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    try {
      if (selectedAddUserIds.length > 0) {
        await axios.post(
          `http://localhost:5110/api/projects/add-users-to-project?projectId=${projectData.id}`,
          selectedAddUserIds
        );
      }

      if (selectedRemoveUserIds.length > 0) {
        await axios.post(
          `http://localhost:5110/api/projects/remove-users-from-project?projectId=${projectData.id}`,
          selectedRemoveUserIds
        );
      }

      setShowManageModal(false);
      setSelectedAddUserIds([]);
      setSelectedRemoveUserIds([]);
      window.location.reload();
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };
  if (!currentUser) return <>Loading...</>;
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md h-96 overflow-y-auto overflow-x-auto relative">
      {/* Title + Manage Button */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-700 dark:text-white">
          Project Team
        </h3>
        {(currentUser.roleName == "Admin" ||
          currentUser.roleName == "ProjectManager") && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded"
            onClick={() => setShowManageModal(true)}
          >
            🛠 Manage
          </button>
        )}
      </div>

      {/* Current List */}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Proficiency</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">
              {projectData?.manager.name} {projectData?.manager.lastName}
            </td>
            <td className="p-2">Project Manager</td>
            <td className="p-2"></td>
            <td className="p-2">
              {currentUser.id != projectData.manager.id && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  onClick={() => {
                    setTargetUser(projectData?.manager);
                    setShowChat(true);
                  }}
                >
                  💬 Message
                </button>
              )}
            </td>
          </tr>
          {usersData.map((user: any, index: number) => (
            <tr key={index} className="border-b">
              <td className="p-2">
                {user.name} {user.lastName}
              </td>
              <td className="p-2">{user.taskRoleName}</td>
              <td className="p-2">{user.proficiencyLevelName}</td>
              <td className="p-2">
                {currentUser.id != user.id && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    onClick={() => {
                      setTargetUser(user);
                      setShowChat(true);
                    }}
                  >
                    💬 Message
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showChat && targetUser && (
        <ClientChatModal onClose={() => setShowChat(false)}>
          <ClientChatComponent target={targetUser} />
        </ClientChatModal>
      )}

      {/* Manage Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-[700px] shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Manage Project Team
            </h3>

            <div className="flex space-x-6">
              {/* Projede Olanlar */}
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-2 text-gray-600 dark:text-gray-400">
                  Current Members
                </h4>
                <div className="max-h-64 overflow-y-auto">
                  {usersData.map((user: any) => (
                    <div
                      key={user.id}
                      className={`flex justify-between items-center mb-2 p-2 rounded cursor-pointer ${
                        selectedRemoveUserIds.includes(user.id)
                          ? "bg-red-100 dark:bg-red-800"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleRemoveSelect(user.id)}
                    >
                      <span>
                        {user.name} {user.lastName}
                      </span>
                      <button className="text-red-500 hover:text-red-700 text-sm">
                        -
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-sm mb-2 text-gray-600 dark:text-gray-400">
                  Available Developers
                </h4>
                <div className="max-h-64 overflow-y-auto">
                  {otherUsers
                    .filter((u) => u.name)
                    .map((user: any) => (
                      <div
                        key={user.id}
                        className={`flex justify-between items-center mb-2 p-2 rounded cursor-pointer ${
                          selectedAddUserIds.includes(user.id)
                            ? "bg-green-100 dark:bg-green-800"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => handleAddSelect(user.id)}
                      >
                        <span>
                          {user.name} {user.lastName}
                        </span>
                        <button className="text-green-500 hover:text-green-700 text-sm">
                          +
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Alt Butonlar */}
            <div className="flex justify-end mt-6 space-x-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowManageModal(false);
                  setSelectedAddUserIds([]);
                  setSelectedRemoveUserIds([]);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
