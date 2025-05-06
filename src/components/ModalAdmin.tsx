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
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Редактировать продукт
        </h2>

        <div className="grid gap-4">
          <input
            name="name"
            placeholder="Название"
            value={product.name}
            onChange={onChange}
            className="border p-2 rounded"
          />
          <input
            name="description"
            placeholder="Описание"
            value={product.description}
            onChange={onChange}
            className="border p-2 rounded"
          />
          <input
            name="price"
            placeholder="Цена"
            value={product.price}
            onChange={onChange}
            className="border p-2 rounded"
          />
          <input
            name="image"
            placeholder="Ссылка на изображение"
            value={product.image}
            onChange={onChange}
            className="border p-2 rounded"
          />
          <select
            name="category"
            value={product.category}
            onChange={onChange}
            className="border p-2 rounded"
          >
            <option value="electronics">Электроника</option>
            <option value="clothing">Одежда</option>
            <option value="home">Дом</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-black"
          >
            Отмена
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
