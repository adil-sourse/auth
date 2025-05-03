import { useNavigate } from "react-router-dom";
import Button from "./ui/button";
import useAuth from "../hooks/useAuth";
import Logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-between px-20 py-7 items-center">
      <div className="flex gap-16">
        <div>
          <span onClick={() => navigate("/")} className="cursor-pointer">
            <img src={Logo} alt="Logo" className="w-10" />
          </span>
        </div>
        <div className="flex gap-10">
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
      <div className="flex gap-5">
        <span
          onClick={handleAccountClick}
          className="cursor-pointer flex items-center gap-1 hover:text-slate-300"
        >
          {user ? <Button>Account</Button> : <Button>Login</Button>}
        </span>

        {user && user.role === "admin" && (
          <span
            onClick={() => navigate("/admin")}
            className="cursor-pointer flex items-center gap-1 hover:text-slate-300"
          >
            <Button>Admin</Button>
          </span>
        )}
      </div>
    </div>
  );
}
