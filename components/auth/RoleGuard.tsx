// RoleGuard.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./context/UserContext";

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, loading } = useAuth(); // <- corregido
  const router = useRouter();

  useEffect(() => {
    console.log(loading, user);
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (
        !user.role.some((r) => allowedRoles.includes(r.name)) // <- corregido
      ) {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, router]);

  if (
    loading ||
    !user ||
    !user.role.some((r) => allowedRoles.includes(r.name))
  ) {
    return null;
  }

  return <>{children}</>;
}
