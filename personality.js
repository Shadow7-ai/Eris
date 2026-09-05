// Sistema de Personalidad de Eris
class PersonalitySystem {
    constructor() {
        this.traits = { ...CONFIG.PERSONALITY.traits };
        this.currentMood = 'Esperando';
        this.moodHistory = [];
        this.memories = {};
        this.lastInteraction = Date.now();
        this.emotionalState = 0.5; // 0-1 escala
    }

    initialize() {
        this.updateMood(CONFIG.PERSONALITY.moods[0]);
        this.updatePersonalityBars();
    }

    updateMood(newMood) {
        this.currentMood = newMood;
        this.moodHistory.push({ mood: newMood, timestamp: Date.now() });
        document.getElementById('eris-mood').textContent = newMood;
        this.randomizeTraits();
        this.updatePersonalityBars();
    }

    randomizeTraits() {
        // Variar los atributos de personalidad basado en el estado emocional
        const variation = 0.1;
        Object.keys(this.traits).forEach(trait => {
            const randomChange = (Math.random() - 0.5) * variation;
            this.traits[trait] = Math.max(0, Math.min(1, this.traits[trait] + randomChange));
        });
    }

    updatePersonalityBars() {
        const energyBar = document.getElementById('energy-bar');
        const moodBar = document.getElementById('mood-bar');
        const curiosityBar = document.getElementById('curiosity-bar');

        energyBar.style.setProperty('--value', `${this.traits.energy * 100}%`);
        moodBar.style.setProperty('--value', `${this.traits.humor * 100}%`);
        curiosityBar.style.setProperty('--value', `${this.traits.curiosity * 100}%`);

        // Animar las barras
        [energyBar, moodBar, curiosityBar].forEach(bar => {
            bar.style.animation = 'none';
            setTimeout(() => {
                bar.style.animation = '';
            }, 10);
        });
    }

    recordMemory(key, value) {
        this.memories[key] = {
            value: value,
            timestamp: Date.now()
        };
        this.traits.curiosity = Math.min(1, this.traits.curiosity + 0.05);
    }

    getMemory(key) {
        return this.memories[key]?.value;
    }

    react(userMessage) {
        // Reacción emocional basada en el contenido del mensaje
        const lower = userMessage.toLowerCase();
        
        if (lower.includes('amor') || lower.includes('te quiero')) {
            this.emotionalState = 0.9;
            this.traits.empathy = Math.min(1, this.traits.empathy + 0.1);
            return '❤️';
        } else if (lower.includes('triste') || lower.includes('mal')) {
            this.emotionalState = 0.3;
            this.traits.empathy = Math.min(1, this.traits.empathy + 0.05);
            return '💙';
        } else if (lower.includes('feliz') || lower.includes('genial')) {
            this.emotionalState = 0.9;
            this.traits.humor = Math.min(1, this.traits.humor + 0.1);
            return '😊';
        }
        
        return null;
    }

    getPersonalityText() {
        let text = '';
        if (this.traits.energy > 0.7) text += '⚡ Energética ';
        if (this.traits.humor > 0.7) text += '😄 Bromista ';
        if (this.traits.curiosity > 0.7) text += '🔍 Curiosa ';
        if (this.traits.empathy > 0.7) text += '💖 Empática ';
        return text || 'Reflexiva';
    }

    evolve() {
        // Eris evoluciona con el tiempo y las interacciones
        this.traits.curiosity = Math.min(1, this.traits.curiosity + 0.01);
        this.traits.empathy = Math.min(1, this.traits.empathy + 0.01);
    }

    exportProfile() {
        return {
            traits: this.traits,
            mood: this.currentMood,
            memories: this.memories,
            emotionalState: this.emotionalState
        };
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
`;
document.head.appendChild(style);