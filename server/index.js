import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import Product from "./models/product.js";
import Order from "./models/order.js";
import Chat from "./models/chat.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import axios from "axios";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const PORT = 5000;

// Кэш для продуктов
let productCache = null;
let cacheTimestamp = null;

// Функция для получения контекста продуктов
async function getProductContext(message) {
  const now = Date.now();
  let products;

  // Простая фильтрация по ключевым словам в сообщении
  if (message.toLowerCase().includes("футболки")) {
    products = await Product.find({ category: "Футболки" }).select(
      "name price description category stock"
    );
  } else if (message.toLowerCase().includes("электроника")) {
    products = await Product.find({ category: "Электроника" }).select(
      "name price description category stock"
    );
  } else {
    // Ограничиваем до 50 продуктов для общего запроса
    products = await Product.find()
      .limit(50)
      .select("name price description category stock");
  }

  // Обновляем кэш каждые 5 минут
  if (
    !productCache ||
    !cacheTimestamp ||
    now - cacheTimestamp > 5 * 60 * 1000
  ) {
    productCache = products
      .map(
        (p) =>
          `Название: ${p.name}, Цена: ${p.price} ₸, Категория: ${
            p.category
          }, Наличие: ${p.stock} шт., Описание: ${
            p.description || "Нет описания"
          }`
      )
      .join("\n");
    cacheTimestamp = now;
  }
  return productCache;
}

mongoose.connect("mongodb://localhost:27017/shop", {
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

// Middleware для аутентификации
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

// Эндпоинты
app.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.post("/register", async (req, res) => {
  const { login, email, password, role } = req.body;

  if (!login || !email || !password) {
    return res
      .status(400)
      .json({ message: "Логин, email и пароль обязательны" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Пароль должен содержать не менее 8 символов" });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Некорректный формат email" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ login }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.login === login
            ? "Логин уже существует"
            : "Email уже используется",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      login,
      email,
      password: hashedPassword,
      role: role || "user",
      basket: [],
    });

    await newUser.save();

    res.status(201).json({ message: "Успешная регистрация" });
  } catch (err) {
    console.error("Ошибка регистрации:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message:
          field === "email" ? "Email уже используется" : "Логин уже существует",
      });
    }
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
});

app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login });
    if (!user) return res.status(401).json({ message: "Неверные данные" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Неверные данные" });

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

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().select(
      "name price description category stock image"
    );
    res.status(200).json(products);
  } catch (err) {
    console.error("Ошибка при получении продуктов:", err);
    res.status(500).json({ message: "Ошибка при получении продуктов" });
  }
});

app.post("/products", authenticate, adminOnly, async (req, res) => {
  const { name, price, description, category, image, stock } = req.body;

  if (!name || !price || stock === undefined) {
    return res
      .status(400)
      .json({ message: "Название, цена и наличие обязательны" });
  }

  const stockNum = parseInt(stock);
  if (isNaN(stockNum) || stockNum < 0 || stockNum > 100) {
    return res.status(400).json({ message: "Наличие должно быть от 0 до 100" });
  }

  try {
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      description,
      category,
      image,
      stock: stockNum,
    });

    await newProduct.save();
    productCache = null; // Сброс кэша
    const all = await Product.find();
    res.status(201).json(all);
  } catch (err) {
    console.error("Ошибка при добавлении продукта:", err);
    res.status(500).json({ message: err.message });
  }
});

app.put("/products/:id", authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, image, stock } = req.body;

  const stockNum = stock !== undefined ? parseInt(stock) : undefined;
  if (
    stockNum !== undefined &&
    (isNaN(stockNum) || stockNum < 0 || stockNum > 100)
  ) {
    return res.status(400).json({ message: "Наличие должно быть от 0 до 100" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price: price ? parseFloat(price) : undefined,
        description,
        category,
        image,
        stock: stockNum,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Продукт не найден" });
    }

    productCache = null; // Сброс кэша
    const all = await Product.find();
    res.json(all);
  } catch (err) {
    console.error("Ошибка при обновлении продукта:", err);
    res.status(500).json({ message: "Ошибка при обновлении продукта" });
  }
});

app.delete("/products/:id", authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Продукт не найден" });

    await User.updateMany(
      { "basket.productId": id },
      {
        $pull: { basket: { productId: id } },
      }
    );

    productCache = null; // Сброс кэша
    const all = await Product.find();
    res.json(all);
  } catch (err) {
    console.error("Ошибка при удалении продукта:", err);
    res.status(500).json({ message: "Ошибка при удалении продукта" });
  }
});

app.get("/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });
    res.json(user);
  } catch (err) {
    console.error("Ошибка при получении данных пользователя:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.put("/user", authenticate, async (req, res) => {
  const { login, password, email, name, phone } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

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
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Некорректный формат email" });
      }
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res
          .status(400)
          .json({ message: "Электронная почта уже используется" });
      }
      user.email = email;
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;

    await user.save();
    res.json({ message: "Данные успешно обновлены" });
  } catch (err) {
    console.error("Ошибка при обновлении данных пользователя:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message:
          field === "email" ? "Email уже используется" : "Логин уже существует",
      });
    }
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/basket", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("basket.productId")
      .select("basket");
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });
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
    const product = await Product.findById(productId);
    if (!user || !product)
      return res
        .status(404)
        .json({ message: "Пользователь или продукт не найден" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Недостаточно товара в наличии" });
    }

    const index = user.basket.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (index >= 0) {
      user.basket[index].quantity += quantity;
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
    const product = await Product.findById(productId);
    if (!user || !product)
      return res
        .status(404)
        .json({ message: "Пользователь или продукт не найден" });

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Недостаточно товара в наличии" });
    }

    const index = user.basket.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (index === -1)
      return res.status(404).json({ message: "Продукт не найден в корзине" });

    user.basket[index].quantity = quantity;
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

app.post("/checkout", authenticate, async (req, res) => {
  const {
    basket,
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    postalCode,
    paymentMethod,
  } = req.body;

  try {
    if (
      !basket ||
      !basket.length ||
      !firstName ||
      !address ||
      !city ||
      !postalCode ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    // Проверка наличия товаров
    for (const item of basket) {
      const product = await Product.findById(item.productId._id);
      if (!product) {
        throw new Error("Продукт не найден");
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Недостаточно товара "${product.name}" в наличии`,
        });
      }
    }

    const items = await Promise.all(
      basket.map(async (item) => {
        const product = await Product.findById(item.productId._id);
        if (!product) {
          throw new Error("Продукт не найден");
        }
        return {
          productId: item.productId._id,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId: req.user.id,
      items,
      total,
      shippingAddress: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        postalCode,
      },
      paymentMethod,
    });

    // Уменьшение количества товаров в наличии
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    await order.save();

    await User.findByIdAndUpdate(req.user.id, { $set: { basket: [] } });

    productCache = null; // Сброс кэша
    res
      .status(201)
      .json({ message: "Заказ успешно создан", orderId: order._id });
  } catch (err) {
    console.error("Ошибка при оформлении заказа:", err);
    res.status(500).json({ message: "Ошибка сервера при оформлении заказа" });
  }
});

app.get("/orders", authenticate, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "login email")
      .populate("items.productId", "name price");
    res.status(200).json(orders);
  } catch (err) {
    console.error("Ошибка при получении заказов:", err);
    res.status(500).json({ message: "Ошибка при получении заказов" });
  }
});

app.delete("/orders/:id", authenticate, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Заказ не найден" });

    const orders = await Order.find()
      .populate("userId", "login email")
      .populate("items.productId", "name price");
    res.json(orders);
  } catch (err) {
    console.error("Ошибка при удалении заказа:", err);
    res.status(500).json({ message: "Ошибка при удалении заказа" });
  }
});

// Эндпоинты чата
app.get("/chat", authenticate, async (req, res) => {
  try {
    const messages = await Chat.find({ userId: req.user.id }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (err) {
    console.error("Ошибка при получении сообщений:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/chat", authenticate, async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Сообщение не может быть пустым" });
  }

  try {
    // Сохраняем сообщение пользователя
    const userMessage = new Chat({
      userId: req.user.id,
      message: message.trim(),
      sender: "user",
    });
    await userMessage.save();

    // Получаем контекст продуктов
    const productContext = await getProductContext(message);

    // Запрос к OpenRouter API
    const intelResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-medium-3",
        messages: [
          {
            role: "system",
            content: `Вы — помощник службы поддержки интернет-магазина. Отвечайте на русском языке коротко и прямым текстом. Используйте данные о товарах для ответа на вопросы о наличии, характеристиках, ценах и категориях. Направляйте пользователя к действию (например, оформить заказ или выбрать товар). Отвечайте только на вопросы, связанные с магазином. Данные о товарах:\n${productContext} Цены там не в рублях а в тенге (обозначение ₸)`,
          },
          { role: "user", content: message.trim() },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Shop Assistant",
        },
      }
    );

    // Извлекаем ответ ИИ
    const aiResponse =
      intelResponse.data?.choices?.[0]?.message?.content?.trim() || "";
    if (!aiResponse) {
      return res.status(500).json({ message: "Пустой ответ от ИИ" });
    }

    // Сохраняем ответ ИИ
    const aiMessage = new Chat({
      userId: req.user.id,
      message: aiResponse,
      sender: "ai",
    });
    await aiMessage.save();

    // Возвращаем историю чата
    const messages = await Chat.find({ userId: req.user.id }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (err) {
    console.error(
      "Ошибка при отправке сообщения:",
      err.response?.data || err.message
    );
    res.status(500).json({
      message: "Ошибка сервера при обработке сообщения",
      error: err.response?.data || err.message,
    });
  }
});

app.delete("/chat", authenticate, async (req, res) => {
  try {
    await Chat.deleteMany({ userId: req.user.id });
    res.json({ message: "Чат очищен" });
  } catch (err) {
    console.error("Ошибка при очистке чата:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
