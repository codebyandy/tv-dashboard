import { format } from 'date-fns'
import { useClock } from '../hooks/useClock'

export function Clock() {
  const now = useClock()
  const time = format(now, 'h:mm')
  const secs = format(now, 'ss')
  const ampm = format(now, 'a')

  return (
    <div className="flex items-baseline gap-3">
      <span className="text-[8rem] leading-none font-thin tracking-tight tabular-nums">
        {time}
      </span>
      <span className="text-[3rem] leading-none font-thin tabular-nums text-white/30">
        {secs}
      </span>
      <span className="text-xl font-light tracking-[0.2em] text-white/45">
        {ampm}
      </span>
    </div>
  )
}
