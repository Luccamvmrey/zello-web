import { ChevronDownIcon, ClipboardListIcon, MonitorIcon } from 'lucide-react'
import type { Collaborator, LogicalTerminalWithCount, SolicitationType } from '@repo/types'
import { EmptyState } from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { useCollaborators } from '@/lib/queries/collaborators'
import { useSolicitations } from '@/lib/queries/solicitations'
import { useTerminals } from '@/lib/queries/terminals'
import { formatDocument } from '@/lib/utils'
import { SolicitationsTable } from './solicitations-table'

function ActiveResourcesSection({ type }: { type: SolicitationType }) {
  const collaborators = useCollaborators()
  const terminals = useTerminals()

  const isCollaborator = type === 'NEW_COLLABORATOR'
  const isLoading = isCollaborator ? collaborators.isLoading : terminals.isLoading
  const count = isCollaborator ? collaborators.data?.length ?? 0 : terminals.data?.length ?? 0

  const collaboratorColumns: DataTableColumn<Collaborator>[] = [
    { key: 'name', header: 'Nome', render: (c) => c.name },
    {
      key: 'document',
      header: 'Documento',
      className: 'tabular',
      render: (c) => formatDocument(c.document, c.documentType),
    },
    { key: 'email', header: 'Email', render: (c) => c.email },
  ]

  const terminalColumns: DataTableColumn<LogicalTerminalWithCount>[] = [
    { key: 'name', header: 'Nome', render: (t) => t.name },
  ]

  return (
    <Collapsible className="flex flex-col gap-3">
      <CollapsibleTrigger className="group flex items-center gap-2 text-sm font-medium">
        <ChevronDownIcon className="size-4 transition-transform group-data-open:rotate-180" />
        Recursos ativos
        <Badge className="bg-muted text-muted-foreground">{count}</Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {isCollaborator ? (
          <DataTable
            columns={collaboratorColumns}
            data={collaborators.data ?? []}
            isLoading={isLoading}
            emptyState={<EmptyState title="Nenhum colaborador ativo ainda." />}
            getRowKey={(c) => c.id}
          />
        ) : (
          <DataTable
            columns={terminalColumns}
            data={terminals.data ?? []}
            isLoading={isLoading}
            emptyState={<EmptyState title="Nenhum terminal ativo ainda." />}
            getRowKey={(t) => t.id}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function SolicitationTabPanel({ type }: { type: SolicitationType }) {
  const { data, isLoading } = useSolicitations({ type })

  return (
    <div className="flex flex-col gap-6">
      <SolicitationsTable
        type={type}
        data={data ?? []}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={type === 'NEW_COLLABORATOR' ? ClipboardListIcon : MonitorIcon}
            title="Nenhuma solicitação encontrada"
            description="Nada por aqui com este filtro."
          />
        }
      />

      {isLoading ? <Skeleton className="h-6 w-40" /> : <ActiveResourcesSection type={type} />}
    </div>
  )
}

export function SolicitationTabs() {
  return (
    <Tabs defaultValue="NEW_COLLABORATOR">
      <TabsList>
        <TabsTrigger value="NEW_COLLABORATOR">Colaboradores</TabsTrigger>
        <TabsTrigger value="NEW_TERMINAL">Terminais</TabsTrigger>
      </TabsList>
      <TabsContent value="NEW_COLLABORATOR" className="mt-6">
        <SolicitationTabPanel type="NEW_COLLABORATOR" />
      </TabsContent>
      <TabsContent value="NEW_TERMINAL" className="mt-6">
        <SolicitationTabPanel type="NEW_TERMINAL" />
      </TabsContent>
    </Tabs>
  )
}
