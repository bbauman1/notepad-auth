# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Better Auth authentication server built with Hono.js and Bun. It provides authentication endpoints as a standalone service that can be used by external applications. The server currently supports Apple Sign-In as the primary authentication method.

## Commands

### Development
```bash
bun run dev           # Start development server with hot reload
```

### Production
```bash
bun run build         # Compile to single binary (./app)
bun run start         # Run the compiled binary
./app                 # Alternative way to run compiled binary
```

### Better Auth CLI
```bash
bunx @better-auth/cli migrate   # Run migrations (requires DATABASE_URL)
bunx @better-auth/cli generate  # Generate schema (requires DATABASE_URL)
```

**Note**: CLI commands require `DATABASE_URL` environment variable. Run migrations on Railway or set up local database connection.

## Architecture

### Core Components

**Entry Point (`src/index.ts`)**
- Hono.js app configuration
- Route registration for Better Auth handler
- Health check endpoint at `/health`
- OpenID Connect Discovery endpoint at `/.well-known/openid-configuration`
- JWKS proxy endpoint at `/.well-known/jwks.json` (proxies to `/api/auth/jwks`)
- All auth routes are handled by Better Auth at `/api/auth/**`

**Auth Configuration (`src/lib/auth.ts`)**
- Better Auth instance configuration
- Database connection via PostgreSQL Pool
- Social provider setup (Apple Sign-In)
- Session management with cookie caching (5 min max age)
- Trusted origins configuration for OAuth callbacks
- Bearer plugin enabled for Bearer token authentication
- JWT plugin configured for Convex integration (7-day expiry, audience: "convex")
- JWKS endpoint at `/.well-known/jwks.json` (OAuth 2.0 standard path)

### Authentication Flow

The server acts as a centralized auth service:
1. External applications redirect users to `/api/auth/sign-in/apple` (or other providers)
2. Better Auth handles OAuth flow with Apple
3. Session cookies are set for authentication state
4. Applications can verify sessions via Better Auth endpoints
5. Trusted origins include `https://appleid.apple.com` and custom deep link scheme `bbauman-notepad://`

### Database

- Uses PostgreSQL via the `pg` package
- Connection configured via `DATABASE_URL` environment variable
- Better Auth manages its own schema (users, sessions, accounts tables)
- Database can be shared with other applications - just be careful with migrations

#### JWT Plugin Tables

The JWT plugin requires a `jwks` table for storing JSON Web Key Sets:

```sql
CREATE TABLE jwks (
  id TEXT PRIMARY KEY,
  publicKey TEXT NOT NULL,
  privateKey TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  expiresAt TIMESTAMP
);
```

**Migration Required**: After adding the JWT plugin, you must run `bunx @better-auth/cli migrate` on Railway (or wherever your DATABASE_URL points) to create this table.

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret key for encryption and security
- `APPLE_CLIENT_ID` - Apple Sign-In client ID
- `APPLE_CLIENT_SECRET` - Apple Sign-In client secret

## JWT Plugin Usage

The server is configured with the JWT plugin for Convex integration:

### Getting JWT Tokens

**From the `/api/auth/token` endpoint:**
```bash
# Requires authentication (session cookie or Bearer token)
GET /api/auth/token
```

**From `set-auth-jwt` header:**
When calling any auth endpoint, the JWT is returned in the `set-auth-jwt` response header.

### JWKS Endpoint

Public keys for JWT verification are available at:
```bash
GET /api/auth/.well-known/jwks.json
```

This returns the JSON Web Key Set that can be used to verify JWT signatures. The JWKS can be cached indefinitely - only refetch if a JWT with a different `kid` (key ID) is encountered.

### JWT Configuration

- **Issuer**: `https://notepad-auth.up.railway.app`
- **Audience**: `convex`
- **Expiration**: 7 days
- **Algorithm**: EdDSA with Ed25519 curve (default)
- **Private key encryption**: Enabled (AES256 GCM)

## Important Notes

- Email/password authentication is currently DISABLED (`emailAndPassword.enabled: false`)
- Bearer plugin is enabled - clients can authenticate using `Authorization: Bearer <session_token>` header
- JWT plugin is enabled for Convex - clients should use `/api/auth/token` to get JWTs for backend services
- JWTs are NOT a replacement for session cookies - they're for services that require JWT tokens
- OpenID Connect Discovery enabled at `/.well-known/openid-configuration` for Convex integration
- JWKS endpoint at `/.well-known/jwks.json` proxies to Better Auth's `/api/auth/jwks`
- OpenAPI plugin is available but commented out in auth config
- The app compiles to a single binary for deployment simplicity
- Railway deployment is supported via `railpack.json` (uses Bun 1.2.5, Node 22.14.0, Python 3.13)
- Better Auth handler processes both GET and POST requests at `/api/auth/**`
- Session cookies use a 5-minute cache window for performance

## Better Auth Documentation

For authentication configuration, plugins, and API reference:
https://www.better-auth.com/docs
