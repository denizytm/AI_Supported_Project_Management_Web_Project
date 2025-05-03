"use client";

import { TaskType } from "@/types/taskType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProjectRequestType, ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";
import ProjectTeamList from "@/components/projectManagement/ProjectTeamList";
import CreateTaskModal from "@/components/projectManagement/CreateTaskModal";
import GanttChart from "@/components/projectManagement/GanttChart";
import EditTaskModal from "@/components/projectManagement/EditTaskModal";
import DeleteTaskModal from "@/components/projectManagement/DeleteTaskModal";
import AssignmentPreviewModal from "@/components/projectManagement/pManagementChatbot/AssignmentPreviewModal";
import ClientChatModal from "@/components/projectManagement/chat/ClientChatModal";
import ClientChatComponent from "@/components/projectManagement/chat/ClientChatComponent";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSignalR } from "@/context/SignalRContext";

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
    if (tasks.length && currentUser) {
      setAssignedTasks(
        tasks.filter((t) => t.assignedUser?.id == currentUser.id)
      );
    }
  }, [tasks]);

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

  const handleMarkComplete = async (taskId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:5110/api/tasks/update?id=${taskId}`,
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
            <GanttChart
              {...{ taskMap, taskTypes, projectId: projectData.id, tasks }}
            />
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
          <ClientChatComponent {...{ target: projectData.customer }} />
        </ClientChatModal>
      )}

      {currentUser.roleName == "Developer" && showChat2 && (
        <ClientChatModal onClose={() => setShowChat2(false)}>
          <ClientChatComponent {...{ target: projectData.manager }} />
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
            <strong>Progress:</strong> {projectData.progress}%
          </p>
        </div>

        {/* Client Information */}
        {currentUser.roleName == "Developer" ? (
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkComplete(task.id)}
                        className={`px-3 py-1 rounded text-sm ${
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
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        💬 Message PM
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
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
        )}

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
                {projectRequests &&
                  projectRequests.map((request) => (
                    <tr
                      className={`border-b hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                        request.isClosed ? "opacity-50" : ""
                      }`}
                    >
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
                        <button
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsCompleted(request.isClosed || false);
                            setCompletionNote(request.closingNote || "");
                          }}
                          disabled={request.isClosed}
                        >
                          {request.isClosed ? "Done" : "See"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

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
