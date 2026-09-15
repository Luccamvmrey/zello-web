import {
  Monitor,
  Receipt,
  Tags,
} from 'lucide-react'
import { PlaceholderPage } from './placeholder'

export function CatalogPage() {
  return (
    <PlaceholderPage
      title="Catálogo"
      description="Serviços oferecidos e seus valores sugeridos."
      icon={Tags}
      upcoming="Aqui você vai cadastrar os serviços do estabelecimento com preço sugerido, para que a maquininha já saiba o que está sendo cobrado."
    />
  )
}

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
