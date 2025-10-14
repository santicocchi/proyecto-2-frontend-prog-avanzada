"use client"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ErrorModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: string
}

export function ErrorModal({ isOpen, onOpenChange, title = "Error", message }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <DialogTitle className="text-red-700">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full" variant="destructive">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
