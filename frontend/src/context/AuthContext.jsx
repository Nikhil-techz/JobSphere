import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProfile, logoutUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  // Load currently logged-in user
  const loadUser = async () => {
    try {
      const profile = await getProfile();

      setUser(profile);

      return profile;
    } catch (error) {
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // Check authentication when application starts
  useEffect(() => {
    loadUser();
  }, []);

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);

      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        loadUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
