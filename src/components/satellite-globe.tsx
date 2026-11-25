import { useEffect, useMemo, useRef } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import { useElementSize } from '@/hooks/use-element-size'
import { EARTH_RADIUS_KM } from '@/lib/orbit'
import type { GeoPoint, LaunchSite, LivePosition } from '@/lib/types'

const TEX = `${import.meta.env.BASE_URL}textures`
const ACCENT = '#fbbf24' // amber-400

interface Props {
  position: LivePosition | null
  track: GeoPoint[][]
  launchSites: LaunchSite[]
  /** Follow the satellite with the camera. */
  follow?: boolean
}

const toAlt = (km: number) => km / EARTH_RADIUS_KM

function satelliteMarker() {
  const el = document.createElement('div')
  el.className = 'relative flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center'
  el.innerHTML = `
    <span class="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-60"></span>
    <span class="relative inline-flex size-2.5 rounded-full bg-amber-300 ring-2 ring-amber-100/70"></span>`
  return el
}

function siteMarker(d: object) {
  const site = d as LaunchSite
  const el = document.createElement('div')
  el.className =
    'pointer-events-none -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/80 backdrop-blur'
  el.textContent = site.name
  return el
}

export default function SatelliteGlobe({ position, track, launchSites, follow = true }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const [containerRef, { width, height }] = useElementSize<HTMLDivElement>()

  const isLive = position !== null

  // Camera: slow auto-rotate while waiting, track the satellite when live.
  useEffect(() => {
    const g = globeRef.current
    if (!g) return
    const controls = g.controls()
    controls.autoRotate = !isLive
    controls.autoRotateSpeed = 0.35
    controls.enableZoom = true
    controls.minDistance = 140
    controls.maxDistance = 600
  }, [isLive, width])

  useEffect(() => {
    if (!follow || !position) return
    globeRef.current?.pointOfView({ lat: position.lat, lng: position.lng }, 1000)
    // Only recenter when the satellite has moved noticeably.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [follow, position && Math.round(position.lat / 3), position && Math.round(position.lng / 3)])

  const satData = useMemo(
    () => (position ? [{ ...position, kind: 'sat' as const }] : []),
    [position],
  )
  const htmlData = useMemo(
    () => [
      ...satData.map((p) => ({ lat: p.lat, lng: p.lng, alt: toAlt(p.altKm), kind: 'sat' as const })),
      ...launchSites.map((s) => ({ ...s, alt: 0, kind: 'site' as const })),
    ],
    [satData, launchSites],
  )
  const rings = useMemo(
    () => [
      ...satData.map((p) => ({ lat: p.lat, lng: p.lng, color: ACCENT, speed: 3, radius: 6 })),
      ...launchSites.map((s) => ({ lat: s.lat, lng: s.lng, color: '#f87171', speed: 1.2, radius: 2.5 })),
    ],
    [satData, launchSites],
  )
  const paths = useMemo(() => track.map((seg) => ({ points: seg })), [track])

  return (
    <div ref={containerRef} className="absolute inset-0">
      {width > 0 && (
        <Globe
          ref={globeRef}
          width={width}
          height={height}
          // Lift the globe above the coming-soon banner on larger screens.
          globeOffset={!isLive && width >= 600 ? [0, -Math.round(height * 0.12)] : [0, 0]}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={`${TEX}/earth-night.jpg`}
          bumpImageUrl={`${TEX}/earth-topology.png`}
          showAtmosphere
          atmosphereColor="#60a5fa"
          atmosphereAltitude={0.18}
          animateIn
          // Orbit trace at satellite altitude
          pathsData={paths}
          pathPoints="points"
          pathPointLat="lat"
          pathPointLng="lng"
          pathPointAlt={(p: object) => toAlt((p as GeoPoint).altKm)}
          pathColor={() => ['rgba(251,191,36,0.15)', 'rgba(251,191,36,0.9)']}
          pathStroke={1.5}
          pathDashLength={0.02}
          pathDashGap={0.008}
          pathDashAnimateTime={0}
          pathTransitionDuration={0}
          // Pulses on the ground below the satellite and at launch sites
          ringsData={rings}
          ringColor={(d: object) => (t: number) => {
            const r = d as { color: string }
            const a = Math.round((1 - t) * 255).toString(16).padStart(2, '0')
            return `${r.color}${a}`
          }}
          ringMaxRadius="radius"
          ringPropagationSpeed="speed"
          ringRepeatPeriod={1400}
          // Satellite marker + launch site labels
          htmlElementsData={htmlData}
          htmlAltitude="alt"
          htmlElement={(d: object) =>
            (d as { kind: string }).kind === 'sat' ? satelliteMarker() : siteMarker(d)
          }
          htmlTransitionDuration={0}
        />
      )}
    </div>
  )
}
