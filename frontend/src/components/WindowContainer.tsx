"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { getUserById } from "@/hooks/getUserById";
import { usePathname, useRouter } from "next/navigation";
import { UserType } from "@/types/userType";
import ChatbotContainer from "./chatbot/ChatbotContainer";
import { SignalRProvider } from "@/context/SignalRContext";
import { ChatProvider } from "@/context/ChatContext";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);

  const dispatch = useDispatch();
  const path = usePathname();
  const router = useRouter();

  const safePaths = ["/login", "/register"];

  useEffect(() => {
    (async () => {
      const id = localStorage.getItem("id");
      if (id) await handleFetchUserData(id);
      else {
        if (!safePaths.includes(path)) router.push("/login");
      }
    })();
    setIsReady(true);
  }, []);

  const handleFetchUserData = async (value: string) => {
    const userData = (await getUserById(value)) as UserType;
    setCurrentUser(userData);
    dispatch(setUser(userData));
  };

  if (!isReady) return <div>Loading...</div>;
  return (
    <SignalRProvider>
      <ChatProvider>
        <div className="relative">
          {currentUser && <Navbar />}
          <div className="flex">
            {currentUser && <Sidebar />}

            <ChatbotContainer {...{ showAIChat, setShowAIChat }} />

            <button
              className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
              onClick={() => setShowAIChat((v) => !v)}
            >
              💬 Ask AI
            </button>

            <div
              style={
                currentUser
                  ? {
                      marginLeft: sidebarVisible ? 287 : 0,
                      marginTop: 57,
                      width: "85%",
                      paddingTop: 50,
                      paddingBottom: 50,
                    }
                  : { width: "100%" }
              }
              className="dark:bg-gray-900 bg-gray-100"
            >
              {children}
            </div>
          </div>
        </div>
      </ChatProvider>
    </SignalRProvider>
  );
}
