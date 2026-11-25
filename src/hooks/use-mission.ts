import { useEffect, useState } from 'react'
import type { MissionConfig } from '@/lib/types'

type State =
  | { kind: 'loading' }
  | { kind: 'error'; error: string }
  | { kind: 'ready'; config: MissionConfig }

const CONFIG_URL = `${import.meta.env.BASE_URL}data/sputnik-s.json`

/** Loads the hand-maintained mission file. Re-checked every 10 minutes. */
export function useMission(): State {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(CONFIG_URL, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const config = (await res.json()) as MissionConfig
        if (!cancelled) setState({ kind: 'ready', config })
      } catch (e) {
        if (!cancelled) setState({ kind: 'error', error: (e as Error).message })
      }
    }
    load()
    const id = setInterval(load, 10 * 60_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return state
}
