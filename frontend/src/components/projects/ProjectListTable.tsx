import { RootState } from "@/redux/store";
import { ProjectType } from "@/types/projectType";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

interface ProjectListTableProps {
  projects: Array<ProjectType>;
}

export default function ProjectListTable({ projects }: ProjectListTableProps) {
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  if (!currentUser) return <>Loading...</>;
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Project</th>
            <th className="p-2">Client</th>
            <th className="p-2">Manager</th>
            <th className="p-2">Type</th>
            <th className="p-2">Deadline</th>
            <th className="p-2">Progress</th>
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
              <td className="p-2">
                {project.customer.name} {project.customer.lastName}
              </td>
              <td className="p-2">
                {project.manager.name} {project.manager.lastName}
              </td>
              <td className="p-2">{project.projectType.name.slice(0, 10)}</td>
              <td className="p-2">{project.deadline.slice(0, 10)}</td>
              <td className="p-2">{project.progress}%</td>
              <td className="p-2">{project.statusName}</td>
              <td className="p-2">{project.priorityName}</td>
              <td className="p-2 text-blue-500 cursor-pointer">
                {(currentUser.roleName == "Admin" ||
                  (currentUser.roleName == "ProjectManager" &&
                    project.manager.id == currentUser.id) ||
                  (currentUser.roleName == "Client" &&
                    project.customer.id == currentUser.id) ||
                  (currentUser.roleName == "Developer" &&
                    project.userProjects &&
                    project.userProjects.some(
                      (up) => up.userId === currentUser.id
                    ))) && (
                  <button
                    onClick={() =>
                      router.push(`/projects/management?id=${project.id}`)
                    }
                  >
                    View
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
