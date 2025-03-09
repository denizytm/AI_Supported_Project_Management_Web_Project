"use client";

import { useState } from "react";
import {
  FaRegSun,
  FaRegMoon,
  FaCog,
  FaBell,
  FaUser,
  FaCalendar,
} from "react-icons/fa";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("id");
    window.location.reload();
  };

  return (
    <nav className="fixed w-full flex items-center justify-between bg-gray-200 dark:bg-gray-800 p-4 py-6" style={{zIndex : "99999999999999999999"}}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold dark:text-white">ERP</h1>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <FaRegMoon className="text-white text-lg" />
          ) : (
            <FaRegSun className="text-blue-500 text-lg" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select className="border px-2 py-1 rounded-md dark:bg-gray-700 dark:text-white">
          <option>Human Resources</option>
          <option>Finance</option>
          <option>Project Management</option>
          <option>Document</option>
        </select>
        <input
          type="text"
          placeholder="Search"
          className="border px-3 py-1 rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="relative flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <FaCalendar className="cursor-pointer" />
        <FaCog className="cursor-pointer" />
        <FaBell className="cursor-pointer" />

        <div className="relative">
          <FaUser
            className="cursor-pointer"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          />

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600">
              <ul className="p-2">
                <li className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                  My Profile
                </li>
                <li className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                  Settings
                </li>
                <li
                  onClick={handleLogOut}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                >
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
