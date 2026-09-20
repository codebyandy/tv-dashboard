import { differenceInSeconds } from 'date-fns'
import { useBus } from '../hooks/useBus'
import { useClock } from '../hooks/useClock'
import { hasObaConfig, type Arrival } from '../api/oneBusAway'

const DESTINATION = import.meta.env.VITE_OBA_DESTINATION_LABEL || 'Downtown'

function delayLabel(delaySecs: number): string {
  if (Math.abs(delaySecs) < 60) return 'on time'
  const mins = Math.round(delaySecs / 60)
  return mins > 0 ? `+${mins} min` : `${mins} min`
}

function ArrivalRow({ arrival, now }: { arrival: Arrival; now: Date }) {
  const displayTime = arrival.predictedTime ?? arrival.scheduledTime
  const totalSecs = differenceInSeconds(displayTime, now)

  let timeDisplay: React.ReactNode
  if (totalSecs <= 0) {
    timeDisplay = <span className="text-4xl font-thin text-white/90">now</span>
  } else {
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    timeDisplay = (
      <span className="flex items-baseline gap-1.5">
        <span className="text-4xl font-thin tabular-nums text-white/90">{mins}</span>
        <span className="text-lg font-light text-white/40">min</span>
        <span className="text-2xl font-thin tabular-nums text-white/50 ml-1">{String(secs).padStart(2, '0')}</span>
        <span className="text-sm font-light text-white/25">s</span>
      </span>
    )
  }

  return (
    <li className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1.5 w-5 shrink-0">
        <span className="text-xs text-white/30 tabular-nums">{arrival.routeShortName}</span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: '#D5C7F0' }} />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: '#D5C7F0' }} />
        </span>
      </div>
      <div className="flex-1">{timeDisplay}</div>
      <span
        className={`text-xs tracking-wider uppercase tabular-nums ${
          arrival.onTime ? 'text-mint/80' : 'text-white/40'
        }`}
      >
        {delayLabel(arrival.delaySecs)}
      </span>
    </li>
  )
}

export function BusCard() {
  const { data, isLoading, isError } = useBus()
  const now = useClock()
  const stale = isError && Boolean(data)

  return (
    <section className="glass rounded-3xl p-10 flex-1">
      <header className="flex items-center justify-between mb-6">
        <span className="eyebrow flex items-center gap-2" style={{ color: '#D5C7F0' }}>
          Bus · 24 / 33
          {stale && <span className="w-1.5 h-1.5 rounded-full bg-lavender/60" title="Stale" />}
        </span>
        <span className="text-xs text-white/35 tracking-wide">→ {DESTINATION}</span>
      </header>

      <ul className="space-y-6">
        {!hasObaConfig && (
          <li className="text-white/30 text-sm">Add OBA config to .env to see arrivals.</li>
        )}
        {hasObaConfig && isLoading && (
          <li className="text-white/30 text-sm">Loading…</li>
        )}
        {hasObaConfig && !isLoading && data?.length === 0 && (
          <li className="text-white/30 text-sm">No buses in the next 90 min.</li>
        )}
        {data?.map((a, i) => <ArrivalRow key={i} arrival={a} now={now} />)}
      </ul>
    </section>
  )
}
