// Sistema de Voz de Eris
class VoiceSystem {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.recognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        this.recognizer = null;
        this.isListening = false;
        this.isSpeaking = false;
        
        if (this.recognition) {
            this.recognizer = new this.recognition();
            this.setupRecognition();
        }
    }

    speak(text) {
        return new Promise((resolve) => {
            // Cancelar cualquier síntesis anterior
            this.synthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = CONFIG.VOICE.language;
            utterance.rate = CONFIG.VOICE.rate;
            utterance.pitch = CONFIG.VOICE.pitch;
            utterance.volume = CONFIG.VOICE.volume;

            utterance.onend = () => {
                this.isSpeaking = false;
                resolve();
            };

            utterance.onerror = (event) => {
                console.error('Error en síntesis de voz:', event.error);
                this.isSpeaking = false;
                resolve();
            };

            this.isSpeaking = true;
            this.synthesis.speak(utterance);
        });
    }

    startListening() {
        if (!this.recognizer) {
            alert('El reconocimiento de voz no está disponible en tu navegador');
            return;
        }

        this.isListening = true;
        this.recognizer.start();
        this.updateMicButton(true);
    }

    stopListening() {
        if (this.recognizer) {
            this.recognizer.stop();
            this.isListening = false;
            this.updateMicButton(false);
        }
    }

    setupRecognition() {
        if (!this.recognizer) return;

        this.recognizer.continuous = false;
        this.recognizer.interimResults = true;
        this.recognizer.lang = CONFIG.VOICE.language;

        this.recognizer.onstart = () => {
            console.log('Escuchando...');
        };

        this.recognizer.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            const input = document.getElementById('user-input');
            if (finalTranscript) {
                input.value = finalTranscript;
                this.stopListening();
                // Enviar automáticamente
                setTimeout(() => eris.sendMessage(), 100);
            } else if (interimTranscript) {
                input.placeholder = interimTranscript;
            }
        };

        this.recognizer.onerror = (event) => {
            console.error('Error en reconocimiento de voz:', event.error);
            this.stopListening();
        };

        this.recognizer.onend = () => {
            this.isListening = false;
            this.updateMicButton(false);
        };
    }

    updateMicButton(isListening) {
        const micBtn = document.getElementById('mic-btn');
        if (isListening) {
            micBtn.classList.add('listening');
            micBtn.style.animation = 'pulse-mic 1s ease-in-out infinite';
        } else {
            micBtn.classList.remove('listening');
            micBtn.style.animation = 'none';
        }
    }

    // Obtener voces disponibles
    getAvailableVoices() {
        return this.synthesis.getVoices();
    }

    // Configurar voz específica
    setVoice(voiceName) {
        const voices = this.getAvailableVoices();
        const voice = voices.find(v => v.name === voiceName);
        return voice || null;
    }
}

// Crear instancia global del sistema de voz
const voiceSystem = new VoiceSystem();

// Escuchar cuando las voces estén cargadas
if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voces disponibles cargadas');
    };
} else {
    window.addEventListener('voiceschanged', () => {
        console.log('Voces disponibles cargadas');
    });
}