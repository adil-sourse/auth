import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Account() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div className="">
      <Header />
      <div className="flex justify-center items-center h-screen">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
