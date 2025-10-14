"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

type Role = {
  id: number;
  name: string;
};

export default function RoleProyectGuard({
  proyectoId,
  children,
  allowedRoles,
  fallback = null, // opcional: qué mostrar si tiene rol pero no está permitido
}: {
  proyectoId: number;
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}) {
  const router = useRouter();
  const [rol, setRol] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRolProyecto = async () => {
  setLoading(true);
  try {
    const res = await api.post("/proyecto/meRolProyecto", { proyectoId });
    if (res.status !== 200) throw new Error("Error al obtener el rol");
    setRol(res.data.rol); // <- aquí accedemos a res.data.rol
  } catch (error) {
    console.error("Error al obtener el rol del proyecto:", error);
    setRol(null);
  } finally {
    setLoading(false);
  }
};


    fetchRolProyecto();
  }, [proyectoId]);

  // Redirige si no hay rol
  useEffect(() => {
    if (!loading && !rol) {
      router.push("/unauthorized");
    }
  }, [rol, loading, router]);

  if (loading || !rol) {
    return null; // o un spinner mientras carga
  }

  // Si tiene rol pero no está permitido → mostrar fallback o nada
  if (!allowedRoles.includes(rol.name)) {
    return <>{fallback}</>;
  }
  // Si tiene rol permitido → renderiza contenido
  return <>{children}</>;
}
