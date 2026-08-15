import React, { createContext, useContext, useState } from "react";
import api from "../axios/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  const login = async (email, password) => {

    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setIsLoggedIn(true);

      return res.data;

    } catch (error) {

      console.error("LOGIN ERROR:", error);

      // IMPORTANT
      // Let Login.jsx handle the error
      throw error;
    }
  };

  const logout = () => {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;