import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/button";
import useAuth from "../hooks/useAuth";
import { IoLogoOctocat } from "react-icons/io5";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleAccountClick = () => {
    handleNavigate(user ? "/account" : "/login");
  };

  return (
    <header
      className={`${
        transparent
          ? "bg-transparent text-white"
          : "bg-white text-black shadow-md"
      } sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="flex justify-between items-center px-6 md:px-20 py-5 md:py-6">
        <div className="flex items-center gap-20 cursor-pointer">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <IoLogoOctocat className="size-8" />
            <span className="hidden md:inline text-xl font-semibold">
              Магазин
            </span>
          </div>

          <div className="hidden md:flex gap-10 items-center">
            <span
              onClick={() => navigate("/")}
              className="hover:text-gray-400 cursor-pointer"
            >
              Главная
            </span>
            <span
              onClick={() => navigate("/products")}
              className="hover:text-gray-400 cursor-pointer"
            >
              Товары
            </span>
            <span
              onClick={() => navigate("/basket")}
              className="hover:text-gray-400 cursor-pointer"
            >
              Корзина
            </span>
          </div>
        </div>

        <div className={`hidden md:flex gap-4 items-center `}>
          <Button
            onClick={handleAccountClick}
            className={`${transparent ? "bg-transparent text-white " : ""}`}
          >
            {user ? "Аккаунт" : "Вход"}
          </Button>
          {user?.role === "admin" && (
            <Button onClick={() => navigate("/admin")}>Модерация</Button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={`md:hidden px-6 pb-4 space-y-4  shadow-inner ${
            transparent ? "bg-transparent text-white" : "bg-white text-black"
          }`}
        >
          <div
            onClick={() => handleNavigate("/")}
            className="cursor-pointer hover:text-gray-600"
          >
            Главная
          </div>
          <div
            onClick={() => handleNavigate("/products")}
            className="cursor-pointer hover:text-gray-600"
          >
            Товары
          </div>
          <div
            onClick={() => handleNavigate("/basket")}
            className="cursor-pointer hover:text-gray-600"
          >
            Корзина
          </div>

          <div onClick={handleAccountClick}>
            <Button>{user ? "Аккаунт" : "Вход"}</Button>
          </div>
          {user?.role === "admin" && (
            <div onClick={() => handleNavigate("/admin")}>
              <Button>Модерация</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
