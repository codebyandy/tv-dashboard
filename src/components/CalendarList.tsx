interface MockEvent {
  time: string
  title: string
  allDay?: boolean
}

interface MockDay {
  label: string
  events: MockEvent[]
}

const MOCK_DAYS: MockDay[] = [
  {
    label: 'Today',
    events: [
      { time: '10:00 AM', title: 'Standup' },
      { time: '12:30 PM', title: 'Lunch with Sam' },
      { time: '3:00 PM', title: '1:1 with boss' },
    ],
  },
  {
    label: 'Tomorrow',
    events: [
      { time: 'All day', title: 'Dentist', allDay: true },
      { time: '9:00 AM', title: 'Coffee w/ Jamie' },
    ],
  },
]

export function CalendarList() {
  return (
    <section className="glass rounded-3xl p-10 flex flex-col min-h-0">
      <header className="flex items-center justify-between mb-8">
        <span className="eyebrow" style={{ color: '#F5C9B8' }}>
          Upcoming
        </span>
        <span className="text-xs text-white/30 tracking-wide">Andy's Fun LIfe</span>
      </header>

      <div className="flex-1 overflow-hidden">
        {MOCK_DAYS.map((day, di) => (
          <div key={day.label} className={di > 0 ? 'mt-8' : ''}>
            <div className="text-[0.7rem] uppercase tracking-[0.22em] font-semibold text-white/35 mb-4">
              {day.label}
            </div>
            <ul className="space-y-4">
              {day.events.map((e, i) => (
                <li key={i} className="flex items-baseline gap-8">
                  <span
                    className={`w-28 shrink-0 text-sm tabular-nums font-light ${
                      e.allDay ? 'text-white/40' : 'text-white/55'
                    }`}
                  >
                    {e.time}
                  </span>
                  <span className="text-xl font-extralight text-white/90">
                    {e.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
