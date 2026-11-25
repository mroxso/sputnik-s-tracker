import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MissionStatus } from '@/lib/types'

const STYLES: Record<MissionStatus, { label: string; dot: string; className: string }> = {
  'awaiting-launch': {
    label: 'Awaiting launch',
    dot: 'bg-amber-300',
    className: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  },
  launched: {
    label: 'Launched',
    dot: 'bg-sky-300',
    className: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  },
  tracking: {
    label: 'Live',
    dot: 'bg-emerald-300',
    className: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  },
  decayed: {
    label: 'Decayed',
    dot: 'bg-zinc-400',
    className: 'border-zinc-400/30 bg-zinc-400/10 text-zinc-300',
  },
}

export function StatusBadge({ status }: { status: MissionStatus }) {
  const s = STYLES[status] ?? STYLES['awaiting-launch']
  return (
    <Badge variant="outline" className={cn('gap-1.5', s.className)}>
      <span className={cn('size-1.5 rounded-full', s.dot)} />
      {s.label}
    </Badge>
  )
}
