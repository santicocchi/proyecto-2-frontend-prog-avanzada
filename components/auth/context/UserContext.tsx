"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import axios from "axios";
import { scheduleAutoRefresh } from "@/lib/auth";
import api from "@/services/api";

type Role = {
  id: number;
  name: string;
};

type User = {
  id: string;
  role: Role[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => { },
  hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/me");
      if (res.status !== 200) {
        setUser(null);
        throw new Error("No autenticado");
        // redirect("/login");
      }
      setUser(res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
        redirect("/login");
      } else {
        console.error("Error al obtener el usuario:", error);
        setUser(null);
        redirect("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roleName: string): boolean => {
    return user?.role.some((r) => r.name === roleName) || false;
  };

  useEffect(() => {
    // Evitar fetchUser en páginas públicas como login
    const publicRoutes = ["/login", "/register"];
    if (publicRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }

    const expirationStr = localStorage.getItem("accessTokenExpiresAt");
    if (expirationStr) {
      const expiration = Number(expirationStr);
      scheduleAutoRefresh(expiration); // programa refresco automático
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
