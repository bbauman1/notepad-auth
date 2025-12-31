# Notepad Auth

Notepad is an app I made to try out using BetterAuth and Convex in a SwiftUI app. ConvexSwift does not yet natively support BetterAuth, so this repo has some modifications to the auth server to make it work.

- Companion client repo for Notepad - https://github.com/bbauman1/notepad
- A full writeup of how this works is available here - https://bbauman.com/posts/convex-better-auth-swiftui

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
