import { Receipt } from 'lucide-react'
import { PlaceholderPage } from './placeholder'

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
