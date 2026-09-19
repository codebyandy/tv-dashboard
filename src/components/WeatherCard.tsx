import { useWeather } from '../hooks/useWeather'

const LABEL = import.meta.env.VITE_WEATHER_LABEL ?? 'Seattle'

export function WeatherCard() {
  const { data, isLoading, isError } = useWeather()

  const stale = isError && !data

  return (
    <section className="glass rounded-3xl p-10">
      <header className="flex items-center justify-between mb-6">
        <span className="eyebrow flex items-center gap-2" style={{ color: '#B8E6D0' }}>
          {LABEL}
          {stale && <span className="w-1.5 h-1.5 rounded-full bg-mint/60" />}
        </span>
        <span className="text-xs text-white/40 tracking-wide">
          {data ? `${data.icon}  ${data.label}` : isLoading ? '…' : '—'}
        </span>
      </header>

      <div className="flex items-baseline gap-3">
        <span className="text-7xl font-thin tabular-nums leading-none">
          {data ? data.temp : '—'}
        </span>
        <span className="text-2xl font-thin text-white/50">°F</span>
      </div>

      <div className="mt-6 flex gap-6 text-sm text-white/45 tabular-nums">
        <span>
          <span className="text-white/30 mr-1.5">H</span>
          {data ? `${data.high}°` : '—'}
        </span>
        <span>
          <span className="text-white/30 mr-1.5">L</span>
          {data ? `${data.low}°` : '—'}
        </span>
      </div>
    </section>
  )
}
