"use client";

import EditUserModal from "@/components/hr/EditUserModal";
import { RootState } from "@/redux/store";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  users: UserType[];
}

export default function page() {
  const [page, setPage] = useState<number>(1);

  const [paginationData, setPaginationData] =
    useState<PaginationResponse | null>(null);

  const searchParams = useSearchParams();

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    email: "",
    roleName: "",
    statusName: "Available",
    taskRoleName: "",
    proficiencyLevelName: "",
  });

  const initialSearch = searchParams.get("search") || "";
  const initialRole = searchParams.get("role") || "";
  const initialProficiency = searchParams.get("proficiency") || "";
  const initialStatus = searchParams.get("status") || "";

  const [searchData, setSearchData] = useState(initialSearch);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedProficiency, setSelectedProficiency] =
    useState(initialProficiency);

  const taskRoles = [
    "Frontend",
    "Backend",
    "Fullstack",
    "AI",
    "Mobile",
    "Designer",
  ];
  const proficiencyLevels = ["Junior", "Mid", "Senior"];

  const roles = ["Developer", "ProjectManager"];

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [role, setRole] = useState("");
  const [taskRole, setTaskRole] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");

  const fetchUsers = async () => {
    console.trace("fetchUsers");

    const params = new URLSearchParams();

    if (searchData) params.append("search", searchData);
    if (selectedRole) params.append("role", selectedRole);
    if (selectedStatus) params.append("status", selectedStatus);
    if (selectedProficiency) params.append("proficiency", selectedProficiency);

    const queryString = params.toString();

    const response = await axios.get(
      `http://localhost:5110/api/users/all/?page=${page}&${queryString}`
    );
    if (response.status) {
      setPaginationData(response.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, [page]);

  const openEditModal = (user: UserType) => {
    setSelectedUser(user);
    setTaskRole(user.taskRoleName);
    setRole(user.roleName);
    setProficiencyLevel(user.proficiencyLevelName);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (searchData.trim()) queryParams.append("search", searchData);
    if (selectedRole) queryParams.append("role", selectedRole);
    if (selectedStatus) queryParams.append("status", selectedStatus);
    if (selectedProficiency)
      queryParams.append("proficiency", selectedProficiency);

    const url = `/hr?page=1&${queryParams.toString()}`;
    window.location.href = url;
  };

  const handleAddUser = async () => {
    console.trace("handleAddUser");

    try {
      const response = await axios.post(
        "http://localhost:5110/api/users/create",
        newUser
      );

      if (!response.status) {
        const errorData = await response.data();
        throw new Error(errorData.message || "User creation failed");
      }

      setShowAddModal(false);
      window.location.reload();
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  if (!paginationData || !currentUser) return <div>Loading...</div>;
  const { users, totalCount, totalPages, currentPage } = paginationData;
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Human Resources</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="flex flex-col space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">General Information</h2>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Total Workers: 152</li>
              <li>Total Trainees: 26</li>
              <li>Avg. Working Time: 45 hrs/week</li>
              <li>Participation Rate: 85%</li>
              <li>AVG Salary: 1700$</li>
              <li>Total Open Positions: 12 (5%)</li>
              <li>Avg. Age: 33</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">
              Information For This Month
            </h2>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Job Applications: 1005</li>
              <li>Trainees Attended: 123</li>
              <li>Ongoing Trainees: 83</li>
              <li>Successful Trainings: 58</li>
              <li>Failed Trainings: 17</li>
              <li>Turnover Rate: 12%</li>
              <li>Avg Working Hours (Day): 7.2 (82%)</li>
              <li>Requests From Workers: 22</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Requests</h2>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✔️ John Doe - Salary Increase</li>
              <li>❌ Jane Smith - Leave Request</li>
              <li>✔️ Michael Scott - Training Program</li>
              <li>❌ Anna White - Work From Home</li>
              <li>✔️ Sarah Connor - Equipment Upgrade</li>
              <li>❌ Emily Davis - Vacation Extension</li>
              <li>✔️ William Jones - Department Transfer</li>
            </ul>
          </div>
        </div>

        <div className="xl:col-span-2 flex flex-col space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Reminders - Calendar</h2>
            <div className="h-64 bg-gray-700 rounded flex items-center justify-center text-gray-400">
              📅 Calendar Component Here
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Filter Users</h2>
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              >
                <option value="">Status</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="OnLeave">On Leave</option>
              </select>
              <select
                value={selectedProficiency}
                onChange={(e) => setSelectedProficiency(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              >
                <option value="">Proficiency</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              >
                <option value="">Role</option>
                <option value="Admin">Admin</option>
                <option value="ProjectManager">Project Manager</option>
                <option value="Developer">Developer</option>
                <option value="Client">Client</option>
              </select>
              <input
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
                type="text"
                placeholder="Search name..."
                className="bg-gray-700 text-white p-2 rounded flex-1"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-auto">
            <h2 className="text-xl font-semibold mb-2 text-center">Users</h2>
            <div className="button-container w-full flex justify-end">
              {currentUser.roleName == "Admin" && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded mb-4"
                >
                  + Add User
                </button>
              )}
            </div>
            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-xl w-full max-w-xl text-white">
                  <h2 className="text-xl font-bold mb-4">Add New User</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="bg-gray-700 p-2 rounded"
                    />

                    <select
                      value={newUser.roleName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, roleName: e.target.value })
                      }
                      className="bg-gray-700 p-2 rounded"
                    >
                      <option value="">Select Role</option>
                      <option value="Developer">Developer</option>
                      <option value="ProjectManager">Project Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="Client">Client</option>
                    </select>

                    {newUser.roleName === "Developer" && (
                      <select
                        value={newUser.taskRoleName}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            taskRoleName: e.target.value,
                          })
                        }
                        className="bg-gray-700 p-2 rounded"
                      >
                        <option value="">Select Task Role</option>
                        {taskRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    )}

                    {(newUser.roleName === "Developer" ||
                      newUser.roleName === "ProjectManager") && (
                      <select
                        value={newUser.proficiencyLevelName}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            proficiencyLevelName: e.target.value,
                          })
                        }
                        className="bg-gray-700 p-2 rounded"
                      >
                        <option value="">Select Proficiency</option>
                        {proficiencyLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    )}

                    <select
                      value={newUser.statusName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, statusName: e.target.value })
                      }
                      className="bg-gray-700 p-2 rounded"
                    >
                      <option value="">Select Status</option>
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="OnLeave">On Leave</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddUser}
                      className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-white dark:bg-gray-800 text-gray-200">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Proficiency</th>
                  <th className="px-4 py-2">Task Role</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-center">Edit</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-600">
                    <td className="px-4 py-2">
                      {user.name
                        ? user.name + " " + user.lastName
                        : "Waiting for a registration"}
                    </td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.proficiencyLevelName}</td>
                    <td className="px-4 py-2">{user.taskRoleName}</td>
                    <td className="px-4 py-2">{user.roleName}</td>
                    <td className="px-4 py-2">{user.statusName}</td>
                    <td className="px-4 py-2 text-center">
                      {currentUser.roleName === "Admin" &&
                      (user.roleName === "Developer" ||
                        user.roleName === "ProjectManager") ? (
                        <button
                          className="text-xs text-blue-400 hover:underline"
                          onClick={() => openEditModal(user)}
                        >
                          Edit
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* MODAL */}
            {selectedUser && (
              <EditUserModal
                {...{
                  closeModal,
                  proficiencyLevel,
                  proficiencyLevels,
                  selectedUser,
                  setProficiencyLevel,
                  role,
                  setRole,
                  setTaskRole,
                  taskRole,
                  roles,
                  taskRoles,
                }}
              />
            )}
            <div className="flex justify-center mt-6 flex-wrap gap-2">
              {(() => {
                const pageNumbers = [];
                const maxVisible = 2;

                if (totalPages <= 1) return null;

                pageNumbers.push(
                  <button
                    key={1}
                    onClick={() => setPage(1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-gray-300 text-black hover:bg-gray-400"
                    }`}
                  >
                    1
                  </button>
                );

                if (currentPage - maxVisible > 2) {
                  pageNumbers.push(
                    <span
                      key="start-ellipsis"
                      className="px-2 py-1 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                for (
                  let i = Math.max(2, currentPage - maxVisible);
                  i <= Math.min(totalPages - 1, currentPage + maxVisible);
                  i++
                ) {
                  pageNumbers.push(
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-gray-300 text-black hover:bg-gray-400"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (currentPage + maxVisible < totalPages - 1) {
                  pageNumbers.push(
                    <span
                      key="end-ellipsis"
                      className="px-2 py-1 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }

                if (totalPages > 1) {
                  pageNumbers.push(
                    <button
                      key={totalPages}
                      onClick={() => setPage(totalPages)}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-gray-300 text-black hover:bg-gray-400"
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pageNumbers;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
