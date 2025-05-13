import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

interface Order {
  _id: string;
  userId: {
    login: string;
    email: string;
  };
  items: {
    productId: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  createdAt: string;
  status: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orders", {
          withCredentials: true,
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Ошибка загрузки заказов");
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  const handleDeleteInitiate = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/orders/${orderToDelete}`,
        {
          withCredentials: true,
        }
      );
      setOrders(response.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка при удалении заказа");
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
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
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button className="absolute top-10" onClick={() => navigate("/admin")}>
          <IoIosArrowBack size={30} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          История заказов
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-r-lg text-sm">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">Заказы отсутствуют</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {orders.map((order) => (
              <div key={order._id} className="border-b py-4 last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Заказ #{order._id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Пользователь: {order.userId.login} ({order.userId.email})
                    </p>
                    <p className="text-sm text-gray-600">
                      Дата: {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Статус: {order.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Способ оплаты: {order.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-md font-medium">Адрес доставки</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      Телефон: {order.shippingAddress.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      Email: {order.shippingAddress.email}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">Товары</h4>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600 mb-1"
                    >
                      <span>
                        {item.productId.name} x {item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString()} ₸
                      </span>
                    </div>
                  ))}
                  <div className="mt-2 text-md font-bold flex justify-end">
                    <span>Итого: {order.total.toLocaleString()} ₸</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteInitiate(order._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">
              Подтверждение удаления
            </h2>
            <p className="mb-4 text-sm text-gray-700">
              Вы уверены, что хотите удалить заказ #{orderToDelete}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
