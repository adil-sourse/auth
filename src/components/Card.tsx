import axios from "axios";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  category: string;
}

interface BasketItem {
  productId: {
    _id: string;
  };
  quantity: number;
}

interface ProductCardProps extends Product {}

export default function ProductCard({
  _id,
  name,
  image,
  description,
  price,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInBasket, setIsInBasket] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const response = await axios.get("http://localhost:5000/basket", {
          withCredentials: true,
        });
        const basket: BasketItem[] = response.data;

        const inBasket = basket.some((item) => item.productId._id === _id);
        setIsInBasket(inBasket);
        setLoading(false);
      } catch (err: any) {
        console.error("Ошибка загрузки корзины", err);
        setLoading(false);
      }
    };
    fetchBasket();
  }, [_id]);

  const handleAddToBasket = async () => {
    try {
      await axios.post(
        "http://localhost:5000/basket",
        { productId: _id, quantity: 1 },
        { withCredentials: true }
      );
      toast.success("Товар добавлен в корзину!");
      setIsInBasket(true);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.location.href = "/login";
      } else {
        toast.error(
          err.response?.data?.message || "Ошибка добавления в корзину"
        );
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs h-96 mx-auto hover:cursor-pointer hover:scale-105 duration-500 transition-all">
        <div
          className="w-64 h-64 rounded-2xl relative overflow-hidden mx-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="p-5">
          <h2
            className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1"
            onClick={() => setIsModalOpen(true)}
          >
            {name}
          </h2>
          <div className="flex justify-between items-center">
            <div onClick={() => setIsModalOpen(true)}>
              <p className="text-sm text-gray-500 line-clamp-1 max-w-44">
                {description}
              </p>
              <p className="text-lg font-bold text-gray-800 line-clamp-1">
                {price} ₸
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddToBasket}
              disabled={isInBasket || loading}
              className={`ml-6 py-2    ${
                isInBasket
                  ? "text-gray-600 cursor-not-allowed text-md"
                  : "bg-black hover:bg-gray-800 text-white text-sm"
              } rounded-lg transition duration-300 w-32 z-10`}
            >
              {loading ? "Загрузка..." : isInBasket ? "В корзине" : "В корзину"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-2xl pb-8 pt-4 px-8 max-w-3xl w-full mx-4 shadow-2xl">
            <div className="flex justify-end">
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setIsModalOpen(false)}
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-96 object-cover rounded-xl shadow-md"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {name}
                  </h2>
                  <p className="text-gray-600 text-lg mb-4 leading-relaxed ">
                    {description}
                  </p>
                  <div className="text-3xl font-bold text-black mb-6">
                    {price} ₸
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToBasket}
                    disabled={isInBasket || loading}
                    className={`  px-6 py-3 rounded-xl font-semibold text-lg ${
                      isInBasket
                        ? "text-gray-600 cursor-not-allowed"
                        : "hover:bg-gray-800 bg-black text-white"
                    } transition-colors duration-300 w-full`}
                  >
                    {loading
                      ? "Загрузка..."
                      : isInBasket
                      ? "В корзине"
                      : "Добавить в корзину"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
