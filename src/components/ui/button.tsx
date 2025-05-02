import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-black px-5 py-2 text-sm text-white rounded-md hover:scale-105 transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
}
