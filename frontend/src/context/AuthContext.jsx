import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("recruitai_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("recruitai_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .profile()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("recruitai_user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("recruitai_token");
        localStorage.removeItem("recruitai_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem("recruitai_token", res.data.token);
    localStorage.setItem("recruitai_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    localStorage.setItem("recruitai_token", res.data.token);
    localStorage.setItem("recruitai_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("recruitai_token");
    localStorage.removeItem("recruitai_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
