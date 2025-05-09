"use client";
import { useEffect, useState } from "react";
import { ProjectType } from "@/types/projectType";
import { TaskType } from "@/types/taskType";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import axios from "axios";

export default function CalendarPopover() {
  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    (async () => {
      if (currentUser.roleName == "Developer") {
        const taskRes = await axios.get(
          `http://localhost:5110/api/tasks/user?id=${currentUser.id}`
        );
        if (taskRes.status) {
          const taskData = await taskRes.data;
          setTasks(taskData);
        }
      }
    })();
  }, [currentUser]);

  return (
    <div className="absolute top-16 right-6 bg-white dark:bg-gray-800 p-4 rounded shadow-lg w-80 z-50">
      <h4 className="font-bold mb-2 text-gray-700 dark:text-white">
        📅 Upcoming Dates
      </h4>

      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 max-h-64 overflow-y-auto">
        {tasks.map((task) => (
          <li key={task.id}>
            📝 <strong>{task.taskLabel.label}</strong> due on{" "}
            {new Date(task.dueDateString).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
