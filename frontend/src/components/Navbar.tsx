"use client";

import { useChatContext } from "@/context/ChatContext";
import { useSignalR } from "@/context/SignalRContext";
import { setUserStatus } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { NotificationType } from "@/types/notificationType";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaRegSun,
  FaRegMoon,
  FaCog,
  FaBell,
  FaUser,
  FaCalendar,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  const dispatch = useDispatch();
  const { connection } = useSignalR();
  const router = useRouter();
  const { isChatOpen } = useChatContext();

  useEffect(() => {
    if (currentUser)
      (async () => {
        const response = await axios.get(
          `http://localhost:5110/api/notifications/get?userId=${currentUser.id}`
        );

        if (response.status) {
          setNotifications(response.data);
        }
      })();
  }, [currentUser]);

  const handleStatusChange = async (newStatus: string) => {
    if (currentUser) {
      try {
        const response = await axios.put(
          `http://localhost:5110/api/users/update?id=${currentUser.id}`,
          {
            statusName: newStatus,
          }
        );

        if (response.status === 200) {
          dispatch(setUserStatus(newStatus));
        } else {
          alert("Failed to update status.");
        }
      } catch (error) {
        console.error("Status update error:", error);
        alert("An error occurred while updating status.");
      }
    }
  };

  const handleReadNotification = async (notificationIds: number[]) => {
    await axios.post(
      "http://localhost:5110/api/notifications/mark-read",
      notificationIds
    );
  };

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveNotification", (notification: NotificationType) => {
        console.log("New notification :", notification);
        if (isChatOpen && notification.title === "New Message") {
          setNotifications(prev => [{...notification,isRead : true},...prev])
          handleReadNotification([notification.id]);
        }else {
          setNotifications((prev) => [notification, ...prev]);
        }

      });
    }

    return () => {
      connection?.off("ReceiveNotification");
    };
  }, [connection, isChatOpen]);

  const handleLogOut = () => {
    localStorage.removeItem("id");
    window.location.reload();
  };

  if (!currentUser) return <>Loading...</>;
  return (
    <nav
      className="fixed w-full flex items-center justify-between bg-gray-200 dark:bg-gray-800 p-4 py-6"
      style={{ zIndex: "99999999999999999999" }}
    >
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")}>
          <h1 className="text-xl font-bold dark:text-white">ERP</h1>
        </button>
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

        <div className="flex items-center gap-4 relative text-gray-700 dark:text-white">
          {/* 🔔 Notification Icon */}
          <div className="relative">
            <FaBell
              className="cursor-pointer text-lg"
              onClick={() => setNotificationOpen(!notificationOpen)}
            />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {
                notifications.filter((notification) => !notification.isRead)
                  .length
              }
            </span>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 z-50">
                <div className="p-4 font-bold text-gray-800 dark:text-white border-b dark:border-gray-700">
                  🔔 Notifications
                </div>
                <ul className="max-h-72 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-600">
                  {notifications.map((notif) => (
                    <li
                      value={notif.id}
                      onClick={async (e) => {
                        setNotifications((n) =>
                          n.map((noti) => {
                            if (noti.id == notif.id)
                              return { ...noti, isRead: true };
                            return noti;
                          })
                        );
                        await handleReadNotification([notif.id]);
                        if (notif.link) router.push(notif.link);
                      }}
                      key={notif.id}
                      className={`px-4 py-3 transition-colors duration-200 cursor-pointer ${
                        notif.isRead
                          ? "bg-gray-300 dark:bg-gray-800 text-gray-400"
                          : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`font-semibold`}>{notif.title}</span>
                        <span
                          className={`text-sm mt-1 ${
                            notif.isRead
                              ? "text-gray-400"
                              : "text-gray-700 dark:text-gray-700"
                          }`}
                        >
                          {notif.message}
                        </span>
                        <span className="text-xs text-gray-400 mt-2 self-end">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="text-center text-sm p-3 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  See All Notifications
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <FaUser
            className="cursor-pointer"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          />

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600 z-50">
              {/* Profil Bilgisi */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${currentUser.name}+${currentUser.lastName}&background=random`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {currentUser.name} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser.roleName}
                  </p>
                </div>
              </div>

              {/* Status Seçimi */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={currentUser.statusName}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 p-2 rounded"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="OnLeave">On Leave</option>
                </select>
              </div>

              {/* Menü Seçenekleri */}
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
