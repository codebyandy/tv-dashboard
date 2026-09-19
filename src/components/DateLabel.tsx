import { format } from 'date-fns'
import { useClock } from '../hooks/useClock'

export function DateLabel() {
  const now = useClock()
  return (
    <div className="text-right">
      <div className="text-3xl font-extralight text-white/80">
        {format(now, 'EEEE')}
      </div>
      <div className="text-base font-light text-white/45 tracking-wide mt-1">
        {format(now, 'MMMM d, yyyy')}
      </div>
    </div>
  )
}
