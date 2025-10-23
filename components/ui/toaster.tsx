// 'use client'

// import { useToast } from '@/hooks/use-toast'
// import {
//   Toast,
//   ToastClose,
//   ToastDescription,
//   ToastProvider,
//   ToastTitle,
//   ToastViewport,
// } from '@/components/ui/toast'

// export function Toaster() {
//   const { toasts } = useToast()

//   return (
//     <ToastProvider swipeDirection="up" duration={2200}>
//       {toasts.map(({ id, title, description, action, ...props }) => {
//         const isError = props.variant === 'destructive'
//         const base =
//           'transition-all duration-300 shadow-xl rounded-lg border backdrop-blur-sm'
//         const successClasses =
//           'bg-emerald-50 border-emerald-300 text-emerald-900'
//         const errorClasses =
//           'bg-red-50 border-red-300 text-red-900'

//         return (
//           <Toast
//             key={id}
//             {...props}
//             className={`${base} ${isError ? errorClasses : successClasses}`}
//           >
//             <div className="grid gap-1">
//               {title && (
//                 <ToastTitle className={isError ? 'text-red-900' : 'text-emerald-900'}>
//                   {title}
//                 </ToastTitle>
//               )}
//               {description && (
//                 <ToastDescription className={isError ? 'text-red-800' : 'text-emerald-800'}>
//                   {description}
//                 </ToastDescription>
//               )}
//             </div>
//             {action}
//             <ToastClose className={isError ? 'text-red-900' : 'text-emerald-900'} />
//           </Toast>
//         )
//       })}

//       {/* Arriba centrado (override del bottom por defecto) */}
//       <ToastViewport className="fixed !top-10 !bottom-auto left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[9999] w-auto" />
//     </ToastProvider>
//   )
// }

'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const pathname = usePathname()

  // Mejora UX: al cambiar de ruta, cerramos toasts para que no “viajen” entre páginas
  useEffect(() => {
    if (!toasts.length) return
    toasts.forEach((t) => dismiss(t.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <ToastProvider swipeDirection="up" duration={2200}>
      {toasts.map(({ id, title, description, action, ...props }) => {
        const isError = props.variant === 'destructive'
        const base = 'transition-all duration-300 shadow-xl rounded-lg border'
        const success = 'bg-emerald-50 border-emerald-300 text-emerald-900'
        const error = 'bg-red-50 border-red-300 text-red-900'

        return (
          <Toast
            key={id}
            {...props}
            className={`${base} ${isError ? error : success}`}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className={isError ? 'text-red-900' : 'text-emerald-900'}>
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className={isError ? 'text-red-800' : 'text-emerald-800'}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={isError ? 'text-red-900' : 'text-emerald-900'} />
          </Toast>
        )
      })}

      {/* Arriba centrado: override del bottom por defecto */}
      <ToastViewport className="fixed !top-10 !bottom-auto left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[9999] w-auto" />
    </ToastProvider>
  )
}
