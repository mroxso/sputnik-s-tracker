export type MissionStatus = 'awaiting-launch' | 'launched' | 'tracking' | 'decayed'

export interface TimelineEntry {
  date: string
  title: string
  source?: { label: string; url: string }
}

export interface LaunchSite {
  name: string
  lat: number
  lng: number
}

export interface MissionConfig {
  name: string
  status: MissionStatus
  /** NORAD catalog number, known only after launch. */
  noradId: number | null
  /** Official designation, likely "Kosmos-XXXX". */
  designation: string | null
  lastUpdated: string
  launchWindow?: { start: string; end: string; note?: string }
  launchSites?: LaunchSite[]
  timeline: TimelineEntry[]
  /** Optional manual TLE override, used instead of fetching from CelesTrak. */
  tle?: [string, string]
}

export interface GeoPoint {
  lat: number
  lng: number
  /** Kilometres above the surface. */
  altKm: number
}

export interface LivePosition extends GeoPoint {
  /** km/s */
  velocity: number
  timestamp: Date
}
