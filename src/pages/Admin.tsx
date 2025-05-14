import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCardAdmin from "../components/CardAdmin";
import EditProductModal from "../components/ModalAdmin";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  category: string;
  stock: number;
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => {
        console.error("Ошибка загрузки продуктов:", err);
        setError("Ошибка загрузки продуктов");
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401 || res.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error(errorData.message || "Ошибка при удалении продукта");
      }

      const updated = await res.json();
      setProducts(updated);
    } catch (err: any) {
      console.error("Ошибка при удалении:", err);
      setError(err.message || "Ошибка сервера");
    }
  };

  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
    setError("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editProduct) return;
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: name === "stock" ? parseInt(value) || 1 : value,
    });
  };

  const handleUpdate = async () => {
    if (!editProduct) return;

    const priceNum = parseFloat(editProduct.price);
    const stockNum = parseInt(editProduct.stock.toString());
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Цена должна быть положительным числом");
      return;
    }
    if (isNaN(stockNum) || stockNum < 1 || stockNum > 100) {
      setError("Наличие должно быть от 1 до 100");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/products/${editProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ...editProduct,
            price: priceNum,
            stock: stockNum,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401 || res.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error(errorData.message || "Ошибка при обновлении продукта");
      }

      const updated = await res.json();
      setProducts(updated);
      setIsModalOpen(false);
      setEditProduct(null);
      setError("");
    } catch (err: any) {
      console.error("Ошибка при обновлении:", err);
      setError(err.message || "Ошибка сервера");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Панель администратора
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/add-product")}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Добавить товар
              </h3>
              <p className="text-sm text-gray-600">
                Создайте новый товар, указав название, цену, категорию и другие
                детали.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate("/order-history")}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                История заказов
              </h3>
              <p className="text-sm text-gray-600">
                Просмотрите и управляйте всеми заказами пользователей.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Список товаров
          </h2>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-r-lg text-sm">
              {error}
            </div>
          )}
          {products.length === 0 ? (
            <p className="text-gray-500 text-center">Товары отсутствуют</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCardAdmin
                  key={product._id}
                  product={product}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>

        {isModalOpen && editProduct && (
          <EditProductModal
            product={editProduct}
            onChange={handleEditChange}
            onClose={() => setIsModalOpen(false)}
            onSave={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
