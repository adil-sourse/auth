import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import axios from "axios";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/login", {
        login,
        password,
      });

      localStorage.setItem("auth", "true");
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Вход в аккаунт
        </h1>

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
          Войти
        </Button>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">Нет аккаунта? </span>
          <span
            onClick={() => navigate("/register")}
            className="text-sm text-blue-700 font-medium cursor-pointer hover:underline"
          >
            Зарегистрироваться
          </span>
        </div>
      </form>
    </div>
  );
}
