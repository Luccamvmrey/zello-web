import { useNavigate } from 'react-router-dom'
import { EstablishmentForm } from '@/features/establishment/establishment-form'
import { PageHeader } from '@/components/page-header'

export function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Configure seu estabelecimento"
        description="É o único cadastro obrigatório. Os dados fiscais identificam quem recebe cada divisão; o resto dá para completar depois em Configurações."
      />

      <div className="mt-8">
        <EstablishmentForm
          mode="create"
          onSuccess={() => navigate('/dashboard', { replace: true })}
        />
      </div>
    </div>
  )
}
