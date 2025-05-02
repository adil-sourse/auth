import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import Button from "./ui/button";
import { IoIosSearch } from "react-icons/io";

export default function Header() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsAuth(auth === "true");
  }, []);

  const handleAccountClick = () => {
    navigate(isAuth ? "/account" : "/login");
  };

  return (
    <div className="flex justify-between px-20 py-7 items-center ">
      <div className="flex gap-16">
        <div className="">
          <span onClick={() => navigate("/")} className="cursor-pointer">
            <img src={Logo} alt="" className="w-10" />
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
        <div className="relative">
          <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search"
            className="bg-white border py-2 pl-10 pr-3 text-sm rounded-md focus:outline-gray-400"
          />
        </div>

        <span
          onClick={handleAccountClick}
          className="cursor-pointer flex items-center gap-1 hover:text-slate-300"
        >
          {isAuth ? (
            <div className="flex">
              <Button>Account</Button>
            </div>
          ) : (
            <Button>Login</Button>
          )}
        </span>
      </div>
    </div>
  );
}
