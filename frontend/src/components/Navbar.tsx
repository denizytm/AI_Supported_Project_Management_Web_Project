"use client";

import { useState } from "react";
import { FaRegSun, FaRegMoon, FaCog, FaBell, FaUser, FaCalendar } from "react-icons/fa";

export default function Navbar () {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 p-4 shadow-md">
      {/* Sol Taraf - Logo ve Tema Değiştirici */}
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

      {/* Orta Kısım - Dropdown ve Arama Çubuğu */}
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

      {/* Sağ Taraf - İkonlar */}
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <FaCalendar className="cursor-pointer" />
        <FaCog className="cursor-pointer" />
        <FaBell className="cursor-pointer" />
        <FaUser className="cursor-pointer" />
      </div>
    </nav>
  );
};
