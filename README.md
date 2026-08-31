# Eris — Interfaz mejorada

Esta rama contiene una actualización de la interfaz de Eris: separé CSS/JS, añadí opciones para configurar una API key y un ejemplo de proxy en `server/`.

¿Qué incluye?
- index.html (refactor): más accesible, meta tags y modal de ajustes.
- assets/styles.css: estilos.
- assets/app.js: lógica del chat y gestión de settings.
- assets/favicon.svg
- server/: ejemplo de proxy con Node/Express (opcional).

Cómo probar el front localmente
1. Sirve los archivos estáticos (por ejemplo con `npx serve` o `python -m http.server 8080`).
2. Abre `http://localhost:8080`.
3. Ajustes -> elige modo `local` para usar el respondedor integrado o `proxy` para usar el proxy de ejemplo.

Proxy de ejemplo (Node/Express)
1. Ir a la carpeta `server`.
2. Copiar `.env.example` a `.env` y rellenar `EXTERNAL_API_URL` y `API_KEY`.
3. `npm install` y `npm start`.
4. El proxy escuchará POST `/api/proxy` y reenviará la petición a `EXTERNAL_API_URL`, añadiendo la cabecera `X-API-KEY`.

Seguridad
- Guardar claves en localStorage es peligroso en producción (XSS). Recomendado usar el proxy con variables de entorno.

Siguientes pasos
- ¿Quieres que haga merge a la rama principal (main) o prefieres revisar el PR primero?
- Puedo ajustar textos a inglés/español o añadir i18n básico.
