import jwt from "jsonwebtoken";

const JWT_SECRET = "your_super_secret_key";

export function authenticate(req, res, next) {
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
