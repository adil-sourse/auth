import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCardAdmin from "../components/CardAdmin";
import EditProductModal from "../components/ModalAdmin";

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
    await fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" });
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
