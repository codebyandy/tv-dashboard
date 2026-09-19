interface Arrival {
  route: string
  minutes: number
  delayLabel: string
  onTime: boolean
}

const MOCK_ARRIVALS: Arrival[] = [
  { route: '24', minutes: 4, delayLabel: 'on time', onTime: true },
  { route: '33', minutes: 19, delayLabel: '+2 min', onTime: false },
]

export function BusCard() {
  return (
    <section className="glass rounded-3xl p-10">
      <header className="flex items-center justify-between mb-6">
        <span className="eyebrow" style={{ color: '#D5C7F0' }}>
          Bus · 24 / 33
        </span>
        <span className="text-xs text-white/35 tracking-wide">→ 3rd &amp; Pike</span>
      </header>

      <ul className="space-y-4">
        {MOCK_ARRIVALS.map((a, i) => (
          <li key={i} className="flex items-baseline gap-4">
            <span className="text-xs text-white/40 w-6 tabular-nums">{a.route}</span>
            <span className="text-3xl font-thin tabular-nums text-white/90">
              {a.minutes}
            </span>
            <span className="text-sm text-white/45">min</span>
            <span
              className={`ml-auto text-xs tracking-wider uppercase ${
                a.onTime ? 'text-mint/90' : 'text-white/45'
              }`}
            >
              {a.delayLabel}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
