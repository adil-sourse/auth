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
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setNewProduct({ ...newProduct, category: e.target.value });
    setError("");
  };

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price) {
      setError("Название и цена обязательны");
      return;
    }

    const priceNum = parseFloat(newProduct.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Цена должна быть положительным числом");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...newProduct,
          price: priceNum,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 401 || res.status === 403) {
          navigate("/login");
          return;
        }
        throw new Error(errorData.message || "Ошибка при добавлении продукта");
      }

      const updated = await res.json();
      setProducts(updated);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
      });
      setSelectedCategory("");
      setError("");
    } catch (err: any) {
      console.error("Ошибка при добавлении:", err);
      setError(err.message || "Ошибка сервера");
    }
  };

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
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editProduct) return;

    const priceNum = parseFloat(editProduct.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Цена должна быть положительным числом");
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
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Модерация товаров
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-r-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Добавить новый продукт
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Название
              </label>
              <input
                name="name"
                id="name"
                placeholder="Введите название"
                value={newProduct.name}
                onChange={handleChange}
                className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Категория
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
              >
                <option value="">Выберите категорию</option>
                <option value="electronics">Электроника</option>
                <option value="clothing">Одежда</option>
                <option value="home">Дом</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Цена (₸)
              </label>
              <input
                name="price"
                id="price"
                placeholder="Введите цену"
                value={newProduct.price}
                onChange={handleChange}
                type="number"
                step="0.01"
                className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Ссылка на изображение
              </label>
              <input
                name="image"
                id="image"
                placeholder="Введите URL изображения"
                value={newProduct.image}
                onChange={handleChange}
                className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Описание
              </label>
              <input
                name="description"
                id="description"
                placeholder="Введите описание"
                value={newProduct.description}
                onChange={handleChange}
                className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleAdd}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Добавить продукт
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            Список товаров
          </h2>
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
