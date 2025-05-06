import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import Product from "./models/product.js";
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

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Доступ только для администраторов" });
  }
  next();
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
      basket: [],
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

app.post("/products", authenticate, adminOnly, async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Название и цена обязательны" });
    }

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      category,
      image,
      stock: 0,
    });

    await newProduct.save();
    const all = await Product.find();
    res.status(201).json(all);
  } catch (err) {
    console.error("Ошибка при добавлении продукта:", err);
    res.status(500).json({ message: err.message || "Ошибка при добавлении" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("Ошибка при получении продуктов:", err);
    res.status(500).json({ message: "Ошибка при получении продуктов" });
  }
});

app.delete("/products/:id", authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    await User.updateMany(
      { "basket.productId": id },
      { $pull: { basket: { productId: id } } }
    );

    const all = await Product.find();
    res.json(all);
  } catch (err) {
    console.error("Ошибка при удалении продукта:", err);
    res.status(500).json({ message: "Ошибка при удалении продукта" });
  }
});

app.put("/products/:id", authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, image } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price: price ? parseFloat(price) : undefined,
        description,
        category,
        image,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    const all = await Product.find();
    res.json(all);
  } catch (err) {
    console.error("Ошибка при обновлении продукта:", err);
    res.status(500).json({ message: "Ошибка при обновлении продукта" });
  }
});

app.get("/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user);
  } catch (err) {
    console.error("Ошибка при получении данных пользователя:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.put("/user", authenticate, async (req, res) => {
  const { login, password, name, email, phone } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (login) {
      const exists = await User.findOne({ login });
      if (exists && exists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Логин уже занят" });
      }
      user.login = login;
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: "Пароль слишком короткий" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res
          .status(400)
          .json({ message: "Электронная почта уже используется" });
      }
      user.email = email;
    } else if (email === "") {
      user.email = "";
    }

    user.name = name !== undefined ? name : user.name;
    user.phone = phone !== undefined ? phone : user.phone;

    await user.save();
    res.json({ message: "Данные успешно обновлены" });
  } catch (err) {
    console.error("Ошибка при обновлении данных пользователя:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/basket", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("basket.productId")
      .select("basket");
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const validBasket = user.basket.filter((item) => item.productId);
    res.json(validBasket);
  } catch (err) {
    console.error("Ошибка при получении корзины:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/basket", authenticate, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res
      .status(400)
      .json({ message: "Требуется ID продукта и количество" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    const basketItemIndex = user.basket.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (basketItemIndex >= 0) {
      user.basket[basketItemIndex].quantity += quantity;
    } else {
      user.basket.push({ productId, quantity });
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id)
      .populate("basket.productId")
      .select("basket");
    const validBasket = updatedUser.basket.filter((item) => item.productId);
    res.json(validBasket);
  } catch (err) {
    console.error("Ошибка при добавлении в корзину:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.put("/basket/:productId", authenticate, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Требуется корректное количество" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const basketItemIndex = user.basket.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (basketItemIndex === -1) {
      return res.status(404).json({ message: "Продукт не найден в корзине" });
    }

    user.basket[basketItemIndex].quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .populate("basket.productId")
      .select("basket");
    const validBasket = updatedUser.basket.filter((item) => item.productId);
    res.json(validBasket);
  } catch (err) {
    console.error("Ошибка при обновлении корзины:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.delete("/basket/:productId", authenticate, async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.basket = user.basket.filter(
      (item) => item.productId.toString() !== productId
    );
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .populate("basket.productId")
      .select("basket");
    const validBasket = updatedUser.basket.filter((item) => item.productId);
    res.json(validBasket);
  } catch (err) {
    console.error("Ошибка при удалении из корзины:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
