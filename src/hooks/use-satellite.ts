import { useEffect, useMemo, useState } from 'react'
import type { SatRec } from 'satellite.js'
import { fetchTle, orbitTrack, parseTle, positionAt, tleEpoch } from '@/lib/orbit'
import type { GeoPoint, LivePosition, MissionConfig } from '@/lib/types'

export type TrackingState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; error: string }
  | {
      kind: 'live'
      satrec: SatRec
      position: LivePosition | null
      track: GeoPoint[][]
      epoch: Date
    }

const TLE_REFRESH_MS = 2 * 60 * 60_000

/**
 * Fetches orbital elements for the mission (if a NORAD ID is known) and
 * propagates the satellite's position once per second.
 */
export function useSatellite(config: MissionConfig | null): TrackingState {
  const [fetched, setFetched] = useState<{ id: number; tle: [string, string] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  const noradId = config?.noradId ?? null
  const manualTle = config?.tle ?? null
  const enabled = manualTle !== null || noradId !== null
  const tle = manualTle ?? (fetched && fetched.id === noradId ? fetched.tle : null)

  useEffect(() => {
    if (manualTle || noradId === null) return
    const ctrl = new AbortController()
    const load = () =>
      fetchTle(noradId, ctrl.signal)
        .then((t) => {
          setFetched({ id: noradId, tle: t })
          setError(null)
        })
        .catch((e: Error) => {
          if (e.name !== 'AbortError') setError(e.message)
        })
    load()
    const id = setInterval(load, TLE_REFRESH_MS)
    return () => {
      ctrl.abort()
      clearInterval(id)
    }
  }, [noradId, manualTle])

  const hasTle = tle !== null
  useEffect(() => {
    if (!hasTle) return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [hasTle])

  const l1 = tle?.[0]
  const l2 = tle?.[1]
  const satrec = useMemo(() => (l1 && l2 ? parseTle(l1, l2) : null), [l1, l2])

  // The orbit trace only needs recomputing about once a minute.
  const minute = Math.floor(now.getTime() / 60_000)
  const track = useMemo(
    () => (satrec ? orbitTrack(satrec, new Date(minute * 60_000)) : []),
    [satrec, minute],
  )

  if (!enabled) return { kind: 'idle' }
  if (error && !satrec) return { kind: 'error', error }
  if (!satrec) return { kind: 'loading' }
  return {
    kind: 'live',
    satrec,
    position: positionAt(satrec, now),
    track,
    epoch: tleEpoch(satrec),
  }
}
