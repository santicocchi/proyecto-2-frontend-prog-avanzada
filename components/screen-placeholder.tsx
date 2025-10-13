import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

interface ScreenPlaceholderProps {
  title: string
  description: string
}

export function ScreenPlaceholder({ title, description }: ScreenPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-balance">{title}</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md text-pretty">{description}</p>
      <Button asChild size="lg">
        <Link href="/">
          <Home className="mr-2 h-5 w-5" />
          Volver al Dashboard
        </Link>
      </Button>
    </div>
  )
}
