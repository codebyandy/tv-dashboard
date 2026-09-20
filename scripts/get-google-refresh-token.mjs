/**
 * Run once: npm run auth:google
 * Opens your browser, you authorize, refresh token is printed.
 * Paste it into .env as VITE_GOOGLE_REFRESH_TOKEN.
 * Also lists your calendars so you can find the right Calendar ID.
 */

import http from 'http'
import https from 'https'
import { readFileSync } from 'fs'
import { URL } from 'url'
import { exec } from 'child_process'

// Load .env manually (no dotenv dep needed)
function loadEnv() {
  try {
    const raw = readFileSync(new URL('../.env', import.meta.url), 'utf8')
    for (const line of raw.split('\n')) {
      const [key, ...rest] = line.split('=')
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
    }
  } catch {
    console.error('Could not read .env — make sure it exists.')
    process.exit(1)
  }
}

loadEnv()

const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.VITE_GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'http://localhost:9876/oauth/callback'
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'].join(' ')

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing VITE_GOOGLE_CLIENT_ID or VITE_GOOGLE_CLIENT_SECRET in .env')
  process.exit(1)
}

function post(urlStr, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(body)
    const u = new URL(urlStr)
    const req = https.request(
      { hostname: u.hostname, path: u.pathname, method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': data.length } },
      (res) => {
        let raw = ''
        res.on('data', (c) => (raw += c))
        res.on('end', () => resolve(JSON.parse(raw)))
      },
    )
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function get(urlStr, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr)
    const req = https.request(
      { hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
        headers: { Authorization: `Bearer ${token}` } },
      (res) => {
        let raw = ''
        res.on('data', (c) => (raw += c))
        res.on('end', () => resolve(JSON.parse(raw)))
      },
    )
    req.on('error', reject)
    req.end()
  })
}

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost:9876')
  if (u.pathname !== '/oauth/callback') {
    res.end('Not found')
    return
  }

  const code = u.searchParams.get('code')
  if (!code) {
    res.end('No code in callback — try again.')
    server.close()
    return
  }

  res.end('<html><body style="font-family:sans-serif;padding:2rem"><h2>✓ Authorized</h2><p>You can close this tab.</p></body></html>')

  const tokens = await post('https://oauth2.googleapis.com/token', new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  }).toString())

  if (tokens.error) {
    console.error('Token exchange failed:', tokens)
    server.close()
    return
  }

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✓  Refresh token (paste into .env as VITE_GOOGLE_REFRESH_TOKEN):')
  console.log()
  console.log(tokens.refresh_token)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // List calendars to help find the right ID
  const cals = await get('https://www.googleapis.com/calendar/v3/users/me/calendarList', tokens.access_token)
  console.log('Your calendars (find "Andy\'s Fun LIfe" and copy its ID):')
  console.log()
  for (const c of cals.items ?? []) {
    console.log(`  ${c.summary.padEnd(40)} ${c.id}`)
  }
  console.log()
  console.log('Paste the calendar ID into .env as VITE_GOOGLE_CALENDAR_ID')
  console.log()

  server.close()
})

server.listen(9876, () => {
  console.log('Opening browser for Google authorization…')
  exec(`open "${authUrl}"`)
  console.log('If the browser did not open, visit this URL manually:')
  console.log(authUrl)
})
