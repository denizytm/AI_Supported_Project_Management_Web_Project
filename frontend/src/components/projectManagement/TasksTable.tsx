import { TaskType } from "@/types/taskType";

interface TasksTableInterface {
  tasks: Array<TaskType>;
  taskTypes: Array<string>;
  taskMap: Map<string, Array<TaskType>>;
}

export default function TasksTable({
  taskTypes,
  tasks,
  taskMap,
}: TasksTableInterface) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-700">
          <th className="p-3 border">Type</th>
          <th className="p-3 border">Task Name</th>
          <th className="p-3 border">Label</th>
          <th className="p-3 border">Priority</th>
          <th className="p-3 border">Assigned</th>
          <th className="p-3 border">Status</th>
          <th className="p-3 border">Progress</th>
          <th className="p-3 border">Note</th>
        </tr>
      </thead>
      <tbody>
        {tasks &&
          taskTypes.map((type, topIndex) => (
            <>
              <tr key={topIndex} className="border-b">
                <td>{type}</td>
                <td></td>
                <td className="p-3"></td>
                <td className="p-3 text-red-500"></td>
                <td className="p-3"></td>
                <td className="p-3 text-blue-500"></td>
                <td className="p-3"></td>
                <td className="p-3 text-blue-400 cursor-pointer">See</td>
              </tr>
              {taskMap.get(type)?.map((task, innerIndex) => (
                <tr key={task.id} className="border-b">
                  <td>
                    {topIndex + 1}.{innerIndex + 1}
                  </td>
                  <td
                    className={`p-3 ${
                      task.taskLevelName === "High" ? "font-bold" : ""
                    }`}
                  >
                    {task.id ? ` ${task.id}. ` : ""} {task.taskName}
                  </td>
                  <td className="p-3">{task.taskLabel.label}</td>
                  <td className="p-3 text-red-500">{task.priorityName}</td>
                  <td className="p-3">
                    {task.assignedUser.name} {task.assignedUser.lastName}
                  </td>
                  <td className="p-3 text-blue-500">{task.statusName}</td>
                  <td className="p-3">{task.progress}%</td>
                  <td className="p-3 text-blue-400 cursor-pointer">See</td>
                </tr>
              ))}
            </>
          ))}
      </tbody>
    </table>
  );
}
