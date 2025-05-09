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

  const [errorMessages, setErrorMessages] = useState({
    description: "",
    taskTypeName: "",
    taskLabelName: "",
    startDate: "",
    dueDate: "",
    taskLevelName: "",
    priorityName: "",
    statusName: "",
    progress: "",
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
    let c = 0;

    const validations: {
      key: keyof typeof formData;
      message: string;
      condition?: (v: any) => boolean;
    }[] = [
      { key: "description", message: "Please enter a task description." },
      { key: "taskTypeName", message: "Please select a task type." },
      { key: "taskLabelName", message: "Please select a task label." },
      { key: "startDate", message: "Please enter a start date." },
      { key: "dueDate", message: "Please enter a due date." },
      { key: "taskLevelName", message: "Please select a task level." },
      { key: "priorityName", message: "Please select a priority." },
      { key: "statusName", message: "Please enter a status." },
    ];

    validations.forEach(({ key, message, condition }) => {
      const isInvalid = condition ? condition(formData[key]) : !formData[key];

      if (isInvalid) {
        setErrorMessages((em) => ({ ...em, [key]: message }));
        c = 1;
      } else {
        setErrorMessages((em) => ({ ...em, [key]: "" }));
      }
    });

    if (c) return;

    try {
      const response = await axios.post("http://localhost:5110/api/tasks/add", {
        ...formData,
      });
      if (response.status) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
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
          className="w-full text-black p-2 border rounded mb-2"
          onChange={handleChange}
        />
        {errorMessages.description && (
          <p className="text-red-500">{errorMessages.description}</p>
        )}

        <label htmlFor="taskTypeName">Task Type</label>
        <input
          list="taskTypeList"
          name="taskTypeName"
          className="w-full text-black p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <datalist id="taskTypeList">
          {taskTypes.map((type) => (
            <option key={type.id} value={type.name} />
          ))}
        </datalist>
        {errorMessages.taskTypeName && (
          <p className="text-red-500">{errorMessages.taskTypeName}</p>
        )}

        <label htmlFor="taskLabelName">Task Label</label>
        <input
          list="taskLabelList"
          name="taskLabelName"
          className="w-full text-black p-2 border rounded mb-2"
          onChange={handleChange}
        />
        <datalist id="taskLabelList">
          {taskLabels.map((label) => (
            <option key={label.id} value={label.label} />
          ))}
        </datalist>
        {errorMessages.taskLabelName && (
          <p className="text-red-500">{errorMessages.taskLabelName}</p>
        )}

        <label htmlFor="startDate">Start Date</label>
        <input
          value={formData.startDate}
          name="startDate"
          type="date"
          className="w-full text-black p-2 border rounded mb-2"
          onChange={handleChange}
        />
        {errorMessages.startDate && (
          <p className="text-red-500">{errorMessages.startDate}</p>
        )}

        <label htmlFor="dueDate">Due Date</label>
        <input
          value={formData.dueDate}
          name="dueDate"
          type="date"
          className="w-full text-black p-2 border rounded mb-2"
          onChange={handleChange}
        />
        {errorMessages.dueDate && (
          <p className="text-red-500">{errorMessages.dueDate}</p>
        )}

        <label htmlFor="priorityName">Priority</label>
        <select
          name="priorityName"
          className="w-full text-black p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="Critical">Critical</option>
        </select>
        {errorMessages.priorityName && (
          <p className="text-red-500">{errorMessages.priorityName}</p>
        )}

        <label htmlFor="taskLevelName">Task Level</label>
        <select
          name="taskLevelName"
          className="w-full text-black p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value={"Beginner"}>Beginner</option>
          <option value={"Intermediate"}>Intermediate</option>
          <option value={"Expert"}>Expert</option>
        </select>
        {errorMessages.taskLevelName && (
          <p className="text-red-500">{errorMessages.taskLevelName}</p>
        )}

        <label htmlFor="userId">Assign to</label>
        <select
          name="userId"
          className="w-full text-black p-2 border rounded mb-2"
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
          className="w-full text-black p-2 border rounded mb-2"
          onChange={handleChange}
        >
          <option value="ToDo">To do</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        {errorMessages.statusName && (
          <p className="text-red-500">{errorMessages.statusName}</p>
        )}

        <label htmlFor="statusName">Depending On</label>
        <select
          name="taskId"
          className="w-full text-black p-2 border rounded mb-2 overflow-scroll"
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
