"use client";

import * as signalR from "@microsoft/signalr";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { getUserById } from "@/hooks/getUserById";
import { UserType } from "@/types/userType";
import { useSignalR } from "@/context/SignalRContext";

// User interface
interface User {
  id: number;
  name: string;
  email: string;
  lastActivity?: string;
  isOnline?: boolean;
}

// Message interface
interface Message {
  senderUserId: number;
  receiverUserId: number;
  content: string;
  sendAt: string;
}

interface ClientChatComponentProps {
  target: UserType;
}

export default function ClientChatComponent({
  target,
}: ClientChatComponentProps) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [users, setUsers] = useState<User[]>([]);

  const [activeUser, setActiveUser] = useState<User | null>(null);

  const [userMessages, setUserMessages] = useState<{
    [key: number]: Message[];
  }>({
    1: [],
  });

  const [sessionCheckDone, setSessionCheckDone] = useState(false);

  const { connection } = useSignalR();

  const handleSessions = async () => {
    if (currentUser) {
      try {
        const response = await axios.get(
          `http://localhost:5110/api/chat/session/messages?userId=${currentUser.id}`
        );

        if (response.status === 200 && response.data.result) {
          const sessions = response.data.sessions;

          const mapped: { [key: number]: Message[] } = {};
          const extractedUsers: User[] = [];

          sessions.forEach((session: any) => {
            const isUser1 = session.user1Id === currentUser.id;
            const otherUser = isUser1 ? session.user2 : session.user1;
            const otherUserId = otherUser.id;

            mapped[otherUserId] = session.messages.map((m: any) => ({
              senderUserId: m.senderUserId,
              receiverUserId: m.receiverUserId,
              content: m.content,
              sendAt: new Date(m.sentAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }));

            if (!extractedUsers.find((u) => u.id === otherUserId)) {
              extractedUsers.push({
                id: otherUser.id,
                name: `${otherUser.name} ${otherUser.lastName}`,
                email: otherUser.email,
                lastActivity: new Date().toLocaleDateString(),
                isOnline: otherUser.statusName === "Available",
              });
            }
          });

          setUserMessages(mapped);
          setUsers(extractedUsers);
        }
      } catch (err) {
        console.error("Messages or Users couldn't found :", err);
      }
    }
  };

  useEffect(() => {
    if (!currentUser || !target || sessionCheckDone) return;

    (async () => {
      try {
        const response = await axios.get(
          `http://localhost:5110/api/chat/session/get-session?user1Id=${currentUser.id}&user2Id=${target.id}`
        );

        if (response.data?.result === false) {
          await axios.post(
            `http://localhost:5110/api/chat/session/create-session?user1Id=${currentUser.id}&user2Id=${target.id}`
          );
        }

        setSessionCheckDone(true);
        await handleSessions();
      } catch (err) {
        console.error("Error during session check or creation:", err);
      }
    })();
  }, [currentUser, target, sessionCheckDone]);

  useEffect(() => {
    if (users && users.length && target) {
      const foundUser = users.find((user) => user.id == target.id);
      setActiveUser(foundUser || null);
    }
  }, [users, target]);

  useEffect(() => {
    if (!connection || !currentUser) return;

    const handleReceiveMessage = (senderUserId: number, message: string) => {
      const newMsg = {
        senderUserId: +senderUserId,
        receiverUserId: +currentUser.id,
        content: message,
        sendAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setUserMessages((prev) => {
        const current = prev[senderUserId] || [];
        return {
          ...prev,
          [senderUserId]: [...current, newMsg],
        };
      });

      setUsers((prevUsers) => {
        const alreadyExists = prevUsers.some(
          (user) => user.id === senderUserId
        );
        if (!alreadyExists) {
          getUserById(senderUserId.toString()).then((d: UserType) => {
            setUsers((prev) => {
              if (!prev.find((u) => u.id === d.id)) {
                return [...prev, d];
              }
              return prev;
            });
          });
        }
        return prevUsers;
      });
    };

    connection.on("ReceiveMessage", handleReceiveMessage);

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
    };
  }, [connection, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages]);

  const sendMessage = async () => {
    if (currentUser && activeUser) {
      if (newMessage.trim() === "") return;

      const now = new Date();
      const sendAt = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const currentMessages = userMessages[activeUser.id] || [];
      const newMessageObj = {
        receiverUserId: activeUser.id,
        senderUserId: currentUser.id,
        content: newMessage,
        sendAt,
      };

      setUserMessages({
        ...userMessages,
        [activeUser.id]: [...currentMessages, newMessageObj],
      });

      await axios.post("http://localhost:5110/api/chat/message/private", {
        content: newMessage,
        senderUserId: currentUser.id,
        receiverUserId: activeUser.id,
      });

      setNewMessage("");
    }
  };

  // Get current user's messages
  const currentMessages = activeUser ? userMessages[activeUser.id] : [];
  if (!currentUser) return <div>Loading...</div>;
  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Left sidebar - User list */}
      {currentUser.roleName != "ItManager" && (
        <div className="w-64 border-r border-gray-700 bg-[#2c2c2c] flex flex-col">
          <div className="p-4 border-b flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
              {currentUser.name[0].toUpperCase()}
              {currentUser.lastName[0].toUpperCase()}
            </div>
            <div className="font-semibold">
              {currentUser.name.charAt(0).toUpperCase() +
                currentUser.name.slice(1)}{" "}
              {currentUser.lastName.charAt(0).toUpperCase() +
                currentUser.lastName.slice(1)}
            </div>
          </div>

          <div className="text-sm text-center my-2 text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <div className="overflow-y-auto flex-1">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-3 border-b border-gray-700 flex items-center space-x-3 cursor-pointer transition-colors duration-150 ${
                  activeUser && activeUser.id === user.id
                    ? "bg-blue-600"
                    : "hover:bg-[#333]"
                }`}
                onClick={() => setActiveUser(user)}
              >
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">
                      {user.lastActivity}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Middle - Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b flex justify-between items-center">
          <div>
            <div className="font-semibold text-lg">
              {activeUser && activeUser.name}
            </div>
            <div className="text-sm text-gray-500">
              {activeUser && activeUser.email}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#202020]">
          {currentMessages.map((msg) => (
            <div
              className={`flex ${
                msg.senderUserId == currentUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="flex items-end space-x-2">
                {msg.senderUserId != currentUser.id && (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                    <img
                      src={`https://ui-avatars.com/api/?name=${
                        activeUser && activeUser.name
                      }&background=random`}
                      alt={"photo"}
                    />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                    msg.senderUserId != currentUser.id
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border"
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {msg.sendAt}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-700 bg-[#181818]">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <div className="px-2 py-1 bg-green-500 text-white rounded text-xs font-medium mr-2">
              OPEN
            </div>
            <input
              type="text"
              placeholder="Reply to the visitor..."
              className="flex-1 p-2 bg-transparent outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="p-2 text-gray-500 hover:text-gray-700"
              onClick={sendMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Right sidebar - User details */}
      <div className="w-72 border-l border-gray-700 bg-[#2c2c2c]">
        <div className="p-6 flex flex-col items-center text-center text-sm">
          {/* Profil Fotoğrafı */}
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            className="w-24 h-24 rounded-full shadow-lg mb-4 border-4 border-green-500"
          />
          <h3 className="text-lg font-bold text-white">
            {target.name} {target.lastName}
          </h3>
          <p className="text-green-400 text-sm mb-2">Client</p>

          {/* Ayırıcı */}
          <hr className="border-t-2 border-green-500 w-full mb-6" />

          {/* Bilgi Blokları */}
          <div className="space-y-4 text-left w-full text-gray-300">
            <div>
              <h4 className="text-xs font-bold text-green-400 uppercase mb-1">
                Phone
              </h4>
              <p>{target.phone}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-green-400 uppercase mb-1">
                Email
              </h4>
              <p className="break-all">{target.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
