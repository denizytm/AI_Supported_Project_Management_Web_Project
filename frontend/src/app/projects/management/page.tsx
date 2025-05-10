"use client";

import { TaskType } from "@/types/taskType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProjectRequestType, ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";
import ProjectTeamList from "@/components/projectManagement/ProjectTeamList";
import CreateTaskModal from "@/components/projectManagement/CreateTaskModal";
import EditTaskModal from "@/components/projectManagement/EditTaskModal";
import DeleteTaskModal from "@/components/projectManagement/DeleteTaskModal";
import AssignmentPreviewModal from "@/components/projectManagement/pManagementChatbot/AssignmentPreviewModal";
import ClientChatModal from "@/components/projectManagement/chat/ClientChatModal";
import ClientChatComponent from "@/components/projectManagement/chat/ClientChatComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSignalR } from "@/context/SignalRContext";
import { useChatContext } from "@/context/ChatContext";
import GanttChartContainer from "@/components/projectManagement/GanttChartContainer";
import DeveloperTaskContainer from "@/components/projectManagement/DeveloperTaskContainer";
import ClientInfoContainer from "@/components/projectManagement/ClientInfoContainer";
import ClientRequestsContainer from "@/components/projectManagement/ClientRequestsContainer";

interface TaskManagementProps {
  id: number;
  text: string;
}

export default function TaskManagement({ id, text }: TaskManagementProps) {
  const [projectData, setProjectData] = useState<ProjectType>({
    id: 0,
    budget: 0,
    spentBudget: 0,
    description: "",
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
    startDate: "loading",
  });
  const [usersData, setUsersData] = useState<UserType[]>([]);

  const [tasks, setTasks] = useState<Array<TaskType>>([]);
  const [taskMap, setTaskMap] = useState(new Map<string, Array<TaskType>>());
  const [taskTypes, setTaskTypes] = useState<Array<string>>([]);

  const [projectRequests, setProjectRequests] = useState<ProjectRequestType[]>(
    []
  );

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  const { connection } = useSignalR();

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionNote, setCompletionNote] = useState("");

  const [minStartDate, setMinStartDate] = useState("");
  const [maxDueDate, setMaxDueDate] = useState("");

  const [showChat, setShowChat] = useState(false);
  const [showChat2, setShowChat2] = useState(false);

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

  const [assignedTasks, setAssignedTasks] = useState<TaskType[]>([]);

  const [isAssigning, setIsAssigning] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const { setIsChatOpen } = useChatContext();

  useEffect(() => {
    if (showChat || showChat2) {
      setIsChatOpen(true);
    } else {
      setIsChatOpen(false);
    }
  }, [showChat, showChat2]);

  const handleAutoAssign = async () => {
    console.trace("handleAutoAssign");
    setIsAssigning(true);
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
    } finally {
      setIsAssigning(false);
    }
  };

  const handleConfirmAssignments = async (
    finalAssignments: { taskId: number; assignedUserId: number }[]
  ) => {
    console.trace("handleConfirmAssignments");
    try {
      await axios.post(
        "http://localhost:5110/api/chatbot/confirm-assignments",
        finalAssignments
      );
      window.location.reload();
      setShowAssignmentModal(false);
    } catch (err) {
      console.error(err);
      alert("Task assignment failed.");
    }
  };

  useEffect(() => {
    if (tasks.length && currentUser) {
      setAssignedTasks(
        tasks.filter((t) => t.assignedUser?.id == currentUser.id)
      );
    }
  }, [tasks]);

  useEffect(() => {
    (async () => {
      console.trace("useEffect");
      const id = searchParams.get("id");
      console.log(id);
      const response = await axios.get(
        `http://localhost:5110/api/projects/management?id=${id}`
      );

      if (response.status) {
        setTasks(response.data.tasks), setTaskMap(response.data.groupedTasks);
        setProjectData(response.data.project);
        setUsersData(response.data.users);
        setMinStartDate(response.data.minStartDate);
        setMaxDueDate(response.data.maxDueDate);
        setProjectRequests(response.data.project.projectRequests);
        setReady1(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!connection) return;

    const handleProjectRequest = (request: ProjectRequestType) => {
      setProjectRequests((prev) => [...prev, request]);
    };

    connection.on("ReceiveProjectRequest", handleProjectRequest);

    return () => {
      connection.off("ReceiveProjectRequest", handleProjectRequest);
    };
  }, [connection]);

  useEffect(() => {
    if (!connection) return;

    const handleTaskAssignment = (task: TaskType) => {
      setAssignedTasks((prev) => [...prev, task]);
    };

    connection.on("ReceiveTaskAssignment", handleTaskAssignment);

    return () => {
      connection.off("ReceiveTaskAssignment", handleTaskAssignment);
    };
  }, [connection]);

  const handleMarkComplete = async (taskId: number) => {

    try {
      const response = await axios.put(
        `http://localhost:5110/api/tasks/done?id=${taskId}`,
        {
          statusName: "Done",
        }
      );

      if (response.status === 200) {
        setTasks(
          tasks.map((task) => {
            if (task.id == taskId) return { ...task, statusName: "Done" };
            return task;
          })
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("An error occurred while marking the task as Done.");
    }
  };

  const handleSave = async () => {
    if (!selectedRequest) return;
    console.trace("handleSave");
    try {
      const response = await axios.put(
        `http://localhost:5110/api/project/requests/${selectedRequest.id}/close`,
        JSON.stringify(completionNote),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "There was a problem while the request was getting update :",
        error
      );
    }
  };

  if (!ready1 || !currentUser) return <div>Loading...</div>;
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {isAssigning && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg flex items-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <span className="text-gray-700 font-medium">
              Assigning tasks...
            </span>
          </div>
        </div>
      )}

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
      <GanttChartContainer
        {...{
          handleAutoAssign,
          isHidden,
          projectData,
          setModalVisibleStatus,
          setShowChat,
          taskMap,
          tasks,
        }}
      />

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
          <ClientChatComponent {...{ target: projectData.customer }} />
        </ClientChatModal>
      )}

      {currentUser.roleName == "Developer" && showChat2 && (
        <ClientChatModal onClose={() => setShowChat2(false)}>
          <ClientChatComponent {...{ target: projectData.manager }} />
        </ClientChatModal>
      )}

      {/* Bottom Section */}
      <div className="grid [grid-template-columns:2fr_2fr_3fr_3fr] gap-4 mt-4">
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
            <strong>Progress:</strong> {projectData.progress}%
          </p>
          <p className="text-gray-500 dark:text-gray-300">
            <strong>Description:</strong> {projectData.description}
          </p>
        </div>

        {/* Client Information || Task Information */}
        {currentUser.roleName == "Developer" ? (
          <DeveloperTaskContainer
            {...{ assignedTasks, handleMarkComplete, setShowChat2 }}
          />
        ) : (
          <ClientInfoContainer {...{ projectData }} />
        )}

        {/* Project Team */}
        <ProjectTeamList {...{ projectData, usersData }} />

        {/* Client Requests */}
        <ClientRequestsContainer
          {...{
            projectRequests,
            setCompletionNote,
            setIsCompleted,
            setSelectedRequest,
          }}
        />

        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-96">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Request Details
              </h3>

              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedRequest.description}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  <span className="font-semibold">Critic Level:</span>{" "}
                  {selectedRequest.criticLevelName}
                </p>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="completed"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  className="form-checkbox"
                />
                <label
                  htmlFor="completed"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Mark as Completed
                </label>
              </div>

              {isCompleted && (
                <div className="mb-4">
                  <label
                    htmlFor="completionNote"
                    className="block text-gray-700 dark:text-gray-300 font-medium mb-1"
                  >
                    Completion Note
                  </label>
                  <textarea
                    id="completionNote"
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Write how the request was completed..."
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
