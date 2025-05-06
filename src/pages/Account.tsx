import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

export default function Account() {
  const [user, setUser] = useState<{
    login: string;
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });
        setUser(response.data);
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
    return <div>Загрузка...</div>;
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Аккаунт
        </h1>

        <div className="max-w-md mx-auto space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="flex items-center flex-wrap gap-2">
              {editingField === field.key ? (
                <>
                  <input
                    type={field.type}
                    value={editValue}
                    placeholder={field.label}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="inline-block min-w-[100px] max-w-[200px] text-sm p-1"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSave(field.key)}
                    className="px-2 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-2 py-1 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <span className="font-medium">{field.label}: </span>
                  <span className="text-gray-600 mr-2">
                    {field.value || "Нет данных"}
                  </span>
                  <button
                    onClick={() =>
                      handleEdit(
                        field.key,
                        field.value === "********" ? "" : field.value
                      )
                    }
                    className="px-3 py-1 text-blue-600 text-sm hover:text-blue-800"
                  >
                    Изменить
                  </button>
                </>
              )}
            </div>
          ))}

          {error && (
            <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm mt-4 text-center">{success}</p>
          )}

          <button
            onClick={handleLogout}
            className="mt-20 py-1 px-3 max-w-xs mx-auto block bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
