# Kingua AIOS

A futuristic, pulse-style immersive English-learning AI app (cyber edition) — built on Google AI Studio: microphone input + Gemini server-side capabilities + a pulsing immersive interaction design.

View/edit in AI Studio: [ai.studio/apps/0b80d204-baa8-4f74-9a36-dea4da8dede8](https://ai.studio/apps/0b80d204-baa8-4f74-9a36-dea4da8dede8)

## Capabilities

- Real-time microphone input (browser microphone permission required)
- Powered by the Gemini server-side API (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`)
- Pulse-style immersive interaction visuals

## Quick Start

```bash
npm install
npm run dev
```

## Configuration

Set `GEMINI_API_KEY` in the AI Studio Secrets panel (injected automatically at runtime; see `.env.example` for the field descriptions). Once deployed, the app is served from its Cloud Run URL.

## Layout

```
src/            frontend source
server.ts       server (Gemini API calls)
assets/         static assets
metadata.json   AI Studio app metadata
```

## Privacy

- The Gemini API key lives server-side; clients never touch it
- Microphone content is used only for the current AI interaction and is never stored locally
