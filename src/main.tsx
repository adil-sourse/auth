import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Basket from "./pages/Basket";
import { Toaster } from "react-hot-toast";
import Checkout from "./pages/CheckOut";
import Products from "./pages/Products";
import Main from "./pages/Main";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-center" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products" element={<Products />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
