"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { getUserById } from "@/hooks/getUserById";
import { usePathname, useRouter } from "next/navigation";
import { UserType } from "@/types/userType";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const [sidebarVisible, setSidebarVisible] = useState(true);

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
    <div className="relative">
      {currentUser && <Navbar />}
      <div className="flex">
        {currentUser && <Sidebar />}
        <div
          style={
            currentUser
              ? {
                  marginLeft: sidebarVisible ? 290 : 0,
                  marginTop: 80,
                  width: "85%",
                  paddingTop: 25,
                  paddingBottom: 25,
                }
              : { width: "100%" }
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
