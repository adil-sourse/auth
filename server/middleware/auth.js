const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Требуется авторизация" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = decoded; // Предполагается, что токен содержит _id
    next();
  } catch (err) {
    res.status(401).json({ message: "Некорректный токен" });
  }
};
