import { Clock } from './components/Clock'
import { DateLabel } from './components/DateLabel'
import { CountdownBanner } from './components/CountdownBanner'
import { CalendarList } from './components/CalendarList'
import { WeatherCard } from './components/WeatherCard'
import { BusCard } from './components/BusCard'
import { useCalendar } from './hooks/useCalendar'
import { useMemo } from 'react'
import { isFuture } from 'date-fns'

function useNextEvent() {
  const { data } = useCalendar()
  return useMemo(() => {
    if (!data) return null
    const next = data.find((e) => !e.allDay && isFuture(e.start))
    if (!next) return null
    return { title: next.title, start: next.start }
  }, [data])
}

function App() {
  const nextEvent = useNextEvent()

  return (
    <div className="h-screen w-screen p-12 flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <Clock />
        <DateLabel />
      </header>

      <CountdownBanner nextEvent={nextEvent} />

      <main className="flex-1 grid grid-cols-[3fr_2fr] gap-8 min-h-0">
        <CalendarList />
        <div className="flex flex-col gap-8 min-h-0">
          <WeatherCard />
          <BusCard />
        </div>
      </main>
    </div>
  )
}

export default App
