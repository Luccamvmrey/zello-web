import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TerminalForm } from '@/features/terminals/components/terminal-form'
import { useCreateSolicitation } from '@/lib/queries/solicitations'

interface TerminalSolicitationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TerminalSolicitationForm({ open, onOpenChange }: TerminalSolicitationFormProps) {
  const createSolicitation = useCreateSolicitation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar novo terminal</DialogTitle>
          <DialogDescription>
            Um admin precisa aprovar antes do terminal ser criado de fato.
          </DialogDescription>
        </DialogHeader>

        <TerminalForm
          mode="create"
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
          submitOverride={{
            onSubmit: async (data) => {
              await createSolicitation.mutateAsync({ type: 'NEW_TERMINAL', data })
            },
            successMessage: 'Solicitação enviada. Aguarde aprovação.',
            submitLabel: 'Enviar solicitação',
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
