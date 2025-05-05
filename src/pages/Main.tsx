import { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/ui/button";

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: string;
  category: string;
}

export default function Main() {
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
    <div>
      <Header />

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-bold text-3xl text-center mt-3 mb-10">Товары</h1>

        <div className="flex gap-4 mx-10 md:mx-0 items-center">
          <input
            type="text"
            value={searchProdInput}
            onChange={(e) => setSearchProdInput(e.target.value)}
            placeholder="Поиск"
            className="border p-2 rounded-lg focus:outline-none w-full"
          />

          <button
            className="bg-black text-white px-4 h-10 rounded-lg"
            onClick={() => setSearchProd(searchProdInput)}
          >
            Поиск
          </button>

          <button onClick={() => setShowFilters((prev) => !prev)}>
            Фильтр
          </button>
        </div>

        {showFilters && (
          <div className="bg-slate-100 p-4 mt-4 rounded-lg mx-10 md:mx-0 flex flex-col sm:flex-row gap-4 flex-wrap">
            <select
              value={selectedCategoryInput}
              onChange={(e) => setSelectedCategoryInput(e.target.value)}
              className="border p-2 rounded-lg w-full sm:w-1/4"
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
              className="border p-2 rounded-lg w-full sm:w-1/4"
            />

            <input
              type="number"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              placeholder="Макс. цена"
              className="border p-2 rounded-lg w-full sm:w-1/4"
            />

            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={handleApplyFilters}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Применить
              </button>
              <button
                onClick={handleResetFilters}
                className=" text-black px-4 py-2 rounded-lg"
              >
                Сбросить
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10 place-items-center">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs h-96 mx-auto"
            >
              <div className="w-64 h-64 rounded-2xl relative overflow-hidden mx-auto">
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
                    type="button"
                    className="ml-6 px-4 py-2 text-white bg-black text-lg font-medium rounded-lg transition duration-300 w-1/2"
                  >
                    В корзину
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
