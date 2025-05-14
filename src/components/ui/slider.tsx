import React from "react";

interface StockSliderProps {
  stock: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StockSlider({ stock, onChange }: StockSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 100)) {
      onChange(e);
    }
  };

  const stockValue = Number(stock) || 1;
  const fillPercentage = ((stockValue - 1) / (100 - 1)) * 100;

  const sliderStyle = {
    background: `linear-gradient(to right, #000000 ${fillPercentage}%, #e5e7eb ${fillPercentage}%)`,
    height: "8px",
  };

  return (
    <div className="flex items-center space-x-2 mt-1">
      <input
        type="range"
        name="stock"
        id="stock"
        min="1"
        max="100"
        value={stock}
        onChange={handleChange}
        className="w-full rounded-lg cursor-pointer"
        style={sliderStyle}
      />
      <input
        type="number"
        name="stock"
        value={stock}
        onChange={handleChange}
        min="1"
        max="100"
        className="w-16 py-1 px-2 border border-gray-300 rounded-lg sm:text-sm focus:outline-none"
      />
      <span className="text-sm text-gray-600 ">{stock} шт.</span>
    </div>
  );
}
