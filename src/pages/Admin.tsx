import { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/ui/button";
import { MdModeEdit } from "react-icons/md";

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

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setNewProduct({ ...newProduct, category: e.target.value });
  };

  const handleAdd = async () => {
    const res = await fetch("http://localhost:5000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (res.ok) {
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
    }
  };

  const handleDelete = async (id: string) => {
    await fetch("http://localhost:5000/products/${id}", { method: "DELETE" });
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editProduct) return;
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!editProduct) return;
    const res = await fetch(
      `http://localhost:5000/products/${editProduct._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      }
    );

    if (res.ok) {
      const updated = await res.json();
      setProducts(updated);
      setIsModalOpen(false);
      setEditProduct(null);
    }
  };

  return (
    <div>
      <Header />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin products</h1>

        <div className="mb-8 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
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
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Добавить продукт
            </button>
          </div>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs h-96 mx-auto"
            >
              <div className="w-64 h-64 mt-3 md:mt-0 rounded-2xl relative overflow-hidden mx-auto">
                <button
                  onClick={() => handleEditClick(product)}
                  className="absolute top-2 right-2 bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-70 transition"
                >
                  <MdModeEdit className="text-white size-5" />
                </button>
                <img
                  src={product.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                  {product.name}
                </h2>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-gray-800 line-clamp-1">
                      {product.price} ₸
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDelete(product._id)}
                    type="button"
                    className="ml-6 px-4 py-2 text-white bg-red-600 text-lg font-medium rounded-lg transition duration-300 w-1/2"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>

      {/* Модальное окно редактирования */}
      {isModalOpen && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              Редактировать продукт
            </h2>

            <div className="grid gap-4">
              <input
                name="name"
                placeholder="Название"
                value={editProduct.name}
                onChange={handleEditChange}
                className="border p-2 rounded"
              />
              <input
                name="description"
                placeholder="Описание"
                value={editProduct.description}
                onChange={handleEditChange}
                className="border p-2 rounded"
              />
              <input
                name="price"
                placeholder="Цена"
                value={editProduct.price}
                onChange={handleEditChange}
                className="border p-2 rounded"
              />
              <input
                name="image"
                placeholder="Ссылка на изображение"
                value={editProduct.image}
                onChange={handleEditChange}
                className="border p-2 rounded"
              />
              <select
                name="category"
                value={editProduct.category}
                onChange={handleEditChange}
                className="border p-2 rounded"
              >
                <option value="electronics">Электроника</option>
                <option value="clothing">Одежда</option>
                <option value="home">Дом</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-black"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-green-600 text-white"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
