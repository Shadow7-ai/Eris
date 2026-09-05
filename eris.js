// Sistema principal de Eris
class Eris {
    constructor() {
        this.isInitialized = false;
        this.isListening = false;
        this.voiceEnabled = CONFIG.VOICE.enabled;
        this.conversationMemory = [];
        this.personality = new PersonalitySystem();
        this.currentMood = 'Esperando';
        this.interactionCount = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showWelcomeMessage();
        this.personality.initialize();
        this.isInitialized = true;
        console.log('Eris inicializado correctamente');
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
            // Generar respuesta inteligente
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
    }

    async generateResponse(userMessage) {
        // Sistema de respuestas basado en palabras clave y patrones
        const responses = this.analyzeMessage(userMessage);
        
        if (CONFIG.OPENAI_API_KEY !== 'tu_clave_openai_aqui') {
            return await this.callOpenAI(userMessage);
        } else {
            // Respuestas inteligentes sin API (basadas en patrones)
            return this.generateSmartResponse(userMessage);
        }
    }

    analyzeMessage(message) {
        const lower = message.toLowerCase();
        const analysis = {
            intent: 'general',
            sentiment: 'neutral',
            entities: []
        };

        // Análisis de intención
        if (lower.includes('hola') || lower.includes('hola')) {
            analysis.intent = 'greeting';
        } else if (lower.includes('adiós') || lower.includes('hasta')) {
            analysis.intent = 'farewell';
        } else if (lower.includes('ayuda') || lower.includes('cómo')) {
            analysis.intent = 'help';
        } else if (lower.includes('joke') || lower.includes('chiste')) {
            analysis.intent = 'humor';
        }

        return analysis;
    }

    generateSmartResponse(userMessage) {
        const analysis = this.analyzeMessage(userMessage);
        const mood = this.personality.currentMood;

        const responseTemplates = {
            greeting: [
                '¡Hola! Me da mucha alegría verte. ¿Cómo está tu día?',
                '¡Bienvenido! ¿Hay algo con lo que pueda ayudarte hoy?',
                '¡Qué agradable verte! ¿En qué puedo servirte?'
            ],
            farewell: [
                '¡Ha sido un placer hablar contigo! Que tengas un excelente día.',
                'Hasta luego. Espero poder conversar contigo pronto.',
                'Me encantó nuestra charla. ¡Vuelve pronto!'
            ],
            help: [
                'Estoy aquí para ayudarte. Puedo responder preguntas, conversar, e incluso contarte chistes.',
                'Claro, ¿cuál es tu pregunta? Haré mi mejor esfuerzo para ayudarte.',
                'Por supuesto. Soy capaz de conversar sobre muchos temas. ¿Qué te interesa?'
            ],
            humor: [
                '¿Quieres escuchar un chiste? Aquí va: ¿Por qué los programadores prefieren el dark mode? Porque la luz atrae bugs.',
                '¡Claro! ¿Sabías que los desarrolladores no pueden tomar el sol? Podrían obtener un `java.lang.NullPointerException`.',
                'Jajaja, me encanta el humor. Aquí va: Un desarrollador va al bar y pide una doble. El barman pregunta "¿Un problema?". Responde: "No, dos"'
            ],
            general: [
                'Ese es un tema interesante. Cuéntame más al respecto.',
                'Vaya, eso me causa curiosidad. ¿Qué te lleva a preguntar sobre eso?',
                'Me parece fascinante. Estoy aquí para aprender contigo.',
                'Entiendo. Esa es una observación muy inteligente.'
            ]
        };n
        const templates = responseTemplates[analysis.intent] || responseTemplates['general'];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    async callOpenAI(userMessage) {
        try {
            const response = await fetch(CONFIG.APIS.openai, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: this.conversationMemory.concat([
                        { role: 'user', content: userMessage }
                    ]),
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

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
}

// Inicializar Eris cuando el DOM esté listo
let eris;
document.addEventListener('DOMContentLoaded', () => {
    eris = new Eris();
});