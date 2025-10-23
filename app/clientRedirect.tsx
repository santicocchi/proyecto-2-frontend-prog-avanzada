// app/ClientRedirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/context/UserContext";

export default function ClientRedirect() {
    const { hasRole } = useAuth();
    const router = useRouter();

    //ejecutar redireccion segun tipo de usuario
    useEffect(() => {
        if (hasRole("dueño") || hasRole("empleado") ) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    }, [hasRole, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin h-10 w-10 text-[#2B3A8F]" />
        </div>
    )
}
