import { format, isToday, isTomorrow, startOfDay } from 'date-fns'
import { useCalendar } from '../hooks/useCalendar'
import { hasGoogleCreds, type CalendarEvent } from '../api/google'

function dayLabel(date: Date): string {
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEEE, MMM d')
}

function groupByDay(events: CalendarEvent[]): { label: string; events: CalendarEvent[] }[] {
  const map = new Map<string, CalendarEvent[]>()
  for (const e of events) {
    const key = startOfDay(e.start).toISOString()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(e)
  }
  return Array.from(map.entries()).map(([, evts]) => ({
    label: dayLabel(evts[0].start),
    events: [
      ...evts.filter((e) => e.allDay),
      ...evts.filter((e) => !e.allDay),
    ],
  }))
}

function EventRow({ event }: { event: CalendarEvent }) {
  const timeStr = event.allDay ? 'All day' : format(event.start, 'h:mm a')
  return (
    <li className="flex items-baseline gap-8">
      <span className={`w-28 shrink-0 text-sm tabular-nums font-light ${event.allDay ? 'text-white/35' : 'text-white/50'}`}>
        {timeStr}
      </span>
      <span className="text-xl font-extralight text-white/90 truncate">{event.title}</span>
    </li>
  )
}

export function CalendarList() {
  const { data, isLoading, isError, isFetching } = useCalendar()

  const days = data ? groupByDay(data.slice(0, 7)) : []
  const stale = isError && Boolean(data)
  const noCredsYet = !hasGoogleCreds

  return (
    <section className="glass rounded-3xl p-10 flex flex-col min-h-0">
      <header className="flex items-center justify-between mb-8">
        <span className="eyebrow flex items-center gap-2" style={{ color: '#F5C9B8' }}>
          Upcoming
          {stale && <span className="w-1.5 h-1.5 rounded-full bg-peach/60" title="Stale data" />}
          {isFetching && !stale && <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />}
        </span>
        <span className="text-xs text-white/30 tracking-wide">Andy's Fun Life</span>
      </header>

      <div className="flex-1 overflow-hidden">
        {noCredsYet && (
          <p className="text-white/30 text-sm">Add Google credentials to .env to see events.</p>
        )}
        {!noCredsYet && isLoading && (
          <p className="text-white/30 text-sm">Loading…</p>
        )}
        {!noCredsYet && !isLoading && days.length === 0 && (
          <p className="text-white/30 text-sm">Nothing in the next 48 hours.</p>
        )}
        {days.map((day, di) => (
          <div key={day.label} className={di > 0 ? 'mt-8' : ''}>
            <div className="text-[0.7rem] uppercase tracking-[0.22em] font-semibold text-white/30 mb-4">
              {day.label}
            </div>
            <ul className="space-y-4">
              {day.events.map((e) => <EventRow key={e.id} event={e} />)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
