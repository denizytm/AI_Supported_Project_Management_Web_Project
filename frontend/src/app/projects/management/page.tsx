"use client";

import { TaskType } from "@/types/taskType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";
import ProjectTeamList from "@/components/projectManagement/ProjectTeamList";
import CreateTaskModal from "@/components/projectManagement/CreateTaskModal";
import GanttChart from "@/components/projectManagement/GanttChart";
import EditTaskModal from "@/components/projectManagement/EditTaskModal";
import DeleteTaskModal from "@/components/projectManagement/DeleteTaskModal";
import AssignmentPreviewModal from "@/components/projectManagement/pManagementChatbot/AssignmentPreviewModal";
import ClientChatModal from "@/components/projectManagement/chat/ClientChatModal";
import ClientChatComponent from "@/components/projectManagement/chat/ClientChatComponent";

interface TaskManagementProps {
  id: number;
  text: string;
}

export default function TaskManagement({ id, text }: TaskManagementProps) {
  const [projectData, setProjectData] = useState<ProjectType>({
    id: 0,
    budget: 0,
    deadline: "0000-00-00",
    manager: {
      id: 0,
      email: "loading",
      name: "loading",
      lastName: "loading",
      proficiencyLevelName: "loading",
      roleName: "loading",
      statusName: "loading",
      taskRoleName: "loading",
      phone: "loading",
      company: "loading",
    },
    customer: {
      id: 0,
      email: "loading",
      name: "loading",
      lastName: "loading",
      proficiencyLevelName: "loading",
      roleName: "loading",
      statusName: "loading",
      taskRoleName: "loading",
      phone: "loading",
      company: "loading",
    },
    projectType: {
      id: 0,
      name: "",
    },
    name: "loading",
    priorityName: "loading",
    progress: "loading",
    statusName: "loading",
  });
  const [usersData, setUsersData] = useState<UserType[]>([]);

  const [tasks, setTasks] = useState<Array<TaskType>>([]);
  const [taskMap, setTaskMap] = useState(new Map<string, Array<TaskType>>());
  const [taskTypes, setTaskTypes] = useState<Array<string>>([]);

  const [minStartDate, setMinStartDate] = useState("");
  const [maxDueDate, setMaxDueDate] = useState("");

  const [showChat, setShowChat] = useState(false);

  const [ready1, setReady1] = useState(false);

  const [modalVisibleStatus, setModalVisibleStatus] = useState({
    create: false,
    edit: false,
    delete: false,
  });
  const [isHidden, setIsHidden] = useState(false);

  const [aiAssignments, setAiAssignments] = useState([]);
  const [availableUsers, setAvailableUsers] = useState<
    {
      id: number;
      name: string;
      proficiencyLevelName: string;
      statusName: string;
    }[]
  >([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAutoAssign = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5110/api/chatbot/assign-tasks?projectId=${projectData.id}`
      );
      const data = res.data.assignments;

      const userList = usersData.map((u) => ({
        id: u.id,
        name: `${u.name} ${u.lastName}`,
        proficiencyLevelName: u.proficiencyLevelName,
        statusName: u.statusName,
      }));

      setAiAssignments(
        data.map((d: any) => ({
          taskId: d.taskId,
          taskDescription: d.taskDescription,
          assignedTo: d.userId,
          taskLevel: d.taskLevel,
        }))
      );
      setAvailableUsers(userList);
      setShowAssignmentModal(true);
    } catch (err) {
      console.error(err);
      alert("Task assignment failed.");
    }
  };

  const handleConfirmAssignments = async (
    finalAssignments: { taskId: number; assignedUserId: number }[]
  ) => {
    try {
      await axios.post(
        "http://localhost:5110/api/chatbot/confirm-assignments",
        finalAssignments
      );
      alert("Tasks successfully assigned");
      setShowAssignmentModal(false);
    } catch (err) {
      console.error(err);
      alert("Task assignment failed.");
    }
  };

  useEffect(() => {
    (async () => {
      const id = searchParams.get("id");
      const response = await axios.get(
        `http://localhost:5110/api/projects/management?id=${id}`
      );

      if (response.status) {
        setTasks(response.data.tasks), setTaskMap(response.data.groupedTasks);
        setProjectData(response.data.project);
        setUsersData(response.data.users);
        setMinStartDate(response.data.minStartDate);
        setMaxDueDate(response.data.maxDueDate);

        setReady1(true);
      }
    })();
  }, []);

  if (!ready1) return <div>Loading...</div>;
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <CreateTaskModal
        {...{
          modalVisibleStatus,
          setModalVisibleStatus,
          usersData,
          projectId: projectData.id,
          tasks,
        }}
      />
      <EditTaskModal
        {...{
          modalVisibleStatus,
          setModalVisibleStatus,
          usersData,
          projectId: projectData.id,
          tasks,
        }}
      />
      <DeleteTaskModal
        {...{
          modalVisibleStatus,
          setModalVisibleStatus,
          tasks,
        }}
      />
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
        >
          Go Back
        </button>
      </div>

      {/* Task Table and Gantt Chart */}
      <div className="grid grid-cols-8 gap-4">
        <div className="col-span-12 bg-white dark:bg-gray-800 p-4 shadow-md rounded-md overflow-auto">
          <div className="flex bg-gray-200 dark:bg-gray-700 p-2 rounded-md">
            <div className="w-1/6 flex gap-2">
              <button
                onClick={() => {
                  setModalVisibleStatus((oD) => ({
                    ...oD,
                    create: true,
                  }));
                }}
                className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => {
                  setModalVisibleStatus((oD) => ({
                    ...oD,
                    edit: true,
                  }));
                }}
                className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={() => {
                  setModalVisibleStatus((oD) => ({
                    ...oD,
                    delete: true,
                  }));
                }}
                className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-gray-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="title w-3/5">
              <h2 className="text-2xl text-center font-bold text-gray-700 dark:text-white">
                Task Management
              </h2>
            </div>
            <button
              onClick={() => setShowChat(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow mr-5"
            >
              💬 Chat With Client
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow"
              onClick={() => handleAutoAssign()}
            >
              🤖 Auto Assign Tasks
            </button>
          </div>
          {isHidden ? (
            <></>
          ) : (
            <GanttChart {...{ taskMap, taskTypes, maxDueDate, minStartDate }} />
          )}
        </div>
      </div>

      {showAssignmentModal && (
        <AssignmentPreviewModal
          assignments={aiAssignments}
          users={availableUsers}
          onClose={() => setShowAssignmentModal(false)}
          onConfirm={handleConfirmAssignments}
        />
      )}

      {showChat && (
        <ClientChatModal onClose={() => setShowChat(false)}>
          <ClientChatComponent {...{ customer: projectData.customer }} />
        </ClientChatModal>
      )}

      {/* Bottom Section */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {/* General Information */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md">
          <h3 className="font-bold text-gray-700 dark:text-white mb-2">
            General Information
          </h3>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Project Name:</strong> {projectData.name}
          </p>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Project Code:</strong> {projectData.id}
          </p>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Project Manager:</strong> {projectData.manager.name}{" "}
            {projectData.manager.lastName}
          </p>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Completion:</strong> {projectData.progress}
          </p>
        </div>

        {/* Client Information */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md">
          <h3 className="font-bold text-gray-700 dark:text-white mb-2">
            Client Information
          </h3>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Name:</strong> {projectData.customer.name}{" "}
            {projectData.customer.lastName}
          </p>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Company:</strong> {projectData.customer.company}
          </p>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Email:</strong> {projectData.customer.email}
          </p>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Phone:</strong> {projectData.customer.phone}
          </p>
        </div>

        {/* Project Team */}
        <ProjectTeamList {...{ projectData, usersData }} />

        {/* Client Requests */}
        <div className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-md max-h-[400px] overflow-auto">
          <h3 className="font-bold text-gray-700 dark:text-white mb-2">
            Client Requests
          </h3>

          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full text-left ">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-3 py-2">Critic</th>
                  <th className="px-3 py-2">Request</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {projectData?.projectRequests?.map((request) => (
                  <tr className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td
                      className={
                        "px-3 py-2 font-semibold whitespace-nowrap " +
                        (request.criticLevelName === "Low"
                          ? "text-green-500"
                          : request.criticLevelName === "Medium"
                          ? "text-yellow-500"
                          : request.criticLevelName === "High"
                          ? "text-red-500"
                          : "text-red-700")
                      }
                    >
                      {request.criticLevelName}
                    </td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300 max-w-[180px] truncate">
                      {request.description}
                    </td>
                    <td className="px-3 py-2">
                      <button className="text-blue-500 hover:text-blue-700 font-semibold">
                        See
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
