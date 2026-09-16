import { CheckIcon, RotateCcwIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { AdminAccount } from '@repo/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DataTable, type DataTableColumn } from '@/components/data-table'
import { apiErrorMessage } from '@/lib/api'
import { useApproveAccount, useReactivateAccount, useRejectAccount } from '@/lib/queries/admin'
import { ACCOUNT_STATUS_BADGE } from './account-status-badge'

interface AdminAccountsTableProps {
  data: AdminAccount[]
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function AdminAccountsTable({ data, isLoading, emptyState }: AdminAccountsTableProps) {
  const [rejecting, setRejecting] = useState<AdminAccount | null>(null)
  const [reason, setReason] = useState('')
  const approveAccount = useApproveAccount()
  const rejectAccount = useRejectAccount()
  const reactivateAccount = useReactivateAccount()

  async function handleApprove(account: AdminAccount) {
    try {
      await approveAccount.mutateAsync({ id: account.id })
      toast.success('Conta aprovada.')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível aprovar a conta.'))
    }
  }

  async function handleConfirmReject() {
    if (!rejecting) return

    try {
      await rejectAccount.mutateAsync({ id: rejecting.id, dto: { reason: reason || undefined } })
      toast.success('Conta rejeitada.')
      setRejecting(null)
      setReason('')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível rejeitar a conta.'))
    }
  }

  async function handleReactivate(account: AdminAccount) {
    try {
      await reactivateAccount.mutateAsync({ id: account.id })
      toast.success('Conta reativada.')
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Não foi possível reativar a conta.'))
    }
  }

  const columns: DataTableColumn<AdminAccount>[] = [
    { key: 'name', header: 'Nome', render: (r) => r.name },
    { key: 'email', header: 'Email', render: (r) => r.email },
    {
      key: 'createdAt',
      header: 'Data de criação',
      render: (r) => new Date(r.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'establishment',
      header: 'Estabelecimento',
      render: (r) => r.establishment?.nomeFantasia ?? 'Não cadastrado',
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge className={ACCOUNT_STATUS_BADGE[r.accountStatus].className}>
          {ACCOUNT_STATUS_BADGE[r.accountStatus].label}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-2">
          {r.accountStatus === 'PENDING_APPROVAL' ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleApprove(r)}
                disabled={approveAccount.isPending}
              >
                <CheckIcon /> Aprovar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRejecting(r)}>
                <XIcon /> Rejeitar
              </Button>
            </>
          ) : null}

          {r.accountStatus === 'ACTIVE' ? (
            <Button variant="ghost" size="sm" onClick={() => setRejecting(r)}>
              <XIcon /> Suspender
            </Button>
          ) : null}

          {r.accountStatus === 'SUSPENDED' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleReactivate(r)}
              disabled={reactivateAccount.isPending}
            >
              <RotateCcwIcon /> Reativar
            </Button>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyState={emptyState}
        getRowKey={(r) => r.id}
      />

      <AlertDialog
        open={!!rejecting}
        onOpenChange={(open) => {
          if (!open) {
            setRejecting(null)
            setReason('')
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {rejecting?.accountStatus === 'ACTIVE' ? 'Suspender conta?' : 'Rejeitar conta?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {rejecting ? `${rejecting.name} não poderá mais acessar o sistema.` : undefined}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Textarea
            placeholder="Motivo (opcional)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />

          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectAccount.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={rejectAccount.isPending}
              onClick={handleConfirmReject}
            >
              {rejecting?.accountStatus === 'ACTIVE' ? 'Suspender' : 'Rejeitar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
