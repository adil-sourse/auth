import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";

interface Message {
  message: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function Chat({ isOpen, onClose }: ChatProps) {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatError, setChatError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/chat", {
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setChatMessages(
          response.data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } else {
        setChatError("Сервер вернул некорректные данные");
      }
    } catch (err: any) {
      setChatError(err.response?.data?.message || "Ошибка загрузки сообщений");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchMessages();
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) {
      setChatError("Сообщение не может быть пустым");
      return;
    }

    setIsSending(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/chat",
        { message: chatInput },
        { withCredentials: true }
      );
      setChatMessages(
        response.data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
      setChatInput("");
      setChatError("");
    } catch (err: any) {
      setChatError(err.response?.data?.message || "Ошибка при отправке");
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChatInitiate = () => {
    setShowClearModal(true);
  };

  const handleClearChatConfirm = async () => {
    try {
      await axios.delete("http://localhost:5000/chat", {
        withCredentials: true,
      });
      setChatMessages([]);
      setChatError("");
    } catch (err: any) {
      setChatError(err.response?.data?.message || "Ошибка при очистке чата");
    } finally {
      setShowClearModal(false);
    }
  };

  const handleClearChatCancel = () => {
    setShowClearModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">Поддержка</h2>
          <div className="flex gap-6">
            <button onClick={handleClearChatInitiate} disabled={isSending}>
              <FaRegTrashAlt />
            </button>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 ? (
            <p className="text-gray-500 text-center">
              Нет сообщений. Начните чат!
            </p>
          ) : (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        {chatError && (
          <div className="bg-red-50 text-red-700 p-2 text-sm text-center">
            {chatError}
          </div>
        )}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
              onKeyPress={(e) =>
                e.key === "Enter" && !isSending && handleSendMessage()
              }
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              disabled={isSending}
            >
              {isSending ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </div>
      </div>

      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-black mb-4">
              Подтверждение очистки чата
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Точно хотите очистить чат? Все сообщения будут удалены.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClearChatCancel}
                className="px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition-colors text-sm"
              >
                Отмена
              </button>
              <button
                onClick={handleClearChatConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm"
              >
                Да
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
