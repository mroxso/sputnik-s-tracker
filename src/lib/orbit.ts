import {
  degreesLat,
  degreesLong,
  eciToGeodetic,
  gstime,
  propagate,
  twoline2satrec,
  type SatRec,
} from 'satellite.js'
import type { GeoPoint, LivePosition } from './types'

export const EARTH_RADIUS_KM = 6371

export function parseTle(line1: string, line2: string): SatRec {
  return twoline2satrec(line1.trim(), line2.trim())
}

export function positionAt(satrec: SatRec, date: Date): LivePosition | null {
  const pv = propagate(satrec, date)
  if (!pv) return null
  const gd = eciToGeodetic(pv.position, gstime(date))
  const { x, y, z } = pv.velocity
  return {
    lat: degreesLat(gd.latitude),
    lng: degreesLong(gd.longitude),
    altKm: gd.height,
    velocity: Math.sqrt(x * x + y * y + z * z),
    timestamp: date,
  }
}

/** Orbital period in minutes, from mean motion (rad/min). */
export function periodMinutes(satrec: SatRec): number {
  return (2 * Math.PI) / satrec.no
}

export function inclinationDeg(satrec: SatRec): number {
  return (satrec.inclo * 180) / Math.PI
}

/** Epoch of the element set as a Date. */
export function tleEpoch(satrec: SatRec): Date {
  const year = satrec.epochyr < 57 ? 2000 + satrec.epochyr : 1900 + satrec.epochyr
  const start = Date.UTC(year, 0, 1)
  return new Date(start + (satrec.epochdays - 1) * 86_400_000)
}

/**
 * Samples one full orbit centred on `date`. Returned as segments that are
 * split at the antimeridian so the path never draws across the globe.
 */
export function orbitTrack(satrec: SatRec, date: Date, steps = 180): GeoPoint[][] {
  const period = periodMinutes(satrec) * 60_000
  const segments: GeoPoint[][] = [[]]
  let prev: GeoPoint | null = null
  for (let i = 0; i <= steps; i++) {
    const t = new Date(date.getTime() - period / 2 + (period * i) / steps)
    const p = positionAt(satrec, t)
    if (!p) continue
    if (prev && Math.abs(p.lng - prev.lng) > 180) segments.push([])
    segments[segments.length - 1].push({ lat: p.lat, lng: p.lng, altKm: p.altKm })
    prev = p
  }
  return segments.filter((s) => s.length > 1)
}

export async function fetchTle(noradId: number, signal?: AbortSignal): Promise<[string, string]> {
  const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=TLE`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`CelesTrak responded ${res.status}`)
  const lines = (await res.text())
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const l1 = lines.find((l) => l.startsWith('1 '))
  const l2 = lines.find((l) => l.startsWith('2 '))
  if (!l1 || !l2) throw new Error('No orbital elements published yet')
  return [l1, l2]
}
