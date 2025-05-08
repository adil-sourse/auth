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
    <div>
      <Header />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Модерация товаров
        </h1>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <div className="mb-8 grid gap-2 sm:grid-cols-2 md:grid-cols-4 bg-white rounded-lg shadow-lg p-10">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border p-2 rounded-lg w-full"
          >
            <option value="">Выберите категорию</option>
            <option value="electronics">Электроника</option>
            <option value="clothing">Одежда</option>
            <option value="home">Дом</option>
          </select>

          <input
            name="name"
            placeholder="Название"
            value={newProduct.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="description"
            placeholder="Описание"
            value={newProduct.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="price"
            placeholder="Цена"
            value={newProduct.price}
            onChange={handleChange}
            type="number"
            step="0.01"
            className="border p-2 rounded"
          />
          <input
            name="image"
            placeholder="Ссылка на изображение"
            value={newProduct.image}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <div className="col-span-full flex justify-center mt-2">
            <button
              onClick={handleAdd}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Добавить продукт
            </button>
          </div>
        </div>

        <div className="text-center mt-10 mb-5 text-2xl">Список товаров</div>

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
  );
}
