import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import Chat from "../components/Chat";

export default function Account() {
  const [user, setUser] = useState<{
    login: string;
    name: string;
    email: string;
    phone: string;
    _id: string; // Добавляем _id для userId
  } | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        setUser(response.data); // Предполагаем, что _id приходит от сервера
      } catch (err: any) {
        console.error("Ошибка при загрузке данных пользователя:", err);
        setError(err.response?.data?.message || "Ошибка загрузки данных");
      }
    };
    fetchUser();
  }, []);

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
    setError("");
    setSuccess("");
  };

  const handleSave = async (field: string) => {
    try {
      if (
        field === "email" &&
        editValue &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editValue)
      ) {
        setError("Некорректный формат электронной почты");
        return;
      }

      if (
        field === "phone" &&
        editValue &&
        !/^\+?[1-9]\d{1,14}(\s*\(\d+\)\s*\d+[\s-]*\d+)*$/.test(editValue)
      ) {
        setError(
          "Некорректный формат номера телефона (например, +79991234567 или +7 (999) 123-45-67)"
        );
        return;
      }

      if (field === "login" && !editValue) {
        setError("Логин обязателен");
        return;
      }

      if (field === "password" && editValue && editValue.length < 8) {
        setError("Пароль должен быть не менее 8 символов");
        return;
      }

      const updateData: any = {};
      updateData[field] = editValue;

      const response = await axios.put(
        "http://localhost:5000/user",
        updateData,
        { withCredentials: true }
      );

      setUser((prev) => (prev ? { ...prev, [field]: editValue } : prev));
      setSuccess(response.data.message);
      setEditingField(null);
      setEditValue("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при обновлении");
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
    setError("");
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (err: any) {
      console.error("Ошибка при выходе из аккаунта:", err);
      setError("Ошибка при выходе");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-md animate-pulse">Загрузка...</div>
      </div>
    );
  }

  const fields = [
    { key: "login", label: "Логин", type: "text", value: user.login },
    { key: "name", label: "Имя", type: "text", value: user.name },
    {
      key: "email",
      label: "Электронная почта",
      type: "email",
      value: user.email,
    },
    { key: "phone", label: "Телефон", type: "tel", value: user.phone },
    { key: "password", label: "Пароль", type: "password", value: "********" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10 tracking-tight">
          Личный кабинет
        </h1>

        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6 transition-all duration-300 hover:shadow-xl">
          {fields.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-gray-50 rounded-lg px-4"
            >
              {editingField === field.key ? (
                <div className="flex items-center gap-4 w-full">
                  <input
                    type={field.type}
                    value={editValue}
                    placeholder={field.label}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-gray-50 transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave(field.key)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium shadow-sm"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 text-sm w-32">
                      {field.label}:
                    </span>
                    <span className="text-gray-600 text-sm">
                      {field.value || "Нет данных"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleEdit(
                        field.key,
                        field.value === "********" ? "" : field.value
                      )
                    }
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors hover:underline"
                  >
                    Изменить
                  </button>
                </div>
              )}
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg text-sm animate-fade-in">
              {success}
            </div>
          )}

          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Поддержка
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>

      <Chat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userId={user._id}
      />
    </div>
  );
}
