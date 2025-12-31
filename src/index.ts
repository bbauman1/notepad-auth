import { Hono } from 'hono'
import { auth } from './lib/auth'
import { logger } from 'hono/logger'
const app = new Hono()

app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

app.get('/.well-known/jwks.json', async (c) => {
  // Proxy to the Better Auth JWKS endpoint
  const response = await fetch(new URL('/api/auth/jwks', c.req.url))
  const jwks = await response.json()
  return c.json(jwks)
})

app.get('/.well-known/openid-configuration', (c) => {
  const baseURL = process.env.BETTER_AUTH_URL || "https://notepad-auth.up.railway.app"
  return c.json({
    issuer: baseURL,
    jwks_uri: `${baseURL}/.well-known/jwks.json`,
    authorization_endpoint: `${baseURL}/api/auth/authorize`,
    token_endpoint: `${baseURL}/api/auth/token`,
    response_types_supported: ["code", "token", "id_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["EdDSA"],
  })
})

/**
 * Better Auth routes, see docs before changing
 * @link https://better-auth.com/docs
 */
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
}