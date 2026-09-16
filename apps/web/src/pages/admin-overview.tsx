import { ClipboardList, Store, Users, UserCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminOverview } from '@/lib/queries/admin'

interface Widget {
  label: string
  value: number
  icon: LucideIcon
}

export function AdminOverviewPage() {
  const { data, isLoading } = useAdminOverview()

  const widgets: Widget[] = data
    ? [
        { label: 'Contas pendentes', value: data.pendingAccounts, icon: UserCheck },
        { label: 'Solicitações pendentes', value: data.pendingSolicitations, icon: ClipboardList },
        { label: 'Estabelecimentos', value: data.totalEstablishments, icon: Store },
        { label: 'Colaboradores', value: data.totalCollaborators, icon: Users },
      ]
    : []

  return (
    <section>
      <PageHeader title="Visão Geral" description="Resumo da operação em todos os estabelecimentos." />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))
          : widgets.map((widget) => (
              <Card key={widget.label}>
                <CardHeader>
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-normal">
                    <widget.icon className="size-4" aria-hidden="true" />
                    {widget.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="tabular text-3xl font-semibold">{widget.value}</p>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  )
}
