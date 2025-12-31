# Better Auth Server

A standalone authentication server built with [Better Auth](https://www.better-auth.com), Hono.js, and Bun. Provides authentication endpoints that can be consumed by external applications.

## Features

- Apple Sign-In authentication
- JWT tokens for backend service integration
- Bearer token authentication
- OpenID Connect Discovery (`/.well-known/openid-configuration`)
- JWKS endpoint (`/.well-known/jwks.json`)
- Session management with cookie caching
- Compiles to a single binary

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and fill in the values
3. Run database migrations: `bunx @better-auth/cli migrate`
4. Start the server: `bun run dev`

## Environment Variables

See `.env.example` for required variables.

## Endpoints

- `GET /health` - Health check
- `GET /.well-known/openid-configuration` - OpenID Connect Discovery
- `GET /.well-known/jwks.json` - JSON Web Key Set
- `GET /api/auth/token` - Get JWT token (requires authentication)
- `POST /api/auth/sign-in/apple` - Apple Sign-In
- `GET /api/auth/sign-out` - Sign out

## Deployment

### Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/template/VOQsdL)

### Self-hosted

```bash
bun run build  # Compiles to ./app
./app          # Run the binary
```

## Documentation

For full Better Auth documentation: https://www.better-auth.com/docs

## License

MIT
