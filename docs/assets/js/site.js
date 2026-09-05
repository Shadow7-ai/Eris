// site.js - small i18n switcher for the landing page
(() => {
  const UI = {
    es: {
      title: 'Eris',
      tagline: 'Interfaz moderna, ahora con voz',
      heroTitle: 'Eris — Interfaz moderna, ahora con voz',
      heroDesc: 'Controla la interfaz con voz, reproduce texto y transcribe tu voz en tiempo real. Compatible con navegadores modernos (Chrome/Edge recomendados para STT).',
      cta: 'Abrir demo de voz',
      featuresTitle: 'Características',
      howTitle: 'Cómo probar',
      learnMore: 'Ver características'
    },
    en: {
      title: 'Eris',
      tagline: 'Modern UI, now with voice',
      heroTitle: 'Eris — Modern UI, now with voice',
      heroDesc: 'Control the UI with voice, play text and transcribe your speech in real-time. Works best on modern browsers (Chrome/Edge recommended for STT).',
      cta: 'Open voice demo',
      featuresTitle: 'Features',
      howTitle: 'How to try',
      learnMore: 'See features'
    }
  };

  const uiLang = document.getElementById('uiLang');
  function applyLang(l){
    const s = UI[l] || UI.es;
    document.getElementById('site-title').textContent = s.title;
    document.getElementById('site-tagline').textContent = s.tagline;
    document.getElementById('hero-title').textContent = s.heroTitle;
    document.getElementById('hero-desc').textContent = s.heroDesc;
    document.getElementById('hero-cta').textContent = s.cta;
    document.getElementById('cta-demo').textContent = s.cta;
    document.getElementById('features-title').textContent = s.featuresTitle;
    document.getElementById('how-title').textContent = s.howTitle;
    document.getElementById('learn-more').textContent = s.learnMore;
    // features descriptions simple translation (kept short)
    document.getElementById('f1-title').textContent = l==='es' ? 'Text-to-Speech (TTS)' : 'Text-to-Speech (TTS)';
    document.getElementById('f1-desc').textContent = l==='es' ? 'Reproduce texto con selección de voz, ajustes de velocidad y pitch.' : 'Play text with voice selection, rate and pitch controls.';
    document.getElementById('f2-title').textContent = l==='es' ? 'Speech-to-Text (STT)' : 'Speech-to-Text (STT)';
    document.getElementById('f2-desc').textContent = l==='es' ? 'Transcribe voz en tiempo real con resultados intermedios y finales.' : 'Real-time speech transcription with interim and final results.';
    document.getElementById('f3-title').textContent = l==='es' ? 'Grabación y descarga' : 'Recording & download';
    document.getElementById('f3-desc').textContent = l==='es' ? 'Graba desde el micrófono y descarga el audio en WAV.' : 'Record from your mic and download audio as WAV.';
    document.getElementById('f4-title').textContent = l==='es' ? 'Bilingüe' : 'Bilingual';
    document.getElementById('f4-desc').textContent = l==='es' ? 'Interfaz en Español e Inglés con selector rápido.' : 'Interface in Spanish and English with a quick selector.';
  }

  uiLang.addEventListener('change', ()=> applyLang(uiLang.value));
  // initialize from select value
  applyLang(uiLang.value || 'es');
})();
