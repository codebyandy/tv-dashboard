import { Clock } from './components/Clock'
import { DateLabel } from './components/DateLabel'
import { CountdownBanner } from './components/CountdownBanner'
import { CalendarList } from './components/CalendarList'
import { WeatherCard } from './components/WeatherCard'
import { BusCard } from './components/BusCard'

function App() {
  // Temporary mock next-event so the countdown banner has something to render
  // until Google Calendar is wired up.
  const mockNext = {
    title: 'Standup',
    start: new Date(Date.now() + 19 * 60 * 1000),
  }

  return (
    <div className="h-screen w-screen p-12 flex flex-col gap-8">
      <header className="flex items-end justify-between">
        <Clock />
        <DateLabel />
      </header>

      <CountdownBanner nextEvent={mockNext} />

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
