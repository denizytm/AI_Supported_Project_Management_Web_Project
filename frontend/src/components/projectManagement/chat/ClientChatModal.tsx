import React from "react";

interface ChatModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function ClientChatModal({ onClose, children }: ChatModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center">
      <div className="w-full max-w-7xl h-[85vh] bg-white dark:bg-[#1c1c1c] rounded-xl shadow-lg relative overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
