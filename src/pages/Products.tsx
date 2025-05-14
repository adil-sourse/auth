import { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/Card";

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: string;
  category: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchProd, setSearchProd] = useState("");
  const [searchProdInput, setSearchProdInput] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategoryInput, setSelectedCategoryInput] =
    useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((err) => console.error("Ошибка загрузки", err));
  }, []);

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name
      .toLowerCase()
      .includes(searchProd.toLowerCase());

    const price = parseFloat(product.price);
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    const priceMatch = price >= min && price <= max;

    const categoryMatch =
      !selectedCategory || product.category === selectedCategory;

    return nameMatch && priceMatch && categoryMatch;
  });

  const handleApplyFilters = () => {
    setSearchProd(searchProdInput);
    setMinPrice(minPriceInput);
    setMaxPrice(maxPriceInput);
    setSelectedCategory(selectedCategoryInput);
  };

  const handleResetFilters = () => {
    setSearchProd("");
    setSearchProdInput("");
    setMinPrice("");
    setMaxPrice("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSelectedCategory("");
    setSelectedCategoryInput("");
  };

  return (
    <div className="bg-gray-50 h-full min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 ">
        <h1 className="font-bold text-3xl text-center mt-10 mb-10">Товары</h1>

        <div className="flex gap-4 mx-10 md:mx-0 items-center">
          <div className="flex w-full sm:w-auto flex-1">
            <input
              type="text"
              value={searchProdInput}
              onChange={(e) => setSearchProdInput(e.target.value)}
              placeholder="Поиск товаров..."
              className="w-full p-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm"
            />
            <button
              onClick={() => setSearchProd(searchProdInput)}
              className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm"
            >
              Поиск
            </button>
          </div>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium shadow-sm"
          >
            {showFilters ? "Фильтры" : "Фильтры"}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-col sm:flex-row gap-4 flex-wrap transition-all duration-300 animate-fade-in mt-3">
            <select
              value={selectedCategoryInput}
              onChange={(e) => setSelectedCategoryInput(e.target.value)}
              className="border border-gray-200 p-3 rounded-lg w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="">Все категории</option>
              <option value="electronics">Электроника</option>
              <option value="clothing">Одежда</option>
              <option value="home">Дом</option>
            </select>

            <input
              type="number"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              placeholder="Мин. цена"
              className="border border-gray-200 p-3 rounded-lg w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />

            <input
              type="number"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              placeholder="Макс. цена"
              className="border border-gray-200 p-3 rounded-lg w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleApplyFilters}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm flex-1"
              >
                Применить
              </button>
              <button
                onClick={handleResetFilters}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium shadow-sm flex-1"
              >
                Сбросить
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10 place-items-center">
          {filteredProducts.map((product) => (
            <ProductCard stock={0} _id={""} key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
