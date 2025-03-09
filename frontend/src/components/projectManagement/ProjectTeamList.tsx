"use client";

import { ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";

interface ProjectTeamListProps {
  projectData: ProjectType;
  usersData: Array<UserType>;
}

export default function ProjectTeamList({
  projectData,
  usersData,
}: ProjectTeamListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md h-96 overflow-y-scroll">
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
        <tbody >
          <tr className="border-b">
            <td className="p-2">
              {projectData?.manager.name} {projectData?.manager.lastName}
            </td>
            <td className="p-2">Project Manager</td>
          </tr>
          {usersData.map((user, index) => (
            <tr className="border-b">
              <td className="p-2">
                {user.name} {user.lastName}
              </td>
              <td className="p-2">{user.taskRoleName}</td>
            </tr>
          ))}
          <tr className="border-b">
            <td className="p-2">Jane Smith</td>
            <td className="p-2">Frontend</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
