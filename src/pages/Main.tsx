import { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/ui/button";

interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: string;
}

export default function Main() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      fetch("http://localhost:5000/products")
        .then((res) => res.json())
        .then((data: Product[]) => setProducts(data))
        .catch((err) => console.error("Ошибка загрузки", err));
    };
    loadData();
  }, []);

  return (
    <div className="">
      <Header />

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-bold text-3xl text-center mt-3 mb-10">Products </h1>

        <div className="flex gap-8 mx-10 md:mx-0">
          <input
            type="text"
            placeholder="Search"
            className="border p-2 rounded-lg mb-8 focus:outline-none w-full "
          />

          <button className="bg-black p-2 text-white h-10 rounded-lg">
            Filters
          </button>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 place-items-center">
          {products.map((product) => (
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
                    className="ml-6 px-4 py-2 text-white bg-black text-lg font-medium rounded-lg transition duration-300 w-24"
                  >
                    Go
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
