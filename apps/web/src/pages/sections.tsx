import {
  LayoutDashboard,
  Monitor,
  Receipt,
  Scale,
  Settings,
  Tags,
  Users,
} from 'lucide-react'
import { PlaceholderPage } from './placeholder'

export function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Visão geral da operação do seu estabelecimento."
      icon={LayoutDashboard}
    />
  )
}

export function CollaboratorsPage() {
  return (
    <PlaceholderPage
      title="Colaboradores"
      description="Profissionais que recebem sua parte direto na venda."
      icon={Users}
    />
  )
}

export function RulesPage() {
  return (
    <PlaceholderPage
      title="Regras"
      description="Como cada venda é dividida entre estabelecimento e profissional."
      icon={Scale}
    />
  )
}

export function CatalogPage() {
  return (
    <PlaceholderPage
      title="Catálogo"
      description="Serviços oferecidos e seus valores sugeridos."
      icon={Tags}
    />
  )
}

export function TerminalsPage() {
  return (
    <PlaceholderPage
      title="Terminais"
      description="Pontos de venda e maquininhas vinculadas."
      icon={Monitor}
    />
  )
}

export function SalesPage() {
  return (
    <PlaceholderPage
      title="Vendas"
      description="Histórico de vendas e o registro de cada divisão."
      icon={Receipt}
    />
  )
}

export function SettingsPage() {
  return (
    <PlaceholderPage
      title="Configurações"
      description="Dados do estabelecimento e preferências da conta."
      icon={Settings}
    />
  )
}
