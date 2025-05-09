import { TaskType } from "@/types/taskType";

interface DeveloperTaskContainerProps {
  assignedTasks: TaskType[];
  handleMarkComplete: (taskId: number) => Promise<void>;
  setShowChat2: (value: React.SetStateAction<boolean>) => void;
}

export default function DeveloperTaskContainer({
  assignedTasks,
  handleMarkComplete,
  setShowChat2,
}: DeveloperTaskContainerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md ">
      <h3 className="font-bold text-gray-700 dark:text-white mb-2">
        Your Assigned Tasks
      </h3>
      <ul className="space-y-3">
        {assignedTasks.map((task) => {
          const isDone = task.statusName == "Done";

          return (
            <li
              key={task.id}
              className={`flex justify-between items-center p-3 rounded ${
                isDone
                  ? "bg-green-100 dark:bg-green-800"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <div>
                <p className="text-gray-800 dark:text-gray-200 font-semibold">
                  {task.taskLabel.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.description}
                </p>
              </div>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => handleMarkComplete(task.id)}
                  className={`px-2 py-1 rounded text-xs ${
                    isDone
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500 text-white"
                  }`}
                  disabled={isDone}
                >
                  ✅ {isDone ? "Completed" : "Done"}
                </button>
                <button
                  onClick={() => setShowChat2(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs"
                >
                  💬 Message PM
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
