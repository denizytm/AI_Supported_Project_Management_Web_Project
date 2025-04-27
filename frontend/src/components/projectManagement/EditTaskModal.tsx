"use client";

import { TaskLabelType } from "@/types/taskLabelType";
import { TaskType } from "@/types/taskType";
import { TasktypeType } from "@/types/tasktypeType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";

interface EditTaskModalProps {
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
  projectId: number;
  tasks: TaskType[];
  selectedTaskIdFromGantt?: number;
}

export default function EditTaskModal({
  modalVisibleStatus,
  setModalVisibleStatus,
  projectId,
  tasks,
  selectedTaskIdFromGantt,
}: EditTaskModalProps) {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>();

  const [formData, setFormData] = useState({
    description: "",
    taskTypeName: "",
    taskLabelName: "",
    startDate: "",
    dueDate: "",
    taskLevelName: "Beginner",
    priorityName: "Low",
    statusName: "ToDo",
    progress: 0,
    note: "",
    projectId,
    taskId: 0,
    userId: 0,
  });

  const [ready, setReady] = useState(false);
  const [taskTypes, setTaskTypes] = useState<TasktypeType[]>([]);
  const [taskLabels, setTaskLabels] = useState<TaskLabelType[]>([]);
  const [usersData, setUsersData] = useState<UserType[]>([]);

  useEffect(() => {
    (async () => {
      if (selectedTaskIdFromGantt) {
        const response = await axios.get(
          `http://localhost:5110/api/tasks/find?id=${selectedTaskIdFromGantt}`
        );
        if (response.status) setSelectedTask(response.data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5110/api/projects/management?id=${projectId}`
      );

      if (response.status) {
        setUsersData(response.data.users);
      }
    })();
  }, []);

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

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        description: selectedTask.description,
        dueDate: selectedTask.dueDateString,
        note: "",
        priorityName: selectedTask.priorityName,
        progress: selectedTask.progress,
        startDate: selectedTask.startDateString,
        statusName: selectedTask.statusName,
        projectId,
        taskLabelName: selectedTask.taskLabel.label,
        taskLevelName: selectedTask.taskLevelName,
        userId: selectedTask.userId || 0,
        taskTypeName: selectedTask.taskType.name,
        taskId: selectedTask.taskId || 0,
      });
    }
  }, [selectedTask]);

  const onClose = () => {
    setModalVisibleStatus((oD) => ({
      ...oD,
      edit: false,
    }));
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
        formData
      );
      onClose();
    }
  };

  if (!ready) return <div>Loading...</div>;
  if (!modalVisibleStatus.edit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Tasks</h2>

        <label htmlFor="statusName">Select Task to Edit</label>
        <select
          name="taskId"
          className="w-full p-2 border rounded mb-2 overflow-scroll"
          onChange={(e) => {
            setSelectedTask(tasks.find((task) => task.id == +e.target.value));
          }}
          value={selectedTask?.id}
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
              {task.description} ({task.taskLevelName}) ({task.taskType.name} /{" "}
              {task.taskLabel.label}) (
              {task.startDateString + "  " + task.dueDateString})
            </option>
          ))}
        </select>

        <label htmlFor="name">Task Name</label>
        <input
          name="description"
          type="text"
          placeholder="Task Name"
          className="w-full p-2 border rounded mb-2"
          onChange={handleChange}
          value={formData.description}
        />

        <label htmlFor="taskTypeName">Task Type</label>
        <input
          list="taskTypeList"
          name="taskTypeName"
          className="w-full p-2 border rounded mb-2"
          value={formData.taskTypeName}
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
          value={formData.taskLabelName}
          onChange={handleChange}
        />
        <datalist id="taskLabelList">
          {taskLabels.map((label) => (
            <option key={label.id} value={label.label} />
          ))}
        </datalist>

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
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>

        <label htmlFor="userId">Assign to</label>
        <select
          name="userId"
          className="w-full p-2 border rounded mb-2"
          value={formData.userId}
          onChange={handleChange}
        >
          <option value="">Select User</option>
          {formData.taskLevelName == "Beginner"
            ? usersData.map((user) => (
                <option
                  className={
                    user.proficiencyLevelName == "Beginner"
                      ? "text-green-500"
                      : user.proficiencyLevelName == "Intermediate"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }
                  value={user.id}
                >
                  {user.name} {user.lastName} ({user.proficiencyLevelName})
                </option>
              ))
            : formData.taskLevelName == "Intermediate"
            ? usersData
                .filter((user) => user.proficiencyLevelName != "Beginner")
                .map((user) => (
                  <option
                    className={
                      user.proficiencyLevelName == "Intermediate"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }
                    value={user.id}
                  >
                    {user.name} {user.lastName} ({user.proficiencyLevelName})
                  </option>
                ))
            : usersData
                .filter((user) => user.proficiencyLevelName == "Expert")
                .map((user) => (
                  <option className="text-red-500" value={user.id}>
                    {user.name} {user.lastName} ({user.proficiencyLevelName})
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
          value={formData.taskId}
          onChange={handleChange}
        >
          <option value="">None</option>
          {tasks
            .filter(
              (task) =>
                task.taskType.name == formData.taskTypeName &&
                selectedTask &&
                task.id != selectedTask.id
            )
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
