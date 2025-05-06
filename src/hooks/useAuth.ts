import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  role: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/me", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);

    axios
      .post("http://localhost:5000/logout", {}, { withCredentials: true })
      .then(() => {
        document.cookie = "token=; Max-Age=0";
      });
  };

  return { user, login, logout };
}
