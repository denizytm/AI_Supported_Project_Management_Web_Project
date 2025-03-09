"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCoins,
  FaProjectDiagram,
  FaUserTie,
  FaFolder,
} from "react-icons/fa";

export default function Sidebar() {
  const [active, setActive] = useState("Project Management");
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, link: "/dashboard" },
    { name: "Human Resources", icon: <FaUsers />, link: "/hr" },
    { name: "Finance", icon: <FaCoins />, link: "/finance" },
    {
      name: "Project Management",
      icon: <FaProjectDiagram />,
      link: "/projects",
    },
    { name: "Customer", icon: <FaUserTie />, link: "/customer" },
    { name: "Documents", icon: <FaFolder />, link: "/documents" },
  ];

  return (
    <aside className="fixed w-72 top-20 bg-gray-200 h-screen hidden md:block  dark:bg-gray-800 ">
      <nav className="hidden w-72 md:block flex flex-col gap-4 p-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`flex items-center gap-3 p-2 rounded-md text-gray-700 dark:text-gray-300 transition-all
              ${
                active === item.name
                  ? "text-blue-500 font-semibold"
                  : "hover:bg-gray-300 dark:hover:bg-gray-700"
              }
            `}
            onClick={() => {
              setActive(item.name);
              router.push(item.link);
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
