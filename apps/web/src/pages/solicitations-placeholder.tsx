import { ClipboardList } from 'lucide-react'
import { PlaceholderPage } from '@/pages/placeholder'

export function SolicitationsPlaceholderPage() {
  return (
    <PlaceholderPage
      title="Solicitações"
      description="Pedidos que dependem de uma ação sua."
      icon={ClipboardList}
      upcoming="Aqui você vai ver e responder solicitações de colaboradores e terminais."
    />
  )
}
