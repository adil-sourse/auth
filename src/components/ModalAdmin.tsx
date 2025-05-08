interface EditProductModalProps {
  product: {
    _id: string;
    name: string;
    image: string;
    description: string;
    price: string;
    category: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function EditProductModal({
  product,
  onChange,
  onClose,
  onSave,
}: EditProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Редактировать продукт
        </h2>

        <div className="grid gap-4">
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
              value={product.name}
              onChange={onChange}
              className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
            />
          </div>
          <div>
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
              value={product.description}
              onChange={onChange}
              className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none"
            />
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
              value={product.price}
              onChange={onChange}
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
              value={product.image}
              onChange={onChange}
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
              name="category"
              id="category"
              value={product.category}
              onChange={onChange}
              className="mt-1 block w-full py-1 px-2 border-gray-300 rounded-lg  border 0 sm:text-sm focus:outline-none "
            >
              <option value="">Выберите категорию</option>
              <option value="electronics">Электроника</option>
              <option value="clothing">Одежда</option>
              <option value="home">Дом</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Отмена
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
