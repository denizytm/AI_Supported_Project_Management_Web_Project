"use client";

import { createContext, useContext, useState } from "react";

interface ChatContextType {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  unreadCount: number;
  incrementUnread: () => void;
  resetUnread: () => void;
}

const ChatContext = createContext<ChatContextType>({
  isChatOpen: false,
  setIsChatOpen: () => {},
  unreadCount: 0,
  incrementUnread: () => {},
  resetUnread: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const incrementUnread = () => setUnreadCount((prev) => prev + 1);
  const resetUnread = () => setUnreadCount(0);

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        setIsChatOpen,
        unreadCount,
        incrementUnread,
        resetUnread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
