const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' })

/** Accepts YYYY-MM or YYYY-MM-DD. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!d) return monthFmt.format(new Date(Date.UTC(y, m - 1, 1)))
  return dateFmt.format(new Date(Date.UTC(y, m - 1, d)))
}

export function formatCoord(value: number, pos: string, neg: string): string {
  return `${Math.abs(value).toFixed(2)}° ${value >= 0 ? pos : neg}`
}

export function formatAge(from: Date, now = new Date()): string {
  const h = (now.getTime() - from.getTime()) / 3_600_000
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min ago`
  if (h < 48) return `${Math.round(h)} h ago`
  return `${Math.round(h / 24)} days ago`
}
