import { useQuery } from '@tanstack/react-query'
import { fetchUpcomingEvents, hasGoogleCreds, type CalendarEvent } from '../api/google'

export function useCalendar() {
  return useQuery<CalendarEvent[]>({
    queryKey: ['calendar'],
    queryFn: () => fetchUpcomingEvents(48),
    enabled: hasGoogleCreds,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  })
}
