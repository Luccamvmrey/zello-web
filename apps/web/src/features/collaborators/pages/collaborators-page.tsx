import { Users } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { ListToolbar } from '@/components/list-toolbar'
import { PageHeader } from '@/components/page-header'
import { useCollaborators } from '@/lib/queries/collaborators'
import { CollaboratorFormDialog } from '../components/collaborator-form-dialog'
import { CollaboratorsTable } from '../components/collaborators-table'

export function CollaboratorsPage() {
  const [includeInactive, setIncludeInactive] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const { data, isLoading } = useCollaborators(includeInactive)

  const count = data?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Colaboradores"
        description="Quem recebe parte de cada venda do estabelecimento."
        action={<Button onClick={() => setCreateOpen(true)}>Novo colaborador</Button>}
      />

      <ListToolbar
        actions={
          <div className="flex items-center gap-2">
            <Switch
              id="include-inactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
            <Label htmlFor="include-inactive">Mostrar inativos</Label>
          </div>
        }
      >
        {isLoading ? (
          <Skeleton className="h-4 w-28" />
        ) : (
          `${count} ${count === 1 ? 'colaborador' : 'colaboradores'}`
        )}
      </ListToolbar>

      <CollaboratorsTable
        data={data ?? []}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={Users}
            title="Nenhum colaborador cadastrado"
            description="Cadastre os profissionais que recebem parte de cada venda. Sem eles, não há o que dividir."
            action={<Button onClick={() => setCreateOpen(true)}>Adicionar o primeiro</Button>}
          />
        }
      />

      <CollaboratorFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
