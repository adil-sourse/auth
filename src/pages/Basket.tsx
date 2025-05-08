import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface BasketItem {
  productId: {
    _id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    category: string;
  };
  quantity: number;
}

export default function Basket() {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const response = await axios.get("http://localhost:5000/basket", {
          withCredentials: true,
        });
        setBasket(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка загрузки корзины");
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };
    fetchBasket();
  }, [navigate]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/basket/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      setBasket(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка обновления корзины");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/basket/${productId}`,
        { withCredentials: true }
      );
      setBasket(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка удаления из корзины");
    }
  };

  const calculateTotal = () => {
    return basket
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-md animate-pulse">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Ваша корзина
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-r-lg text-sm">
            {error}
          </div>
        )}

        {basket.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-md">Ваша корзина пуста</p>
            <button
              onClick={() => navigate("/")}
              className="mt-3 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Перейти к покупкам
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {basket.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.productId.name}
                  </h2>
                  <p className="text-gray-500 mt-1 text-sm line-clamp-2">
                    {item.productId.description}
                  </p>
                  <p className="text-gray-900 font-medium mt-1 text-md">
                    {item.productId.price.toLocaleString()} ₸
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId._id,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-900 text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId._id,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors "
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-xl font-bold text-gray-900">
                Итого: {calculateTotal()} ₸
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-black text-white px-6 py-2 rounded-lg hover:scale-105 transition-scale duration-100 text-md font-medium"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
