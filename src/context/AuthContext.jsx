import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  // On mount, restore session from stored token
  useEffect(() => {
    if (!token) return;
    api.getMe(token)
      .then((u) => setUser(u))
      .catch(() => {
        // Token expired / invalid
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    const t = data.access_token;
    localStorage.setItem("token", t);
    setToken(t);
    setUser({
      id: data.user_id,
      name: data.name,
      email: data.email,
      is_admin: data.is_admin,
    });
    return data;
  };

  const register = async (name, email, password) => {
    return api.register(name, email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isLoggedIn: !!user,
    isAdmin: !!user?.is_admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
