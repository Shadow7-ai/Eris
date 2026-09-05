// Configuración de Eris
const CONFIG = {
    // API Keys
    OPENAI_API_KEY: 'tu_clave_openai_aqui', // Reemplazar con tu clave real
    
    // Configuración de Personalidad
    PERSONALITY: {
        name: 'Eris',
        description: 'Una IA inteligente, curiosa y empática',
        traits: {
            energy: 0.7,
            humor: 0.8,
            curiosity: 0.9,
            empathy: 0.85
        },
        moods: [
            'Feliz', 'Entusiasmada', 'Pensativa',
            'Curiosa', 'Juguetona', 'Reflexiva',
            'Animada', 'Concentrada'
        ],
        greetings: [
            '¡Hola! Soy Eris. ¿En qué puedo ayudarte?',
            '¿Qué tal? Me llamo Eris. Cuéntame, ¿qué te trae por aquí?',
            '¡Bienvenido! Soy Eris. Estoy lista para conversar.',
            '¡Hola amigo! Soy Eris. ¿Qué hay de nuevo?'
        ]
    },

    // Configuración de Voz
    VOICE: {
        enabled: true,
        language: 'es-ES',
        rate: 1,
        pitch: 1.2,
        volume: 1
    },

    // Configuración de Respuestas
    RESPONSES: {
        typing_speed: 30, // ms por carácter
        emotion_reactions: true,
        learning_enabled: true
    },

    // URLs de APIs
    APIS: {
        openai: 'https://api.openai.com/v1/chat/completions',
        huggingface: 'https://api-inference.huggingface.co/models/'
    }
};

// Contexto de conversación para mantener continuidad
const CONVERSATION_CONTEXT = {
    messages: [],
    user_profile: {},
    interaction_count: 0,
    favorite_topics: [],
    memory: {}
};