import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Main() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1">
        <div className="relative h-full w-full">
          <img
            src="https://picsum.photos/1920/1080"
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Добро пожаловать</h1>
              <p className="text-lg mb-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatum, aliquam.
              </p>
              <button
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
                onClick={() => navigate("/products")}
              >
                Каталог
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
