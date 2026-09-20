import { useQuery } from '@tanstack/react-query'
import { fetchArrivals, hasObaConfig } from '../api/oneBusAway'

export function useBus() {
  return useQuery({
    queryKey: ['bus'],
    queryFn: fetchArrivals,
    enabled: hasObaConfig,
    refetchInterval: 30 * 1000,
    staleTime: 25 * 1000,
  })
}
