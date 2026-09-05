# 🎭 Eris - IA Personal Inteligente

**Eris** es una IA conversacional avanzada con voz, personalidad propia e inteligencia adaptativa. Diseñada para ser amigable, empática y continuamente en evolución.

## ✨ Características

- 🎤 **Reconocimiento y Síntesis de Voz** - Interactúa con Eris mediante voz natural
- 🧠 **Personalidad Dinámica** - Eris tiene rasgos que evolucionan con las interacciones
- 💭 **Memoria Conversacional** - Mantiene contexto de conversaciones anteriores
- 🎨 **Interfaz Moderna** - Diseño intuitivo y responsive
- 🔮 **Análisis Inteligente** - Detecta intención y sentimiento en mensajes
- ⚡ **Respuestas Contextuales** - Genera respuestas basadas en análisis de patrones
- 🌙 **Modo Oscuro Ready** - Interfaz elegante y moderna

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/Shadow7-ai/Eris.git
cd Eris
```

### 2. Abrir en navegador
```bash
# Opción 1: Abrir directamente
open index.html

# Opción 2: Usar un servidor local (recomendado)
python -m http.server 8000
# Luego visita: http://localhost:8000
```

### 3. Configuración (Opcional)

Para usar OpenAI API, edita `config.js`:
```javascript
const CONFIG = {
    OPENAI_API_KEY: 'sk-tu-clave-aqui'
    // ...
};
```

## 📖 Cómo Usar

1. **Chat de Texto** - Escribe mensajes en el campo de entrada
2. **Chat por Voz** - Haz clic en el icono de micrófono para hablar
3. **Voz de Eris** - Activa el icono de altavoz para escuchar respuestas
4. **Personalidad** - Observa cómo Eris evoluciona con cada interacción

## 🏗️ Arquitectura

### Archivos Principales

- **index.html** - Estructura de la interfaz
- **styles.css** - Estilos modernos y responsivos
- **config.js** - Configuración y parámetros
- **eris.js** - Lógica principal de IA y chat
- **personality.js** - Sistema de personalidad y emociones
- **voice.js** - Sistema de reconocimiento y síntesis de voz

### Estructura de Clases

```
Eris (Principal)
├── PersonalitySystem (Personalidad)
├── VoiceSystem (Voz)
└── ConversationMemory (Memoria)
```

## 🧠 Sistema de Personalidad

Eris tiene 4 atributos principales:

- **Energía** (0-1) - Nivel de actividad
- **Humor** (0-1) - Tendencia a bromear
- **Curiosidad** (0-1) - Interés en aprender
- **Empatía** (0-1) - Capacidad empática

Estos evolucionar con las interacciones.

## 🎤 Sistema de Voz

- **Entrada**: Web Speech API (Chrome, Edge)
- **Salida**: Speech Synthesis API
- **Idioma**: Español (configurable)

## 🔌 API y Extensiones

### OpenAI Integration
Para respuestas más inteligentes, configura tu API key de OpenAI.

### Extensiones Planeadas
- [ ] Integración con más APIs de IA
- [ ] Base de datos persistente
- [ ] Múltiples idiomas
- [ ] Avatares animados avanzados
- [ ] Integración con redes sociales

## 🛠️ Requisitos

- Navegador moderno (Chrome 25+, Firefox 25+, Safari 14.1+, Edge 79+)
- Conexión a internet (para APIs opcionales)
- Micrófono y altavoz (para funciones de voz)

## 📱 Compatibilidad

| Navegador | Compatibilidad | Características |
|-----------|----------------|------------------|
| Chrome | ✅ Completa | Todo incluyendo voz |
| Firefox | ✅ Completa | Todo incluyendo voz |
| Safari | ✅ Parcial | Voz limitada |
| Edge | ✅ Completa | Todo incluyendo voz |
| IE | ❌ No | No soportado |

## 🎨 Personalización

### Cambiar Colores
Edita los gradientes en `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Cambiar Personalidad
Modifica `CONFIG.PERSONALITY` en `config.js`

### Cambiar Voces
Ajusta `CONFIG.VOICE` en `config.js`

## 🚨 Solución de Problemas

### La voz no funciona
- Verifica que hayas permitido acceso al micrófono
- Prueba en Chrome o Edge (mejor soporte)
- Revisa la consola para errores

### Las respuestas son lentas
- Sin API key: Respuestas offline (rápidas)
- Con API key: Depende de OpenAI
- Revisa tu conexión a internet

### El reconocimiento de voz no funciona
- Solo funciona en navegadores que soporten Web Speech API
- Asegúrate de usar HTTPS en producción

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Shadow7-ai** - [GitHub Profile](https://github.com/Shadow7-ai)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 🌟 Agradecimientos

- Web Speech API
- OpenAI (OpenAI API)
- Comunidad de GitHub

---

**Desarrollado con ❤️ por Shadow7-ai**

*Eris sigue aprendiendo y evolucionando cada día. ¿Qué le enseñarás hoy?*