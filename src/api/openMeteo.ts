export interface WeatherSnapshot {
  temp: number
  high: number
  low: number
  code: number
  label: string
  icon: string
}

const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear', icon: '☀︎' },
  1: { label: 'Mostly clear', icon: '☀︎' },
  2: { label: 'Partly cloudy', icon: '⛅︎' },
  3: { label: 'Overcast', icon: '☁︎' },
  45: { label: 'Fog', icon: '≡' },
  48: { label: 'Rime fog', icon: '≡' },
  51: { label: 'Light drizzle', icon: '☂︎' },
  53: { label: 'Drizzle', icon: '☂︎' },
  55: { label: 'Heavy drizzle', icon: '☂︎' },
  56: { label: 'Freezing drizzle', icon: '☂︎' },
  57: { label: 'Freezing drizzle', icon: '☂︎' },
  61: { label: 'Light rain', icon: '☂︎' },
  63: { label: 'Rain', icon: '☂︎' },
  65: { label: 'Heavy rain', icon: '☂︎' },
  66: { label: 'Freezing rain', icon: '☂︎' },
  67: { label: 'Freezing rain', icon: '☂︎' },
  71: { label: 'Light snow', icon: '❄︎' },
  73: { label: 'Snow', icon: '❄︎' },
  75: { label: 'Heavy snow', icon: '❄︎' },
  77: { label: 'Snow grains', icon: '❄︎' },
  80: { label: 'Rain showers', icon: '☂︎' },
  81: { label: 'Heavy showers', icon: '☂︎' },
  82: { label: 'Violent showers', icon: '☂︎' },
  85: { label: 'Snow showers', icon: '❄︎' },
  86: { label: 'Snow showers', icon: '❄︎' },
  95: { label: 'Thunderstorm', icon: '⚡︎' },
  96: { label: 'Thunder + hail', icon: '⚡︎' },
  99: { label: 'Severe thunder', icon: '⚡︎' },
}

function describe(code: number) {
  return WEATHER_CODES[code] ?? { label: '—', icon: '·' }
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherSnapshot> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lng))
  url.searchParams.set('current', 'temperature_2m,weather_code')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min')
  url.searchParams.set('temperature_unit', 'fahrenheit')
  url.searchParams.set('timezone', 'America/Los_Angeles')
  url.searchParams.set('forecast_days', '1')

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`)
  const data = await res.json()

  const code = data.current.weather_code as number
  const meta = describe(code)

  return {
    temp: Math.round(data.current.temperature_2m),
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    code,
    label: meta.label,
    icon: meta.icon,
  }
}
