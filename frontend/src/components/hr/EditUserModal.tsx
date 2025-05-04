import { UserType } from "@/types/userType";
import React from "react";

export interface EditUserModalProps {
  selectedUser: UserType;
  taskRole: string;
  setTaskRole: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  proficiencyLevel: string;
  setProficiencyLevel: React.Dispatch<React.SetStateAction<string>>;
  taskRoles: string[];
  roles: string[];
  proficiencyLevels: string[];
  closeModal: () => void;
}

export default function EditUserModal({
  proficiencyLevels,
  selectedUser,
  taskRole,
  setTaskRole,
  proficiencyLevel,
  setProficiencyLevel,
  taskRoles,
  role,
  roles,
  setRole,
  closeModal,
}: EditUserModalProps) {
  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://localhost:5110/api/users/update?id=${selectedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskRoleName: taskRole,
            proficiencyLevelName: proficiencyLevel,
            roleName : role
          }),
        }
      );

      if (!response.ok) throw new Error("Update failed");
      closeModal();
      window.location.reload();
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-96 text-white">
        <h2 className="text-lg font-bold mb-4">
          Edit User: {selectedUser.name} {selectedUser.lastName}
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Task Role</label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={taskRole}
            onChange={(e) => setTaskRole(e.target.value)}
          >
            {taskRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Proficiency Level</label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={proficiencyLevel}
            onChange={(e) => setProficiencyLevel(e.target.value)}
          >
            {proficiencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Role</label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
