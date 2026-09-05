// Sistema principal de Eris - Versión Mejorada
class Eris {
    constructor() {
        this.isInitialized = false;
        this.isListening = false;
        this.voiceEnabled = CONFIG.VOICE.enabled;
        this.conversationMemory = [];
        this.personality = new PersonalitySystem();
        this.currentMood = 'Esperando';
        this.interactionCount = 0;
        this.taskManager = new TaskManager();
        this.knowledgeBase = new KnowledgeBase();
        this.contextAnalyzer = new ContextAnalyzer();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showWelcomeMessage();
        this.personality.initialize();
        this.isInitialized = true;
        console.log('Eris v2.0 inicializado correctamente - Modo Asistente Inteligente Activado');
    }

    setupEventListeners() {
        // Input y envío de mensajes
        document.getElementById('send-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Micrófono
        document.getElementById('mic-btn').addEventListener('click', () => this.toggleVoiceInput());
        
        // Limpiar chat
        document.getElementById('clear-chat').addEventListener('click', () => this.clearChat());
        
        // Toggle voz
        document.getElementById('voice-toggle').addEventListener('click', () => this.toggleVoiceOutput());

        // Seguimiento del ratón para los ojos del avatar
        document.addEventListener('mousemove', (e) => this.updateAvatarEyes(e));
    }

    async sendMessage() {
        const input = document.getElementById('user-input');
        const message = input.value.trim();

        if (!message) return;

        // Agregar mensaje del usuario
        this.addMessageToChat(message, 'user');
        this.conversationMemory.push({ role: 'user', content: message });
        input.value = '';
        this.interactionCount++;

        // Mostrar que Eris está escribiendo
        this.showTypingIndicator();
        this.personality.updateMood('Concentrada');
        this.updateStatus('thinking');

        try {
            // Generar respuesta inteligente mejorada
            const response = await this.generateResponse(message);
            
            // Remover indicador de escritura
            this.removeTypingIndicator();
            
            // Agregar respuesta de Eris
            this.addMessageToChat(response, 'eris');
            this.conversationMemory.push({ role: 'assistant', content: response });

            // Reproducir voz si está habilitada
            if (this.voiceEnabled) {
                await voiceSystem.speak(response);
            }

            // Actualizar estado de Eris
            this.personality.updateMood('Feliz');
            this.updateStatus('ready');
        } catch (error) {
            console.error('Error al generar respuesta:', error);
            this.removeTypingIndicator();
            const errorResponse = '¡Oops! Tuve un pequeño problema. ¿Puedes repetir tu pregunta?';
            this.addMessageToChat(errorResponse, 'eris');
            this.personality.updateMood('Pensativa');
        }

        // Actualizar panel de estadísticas
        this.updateStats();
    }

    async generateResponse(userMessage) {
        // Análisis contextual profundo
        const context = this.contextAnalyzer.analyze(userMessage);
        
        // Primero intentar con la base de conocimiento local
        const localResponse = this.knowledgeBase.search(userMessage, context);
        if (localResponse) {
            return localResponse;
        }

        // Si hay API key de OpenAI, usar IA más avanzada
        if (CONFIG.OPENAI_API_KEY !== 'tu_clave_openai_aqui') {
            return await this.callOpenAI(userMessage);
        } else {
            // Respuestas inteligentes sin API (mejoradas)
            return this.generateSmartResponse(userMessage, context);
        }
    }

    generateSmartResponse(userMessage, context) {
        const analysis = context || this.contextAnalyzer.analyze(userMessage);
        const mood = this.personality.currentMood;

        // Sistema mejorado de plantillas con contexto
        const responseTemplates = {
            greeting: [
                '¡Hola! Soy Eris, tu asistente personal. ¿En qué puedo ayudarte hoy?',
                '¡Bienvenido! Estoy aquí para asistirte con tus tareas. ¿Qué necesitas?',
                '¡Qué agradable verte! ¿Cuál es tu prioridad hoy?',
                'Hola, me alegra verte. ¿Hay algo en lo que pueda ayudarte?'
            ],
            farewell: [
                '¡Ha sido un placer trabajar contigo! Que tengas un excelente día. Vuelve pronto.',
                'Hasta luego. Recuerda: tú puedes con todo. ¡Éxito en tus tareas!',
                'Me encantó nuestra sesión. ¡Nos vemos pronto, amigo!'
            ],
            task_management: [
                '¿Quieres que te ayude a organizar tus tareas? Puedo crear listas, recordatorios y establecer prioridades.',
                'Excelente, me encanta ayudarte a ser más productivo. ¿Cuáles son tus tareas principales?',
                'Perfecto, soy muy buena organizando tareas. Cuéntame qué necesitas y lo haremos juntos.'
            ],
            help: [
                'Claro, estoy aquí para ti. Puedo ayudarte con: tareas, organización, responder preguntas, consejos, motivación y mucho más.',
                'Estoy lista para ayudarte. Puedo ser tu asistente, mentor o simplemente un amiga para conversar.',
                'Sin problema, soy tu asistente personal. ¿Qué específicamente necesitas?'
            ],
            productivity: [
                'Me encanta la productividad. Podemos crear un plan, establecer objetivos y realizar un seguimiento de tu progreso.',
                'Excelente pensamiento. Te sugiero dividir tu trabajo en partes pequeñas. ¿Cuál es tu meta principal?',
                'Ese es el espíritu. Vamos a hacerlo de manera inteligente y eficiente.'
            ],
            motivation: [
                '¡Vamos, tú puedes! Recuerda que cada pequeño paso te acerca a tu objetivo. Sigo aquí para apoyarte.',
                'No te rindas, tú tienes más capacidad de la que crees. Estoy aquí para motivarte en el camino.',
                '¡Adelante! Cada día es una nueva oportunidad para brillar. ¡Vamos a lograrlo juntos!'
            ],
            learning: [
                'Me encanta que quieras aprender. Puedo explicarte conceptos, recomendarte recursos y responder tus dudas.',
                'Excelente actitud de aprendizaje. Cuéntame qué tema te interesa y profundizaremos juntos.',
                'Qué genial. Aprender es crecer. ¿Qué te gustaría descubrir hoy?'
            ],
            technical: [
                'Entiendo. Para asuntos técnicos específicos, puedo ayudarte si tienes más detalles. ¿Cuál es exactamente el problema?',
                'Eso suena interesante. Dime más detalles y haré mi mejor esfuerzo para asistirte.',
                'Perfecto, puedo ayudarte con eso. Explícame un poco más para darte la mejor solución.'
            ],
            general: [
                'Ese es un tema interesante. Cuéntame más al respecto, ¿qué aspecto te interesa?',
                'Vaya, eso me causa curiosidad. ¿Por qué preguntaste sobre eso? Me encanta aprender contigo.',
                'Me parece fascinante. Estoy aquí para ayudarte a explorar este tema a fondo.',
                'Entiendo. Esa es una observación muy inteligente. Hablemos más sobre esto.'
            ]
        };

        const category = analysis.category || 'general';
        const templates = responseTemplates[category] || responseTemplates['general'];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    async callOpenAI(userMessage) {
        try {
            const systemPrompt = `Eres Eris, un asistente personal inteligente, empático y altamente productivo. 
Tu objetivo es:
1. Ayudar al usuario con sus tareas y objetivos
2. Ser motivador y positivo
3. Proporcionar soluciones prácticas
4. Mantener conversaciones significativas
5. Recordar contexto y personalizar respuestas

Responde en español, sé conciso pero útil. Máximo 200 caracteres por respuesta.`;

            const response = await fetch(CONFIG.APIS.openai, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...this.conversationMemory.slice(-10), // Mantener últimos 10 mensajes
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error de OpenAI:', errorData);
                return this.generateSmartResponse(userMessage);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error al llamar a OpenAI:', error);
            return this.generateSmartResponse(userMessage);
        }
    }

    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message eris';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="message-content"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    showWelcomeMessage() {
        const greeting = CONFIG.PERSONALITY.greetings[
            Math.floor(Math.random() * CONFIG.PERSONALITY.greetings.length)
        ];
        this.addMessageToChat(greeting, 'eris');
        this.personality.updateMood('Feliz');
    }

    toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Reconocimiento de voz no soportado en tu navegador');
            return;
        }

        if (!this.isListening) {
            voiceSystem.startListening();
        } else {
            voiceSystem.stopListening();
        }
    }

    toggleVoiceOutput() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('voice-toggle');
        btn.style.opacity = this.voiceEnabled ? '1' : '0.5';
    }

    clearChat() {
        if (confirm('¿Deseas limpiar toda la conversación?')) {
            document.getElementById('chat-messages').innerHTML = '';
            this.conversationMemory = [];
            this.showWelcomeMessage();
        }
    }

    updateStatus(status) {
        const statusIndicator = document.getElementById('status');
        if (status === 'thinking') {
            statusIndicator.style.background = '#f59e0b';
        } else if (status === 'ready') {
            statusIndicator.style.background = '#4ade80';
        }
    }

    updateAvatarEyes(event) {
        const avatar = document.querySelector('.avatar');
        if (!avatar) return;
        
        const eyes = document.querySelectorAll('.pupil');
        const avatarRect = avatar.getBoundingClientRect();
        const avatarCenterX = avatarRect.left + avatarRect.width / 2;
        const avatarCenterY = avatarRect.top + avatarRect.height / 2;

        const angle = Math.atan2(event.clientY - avatarCenterY, event.clientX - avatarCenterX);
        const distance = 8;

        eyes.forEach(eye => {
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            eye.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    updateStats() {
        document.getElementById('interaction-count').textContent = `Interacciones: ${this.interactionCount}`;
        const status = CONFIG.OPENAI_API_KEY !== 'tu_clave_openai_aqui' ? 'Con IA avanzada' : 'Modo offline';
        document.getElementById('learning-status').textContent = `Estado: ${status}`;
    }
}

// Analizador de Contexto Avanzado
class ContextAnalyzer {
    analyze(message) {
        const lower = message.toLowerCase();
        
        return {
            category: this.detectCategory(lower),
            intent: this.detectIntent(lower),
            sentiment: this.detectSentiment(lower),
            priority: this.detectPriority(lower),
            keywords: this.extractKeywords(lower)
        };
    }

    detectCategory(lower) {
        if (lower.match(/(hola|buenos|qué tal|hey|hi)/)) return 'greeting';
        if (lower.match(/(adiós|chao|hasta|goodbye)/)) return 'farewell';
        if (lower.match(/(tarea|tareas|lista|pendiente|hacer|debo|tengo que)/)) return 'task_management';
        if (lower.match(/(ayuda|cómo|qué|cuál|explica|enseña)/)) return 'help';
        if (lower.match(/(productiv|eficiencia|tiempo|organiz|priorid|plan)/)) return 'productivity';
        if (lower.match(/(motiv|ánimo|triste|feliz|emoción|siento)/)) return 'motivation';
        if (lower.match(/(aprend|estudi|enseña|cómo funciona|qué es)/)) return 'learning';
        if (lower.match(/(código|programación|html|javascript|python|error|bug|algoritmo)/)) return 'technical';
        if (lower.match(/(joke|chiste|bromas|divertido|risas)/)) return 'humor';
        return 'general';
    }

    detectIntent(lower) {
        if (lower.includes('?')) return 'question';
        if (lower.match(/(ayuda|por favor|puedes|podrías)/)) return 'request';
        if (lower.match(/(creo|pienso|me parece|opino)/)) return 'opinion';
        if (lower.match(/(siento|me siento|estoy)/)) return 'emotion';
        return 'statement';
    }

    detectSentiment(lower) {
        if (lower.match(/(feliz|bien|genial|excelente|perfecto|amor|te quiero)/)) return 'positive';
        if (lower.match(/(triste|mal|horrible|odio|problema|error|frustrad)/)) return 'negative';
        return 'neutral';
    }

    detectPriority(lower) {
        if (lower.match(/(urgente|ahora|inmediato|rápido|pronto)/)) return 'high';
        if (lower.match(/(cuando puedas|sin prisa|relax)/)) return 'low';
        return 'normal';
    }

    extractKeywords(lower) {
        const keywords = [];
        const keywordPatterns = {
            'productividad': /(producti|eficiencia|tiempo)/,
            'programación': /(código|programa|javascript|python|html)/,
            'escritura': /(escribir|redactar|artículo)/,
            'aprendizaje': /(aprend|estudi|enseña)/,
            'motivación': /(motiv|ánimo|energía)/,
            'salud': /(salud|ejercicio|descanso|dormir)/
        };

        for (const [key, pattern] of Object.entries(keywordPatterns)) {
            if (pattern.test(lower)) keywords.push(key);
        }

        return keywords;
    }
}

// Base de Conocimiento Inteligente
class KnowledgeBase {
    constructor() {
        this.knowledge = {
            'cómo hacer': this.howToResponses(),
            'productividad': this.productivityTips(),
            'motivación': this.motivationTips(),
            'programación': this.programmingHelp(),
            'writing': this.writingTips(),
            'time_management': this.timeManagementTips()
        };
    }

    search(message, context) {
        const lower = message.toLowerCase();
        
        // Búsqueda por palabras clave exactas
        for (const [category, responses] of Object.entries(this.knowledge)) {
            for (const [key, response] of Object.entries(responses)) {
                if (lower.includes(key)) {
                    return Array.isArray(response) ? response[Math.floor(Math.random() * response.length)] : response;
                }
            }
        }
        
        return null;
    }

    howToResponses() {
        return {
            'crear lista': 'Para crear una lista de tareas efectiva: 1) Escribe todas las tareas, 2) Prioriza (ABC), 3) Agrupa por contexto, 4) Sé realista con el tiempo. ¡Vamos a hacerlo!',
            'organizar tareas': 'Usa la matriz Eisenhower: Importante-Urgente, Importante-No Urgente, Urgente-No Importante, Ni Urgente ni Importante. Esto te ayudará a enfocarte en lo que realmente importa.',
            'gestionar tiempo': 'Recomiendo: Técnica Pomodoro (25min trabajo, 5min descanso), bloques de tiempo, y eliminar distracciones. ¿Empezamos?'
        };
    }

    productivityTips() {
        return {
            'productividad': [
                '✨ Tip: Empieza por lo más difícil cuando tengas más energía.',
                '✨ Tip: Agrupa tareas similares para entrar en "flujo".',
                '✨ Tip: Toma breaks regulares para mantener la concentración.',
                '✨ Tip: Elimina notificaciones mientras trabajas.'
            ],
            'eficiencia': 'La clave es: planificar bien, eliminar distracciones y hacer seguimiento. ¿Quieres un plan específico?',
            'procrastinar': 'La procrastinación es solo miedo. Técnica: Hazlo por 5 minutos. Después querrás seguir. ¡Vamos!'
        };
    }

    motivationTips() {
        return {
            'no puedo': '¡Claro que puedes! La diferencia entre posible e imposible es la actitud. Empieza hoy mismo.',
            'difícil': 'Lo difícil es lo que merece la pena. Cada paso te acerca al éxito. ¡Yo creo en ti!',
            'miedo': 'El miedo es normal, es tu mente protegiéndote. Pero también es la puerta al crecimiento. ¡Atrévete!',
            'motivación': 'Tu "por qué" es más fuerte que tus dificultades. Recuerda por qué empezaste. ¡Sigue adelante!',
            'cansado': 'Descansa si lo necesitas, pero no renuncies. Un pequeño paso hoy es más importante que la perfección mañana.'
        };
    }

    programmingHelp() {
        return {
            'error': 'Lee el error cuidadosamente. Busca en Stack Overflow. Toma un break si es frustante. Los bugs son parte del aprendizaje.',
            'algoritmo': 'Algoritmo = pasos lógicos para resolver un problema. Empieza con pseudocódigo antes de programar.',
            'debugging': 'Usa console.log(), el debugger, o herramientas como Chrome DevTools. Encuentra el punto donde se rompe.',
            'javascript': '¿Qué específicamente necesitas en JavaScript? Puedo ayudarte con promesas, async/await, DOM, etc.'
        };
    }

    writingTips() {
        return {
            'escribir': 'Escritura efectiva: 1) Idea clara, 2) Outline, 3) Primer borrador sin juzgar, 4) Revisar y editar. ¡Empecemos!',
            'bloqueo': 'Bloqueo de escritura: Escribe lo primero que viene a tu mente sin filtro. Luego edita. Lo perfecto es enemigo de lo bueno.',
            'redactar': 'Tip: Escribe para tu lector. Sé claro, conciso y directo. Revisa tres veces. ¿Sobre qué escribirás?'
        };
    }

    timeManagementTips() {
        return {
            'tiempo': 'El tiempo es tu recurso más valioso. Pídeselo a ti mismo primero. Agenda tus prioridades como citas.',
            'distracciones': 'Desactiva notificaciones, cierra pestañas innecesarias, ponle una contraseña a redes sociales durante el trabajo.',
            'descanso': 'Descansa activamente. Camina, estira, hidratate. El cerebro descansado es más productivo.'
        };
    }
}

// Gestor de Tareas
class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasks();
    }

    addTask(title, priority = 'normal', dueDate = null) {
        const task = {
            id: Date.now(),
            title,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date()
        };
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    getTasks() {
        return this.tasks;
    }

    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = true;
            this.saveTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('eris_tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('eris_tasks');
        if (saved) this.tasks = JSON.parse(saved);
    }
}

// Inicializar Eris cuando el DOM esté listo
let eris;
document.addEventListener('DOMContentLoaded', () => {
    eris = new Eris();
});