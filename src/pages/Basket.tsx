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
    return <div className="text-center mt-10">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Корзина
        </h1>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        {basket.length === 0 ? (
          <p className="text-center text-gray-600">Ваша корзина пуста</p>
        ) : (
          <div className="space-y-4">
            {basket.map((item) => (
              <div
                key={item.productId._id}
                className="flex items-center bg-white p-4 rounded-lg shadow-md"
              >
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.productId.name}
                  </h2>
                  <p className="text-gray-600">{item.productId.description}</p>
                  <p className="text-gray-800 font-medium">
                    Цена: {item.productId.price} ₽
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId._id,
                          item.quantity - 1
                        )
                      }
                      className="px-2 py-1 bg-gray-300 rounded-lg"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId._id,
                          item.quantity + 1
                        )
                      }
                      className="px-2 py-1 bg-gray-300 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.productId._id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Удалить
                </button>
              </div>
            ))}
            <div className="text-right mt-6">
              <p className="text-xl font-bold">Итого: {calculateTotal()} ₽</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
