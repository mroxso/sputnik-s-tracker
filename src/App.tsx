import { lazy, Suspense } from 'react'
import { Database, CodeXml, Satellite } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ComingSoonBanner } from '@/components/coming-soon-banner'
import { StatusBadge } from '@/components/status-badge'
import { Telemetry } from '@/components/telemetry'
import { Timeline } from '@/components/timeline'
import { useMission } from '@/hooks/use-mission'
import { useSatellite } from '@/hooks/use-satellite'
import { formatDate } from '@/lib/format'

const SatelliteGlobe = lazy(() => import('@/components/satellite-globe'))

const REPO_URL = 'https://github.com/mroxso/sputnik-s-tracker'

function GlobeFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="size-56 animate-pulse rounded-full bg-gradient-to-br from-sky-900/40 to-slate-900/20 shadow-[0_0_80px_-10px] shadow-sky-500/30 sm:size-72" />
    </div>
  )
}

export default function App() {
  const mission = useMission()
  const config = mission.kind === 'ready' ? mission.config : null
  const tracking = useSatellite(config)
  const live = tracking.kind === 'live' && tracking.position !== null

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/25">
              <Satellite className="size-4" />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-semibold tracking-tight sm:text-base">Sputnik S Tracker</h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Unofficial live position &amp; status
              </p>
            </div>
          </div>
          {config && <StatusBadge status={live ? 'tracking' : config.status} />}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
        {/* Globe */}
        <section
          aria-label="Globe"
          className="relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-[radial-gradient(ellipse_at_center,_#0b1630_0%,_#05070d_70%)] sm:h-[62svh] sm:min-h-[460px] lg:sticky lg:top-20 lg:h-[calc(100svh-7rem)]"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 [background-image:radial-gradient(1px_1px_at_20%_30%,white,transparent),radial-gradient(1px_1px_at_70%_80%,white,transparent),radial-gradient(1px_1px_at_40%_70%,white,transparent),radial-gradient(1px_1px_at_85%_20%,white,transparent),radial-gradient(1px_1px_at_10%_85%,white,transparent),radial-gradient(1px_1px_at_55%_15%,white,transparent)] [background-size:320px_320px]"
          />
          <div className="relative h-[52svh] min-h-[320px] sm:h-auto sm:flex-1">
            <Suspense fallback={<GlobeFallback />}>
              <SatelliteGlobe
                position={tracking.kind === 'live' ? tracking.position : null}
                track={tracking.kind === 'live' ? tracking.track : []}
                launchSites={live ? [] : (config?.launchSites ?? [])}
              />
            </Suspense>

            {live && config && (
              <div className="pointer-events-none absolute top-3 left-3 rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-white/70 backdrop-blur sm:top-4 sm:left-4">
                <div className="font-medium text-white">{config.designation ?? config.name}</div>
                {config.noradId && <div className="font-mono">NORAD {config.noradId}</div>}
              </div>
            )}
          </div>

          {!live && <ComingSoonBanner config={config} />}
        </section>

        {/* Side panel */}
        <aside className="flex flex-col gap-4 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mission status</CardTitle>
              <CardDescription>
                {mission.kind === 'error'
                  ? `Could not load mission data (${mission.error}).`
                  : config
                    ? `Last updated ${formatDate(config.lastUpdated)}`
                    : 'Loading…'}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <Row label="Status">{config ? <StatusBadge status={live ? 'tracking' : config.status} /> : '—'}</Row>
              <Separator />
              <Row label="Designation">{config?.designation ?? 'Not yet assigned'}</Row>
              <Separator />
              <Row label="NORAD ID">{config?.noradId ?? 'Not yet assigned'}</Row>
              {config?.launchWindow && (
                <>
                  <Separator />
                  <Row label="Launch window">
                    {formatDate(config.launchWindow.start)} – {formatDate(config.launchWindow.end)}
                  </Row>
                  {config.launchWindow.note && (
                    <p className="text-xs text-muted-foreground">{config.launchWindow.note}</p>
                  )}
                </>
              )}
              {tracking.kind === 'error' && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  Orbital data unavailable: {tracking.error}
                </p>
              )}
            </CardContent>
          </Card>

          <section aria-label="Telemetry" className="flex flex-col gap-2.5">
            <h2 className="px-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Telemetry
            </h2>
            <Telemetry tracking={tracking} />
          </section>

          {config && config.timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Reports so far. None of this is officially confirmed.</CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline entries={config.timeline} />
              </CardContent>
            </Card>
          )}

          <Card size="sm">
            <CardContent className="flex gap-3 text-xs leading-relaxed text-muted-foreground">
              <Database className="mt-0.5 size-4 shrink-0" />
              <p>
                Positions are computed in your browser with SGP4 from public orbital elements
                published via{' '}
                <a className="underline underline-offset-4 hover:text-foreground" href="https://celestrak.org" target="_blank" rel="noreferrer">
                  CelesTrak
                </a>
                . Accuracy depends on how fresh those elements are.
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Independent project. Not affiliated with any government or space agency.</p>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <CodeXml className="size-3.5" /> Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  )
}
