import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../axios/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("admin_access_token");
    const storedUser = localStorage.getItem("admin_user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("admin_user");
      }
    }
    setInitializing(false);
  }, []);

  const login = async (email, password) => {
    // LoginResponse shape assumed: { accessToken, refreshToken, user: { email, role, name } }
    // Adjust the field names below to match your actual LoginResponse DTO.
    const { data } = await api.post("/auth/login", { email, password });

    const accessToken = data.accessToken ?? data.token;
    const refreshToken = data.refreshToken;
    const userInfo = data.user ?? { email };

    if (userInfo.role && userInfo.role !== "ADMIN") {
      throw new Error("This account doesn't have admin access.");
    }

    localStorage.setItem("admin_access_token", accessToken);
    if (refreshToken) localStorage.setItem("admin_refresh_token", refreshToken);
    localStorage.setItem("admin_user", JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("admin_refresh_token");
    try {
      if (refreshToken) await api.post("/auth/logout", { refreshToken });
    } catch {
      // ignore — clear local session regardless
    }
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, initializing, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
