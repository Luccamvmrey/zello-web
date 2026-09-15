import type { SplitRule } from '@repo/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RuleForm } from './rule-form'

interface RuleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  rule?: SplitRule
}

export function RuleFormDialog({ open, onOpenChange, mode, rule }: RuleFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nova regra' : 'Editar regra'}</DialogTitle>
          <DialogDescription>
            Defina como cada venda é dividida entre estabelecimento e colaborador.
          </DialogDescription>
        </DialogHeader>

        <RuleForm
          mode={mode}
          rule={rule}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
