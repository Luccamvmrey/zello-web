import type { Service } from '@repo/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ServiceForm } from './service-form'

interface ServiceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  service?: Service
}

export function ServiceFormDialog({ open, onOpenChange, mode, service }: ServiceFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Novo serviço' : 'Editar serviço'}</DialogTitle>
          <DialogDescription>
            Cadastre o serviço e o valor sugerido para cobrança na maquininha.
          </DialogDescription>
        </DialogHeader>

        <ServiceForm
          mode={mode}
          service={service}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
