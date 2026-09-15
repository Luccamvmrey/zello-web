import { ArrowRight, Monitor, Scale, Tags, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useEstablishmentMe } from '@/lib/queries/establishments'

interface Widget {
  label: string
  value: number
  icon: LucideIcon
  to: string
}

/** Ordem em que um estabelecimento novo precisa preencher as coisas. */
const FIRST_STEPS = [
  {
    to: '/collaborators',
    label: 'Cadastre os profissionais',
    detail: 'Quem recebe parte de cada venda.',
  },
  {
    to: '/rules',
    label: 'Defina as regras de divisão',
    detail: 'Quanto cabe a cada um.',
  },
  {
    to: '/terminals',
    label: 'Vincule as maquininhas',
    detail: 'Por onde as vendas entram.',
  },
]

export function DashboardPage() {
  const { data, isLoading } = useEstablishmentMe()

  const widgets: Widget[] = data
    ? [
        { label: 'Colaboradores ativos', value: data.collaboratorCount, icon: Users, to: '/collaborators' },
        { label: 'Regras de negócio', value: data.splitRuleCount, icon: Scale, to: '/rules' },
        { label: 'Serviços no catálogo', value: data.serviceCount, icon: Tags, to: '/catalog' },
        { label: 'Terminais', value: data.terminalCount, icon: Monitor, to: '/terminals' },
      ]
    : []

  // Conta recém-criada: os quatro zeros não dizem o que fazer a seguir.
  const isFresh = !!data && widgets.every((widget) => widget.value === 0)

  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="Visão geral da operação do seu estabelecimento."
      />

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
              <Link
                key={widget.to}
                to={widget.to}
                className="focus-visible:ring-ring rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <Card className="hover:border-border hover:shadow-overlay h-full transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-normal">
                      <widget.icon className="size-4" aria-hidden="true" />
                      {widget.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2">
                    <p className="tabular text-3xl font-semibold">{widget.value}</p>
                    {widget.value > 0 ? (
                      <span
                        aria-hidden="true"
                        className="bg-highlight mt-1 h-4 w-0.5 rounded-full"
                      />
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {isFresh ? (
        <div className="mt-8">
          <h2 className="font-heading text-base font-medium">Primeiros passos</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Seu estabelecimento está cadastrado. Faltam três coisas para a primeira venda
            já nascer dividida.
          </p>

          <ol className="border-border-subtle mt-4 flex flex-col rounded-xl border">
            {FIRST_STEPS.map((step, index) => (
              <li
                key={step.to}
                className="border-border-subtle border-b last:border-b-0"
              >
                <Link
                  to={step.to}
                  className="hover:bg-surface-sunken focus-visible:ring-ring flex items-center gap-4 px-4 py-3 transition-colors outline-none focus-visible:ring-2"
                >
                  <span className="text-muted-foreground tabular text-sm">
                    {index + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{step.label}</span>
                    <span className="text-muted-foreground block text-xs">
                      {step.detail}
                    </span>
                  </span>
                  <ArrowRight
                    className="text-muted-foreground size-4 shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  )
}
