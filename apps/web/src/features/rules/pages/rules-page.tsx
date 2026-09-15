import { Scale } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { ListToolbar } from '@/components/list-toolbar'
import { PageHeader } from '@/components/page-header'
import { useSplitRules } from '@/lib/queries/split-rules'
import { RuleFormDialog } from '../components/rule-form-dialog'
import { RulesTable } from '../components/rules-table'

export function RulesPage() {
  const [includeInactive, setIncludeInactive] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const { data, isLoading } = useSplitRules(includeInactive)

  const count = data?.length ?? 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Regras de Negócio"
        description="Como cada venda é dividida entre estabelecimento e profissional."
        action={<Button onClick={() => setCreateOpen(true)}>Nova regra</Button>}
      />

      <ListToolbar
        actions={
          <div className="flex items-center gap-2">
            <Switch
              id="include-inactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
            <Label htmlFor="include-inactive">Mostrar inativas</Label>
          </div>
        }
      >
        {isLoading ? <Skeleton className="h-4 w-28" /> : `${count} ${count === 1 ? 'regra' : 'regras'}`}
      </ListToolbar>

      <RulesTable
        data={data ?? []}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={Scale}
            title="Nenhuma regra cadastrada"
            description="Defina o percentual ou o valor fixo que cabe a cada divisão de venda."
            action={<Button onClick={() => setCreateOpen(true)}>Criar a primeira</Button>}
          />
        }
      />

      <RuleFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
