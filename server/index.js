import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import Product from "./models/product.js";
import productsData from "./data/products.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const PORT = 5000;

mongoose.connect("mongodb://localhost:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB ошибка:"));
db.once("open", () => console.log("Подключено к MongoDB"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Не авторизован" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Недействительный токен" });
  }
}

app.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.post("/register", async (req, res) => {
  const { login, password, role } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: "Логин и пароль обязательны" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Пароль слишком короткий" });
  }

  try {
    const exists = await User.findOne({ login });
    if (exists) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      login,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    res.status(201).json({ message: "Успешная регистрация" });
  } catch (err) {
    console.error("Ошибка регистрации:", err);
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
});
app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login });
    if (!user) {
      console.error("Пользователь не найден");
      return res.status(401).json({ message: "Неверные данные" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Неверный пароль");
      return res.status(401).json({ message: "Неверные данные" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Вход выполнен" });
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({ message: "Ошибка сервера при входе" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
  res.json({ message: "Вы вышли" });
});

app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    const all = await Product.find();
    res.status(201).json(all);
  } catch (err) {
    res.status(500).json({ message: "Ошибка при добавлении" });
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

app.post("/add-product", async (req, res) => {
  const { name, description, price, image } = req.body;
  const newProduct = new Product({ name, description, price, image });
  try {
    await newProduct.save();
    res.status(201).json({ message: "Продукт добавлен" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при добавлении" });
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    const all = await Product.find();
    res.json(all); // отправляем обновлённый список продуктов
  } catch (err) {
    console.error("Ошибка при обновлении:", err);
    res.status(500).json({ message: "Ошибка при обновлении продукта" });
  }
});

app.listen(PORT, () =>
  console.log("Сервер запущен на http://localhost:${PORT}")
);
