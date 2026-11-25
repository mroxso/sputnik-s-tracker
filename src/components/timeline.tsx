import { ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/format'
import type { TimelineEntry } from '@/lib/types'

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <ol className="relative space-y-5 border-l border-border pl-5">
      {sorted.map((e, i) => (
        <li key={`${e.date}-${i}`} className="relative">
          <span className="absolute top-1.5 -left-[24.5px] size-2 rounded-full bg-amber-400/80 ring-4 ring-background" />
          <time className="font-mono text-xs text-muted-foreground">{formatDate(e.date)}</time>
          <p className="mt-0.5 text-sm leading-snug">{e.title}</p>
          {e.source && (
            <a
              href={e.source.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {e.source.label}
              <ExternalLink className="size-3" />
            </a>
          )}
        </li>
      ))}
    </ol>
  )
}
