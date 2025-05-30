import { MdModeEdit } from "react-icons/md";

interface ProductCardAdminProps {
  product: {
    _id: string;
    name: string;
    image: string;
    description: string;
    price: string;
    category: string;
    stock: number;
  };
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
}

export default function ProductCardAdmin({
  product,
  onEdit,
  onDelete,
}: ProductCardAdminProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xs h-[25rem] mx-auto">
      <div className="w-64 h-64 mt-3 md:mt-0 rounded-2xl relative overflow-hidden mx-auto">
        <button
          onClick={() => onEdit(product)}
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

      <div className="p-4 flex flex-col h-[calc(100%-256px)]">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1 ">
          {product.name}
        </h2>
        <div className="flex justify-between items-end flex-1">
          <div>
            <p className="text-xs text-gray-500 line-clamp-1 max-w-44">
              {product.description}
            </p>
            <p className="text-xs font-medium text-gray-600 bg-gray-100 rounded-lg px-2 py-1 inline-block mt-3 mb-2">
              В наличии: {product.stock} шт.
            </p>
            <p className="text-base font-bold text-gray-800 mt-1">
              {product.price} ₸
            </p>
          </div>
          <button
            onClick={() => onDelete(product._id)}
            type="button"
            className="ml-4 py-1.5 text-white text-xs bg-red-600 hover:bg-red-500 rounded-lg transition duration-300 w-24 z-10"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
