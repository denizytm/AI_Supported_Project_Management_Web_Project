"use client";

import { RootState } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCoins,
  FaProjectDiagram,
  FaUserTie,
  FaFolder,
} from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const [active, setActive] = useState("Project Management");
  const router = useRouter();

  const [menuItems, setMenuItems] = useState([
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      link: "/dashboard",
      roles: ["Admin", "ProjectManager", "Developer", "Client"],
    },
    {
      name: "Human Resources",
      icon: <FaUsers />,
      link: "/hr",
      roles: ["Admin"],
    },
    {
      name: "Finance",
      icon: <FaCoins />,
      link: "/finance",
      roles: ["Admin"],
    },
    {
      name: "Project Management",
      icon: <FaProjectDiagram />,
      link: "/projects",
      roles: ["Admin", "ProjectManager", "Developer"],
    },
    {
      name: "Client",
      icon: <FaUserTie />,
      link: "/client",
      roles: ["Client"],
    },
    {
      name: "Documents",
      icon: <FaFolder />,
      link: "/documents",
      roles: ["Admin", "ProjectManager"],
    },
  ]);

  const [filteredMenuItems, setFilteredMenuItems] = useState<
    {
      name: string;
      icon: JSX.Element;
      link: string;
      roles: string[];
    }[]
  >([]);

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  useEffect(() => {
    if (currentUser) {
      setFilteredMenuItems(
        menuItems.filter((item) => item.roles.includes(currentUser?.roleName))
      );
    }
  }, [currentUser]);

  return (
    <aside className="fixed w-72 top-20 bg-gray-200 h-screen hidden md:block  dark:bg-gray-800 ">
      <nav className="hidden w-72 md:block flex flex-col gap-4 p-4">
        {filteredMenuItems.map((item) => (
          <Link href={item.link} key={item.name}>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
              {item.icon}
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
