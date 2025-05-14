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
  stock: number;
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
  stock,
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
    if (stock === 0) {
      toast.error("Товар отсутствует в наличии");
      return;
    }
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

  const isOutOfStock = stock === 0;

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs h-[25rem] mx-auto ${
          isOutOfStock ? "opacity-50" : "hover:cursor-pointer hover:scale-105"
        } duration-500 transition-all`}
      >
        <div
          className="w-64 h-64 rounded-2xl relative overflow-hidden mx-auto"
          onClick={() => !isOutOfStock && setIsModalOpen(true)}
        >
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover ${
              isOutOfStock ? "grayscale" : ""
            }`}
          />
        </div>

        <div className="p-4 flex flex-col h-[calc(100%-256px)]">
          <h2
            className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2"
            onClick={() => !isOutOfStock && setIsModalOpen(true)}
          >
            {name}
          </h2>
          <div className="flex justify-between items-end flex-1">
            <div onClick={() => !isOutOfStock && setIsModalOpen(true)}>
              <p className="text-xs text-gray-500 line-clamp-1 max-w-44">
                {description}
              </p>
              <p className="text-xs font-medium text-gray-600 bg-gray-100 rounded-lg px-2 py-1 inline-block mt-3 mb-1">
                В наличии: {stock} шт.
              </p>
              {isOutOfStock ? (
                <p className="text-base font-bold text-gray-500 mt-1">
                  Товар отсутствует
                </p>
              ) : (
                <p className="text-base font-bold text-gray-800 mt-1">
                  {price} ₸
                </p>
              )}
            </div>
            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleAddToBasket}
                disabled={isInBasket || loading || isOutOfStock}
                className={`ml-4 py-1.5 ${
                  isInBasket
                    ? "text-gray-600 cursor-not-allowed text-xs"
                    : "bg-black hover:bg-gray-800 text-white text-xs"
                } rounded-lg transition duration-300 w-24 z-10`}
              >
                {loading
                  ? "Загрузка..."
                  : isInBasket
                  ? "В корзине"
                  : "В корзину"}
              </button>
            )}
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
                  <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                    {description}
                  </p>
                  <p className="text-sm font-medium text-gray-600 bg-gray-100 rounded-lg px-2 py-1 inline-block mb-4">
                    В наличии: {stock} шт.
                  </p>
                  <div className="text-3xl font-bold text-black mb-6">
                    {price} ₸
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToBasket}
                    disabled={isInBasket || loading || isOutOfStock}
                    className={`px-6 py-3 rounded-xl font-semibold text-lg ${
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
