import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from '../api/openMeteo'

const LAT = Number(import.meta.env.VITE_WEATHER_LAT ?? 47.6062)
const LNG = Number(import.meta.env.VITE_WEATHER_LNG ?? -122.3321)

export function useWeather() {
  return useQuery({
    queryKey: ['weather', LAT, LNG],
    queryFn: () => fetchWeather(LAT, LNG),
    refetchInterval: 15 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  })
}
