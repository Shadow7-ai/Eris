# Eris — Feature: Voice Input & Memory

Esta rama (feature/voice-input-memory) añade una implementación completa y rápida para convertir a Eris en un asistente conversacional más avanzado con:

- Entrada por voz (reconocimiento) para dictado (cuando el navegador lo soporta).
- Síntesis de voz (TTS) usando la Web Speech API.
- Memoria persistente en servidor (archivo JSON) y en cliente (localStorage).
- Proxy seguro a la API de OpenAI (/api/chat) que combina memorias del servidor + memorias locales enviadas por el cliente.
- Endpoints para gestionar memorias en el servidor: GET/POST/DELETE y un endpoint opcional para resumir texto usando la API de OpenAI.

---

## Archivos relevantes añadidos/actualizados

- `public/index.html` — Frontend mejorado con TTS, reconocimiento por voz, UI de memorias y conexión básica al backend.
- `server.js` — Servidor Express que expone:
  - `POST /api/chat` — Proxy a la API de OpenAI (incluye memorias servidor + memorias locales enviadas por el cliente).
  - `GET /api/memories`, `POST /api/memories`, `DELETE /api/memories/:id` — CRUD de memorias (persistidas en `memories.json`).
  - `POST /api/memories/summarize` — (opcional) resúmenes mediante OpenAI.
- `package.json` — Dependencias mínimas (express, node-fetch).

---

## Cómo ejecutar localmente

1. Clona el repo y cambia a la rama feature/voice-input-memory:

   ```bash
   git fetch origin
   git checkout feature/voice-input-memory
   ```

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Configura la variable de entorno de OpenAI (en el servidor):

   - macOS / Linux:
     ```bash
     export OPENAI_API_KEY="sk-..."
     export OPENAI_MODEL="gpt-4" # opcional
     ```
   - Windows (PowerShell):
     ```powershell
     $env:OPENAI_API_KEY = "sk-..."
     $env:OPENAI_MODEL = "gpt-4"
     ```

   Si no configuras OPENAI_API_KEY, el `/api/chat` devolverá un error indicando que falta la clave.

4. Inicia el servidor:

   ```bash
   npm start
   ```

5. Abre en tu navegador:

   - http://localhost:3000

   Recomendado: usar Chrome o Edge para mejor soporte de reconocimiento por voz y TTS.

---

## Endpoints (ejemplos)

- Listar memorias (servidor):
  ```bash
  curl http://localhost:3000/api/memories
  ```

- Crear memoria en servidor:
  ```bash
  curl -X POST http://localhost:3000/api/memories -H "Content-Type: application/json" -d '{"text":"Mi color favorito es azul"}'
  ```

- Borrar memoria (por id):
  ```bash
  curl -X DELETE http://localhost:3000/api/memories/<id>
  ```

- Chat (proxy hacia OpenAI):
  ```bash
  curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"userMessage":"Hola Eris, ¿cómo estás?","history":[],"memories":[]} '
  ```

- Resumir texto (opcional):
  ```bash
  curl -X POST http://localhost:3000/api/memories/summarize -H "Content-Type: application/json" -d '{"text":"Texto largo..."}'
  ```

---

## Notas y recomendaciones

- Seguridad: NO pongas la `OPENAI_API_KEY` en el cliente. El servidor la usa para las llamadas a la API.
- Costes: las llamadas a la API de OpenAI consumen tokens. Usa `OPENAI_MODEL` acorde a tu cuenta.
- Compatibilidad: la API de reconocimiento de voz (SpeechRecognition) funciona mejor en Chrome/Edge. TTS con SpeechSynthesis depende del SO/navegador.
- Persistencia: las memorias del servidor se guardan en `memories.json` (archivo creado automáticamente). Si quieres migrar a una base de datos, puedo adaptar el código.

---

## Qué falta por pulir (opcional)

- Interfaz para crear/borrar memorias directamente en el servidor desde la UI (puedo añadir esto si quieres).
- Resumen automático de memorias largas al guardarlas (usa OpenAI y consume tokens).
- Tests y validaciones adicionales.

---

Si prefieres que abra el Pull Request con un título y descripción, puedo crear el PR en GitHub si me confirmas; en caso contrario, puedes abrirlo manualmente comparando `feature/voice-input-memory` con `main` o tu rama principal.

Sugerencia de título del PR:

> feat: voice input, TTS and persistent memories (Eris)

Descripción sugerida (copiar/pegar):

> Añade entrada por voz, síntesis de voz (TTS), memoria persistente en servidor y proxy seguro hacia OpenAI. Incluye endpoints para gestionar memorias y un endpoint opcional para resumir textos. Frontend en `public/index.html` actualizado para usar TTS, dictado y memoria.
