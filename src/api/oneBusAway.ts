const API_KEY = import.meta.env.VITE_OBA_API_KEY || 'TEST'
const STOP_ID = import.meta.env.VITE_OBA_STOP_ID
const ROUTE_IDS: string[] = (import.meta.env.VITE_OBA_ROUTE_IDS ?? '')
  .split(',')
  .map((s: string) => s.trim())
  .filter(Boolean)

export const hasObaConfig = Boolean(STOP_ID && ROUTE_IDS.length)

export interface Arrival {
  routeShortName: string
  headsign: string
  scheduledTime: Date
  predictedTime: Date | null
  delaySecs: number
  onTime: boolean
}

interface ObaArrivalEntry {
  routeId: string
  routeShortName: string
  tripHeadsign: string
  scheduledArrivalTime: number
  predictedArrivalTime: number
  scheduleDeviation: number
}

export async function fetchArrivals(): Promise<Arrival[]> {
  const url =
    `https://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/${STOP_ID}.json` +
    `?key=${API_KEY}&minutesBefore=0&minutesAfter=90`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`OBA ${res.status}`)
  const data = await res.json()

  const entries: ObaArrivalEntry[] =
    data?.data?.entry?.arrivalsAndDepartures ?? []

  const now = Date.now()

  return entries
    .filter((e) => ROUTE_IDS.includes(e.routeId))
    .filter((e) => {
      const t = e.predictedArrivalTime || e.scheduledArrivalTime
      return t > now
    })
    .slice(0, 3)
    .map((e) => {
      const predicted = e.predictedArrivalTime
        ? new Date(e.predictedArrivalTime)
        : null
      const scheduled = new Date(e.scheduledArrivalTime)
      const delaySecs = e.scheduleDeviation ?? 0
      return {
        routeShortName: e.routeShortName,
        headsign: e.tripHeadsign,
        scheduledTime: scheduled,
        predictedTime: predicted,
        delaySecs,
        onTime: Math.abs(delaySecs) < 60,
      }
    })
}
