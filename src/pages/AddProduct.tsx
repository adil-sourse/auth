import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductModeration from "../components/ProductModeration";
import Header from "../components/Header";
import ProductCardAdmin from "../components/CardAdmin";
import EditProductModal from "../components/ModalAdmin";
import { IoIosArrowBack } from "react-icons/io";

interface ProductInput {
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  category: string;
}

export default function AddProduct() {
  const [newProduct, setNewProduct] = useState<ProductInput>({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
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
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button className="absolute top-10" onClick={() => navigate("/admin")}>
          <IoIosArrowBack size={30} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Добавить новый товар
        </h1>
        <ProductModeration
          newProduct={newProduct}
          selectedCategory={selectedCategory}
          error={error}
          onChange={handleChange}
          onCategoryChange={handleCategoryChange}
          onAdd={handleAdd}
        />

        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
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
