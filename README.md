# Notepad Auth

An auth server for using BetterAuth with Convex's Swift SDK.

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and fill in the values
3. Run database migrations: `bunx @better-auth/cli migrate`
4. Start the server: `bun run dev`

I deploy on Railway and if you upload there it should deploy easily.

## Environment Variables

See `.env.example` for required variables.

## License

MIT
