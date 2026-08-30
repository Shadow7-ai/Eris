# Eris — Server proxy for external AI (Node/Express)

This folder contains a lightweight proxy that forwards chat messages to an external AI provider (example: OpenAI). The proxy keeps your API key on the server and prevents exposing secrets in the browser.

Files added
- index.js — Express server with /api/ai and /api/calc endpoints
- package.json — dependencies and scripts
- .env.example — example environment variables

Quick start (local)
1. cd server
2. npm install
3. Create a .env file (copy .env.example) and set OPENAI_API_KEY if you want to use AI external
4. npm run dev    # requires nodemon, or npm start
5. Open your frontend and enable "AI: ON" toggle. The frontend will POST to /api/ai on the same host.

Notes & Security
- Do NOT store API keys in the frontend. Use this proxy or another secure backend.
- In production, restrict CORS to your frontend URL(s) and enable HTTPS.
- You can add authentication (API key per user) and persistent storage if you want to store conversation logs.

Example curl

curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -d '{ "messages": [{"role":"system","content":"Eres Eris, una asistente amable."}, {"role":"user","content":"Hola"}] }'

