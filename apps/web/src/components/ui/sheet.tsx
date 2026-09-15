'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { cn } from 'cn'

/**
 * Painel deslizante ancorado a uma borda da tela. Construído sobre o mesmo
 * primitivo de Dialog do resto do app (@base-ui/react) — herda foco preso,
 * fechamento por Esc e restauração do foco ao gatilho.
 *
 * Existe para a navegação mobile: abaixo de `lg` a sidebar fixa não cabe.
 */

function Sheet({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-foreground/40 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  )
}

const SIDE_CLASSES = {
  left: 'inset-y-0 left-0 h-dvh w-72 max-w-[85vw] border-r data-open:slide-in-from-left data-closed:slide-out-to-left',
  right:
    'inset-y-0 right-0 h-dvh w-72 max-w-[85vw] border-l data-open:slide-in-from-right data-closed:slide-out-to-right',
} as const

function SheetContent({
  className,
  side = 'left',
  children,
  ...props
}: DialogPrimitive.Popup.Props & { side?: keyof typeof SIDE_CLASSES }) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          'fixed z-50 flex flex-col bg-card text-card-foreground shadow-overlay border-border duration-150 outline-none data-open:animate-in data-closed:animate-out',
          SIDE_CLASSES[side],
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn('font-heading text-base leading-none font-medium', className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetOverlay, SheetTitle, SheetTrigger }
