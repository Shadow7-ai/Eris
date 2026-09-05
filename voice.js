// Sistema de Voz Avanzado de Eris - Voz Femenina Natural
class VoiceSystem {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.recognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        this.recognizer = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.selectedVoice = null;
        this.currentEmotion = 'neutral';
        
        if (this.recognition) {
            this.recognizer = new this.recognition();
            this.setupRecognition();
        }
        
        this.initializeVoices();
    }

    initializeVoices() {
        // Cargar voces disponibles
        const loadVoices = () => {
            const voices = this.synthesis.getVoices();
            
            // Buscar voz femenina en español de mejor calidad
            const spanishFemaleVoices = voices.filter(voice => {
                return (voice.lang.startsWith('es') || voice.lang.startsWith('es-ES')) && 
                       (voice.name.toLowerCase().includes('female') || 
                        voice.name.toLowerCase().includes('mujer') ||
                        voice.name.toLowerCase().includes('woman') ||
                        voice.name.toLowerCase().includes('nina') ||
                        voice.name.includes('victoria') ||
                        voice.name.includes('Samantha') ||
                        voice.name.includes('Moira'));
            });
            
            if (spanishFemaleVoices.length > 0) {
                this.selectedVoice = spanishFemaleVoices[0];
                console.log('🎤 Voz femenina seleccionada:', this.selectedVoice.name);
            } else {
                // Fallback a cualquier voz en español
                const spanishVoices = voices.filter(voice => voice.lang.startsWith('es'));
                if (spanishVoices.length > 0) {
                    this.selectedVoice = spanishVoices[0];
                    console.log('🎤 Voz en español seleccionada:', this.selectedVoice.name);
                }
            }
        };
        
        loadVoices();
        if ('onvoiceschanged' in this.synthesis) {
            this.synthesis.onvoiceschanged = loadVoices;
        }
    }

    speak(text, emotion = 'neutral') {
        return new Promise((resolve) => {
            // Cancelar cualquier síntesis anterior
            this.synthesis.cancel();

            // Ajustar el texto para sonar más natural
            const naturalText = this.makeTextNatural(text, emotion);
            
            const utterance = new SpeechSynthesisUtterance(naturalText);
            utterance.lang = 'es-ES';
            
            // Aplicar configuración de emoción
            const emotionSettings = this.getEmotionSettings(emotion);
            utterance.rate = emotionSettings.rate;
            utterance.pitch = emotionSettings.pitch;
            utterance.volume = emotionSettings.volume;
            
            // Usar la voz seleccionada si está disponible
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }

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
            this.currentEmotion = emotion;
            this.synthesis.speak(utterance);
        });
    }

    makeTextNatural(text, emotion) {
        // Agregar pausas y modificar el texto para sonar más natural
        let naturalText = text;
        
        // Agregar pausas después de puntos
        naturalText = naturalText.replace(/\./g, '. ');
        
        // Remover URLs y códigos
        naturalText = naturalText.replace(/https?:\/\/\S+/g, '');
        naturalText = naturalText.replace(/`[^`]+`/g, 'código');
        
        // Según la emoción, ajustar el texto
        if (emotion === 'playful') {
            naturalText = naturalText.replace(/!/g, ' ');
        }
        
        return naturalText;
    }

    getEmotionSettings(emotion) {
        const emotionMap = {
            'happy': {
                rate: 0.95,
                pitch: 1.5,
                volume: 1,
                energy: '⭐ Feliz'
            },
            'excited': {
                rate: 1.1,
                pitch: 1.6,
                volume: 1,
                energy: '🔥 Entusiasmada'
            },
            'thoughtful': {
                rate: 0.85,
                pitch: 1.3,
                volume: 0.95,
                energy: '🤔 Pensativa'
            },
            'serious': {
                rate: 0.8,
                pitch: 1.2,
                volume: 1,
                energy: '⚡ Seria'
            },
            'playful': {
                rate: 1.0,
                pitch: 1.5,
                volume: 1,
                energy: '😄 Burlona'
            },
            'calm': {
                rate: 0.9,
                pitch: 1.35,
                volume: 0.9,
                energy: '☮️ Serena'
            },
            'inspired': {
                rate: 1.0,
                pitch: 1.45,
                volume: 1,
                energy: '✨ Inspirada'
            },
            'neutral': {
                rate: 0.9,
                pitch: 1.4,
                volume: 1,
                energy: '💬 Normal'
            }
        };

        return emotionMap[emotion] || emotionMap['neutral'];
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
        this.recognizer.lang = 'es-ES';

        this.recognizer.onstart = () => {
            console.log('🎤 Eris está escuchando...');
            document.getElementById('user-input').placeholder = '🎤 Estoy escuchando...';
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
                input.placeholder = 'Escribe algo o habla con Eris...';
                // Enviar automáticamente
                setTimeout(() => eris.sendMessage(), 100);
            } else if (interimTranscript) {
                input.placeholder = `🎤 ${interimTranscript}...`;
            }
        };

        this.recognizer.onerror = (event) => {
            console.error('Error en reconocimiento de voz:', event.error);
            this.stopListening();
            if (event.error === 'no-speech') {
                alert('No detecté tu voz. Intenta de nuevo.');
            }
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

    getAvailableVoices() {
        return this.synthesis.getVoices();
    }

    setVoice(voiceName) {
        const voices = this.getAvailableVoices();
        const voice = voices.find(v => v.name === voiceName);
        if (voice) {
            this.selectedVoice = voice;
            return voice;
        }
        return null;
    }

    // Método para cambiar emoción dinámicamente
    setEmotion(emotion) {
        this.currentEmotion = emotion;
        const settings = this.getEmotionSettings(emotion);
        console.log('🎀 Emoción de Eris:', settings.energy);
    }

    // Obtener información de voz actual
    getCurrentVoiceInfo() {
        return {
            voice: this.selectedVoice?.name || 'Voz por defecto',
            emotion: this.currentEmotion,
            isSpeaking: this.isSpeaking,
            isListening: this.isListening
        };
    }
}

// Crear instancia global del sistema de voz
const voiceSystem = new VoiceSystem();

// Cargar voces cuando estén disponibles
if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        voiceSystem.initializeVoices();
    };
} else {
    window.addEventListener('voiceschanged', () => {
        voiceSystem.initializeVoices();
    });
}