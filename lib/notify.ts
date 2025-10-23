// src/lib/notify.ts
'use client'
import { useToast } from '@/hooks/use-toast'

export function useNotify() {
  const { toast } = useToast()
  return {
    success(desc: string, title = 'Éxito') {
      toast({ title, description: desc })
    },
    error(desc: string, title = 'Error') {
      toast({ title, description: desc, variant: 'destructive' })
    },
    apiError(err: any, fallback = 'Error inesperado') {
      const msg = err?.response?.data?.message || err?.message || fallback
      toast({ title: 'Error', description: String(msg), variant: 'destructive' })
    },
  }
}
