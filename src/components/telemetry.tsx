import type { ReactNode } from 'react'
import { Activity, ArrowUpFromLine, Compass, Gauge, Earth, Clock, Orbit, Timer } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatAge, formatCoord } from '@/lib/format'
import { inclinationDeg, periodMinutes } from '@/lib/orbit'
import type { TrackingState } from '@/hooks/use-satellite'

function Stat({
  icon,
  label,
  value,
  unit,
}: {
  icon: ReactNode
  label: string
  value: string | null
  unit?: string
}) {
  return (
    <Card size="sm" className="gap-1.5 bg-card/60 px-3.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:size-3.5">
        {icon}
        {label}
      </div>
      <div
        className={cn(
          'font-mono text-lg tabular-nums tracking-tight sm:text-xl',
          value === null && 'text-muted-foreground/40',
        )}
      >
        {value ?? '—'}
        {value !== null && unit && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
        )}
      </div>
    </Card>
  )
}

export function Telemetry({ tracking }: { tracking: TrackingState }) {
  const live = tracking.kind === 'live' ? tracking : null
  const p = live?.position ?? null
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
      <Stat icon={<Earth />} label="Latitude" value={p ? formatCoord(p.lat, 'N', 'S') : null} />
      <Stat icon={<Compass />} label="Longitude" value={p ? formatCoord(p.lng, 'E', 'W') : null} />
      <Stat icon={<ArrowUpFromLine />} label="Altitude" value={p ? Math.round(p.altKm).toLocaleString('en') : null} unit="km" />
      <Stat icon={<Gauge />} label="Velocity" value={p ? p.velocity.toFixed(2) : null} unit="km/s" />
      <Stat icon={<Timer />} label="Period" value={live ? periodMinutes(live.satrec).toFixed(1) : null} unit="min" />
      <Stat icon={<Orbit />} label="Inclination" value={live ? inclinationDeg(live.satrec).toFixed(2) : null} unit="°" />
      <Stat icon={<Clock />} label="Elements epoch" value={live ? formatAge(live.epoch) : null} />
      <Stat icon={<Activity />} label="Updated" value={p ? p.timestamp.toISOString().slice(11, 19) : null} unit="UTC" />
    </div>
  )
}
