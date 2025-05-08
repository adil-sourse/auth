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

export default function Checkout() {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "card",
  });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/checkout",
        { ...formData, basket },
        { withCredentials: true }
      );
      navigate("/order-confirmation");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при оформлении заказа");
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
    <div className="min-h-screen ">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Оформление заказа
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-r-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Информация о заказе
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Имя
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите имя"
                    className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Фамилия
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите фамилию"
                    className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Введите email"
                  className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Введите номер"
                  className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Адрес доставки
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Введите адрес"
                  className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Город
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите город"
                    className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Почтовый индекс
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите индекс"
                    className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700"
                >
                  Способ оплаты
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
                >
                  <option value="card">Кредитная карта</option>
                  <option value="cash">Наличные при доставке</option>
                  <option value="online">Apple Pay</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-md font-medium"
              >
                Подтвердить заказ
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Сводка заказа
            </h2>
            <div className="space-y-4">
              {basket.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.productId.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Кол-во: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {(item.productId.price * item.quantity).toLocaleString()}{" "}
                      ₸
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Итого:</span>
                  <span>{calculateTotal()} ₸</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/basket")}
                className="w-full bg-gray-100 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Вернуться в корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
