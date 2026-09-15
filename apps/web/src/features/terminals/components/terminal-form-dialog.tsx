import type { LogicalTerminal } from '@repo/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TerminalForm } from './terminal-form'

interface TerminalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  terminal?: LogicalTerminal
}

export function TerminalFormDialog({
  open,
  onOpenChange,
  mode,
  terminal,
}: TerminalFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Novo terminal' : 'Editar terminal'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Cadastre um novo ponto de venda para este estabelecimento.'
              : 'Atualize o nome deste terminal.'}
          </DialogDescription>
        </DialogHeader>

        <TerminalForm
          mode={mode}
          terminal={terminal}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
