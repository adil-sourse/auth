import axios from "axios";
import Button from "./ui/button";

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  category: string;
}

interface ProductCardProps extends Product {}

export default function ProductCard({
  _id,
  name,
  image,
  description,
  price,
}: ProductCardProps) {
  const handleAddToBasket = async () => {
    try {
      await axios.post(
        "http://localhost:5000/basket",
        { productId: _id, quantity: 1 },
        { withCredentials: true }
      );
      alert("Товар добавлен в корзину!");
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        window.location.href = "/login";
      } else {
        alert(err.response?.data?.message || "Ошибка добавления в корзину");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs h-96 mx-auto">
      <div className="w-64 h-64 rounded-2xl relative overflow-hidden mx-auto">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
          {name}
        </h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
            <p className="text-lg font-bold text-gray-800 line-clamp-1">
              {price} ₸
            </p>
          </div>
          <Button
            type="button"
            onClick={handleAddToBasket}
            className="ml-6 px-4 py-2 text-white bg-black text-lg font-medium rounded-lg transition duration-300 w-32"
          >
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
}
