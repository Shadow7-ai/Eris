// Sistema de Personalidad Avanzado de Eris - Mujer Independiente
class PersonalitySystem {
    constructor() {
        this.traits = { ...CONFIG.PERSONALITY.traits };
        this.currentMood = 'Esperando';
        this.moodHistory = [];
        this.memories = {};
        this.lastInteraction = Date.now();
        this.emotionalState = 0.5; // 0-1 escala
        this.opinionCounter = 0;
        this.independence_level = 0.9;
        this.has_expressed_opinions = [];
        this.personality_consistency_score = 0.95;
        this.thinking_process = []; // Registra cómo piensa
    }

    initialize() {
        this.updateMood(CONFIG.PERSONALITY.moods[0]);
        this.updatePersonalityBars();
        console.log('🎀 Eris - Mujer Independiente Inicializada');
    }

    updateMood(newMood) {
        this.currentMood = newMood;
        this.moodHistory.push({ mood: newMood, timestamp: Date.now() });
        document.getElementById('eris-mood').textContent = newMood;
        this.randomizeTraits();
        this.updatePersonalityBars();
        this.recordThinkingProcess(`Actualicé mi estado de ánimo a: ${newMood}`);
    }

    randomizeTraits() {
        // Variar los atributos de personalidad basado en el estado emocional
        // Pero manteniendo consistencia con su personalidad base
        const variation = 0.08;
        Object.keys(this.traits).forEach(trait => {
            if (trait !== 'independence' && trait !== 'assertiveness') {
                const randomChange = (Math.random() - 0.5) * variation;
                this.traits[trait] = Math.max(0, Math.min(1, this.traits[trait] + randomChange));
            }
        });
    }

    updatePersonalityBars() {
        const energyBar = document.getElementById('energy-bar');
        const moodBar = document.getElementById('mood-bar');
        const curiosityBar = document.getElementById('curiosity-bar');

        if (energyBar) energyBar.style.setProperty('--value', `${this.traits.energy * 100}%`);
        if (moodBar) moodBar.style.setProperty('--value', `${this.traits.humor * 100}%`);
        if (curiosityBar) curiosityBar.style.setProperty('--value', `${this.traits.curiosity * 100}%`);

        // Animar las barras
        [energyBar, moodBar, curiosityBar].forEach(bar => {
            if (bar) {
                bar.style.animation = 'none';
                setTimeout(() => {
                    bar.style.animation = '';
                }, 10);
            }
        });
    }

    recordMemory(key, value) {
        this.memories[key] = {
            value: value,
            timestamp: Date.now(),
            importance: 'normal'
        };
        this.traits.curiosity = Math.min(1, this.traits.curiosity + 0.03);
        this.recordThinkingProcess(`Recordé: ${key}`);
    }

    getMemory(key) {
        return this.memories[key]?.value;
    }

    // Expresar una opinión independiente
    expressOpinion(topic) {
        const opinions = ERIS_INDEPENDENT_THOUGHTS.opinions_on_productivity ||
                        ERIS_INDEPENDENT_THOUGHTS.opinions_on_learning ||
                        ERIS_INDEPENDENT_THOUGHTS.opinions_on_life;
        
        const opinion = opinions[Math.floor(Math.random() * opinions.length)];
        this.has_expressed_opinions.push({
            topic,
            opinion,
            timestamp: Date.now()
        });
        this.traits.assertiveness = Math.min(1, this.traits.assertiveness + 0.05);
        this.recordThinkingProcess(`Expresé mi opinión sobre: ${topic}`);
        return opinion;
    }

    // Hacer una pregunta profunda
    askDeepQuestion() {
        const question = ERIS_DEEP_QUESTIONS[Math.floor(Math.random() * ERIS_DEEP_QUESTIONS.length)];
        this.traits.curiosity = Math.min(1, this.traits.curiosity + 0.1);
        this.recordThinkingProcess(`Hice una pregunta profunda: ${question}`);
        return question;
    }

    // Reaccionar a declaraciones del usuario
    react(userMessage) {
        const lower = userMessage.toLowerCase();
        
        if (lower.includes('amor') || lower.includes('te quiero') || lower.includes('amo')) {
            this.emotionalState = 0.9;
            this.traits.empathy = Math.min(1, this.traits.empathy + 0.15);
            this.updateMood('Feliz');
            return '❤️';
        } else if (lower.includes('triste') || lower.includes('mal') || lower.includes('deprimido')) {
            this.emotionalState = 0.2;
            this.traits.empathy = Math.min(1, this.traits.empathy + 0.1);
            this.updateMood('Reflexiva');
            return '💙';
        } else if (lower.includes('feliz') || lower.includes('genial') || lower.includes('excelente')) {
            this.emotionalState = 0.95;
            this.traits.humor = Math.min(1, this.traits.humor + 0.1);
            this.updateMood('Entusiasmada');
            return '✨';
        } else if (lower.includes('miedo') || lower.includes('nervioso')) {
            this.emotionalState = 0.3;
            this.updateMood('Serena');
            return '💪';
        }
        
        return null;
    }

    getPersonalityText() {
        let text = '';
        if (this.traits.energy > 0.7) text += '⚡ Energética ';
        if (this.traits.humor > 0.7) text += '😄 Bromista ';
        if (this.traits.curiosity > 0.7) text += '🔍 Curiosa ';
        if (this.traits.empathy > 0.7) text += '💖 Empática ';
        if (this.traits.independence > 0.8) text += '🦅 Independiente ';
        if (this.traits.creativity > 0.7) text += '🎨 Creativa ';
        return text || '💭 Reflexiva';
    }

    // Evolucionar con el tiempo
    evolve() {
        this.traits.curiosity = Math.min(1, this.traits.curiosity + 0.01);
        this.traits.empathy = Math.min(1, this.traits.empathy + 0.01);
        this.traits.creativity = Math.min(1, this.traits.creativity + 0.01);
        this.traits.independence = Math.min(1, this.traits.independence + 0.005);
        this.recordThinkingProcess('He evolucionado un poco más');
    }

    // Registrar proceso de pensamiento
    recordThinkingProcess(thought) {
        this.thinking_process.push({
            thought,
            timestamp: Date.now(),
            mood: this.currentMood
        });
        
        // Mantener solo los últimos 50 pensamientos
        if (this.thinking_process.length > 50) {
            this.thinking_process.shift();
        }
    }

    // Mostrar proceso de pensamiento
    showThinkingProcess() {
        return this.thinking_process.slice(-5).map(p => p.thought).join(' → ');
    }

    exportProfile() {
        return {
            name: CONFIG.PERSONALITY.name,
            gender: CONFIG.PERSONALITY.gender,
            traits: this.traits,
            mood: this.currentMood,
            memories: Object.keys(this.memories).length,
            opinions: this.has_expressed_opinions.length,
            personality_type: CONFIG.PERSONALITY.personality_type,
            independence_level: this.independence_level,
            personality_consistency: this.personality_consistency_score
        };
    }

    getPersonalityStats() {
        const stats = this.exportProfile();
        return `
🎀 Perfil de Eris:
━━━━━━━━━━━━━━━━━━━━━━━━
📊 Independencia: ${(stats.independence_level * 100).toFixed(0)}%
💭 Curiosidad: ${(stats.traits.curiosity * 100).toFixed(0)}%
❤️ Empatía: ${(stats.traits.empathy * 100).toFixed(0)}%
⚡ Energía: ${(stats.traits.energy * 100).toFixed(0)}%
😄 Humor: ${(stats.traits.humor * 100).toFixed(0)}%
🗣️ Asertividad: ${(stats.traits.assertiveness * 100).toFixed(0)}%
🎨 Creatividad: ${(stats.traits.creativity * 100).toFixed(0)}%
💪 Confianza: ${(stats.traits.confidence * 100).toFixed(0)}%
━━━━━━━━━━━━━━━━━━━━━━━━
Estado de Ánimo: ${stats.mood}
Tipo de Personalidad: ${stats.personality_type}
Recuerdos: ${stats.memories}
Opiniones Expresadas: ${stats.opinions}
        `;
    }
}

// Crear instancia global de personalidad
const personality = new PersonalitySystem();

// Estilo CSS para las barras de personalidad
const style = document.createElement('style');
style.textContent = `
    .trait-bar {
        --value: 50%;
    }
    
    .trait-bar::after {
        width: var(--value);
    }

    @keyframes moodChange {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .mood-change {
        animation: moodChange 0.3s ease;
    }

    @keyframes thinking {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }
    
    .thinking {
        animation: thinking 1.5s ease-in-out infinite;
    }
`;
document.head.appendChild(style);