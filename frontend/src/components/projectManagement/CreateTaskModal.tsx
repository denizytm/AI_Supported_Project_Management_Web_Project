"use client";

import { TaskLabelType } from "@/types/taskLabelType";
import { TaskType } from "@/types/taskType";
import { TasktypeType } from "@/types/tasktypeType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";

interface CreateTaskModalProps {
  modalVisibleStatus: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  setModalVisibleStatus: React.Dispatch<
    React.SetStateAction<{
      create: boolean;
      edit: boolean;
      delete: boolean;
    }>
  >;
  usersData: UserType[];
  projectId: number;
  tasks: TaskType[];
}

export default function CreateTaskModal({
  modalVisibleStatus,
  setModalVisibleStatus,
  usersData,
  projectId,
  tasks,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    taskTypeName: "",
    taskLabelName: "",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    taskLevelName: "Beginner",
    priorityName: "Low",
    statusName: "ToDo",
    progress: 0,
    note: "",
    projectId: projectId,
    taskId: null,
    userId: null,
  });

  const [ready, setReady] = useState(false);
  const [taskTypes, setTaskTypes] = useState<TasktypeType[]>([]);
  const [taskLabels, setTaskLabels] = useState<TaskLabelType[]>([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:5110/api/tasks/formData"
      );

      if (response.status) {
        setTaskLabels(response.data.taskLabels);
        setTaskTypes(response.data.taskTypes);
        setReady(true);
      }
    })();
  }, []);

  const onClose = () => {
    setModalVisibleStatus((oD) => ({
      ...oD,
      create: false,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const result = await axios.post("http://localhost:5110/api/tasks/add", {
      ...formData,
    });
    onClose();
  };

  if (!ready) return <div>Loading...</div>;
  if (!modalVisibleStatus.create) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 max-h-[85vh] overflow-y-auto p-6 rounded-lg shadow-lg w-[90%] max-w-xl mt-[80px]">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>

        <label htmlFor="name">Task Name</label>
        <input
          name="description"
          type="text"
          placeholder="Task Name"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />

        <label htmlFor="taskTypeName">Task Type</label>
        <input
          list="taskTypeList"
          name="taskTypeName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <datalist id="taskTypeList">
          {taskTypes.map((type) => (
            <option key={type.id} value={type.name} />
          ))}
        </datalist>

        <label htmlFor="taskLabelName">Task Label</label>
        <input
          list="taskLabelList"
          name="taskLabelName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <datalist id="taskLabelList">
          {taskLabels.map((label) => (
            <option key={label.id} value={label.label} />
          ))}
        </datalist>

        <label htmlFor="startDate">Start Date</label>
        <input
          value={formData.startDate}
          name="startDate"
          type="date"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />

        <label htmlFor="dueDate">Due Date</label>
        <input
          value={formData.dueDate}
          name="dueDate"
          type="date"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        />

        <label htmlFor="priorityName">Priority</label>
        <select
          name="priorityName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="Critical">Critical</option>
        </select>

        <label htmlFor="taskLevelName">Task Level</label>
        <select
          name="taskLevelName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value={"Beginner"}>Beginner</option>
          <option value={"Intermediate"}>Intermediate</option>
          <option value={"Expert"}>Expert</option>
        </select>

        <label htmlFor="userId">Assign to</label>
        <select
          name="userId"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="">Select User</option>
          {formData.taskLevelName == "Beginner"
            ? usersData.map((user) => (
                <option
                  className={
                    user.proficiencyLevelName == "Juinor"
                      ? "text-green-500"
                      : user.proficiencyLevelName == "Mid"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }
                  key={user.id}
                  value={user.id}
                >
                  {user.name} {user.lastName} ({user.proficiencyLevelName})
                </option>
              ))
            : formData.taskLevelName == "Intermediate"
            ? usersData
                .filter((user) => user.proficiencyLevelName != "Junior")
                .map((user) => (
                  <option
                    className={
                      user.proficiencyLevelName == "Mid"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }
                    key={user.id}
                    value={user.id}
                  >
                    {user.name} {user.lastName} ({user.proficiencyLevelName})
                  </option>
                ))
            : usersData
                .filter((user) => user.proficiencyLevelName == "Senior")
                .map((user) => (
                  <option
                    className="text-red-500"
                    key={user.id}
                    value={user.id}
                  >
                    {user.name} {user.lastName} ({user.proficiencyLevelName})
                  </option>
                ))}
        </select>

        <label htmlFor="statusName">Status</label>
        <select
          name="statusName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="ToDo">To do</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <label htmlFor="statusName">Depending On</label>
        <select
          name="taskId"
          className="w-full p-2 border rounded mb-2 overflow-scroll"
          onChange={handleChange}
        >
          <option value="">None</option>
          {tasks
            .filter((task) => task.taskType.name == formData.taskTypeName)
            .map((task) => (
              <option
                className={
                  task.taskLevelName == "Beginner"
                    ? "text-green-500"
                    : task.taskLevelName == "Intermediate"
                    ? "text-yellow-500"
                    : "text-red-500"
                }
                value={task.id}
              >
                {task.description.slice(0, 10)} {task.taskType.name} (
                {task.taskLevelName}) ({task.taskType.name} /{" "}
                {task.taskLabel.label}) (
                {task.startDateString + "  " + task.dueDateString})
              </option>
            ))}
        </select>

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-400 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
