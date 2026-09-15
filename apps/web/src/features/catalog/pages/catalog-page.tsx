import { Package } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { ListToolbar } from '@/components/list-toolbar'
import { PageHeader } from '@/components/page-header'
import { useServices } from '@/lib/queries/services'
import { CatalogTable } from '../components/catalog-table'
import { ServiceFormDialog } from '../components/service-form-dialog'

export function CatalogPage() {
  const [includeInactive, setIncludeInactive] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const { data, isLoading } = useServices(includeInactive)

  const count = data?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Catálogo de Serviços"
        description="Serviços oferecidos pelo estabelecimento e seus preços sugeridos."
        action={<Button onClick={() => setCreateOpen(true)}>Novo serviço</Button>}
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
          `${count} ${count === 1 ? 'serviço' : 'serviços'}`
        )}
      </ListToolbar>

      <CatalogTable
        data={data ?? []}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={Package}
            title="Nenhum serviço cadastrado"
            description="Cadastre os serviços do estabelecimento com o preço sugerido para cobrança."
            action={<Button onClick={() => setCreateOpen(true)}>Adicionar o primeiro</Button>}
          />
        }
      />

      <ServiceFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
