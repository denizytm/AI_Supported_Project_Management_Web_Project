import { RootState } from "@/redux/store";
import { ProjectType } from "@/types/projectType";
import { useSelector } from "react-redux";
import GanttChart from "./GanttChart";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { TaskType } from "@/types/taskType";

interface GanttChartContainerProps {
  isHidden: boolean;
  projectData: ProjectType;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  setModalVisibleStatus: React.Dispatch<
    React.SetStateAction<{
      create: boolean;
      edit: boolean;
      delete: boolean;
    }>
  >;
  handleAutoAssign: () => void;
  tasks: TaskType[];
  taskMap: Map<string, TaskType[]>;
}

export default function GanttChartContainer({
  isHidden,
  projectData,
  setModalVisibleStatus,
  setShowChat,
  handleAutoAssign,
  taskMap,
  tasks,
}: GanttChartContainerProps) {
  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  if (!currentUser) return <>Loading...</>;
  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="col-span-12 bg-white dark:bg-gray-800 p-4 shadow-md rounded-md overflow-auto">
        <h3 className="text-center text-2xl my-5">{projectData.name}</h3>
        <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md w-full">
          <div className="w-1/3 flex gap-2">
            <button
              onClick={() =>
                setModalVisibleStatus((oD) => ({ ...oD, create: true }))
              }
              className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() =>
                setModalVisibleStatus((oD) => ({ ...oD, edit: true }))
              }
              className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() =>
                setModalVisibleStatus((oD) => ({ ...oD, delete: true }))
              }
              className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="w-1/3 flex justify-center">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
              Task Management
            </h2>
          </div>

          <div className="w-1/3 flex justify-end gap-3">
            {(currentUser.roleName == "Admin" ||
              currentUser.roleName == "ProjectManager") && (
              <>
                <button
                  onClick={() => setShowChat(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded shadow"
                >
                  💬 Chat With Client
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded shadow"
                  onClick={() => handleAutoAssign()}
                >
                  🤖 Auto Assign Tasks
                </button>
              </>
            )}
          </div>
        </div>

        {isHidden ? (
          <></>
        ) : (
          <GanttChart {...{ taskMap, projectId: projectData.id, tasks }} />
        )}
      </div>
    </div>
  );
}
