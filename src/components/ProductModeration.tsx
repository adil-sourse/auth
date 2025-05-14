import React from "react";
import StockSlider from "../components/ui/slider";

interface Props {
  newProduct: {
    name: string;
    description: string;
    category: string;
    price: string;
    image: string;
    stock: string;
  };
  selectedCategory: string;
  error: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAdd: () => void;
}

export default function ProductModeration({
  newProduct,
  selectedCategory,
  error,
  onChange,
  onCategoryChange,
  onAdd,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        Добавить новый продукт
      </h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-r-lg text-sm text-center">
          {error}
        </div>
      )}

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
            onChange={onChange}
            className="mt-1 block w-full py-1 px-2 border border-gray-300 rounded-lg sm:text-sm focus:outline-none"
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
            onChange={onCategoryChange}
            className="mt-1 block w-full py-1 px-2 border border-gray-300 rounded-lg sm:text-sm focus:outline-none"
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
            onChange={onChange}
            type="number"
            step="0.01"
            className="mt-1 block w-full py-1 px-2 border border-gray-300 rounded-lg sm:text-sm focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700"
          >
            Наличие (шт.)
          </label>
          <StockSlider stock={newProduct.stock} onChange={onChange} />
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
            onChange={onChange}
            className="mt-1 block w-full py-1 px-2 border border-gray-300 rounded-lg sm:text-sm focus:outline-none"
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
            onChange={onChange}
            className="mt-1 block w-full py-1 px-2 border border-gray-300 rounded-lg sm:text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={onAdd}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Добавить продукт
        </button>
      </div>
    </div>
  );
}
