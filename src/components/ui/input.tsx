import React from "react";

interface InputProps {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  value,
  placeholder,
  onChange,
  required = false,
}) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      className="px-5 py-3 border w-full rounded mb-3"
    />
  );
};

export default Input;
