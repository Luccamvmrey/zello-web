import { Monitor } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { ListToolbar } from '@/components/list-toolbar'
import { PageHeader } from '@/components/page-header'
import { useTerminals } from '@/lib/queries/terminals'
import { TerminalFormDialog } from '../components/terminal-form-dialog'
import { TerminalsTable } from '../components/terminals-table'

export function TerminalsPage() {
  const [includeInactive, setIncludeInactive] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const { data, isLoading } = useTerminals(includeInactive)

  const count = data?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Terminais"
        description="Pontos de venda e maquininhas vinculadas a este estabelecimento."
        action={<Button onClick={() => setCreateOpen(true)}>Novo terminal</Button>}
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
          `${count} ${count === 1 ? 'terminal' : 'terminais'}`
        )}
      </ListToolbar>

      <TerminalsTable
        data={data ?? []}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={Monitor}
            title="Nenhum terminal cadastrado"
            description="Cadastre os pontos de venda deste estabelecimento."
            action={<Button onClick={() => setCreateOpen(true)}>Criar o primeiro</Button>}
          />
        }
      />

      <TerminalFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
