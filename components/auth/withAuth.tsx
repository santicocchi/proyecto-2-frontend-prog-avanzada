// components/WithAuth.tsx
"use client"
import { Loader2 } from "lucide-react"
import { useAuth } from "./context/UserContext"

export default function WithAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-[#2B3A8F]" />
      </div>
    )
  }

  return <>{children}</>
}
