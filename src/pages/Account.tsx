import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";

export default function Account() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      console.log("Response:", response.data);
      navigate("/");
    } catch (err: any) {
      console.error("Ошибка при выходе из аккаунта:", err);
    }
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
