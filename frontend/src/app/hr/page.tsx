import React from "react";

const mockUsers = [
    {
      id: 1,
      name: "John",
      lastName: "Doe",
      email: "john@example.com",
      proficiencyLevelName: "Intermediate",
      roleName: "Developer",
      statusName: "Available",
      taskRoleName: "Frontend",
    },
    {
      id: 2,
      name: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      proficiencyLevelName: "Expert",
      roleName: "ProjectManager",
      statusName: "OnLeave",
      taskRoleName: "AI",
    },
  ];

export default function page() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Human Resources</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="flex flex-col space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow">
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

          <div className="bg-gray-800 p-4 rounded-lg shadow">
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

          <div className="bg-gray-800 p-4 rounded-lg shadow">
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
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Reminders - Calendar</h2>
            <div className="h-64 bg-gray-700 rounded flex items-center justify-center text-gray-400">
              📅 Calendar Component Here
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Filter Employees</h2>
            <div className="flex flex-wrap gap-4">
              <select className="bg-gray-700 text-white p-2 rounded">
                <option value="">Status</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="OnLeave">On Leave</option>
              </select>
              <select className="bg-gray-700 text-white p-2 rounded">
                <option value="">Proficiency</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
              <select className="bg-gray-700 text-white p-2 rounded">
                <option value="">Role</option>
                <option value="Admin">Admin</option>
                <option value="ProjectManager">Project Manager</option>
                <option value="Developer">Developer</option>
              </select>
              <input
                type="text"
                placeholder="Search name..."
                className="bg-gray-700 text-white p-2 rounded flex-1"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Apply
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow overflow-auto">
            <h2 className="text-xl font-semibold mb-2">Employees</h2>
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-700 text-gray-200">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Proficiency</th>
                  <th className="px-4 py-2">Task Role</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-600">
                    <td className="px-4 py-2">
                      {user.name} {user.lastName}
                    </td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.proficiencyLevelName}</td>
                    <td className="px-4 py-2">{user.taskRoleName}</td>
                    <td className="px-4 py-2">{user.roleName}</td>
                    <td className="px-4 py-2">{user.statusName}</td>
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
