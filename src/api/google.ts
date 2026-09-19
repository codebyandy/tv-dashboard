const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET
const REFRESH_TOKEN = import.meta.env.VITE_GOOGLE_REFRESH_TOKEN
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID

export const hasGoogleCreds = Boolean(
  CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN && CALENDAR_ID,
)

interface CachedToken {
  token: string
  expiresAt: number
}
let cached: CachedToken | null = null

async function getAccessToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN,
    grant_type: 'refresh_token',
  })

  const res = await fetch('/oauth/google/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Google token refresh ${res.status}`)
  const data = await res.json()

  cached = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  return cached.token
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
}

interface GoogleEventDate {
  dateTime?: string
  date?: string
}
interface GoogleEvent {
  id: string
  summary?: string
  start: GoogleEventDate
  end: GoogleEventDate
}

function parseEvent(e: GoogleEvent): CalendarEvent {
  const allDay = Boolean(e.start.date && !e.start.dateTime)
  const start = allDay
    ? new Date(`${e.start.date}T00:00:00`)
    : new Date(e.start.dateTime!)
  const end = allDay
    ? new Date(`${e.end.date}T00:00:00`)
    : new Date(e.end.dateTime!)
  return {
    id: e.id,
    title: e.summary ?? '(no title)',
    start,
    end,
    allDay,
  }
}

export async function fetchUpcomingEvents(hoursAhead = 48): Promise<CalendarEvent[]> {
  const token = await getAccessToken()
  const now = new Date()
  const later = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
  )
  url.searchParams.set('timeMin', now.toISOString())
  url.searchParams.set('timeMax', later.toISOString())
  url.searchParams.set('singleEvents', 'true')
  url.searchParams.set('orderBy', 'startTime')
  url.searchParams.set('maxResults', '20')

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Calendar API ${res.status}`)
  const data = await res.json()
  return (data.items ?? []).map(parseEvent)
}
