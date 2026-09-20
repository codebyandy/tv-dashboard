# tv-dashboard

Just a simple personal TV Dashboard with calendar and transit times, built with React.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your credentials (see below), then:

```bash
npm run dev
```

## Credentials

**Google Calendar**

1. Create a Desktop OAuth client in [Google Cloud Console](https://console.cloud.google.com) with the Calendar API enabled
2. Add the client ID and secret to `.env`
3. Run `npm run auth:google` — browser opens, you authorize, refresh token and calendar ID are printed
4. Paste both into `.env`

**OneBusAway**

Add your stop ID and route IDs to `.env`. The public `TEST` key works for Puget Sound.

**Weather**

No key needed — uses [Open-Meteo](https://open-meteo.com).
