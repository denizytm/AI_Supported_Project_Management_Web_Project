"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useDispatch } from "react-redux";
import { setUser, UserType } from "@/redux/slices/userSlice";
import { getUserById } from "@/hooks/getUserById";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    /* (async () => {
      await handleFetchUserData();
    })(); */
    setIsReady(true);
  }, []);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  const handleFetchUserData = async () => {
    const userData = (await getUserById("1")) as UserType;
    setCurrentUser(userData);
    dispatch(setUser(userData));
  };

  if (!isReady) return <div>Loading...</div>;
  return (
    <div>
      {currentUser && <Navbar />}
      <div className="flex">
        {currentUser && <Sidebar />}
        <div className="w-full" >
         {children}
        </div>
      </div>
    </div>
  );
}
