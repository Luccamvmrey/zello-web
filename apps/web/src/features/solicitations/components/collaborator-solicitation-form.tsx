import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CollaboratorForm } from '@/features/collaborators/components/collaborator-form'
import { useCreateSolicitation } from '@/lib/queries/solicitations'

interface CollaboratorSolicitationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CollaboratorSolicitationForm({
  open,
  onOpenChange,
}: CollaboratorSolicitationFormProps) {
  const createSolicitation = useCreateSolicitation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitar novo colaborador</DialogTitle>
          <DialogDescription>
            Um admin precisa aprovar antes do colaborador ser criado de fato.
          </DialogDescription>
        </DialogHeader>

        <CollaboratorForm
          mode="create"
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
          submitOverride={{
            onSubmit: async (data) => {
              await createSolicitation.mutateAsync({ type: 'NEW_COLLABORATOR', data })
            },
            successMessage: 'Solicitação enviada. Aguarde aprovação.',
            submitLabel: 'Enviar solicitação',
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
