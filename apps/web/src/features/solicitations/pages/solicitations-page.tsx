import { ChevronDownIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CollaboratorSolicitationForm } from '../components/collaborator-solicitation-form'
import { SolicitationTabs } from '../components/solicitation-tabs'
import { TerminalSolicitationForm } from '../components/terminal-solicitation-form'

export function SolicitationsPage() {
  const [newCollaboratorOpen, setNewCollaboratorOpen] = useState(false)
  const [newTerminalOpen, setNewTerminalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Solicitações"
        description="Pedidos que dependem de aprovação de um admin."
        action={
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button />}>
              <PlusIcon /> Nova solicitação <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setNewCollaboratorOpen(true)}>
                Novo colaborador
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNewTerminalOpen(true)}>
                Novo terminal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <SolicitationTabs />

      <CollaboratorSolicitationForm open={newCollaboratorOpen} onOpenChange={setNewCollaboratorOpen} />
      <TerminalSolicitationForm open={newTerminalOpen} onOpenChange={setNewTerminalOpen} />
    </div>
  )
}
