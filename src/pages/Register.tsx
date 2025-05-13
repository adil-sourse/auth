import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import axios from "axios";

export default function Register() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!login || !email || !password) {
      setError("Все поля обязательны");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Введите корректный адрес электронной почты");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/register",
        {
          login,
          email,
          password,
          role: "user",
        },
        { withCredentials: true }
      );

      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при регистрации");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen justify-center items-center">
      <form
        onSubmit={handleRegister}
        className="bg-white w-full max-w-sm p-8 shadow-lg rounded-2xl"
      >
        <h1 className="font-bold text-3xl text-center mb-6 text-gray-800">
          Регистрация
        </h1>
        <Input
          type="email"
          value={email}
          placeholder="Почта"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="text"
          value={login}
          placeholder="Логин"
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <Input
          type="password"
          value={password}
          placeholder="Пароль"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-600 text-sm mt-1 mb-2 text-center">{error}</p>
        )}

        <Button type="submit" className="mt-4">
          Создать аккаунт
        </Button>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">Есть аккаунт? </span>
          <span
            onClick={() => navigate("/login")}
            className="text-sm text-blue-700 font-medium hover:underline cursor-pointer"
          >
            Войти
          </span>
        </div>
      </form>
    </div>
  );
}
