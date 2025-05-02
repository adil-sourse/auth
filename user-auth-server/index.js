import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 5000;

mongoose.connect("mongodb://localhost:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB ошибка:"));
db.once("open", () => console.log("Подключено к MongoDB"));

app.use(cors());
app.use(express.json());

app.listen(PORT, () =>
  console.log("Сервер запущен на http://localhost:${PORT}")
);

import User from "./models/user.js";
import Product from "./models/product.js";
import productsData from "./data/products.js";

app.post("/seed-products", async (req, res) => {
  try {
    await Product.deleteMany();
    await Product.insertMany(productsData);
    res.status(200).json({ message: "Продукты успешно добавлены" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при добавлении продуктов" });
  }
});

app.post("/add-product", async (req, res) => {
  const { name, description, price, image } = req.body;
  const newProduct = new Product({ name, description, price, image });
  try {
    await newProduct.save();
  } catch (err) {
    res.status(500).json({ message: "Ошибка при джобавлении" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при получении продуктов" });
  }
});

app.post("/register", async (req, res) => {
  const { login, password } = req.body;

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Пароль должен быть не менее 8 символов" });
  }

  try {
    const userExists = await User.findOne({ login });
    if (userExists)
      return res.status(400).json({ message: "Пользователь уже существует" });

    const newUser = new User({ login, password });
    await newUser.save();
    res.status(201).json({ message: "Успешная регистрация" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Неверные данные" });
    } else {
      return res.status(200).json({ message: "Успешный вход" });
    }
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
