# Eris — Landing page (docs/index.html)

Esta rama añade una landing page bilingüe en docs/index.html que sirve como entrada para el demo de voz y las características de Eris.

Archivos añadidos:

- docs/index.html — landing page bilingüe (ES/EN) con CTA al demo de voz
- docs/assets/css/site.css — estilos para la landing
- docs/assets/js/site.js — pequeño script i18n para cambiar el idioma de la UI

Lema confirmado: "Eris — Interfaz moderna, ahora con voz"

Cómo probar:
1. Cambia a la rama feat/site-homepage:
   git fetch origin
   git checkout feat/site-homepage
2. Sirve la carpeta docs localmente (ejemplo):
   python -m http.server 8000 --directory docs
   Abrir: http://localhost:8000/index.html

Notas:
- El enlace al demo abre la página docs/voice-demo.html en la rama principal (link apunta a /Eris/blob/main/docs/voice-demo.html). Si planeas publicar con GitHub Pages desde docs/ en main, actualiza los enlaces después del merge si es necesario.
