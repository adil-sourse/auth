import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/button";
import useAuth from "../hooks/useAuth";
import Logo from "../assets/logo.png";
import { Menu, X } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      navigate("/login");
    }
    setMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="flex justify-between items-center px-10 md:px-20 py-5 md:py-7 mx-auto">
        <div className="flex gap-12">
          <div className="md:flex items-center gap-4">
            <span onClick={() => navigate("/")} className="cursor-pointer">
              <img src={Logo} alt="Logo" className="w-10" />
            </span>
          </div>

          <div className="hidden md:flex gap-10">
            <span
              onClick={() => navigate("/")}
              className="hover:text-gray-600 cursor-pointer"
            >
              Discover
            </span>
            <span
              onClick={() => navigate("/")}
              className="hover:text-gray-600 cursor-pointer"
            >
              Creators
            </span>
            <span
              onClick={() => navigate("/")}
              className="hover:text-gray-600 cursor-pointer"
            >
              Sell
            </span>
            <span
              onClick={() => navigate("/")}
              className="hover:text-gray-600 cursor-pointer"
            >
              Stats
            </span>
          </div>
        </div>

        <div className="hidden md:flex gap-4">
          <span onClick={handleAccountClick} className="cursor-pointer">
            <Button>{user ? "Account" : "Login"}</Button>
          </span>
          {user?.role === "admin" && (
            <span onClick={() => navigate("/admin")} className="cursor-pointer">
              <Button>Admin</Button>
            </span>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4">
          {["Discover", "Creators", "Sell", "Stats"].map((item) => (
            <div
              key={item}
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="cursor-pointer text-gray-800 hover:text-gray-600"
            >
              {item}
            </div>
          ))}
          <div onClick={handleAccountClick}>
            <Button>{user ? "Account" : "Login"}</Button>
          </div>
          {user?.role === "admin" && (
            <div
              onClick={() => {
                navigate("/admin");
                setMenuOpen(false);
              }}
            >
              <Button>Admin</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
