import type { Collaborator } from '@repo/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CollaboratorForm } from './collaborator-form'

interface CollaboratorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  collaborator?: Collaborator
}

export function CollaboratorFormDialog({
  open,
  onOpenChange,
  mode,
  collaborator,
}: CollaboratorFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo colaborador' : 'Editar colaborador'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'O documento identifica quem recebe a parte dele em cada venda e não pode ser alterado depois.'
              : 'Documento e status são definidos no cadastro e pela Stone — aqui só o contato muda.'}
          </DialogDescription>
        </DialogHeader>

        <CollaboratorForm
          mode={mode}
          collaborator={collaborator}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
