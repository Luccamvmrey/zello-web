import {
  Monitor,
  Receipt,
} from 'lucide-react'
import { PlaceholderPage } from './placeholder'

export function TerminalsPage() {
  return (
    <PlaceholderPage
      title="Terminais"
      description="Pontos de venda e maquininhas vinculadas."
      icon={Monitor}
      upcoming="Aqui você vai vincular cada maquininha ao estabelecimento e acompanhar quais estão ativas."
    />
  )
}

export function SalesPage() {
  return (
    <PlaceholderPage
      title="Vendas"
      description="Histórico de vendas e o registro de cada divisão."
      icon={Receipt}
      upcoming="Aqui você vai ver cada venda com o extrato da divisão: quanto foi para o estabelecimento, quanto para cada profissional e quando caiu."
    />
  )
}
