import { differenceInMinutes, differenceInSeconds } from 'date-fns'
import { useClock } from '../hooks/useClock'

interface Props {
  nextEvent?: { title: string; start: Date } | null
}

function formatDistance(start: Date, now: Date): string {
  const seconds = differenceInSeconds(start, now)
  if (seconds <= 0) return 'now'
  const minutes = differenceInMinutes(start, now)
  if (minutes < 1) return `${seconds} sec`
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remMin = minutes % 60
  if (remMin === 0) return `${hours} hr`
  return `${hours} hr ${remMin} min`
}

export function CountdownBanner({ nextEvent }: Props) {
  const now = useClock()
  if (!nextEvent) return null
  const distance = formatDistance(nextEvent.start, now)

  return (
    <div className="flex items-center gap-4 text-sm text-white/55">
      <span className="h-px w-12 bg-white/10" />
      <span className="tracking-wide">
        Next in <span className="text-blush font-medium">{distance}</span>
        <span className="text-white/25 mx-2">·</span>
        <span className="text-white/80">{nextEvent.title}</span>
      </span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}
