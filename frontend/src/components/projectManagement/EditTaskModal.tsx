"use client";

import { TaskType } from "@/types/taskType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";

interface TaskModalProps {
  modalVisibleStatus: {
    create: boolean;
    edit: boolean;
  };
  setModalVisibleStatus: React.Dispatch<
    React.SetStateAction<{
      create: boolean;
      edit: boolean;
    }>
  >;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  usersData: UserType[];
  projectId: string;
  tasks: TaskType[];
}

export default function EditTaskModal({
  modalVisibleStatus,
  setIsHidden,
  setModalVisibleStatus,
  usersData,
  projectId,
  tasks,
}: TaskModalProps) {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>();

  const [formData, setFormData] = useState({
    taskName: "",
    taskLabelId: 1,
    startDate: "",
    dueDate: "",
    typeName: "Resarch",
    taskLevelName: 1,
    priorityName: "Low",
    statusName: "ToDo",
    estimatedHours: 0.0,
    progress: 0,
    note: "",
    projectId,
    taskId: null,
    userId: 0,
  });

  const onClose = () => {
    setModalVisibleStatus((oD) => ({
      ...oD,
      edit: false,
    }));
    setIsHidden(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedTask) {
      const result = await axios.put(
        `http://localhost:5110/api/tasks/update?id=${selectedTask.id}`,
        {
          ...formData,
          taskLevelName:
            formData.taskLevelName == 1
              ? "Beginner"
              : formData.taskLevelName == 2
              ? "Intermediate"
              : "Expert",
        }
      );
      onClose();
    }
  };

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        taskName: selectedTask.taskName,
        dueDate: selectedTask.dueDateString,
        estimatedHours: 0.0,
        note: "",
        priorityName: selectedTask.priorityName,
        progress: selectedTask.progress,
        startDate: selectedTask.startDateString,
        statusName: selectedTask.statusName,
        projectId,
        taskId: null,
        taskLevelName:
          selectedTask.taskLevelName == "Beginner"
            ? 1
            : selectedTask.taskLevelName == "Expert"
            ? 3
            : 2,
        typeName: selectedTask.typeName,
        taskLabelId: selectedTask.taskLabel.id,
        userId: +selectedTask.assignedUser.id,
      });
    }
  }, [selectedTask]);

  if (!modalVisibleStatus.edit) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Tasks</h2>

        <label htmlFor="statusName">Select Task to Edit</label>
        <select
          name="taskId"
          className="w-full p-2 border rounded mb-2 overflow-scroll"
          onChange={(e) => {
            setSelectedTask(tasks.find((task) => task.id == +e.target.value));
          }}
        >
          <option value="">None</option>
          {tasks.map((task) => (
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
              {task.taskName} ({task.taskLevelName}) ({task.typeName} /{" "}
              {task.taskLabel.label}) (
              {task.startDateString + "  " + task.dueDateString})
            </option>
          ))}
        </select>

        <label htmlFor="name">Task Name</label>
        <input
          name="taskName"
          type="text"
          placeholder="Task Name"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          value={formData.taskName}
        />

        <label htmlFor="typeName">Task Type</label>
        <select
          name="typeName"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          value={formData.typeName}
        >
          <option value="Resarch">Resarch</option>
          <option value="Development">Development</option>
          <option value="Bugfix">Bug Fix</option>
          <option value="Testing">Testing</option>
        </select>

        <label htmlFor="taksLabelId">Task Label</label>
        <select
          name="taskLabelId"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          value={formData.taskLabelId}
        >
          <option value={1}>design</option>
          <option value={2}>frontend</option>
          <option value={3}>backend</option>
          <option value={4}>database</option>
        </select>

        <label htmlFor="startDate">Start Date</label>
        <input
          name="startDate"
          type="date"
          className="w-full p-2 border rounded mb-2"
          value={formData.startDate}
          onChange={handleChange}
          min="2020-01-01"
          max="2030-12-31"
        />

        <label htmlFor="dueDate">Due Date</label>
        <input
          name="dueDate"
          type="date"
          className="w-full p-2 border rounded mb-2"
          value={formData.dueDate}
          onChange={handleChange}
          min="2020-01-01"
          max="2030-12-31"
        />

        <label htmlFor="priorityName">Priority</label>
        <select
          name="priorityName"
          className="w-full p-2 border rounded mb-2"
          value={formData.priorityName}
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
          value={formData.taskLevelName}
          onChange={handleChange}
        >
          <option value={1}>Beginner</option>
          <option value={2}>Intermediate</option>
          <option value={3}>Expert</option>
        </select>

        <label htmlFor="userId">Assign to</label>
        <select
          name="userId"
          className="w-full p-2 border rounded mb-2"
          value={formData.userId}
          onChange={handleChange}
        >
          <option value="">Select User</option>
          {usersData.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} {user.lastName}
            </option>
          ))}
        </select>

        <label htmlFor="statusName">Status</label>
        <select
          name="statusName"
          className="w-full p-2 border rounded mb-2"
          value={formData.statusName}
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
          value={formData.statusName}
          onChange={handleChange}
        >
          <option value="">None</option>
          {formData.taskLevelName == 1
            ? tasks
                .filter((task) => task.taskLevelName == "Beginner")
                .map((task) => (
                  <option className="text-green-500" value={task.id}>
                    {task.taskName} ({task.taskLevelName}) ({task.typeName} /{" "}
                    {task.taskLabel.label}) (
                    {task.startDateString + "-" + task.dueDateString})
                  </option>
                ))
            : formData.taskLevelName == 2
            ? tasks
                .filter((task) => task.taskLevelName != "Expert")
                .map((task) => (
                  <option
                    className={
                      task.taskLevelName == "Beginner"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }
                    value={task.id}
                  >
                    {task.taskName} ({task.taskLevelName}) ({task.typeName} /{" "}
                    {task.taskLabel.label}) (
                    {task.startDateString + "-" + task.dueDateString})
                  </option>
                ))
            : tasks.map((task) => (
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
                  {task.taskName} ({task.taskLevelName}) ({task.typeName} /{" "}
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
