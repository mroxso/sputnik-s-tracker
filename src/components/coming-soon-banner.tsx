import { CalendarClock, Radar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { MissionConfig } from '@/lib/types'
import { formatDate } from '@/lib/format'

export function ComingSoonBanner({ config }: { config: MissionConfig | null }) {
  const window = config?.launchWindow
  return (
    <div className="pointer-events-none relative flex justify-center p-3 pt-0 sm:absolute sm:inset-x-6 sm:bottom-6 sm:p-0">
      <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-white/10 bg-black/55 p-4 shadow-2xl backdrop-blur-md sm:p-5">
        <div className="flex items-center gap-2">
          <Badge className="gap-1.5 border-amber-400/30 bg-amber-400/15 text-amber-300">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-300" />
            </span>
            Coming soon
          </Badge>
          <span className="text-xs text-white/50">Awaiting orbital data</span>
        </div>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
          Live tracking starts once Sputnik S is in orbit
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-white/65">
          The satellite has not launched yet. As soon as its orbital elements are published, this
          globe will show its position, ground track and altitude in real time.
        </p>
        <div className="mt-4 flex flex-col gap-2 text-xs text-white/60 sm:flex-row sm:gap-5">
          {window && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-3.5 text-amber-300/80" />
              Reported window: {formatDate(window.start)} – {formatDate(window.end)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Radar className="size-3.5 text-amber-300/80" />
            Launch sites marked in red
          </span>
        </div>
      </div>
    </div>
  )
}
