import { getUserById } from "@/hooks/getUserById";
import { setUser } from "@/redux/slices/userSlice";
import { ChatbotMessageType } from "@/types/chatbotMessageType";
import { UserType } from "@/types/userType";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface ChatbotContainerProps {
  showAIChat: boolean;
  setShowAIChat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatbotContainer({
  showAIChat,
  setShowAIChat,
}: ChatbotContainerProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const dispatch = useDispatch();

  const [chatLog, setChatLog] = useState<ChatbotMessageType[]>([
    { sender: "ai", content: "Hello, how can I help you today ?" },
  ]);

  useEffect(() => {
    if(currentUser)
      (async () => {
        const response = await axios.get(`http://localhost:5110/api/chatbot/chat-log?id=${currentUser.id}`);
        if(response.status) 
          if(response.data.chatLog.length)
            setChatLog(response.data.chatLog);
      })();
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      const id = localStorage.getItem("id");
      if (id) await handleFetchUserData(id);
    })();
    setIsReady(true);
  }, []);

  const handleFetchUserData = async (value: string) => {
    const userData = (await getUserById(value)) as UserType;
    console.log(userData);
    setCurrentUser(userData);
    dispatch(setUser(userData));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (!input.trim()) return;

    const userMessage = input.trim();
    setChatLog((prev) => [...prev, { sender: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      // 🧠 Komut analizi
      const lowered = userMessage.toLowerCase();
      if (
        lowered.includes("görevleri ata") ||
        lowered.includes("ai ata") ||
        lowered.includes("görevleri eşleştir")
      ) {
        /* const res = await axios.get(
          `/api/chatbot/assign-tasks?projectId=${projectData.id}`
        );
        const data = res.data.assignments;

        const userList = usersData.map((u) => ({
          id: u.id,
          name: `${u.name} ${u.lastName}`,
        }));

        setAiAssignments(
          data.map((d: any) => ({
            taskId: d.taskId,
            taskDescription: d.taskDescription,
            assignedTo: d.userId,
          }))
        );
        setAvailableUsers(userList);
        setShowAssignmentModal(true); */

        setChatLog((prev) => [
          ...prev,
          {
            sender: "ai",
            content: "AI önerilerini oluşturdum. Lütfen onaylayın ✅",
          },
        ]);
      } else {
        const res = await axios.post("http://localhost:5110/api/chatbot/chat", {
          input: userMessage,
          userId: currentUser.id,
        });
        setChatLog((prev) => [...prev, { sender: "ai", content: res.data }]);
      }
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [
        ...prev,
        { sender: "ai", content: "Bir hata oluştu 😞" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isReady)
    return (
      <div>
        {showAIChat && (
          <div className="fixed bottom-20 right-6 w-96 bg-white dark:bg-gray-900 p-4 shadow-lg rounded-lg z-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-gray-700 dark:text-white">
                AI Assistant
              </h4>
              <button
                onClick={() => setShowAIChat(false)}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="h-96 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 text-sm">
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg shadow ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <p className="text-sm whitespace-pre-wrap">Typing...</p>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                className="flex-grow px-2 py-1 rounded border border-gray-300 dark:border-gray-600"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 rounded"
              >
                ➤
              </button>
            </form>
          </div>
        )}
      </div>
    );
}
