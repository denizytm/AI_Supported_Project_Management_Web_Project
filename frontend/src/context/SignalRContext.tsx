"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface SignalRContextType {
  connection: signalR.HubConnection | null;
}

const SignalRContext = createContext<SignalRContextType>({ connection: null });

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  useEffect(() => {
    if (currentUser && !connection) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5110/chatHub")
        .withAutomaticReconnect()
        .build();

      newConnection
        .start()
        .then(() => {
          console.log("SignalR bağlantısı kuruldu");
          newConnection.invoke("Register", currentUser.id);
          setConnection(newConnection);
        })
        .catch((err) => console.error("SignalR bağlantı hatası:", err));
    }
  }, [currentUser]);

  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
};
