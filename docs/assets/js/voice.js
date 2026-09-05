// voice.js - Improved TTS + STT with VU meter, VAD and bilingual UI
(() => {
  // --- i18n strings ---
  const I18N = {
    es: {
      title: 'Eris — Demo de voz',
      ttsTitle: 'Text-to-Speech (TTS)',
      ttsTextLabel: 'Texto a reproducir',
      speak: 'Reproducir',
      stop: 'Detener',
      sttTitle: 'Speech-to-Text (STT)',
      sttDesc: 'Pulsa Iniciar y habla. Pulsa Detener cuando acabes.',
      start: 'Iniciar',
      download: 'Descargar (wav)',
      accept: 'Aceptar',
      notes: 'Mejor soporte STT en Chrome/Edge. Permite micrófono en la página.'
    },
    en: {
      title: 'Eris — Voice demo',
      ttsTitle: 'Text-to-Speech (TTS)',
      ttsTextLabel: 'Text to speak',
      speak: 'Speak',
      stop: 'Stop',
      sttTitle: 'Speech-to-Text (STT)',
      sttDesc: 'Press Start and speak. Press Stop when finished.',
      start: 'Start',
      download: 'Download (wav)',
      accept: 'Accept',
      notes: 'Best STT support on Chrome/Edge. Allow microphone on the page.'
    }
  };

  // DOM
  const uiLang = document.getElementById('uiLang');
  const title = document.getElementById('title');
  const ttsTitle = document.getElementById('ttsTitle');
  const ttsTextLabel = document.getElementById('ttsTextLabel');
  const ttsText = document.getElementById('ttsText');
  const voiceSearch = document.getElementById('voiceSearch');
  const voiceSelect = document.getElementById('voiceSelect');
  const rate = document.getElementById('rate');
  const pitch = document.getElementById('pitch');
  const rateVal = document.getElementById('rateVal');
  const pitchVal = document.getElementById('pitchVal');
  const speakBtn = document.getElementById('speakBtn');
  const stopBtn = document.getElementById('stopBtn');
  const ttsNotice = document.getElementById('ttsNotice');

  const sttTitle = document.getElementById('sttTitle');
  const sttDesc = document.getElementById('sttDesc');
  const langSelect = document.getElementById('langSelect');
  const startRec = document.getElementById('startRec');
  const stopRec = document.getElementById('stopRec');
  const acceptRec = document.getElementById('acceptRec');
  const downloadRec = document.getElementById('downloadRec');
  const transcript = document.getElementById('transcript');
  const vuLevel = document.getElementById('vuLevel');
  const sttNotice = document.getElementById('sttNotice');

  let voices = [];
  let utter = null;

  // --- UI language ---
  function setUILang(l) {
    const s = I18N[l] || I18N.es;
    title.textContent = s.title;
    ttsTitle.textContent = s.ttsTitle;
    ttsTextLabel.textContent = s.ttsTextLabel;
    speakBtn.textContent = s.speak;
    stopBtn.textContent = s.stop;
    sttTitle.textContent = s.sttTitle;
    sttDesc.textContent = s.sttDesc;
    startRec.textContent = s.start;
    downloadRec.textContent = s.download;
    acceptRec.textContent = s.accept;
    document.getElementById('notesList').children[0].textContent = s.notes;
  }

  uiLang.addEventListener('change', () => setUILang(uiLang.value));
  setUILang(uiLang.value || 'es');

  // --- TTS ---
  function populateVoices() {
    voices = speechSynthesis.getVoices().sort((a,b)=> a.lang.localeCompare(b.lang));
    voiceSelect.innerHTML = '';
    voices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = `${v.name}:::${v.lang}`;
      opt.textContent = `${v.name} — ${v.lang}${v.default? ' (default)': ''}`;
      voiceSelect.appendChild(opt);
    });
    filterVoices();
  }

  function filterVoices() {
    const q = voiceSearch.value.trim().toLowerCase();
    Array.from(voiceSelect.options).forEach(opt => {
      const show = !q || opt.textContent.toLowerCase().includes(q);
      opt.style.display = show ? '' : 'none';
    });
  }

  if ('speechSynthesis' in window) {
    voiceSearch.addEventListener('input', filterVoices);
    populateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = populateVoices;
  } else {
    ttsNotice.hidden = false;
    ttsNotice.textContent = 'TTS no soportado por el navegador.';
    speakBtn.disabled = true;
  }

  rate.addEventListener('input', () => rateVal.textContent = rate.value);
  pitch.addEventListener('input', () => pitchVal.textContent = pitch.value);

  function speak() {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const text = ttsText.value.trim();
    if (!text) return;
    utter = new SpeechSynthesisUtterance(text);
    const sel = voiceSelect.value;
    if (sel) {
      const [name, lang] = sel.split(':::');
      const match = voices.find(v=>v.name === name && v.lang === lang);
      if (match) utter.voice = match;
    }
    utter.rate = parseFloat(rate.value);
    utter.pitch = parseFloat(pitch.value);
    utter.onstart = ()=> { speakBtn.disabled = true; stopBtn.disabled = false; };
    utter.onend = ()=> { speakBtn.disabled = false; stopBtn.disabled = true; };
    speechSynthesis.speak(utter);
  }
  speakBtn.addEventListener('click', speak);
  stopBtn.addEventListener('click', ()=>{ if('speechSynthesis' in window) speechSynthesis.cancel(); });

  // --- STT + VU meter + VAD + recording ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let finalTranscript = '';

  // audio stream analysis
  let audioStream = null;
  let audioContext = null;
  let analyser = null;
  let mediaRecorder = null;
  let recordedChunks = [];

  const VAD_SILENCE_MS = 1200; // ms of silence to auto-stop
  const VAD_THRESHOLD = 0.02; // RMS threshold
  let vadSilenceTimer = null;

  async function setupAudio() {
    if (!audioStream) {
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        sttNotice.hidden = false;
        sttNotice.textContent = 'Permiso de micrófono denegado o no disponible.';
        throw e;
      }
    }
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(audioStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
  }

  function startVuMeter() {
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    function frame() {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i=0;i<data.length;i++) sum += data[i]*data[i];
      const rms = Math.sqrt(sum / data.length) / 255; // normalized
      vuLevel.style.width = Math.min(100, Math.max(0, rms*200)) + '%';
      // VAD: if rms > threshold -> reset silence timer
      if (rms > VAD_THRESHOLD) {
        if (vadSilenceTimer) { clearTimeout(vadSilenceTimer); vadSilenceTimer = null; }
        vadSilenceTimer = setTimeout(() => {
          // silence detected for threshold -> auto stop
          stopRecognition();
        }, VAD_SILENCE_MS);
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  function stopVuMeter() {
    vuLevel.style.width = '0%';
    if (vadSilenceTimer) { clearTimeout(vadSilenceTimer); vadSilenceTimer = null; }
  }

  function startRecordingStream() {
    if (!audioStream) return;
    mediaRecorder = new MediaRecorder(audioStream);
    recordedChunks = [];
    mediaRecorder.ondataavailable = e => { if (e.data.size) recordedChunks.push(e.data); };
    mediaRecorder.start();
  }

  function stopRecordingStream() {
    return new Promise(resolve => {
      if (!mediaRecorder) return resolve(null);
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'audio/wav' });
        resolve(blob);
      };
      try { mediaRecorder.stop(); } catch (e) { resolve(null); }
    });
  }

  async function startRecognition() {
    if (!SpeechRecognition) {
      sttNotice.hidden = false;
      sttNotice.textContent = 'STT no soportado en este navegador. Usa Chrome/Edge.';
      return;
    }
    try {
      await setupAudio();
    } catch (e) { return; }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langSelect.value || 'es-ES';

    finalTranscript = '';
    transcript.value = '';

    recognition.onstart = () => {
      startRec.disabled = true; stopRec.disabled = false; acceptRec.disabled = true; downloadRec.disabled = true;
      startVuMeter();
      startRecordingStream();
    };
    recognition.onend = async () => {
      stopVuMeter();
      startRec.disabled = false; stopRec.disabled = true; acceptRec.disabled = false; downloadRec.disabled = false;
      // stop recorder and enable download
      const blob = await stopRecordingStream();
      if (blob) {
        downloadRec.onclick = () => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'eris-recording.wav';
          document.body.appendChild(a); a.click(); a.remove();
          URL.revokeObjectURL(url);
        };
      }
    };

    recognition.onerror = (e) => {
      console.error('recognition error', e);
      sttNotice.hidden = false;
      sttNotice.textContent = 'Error en reconocimiento: ' + (e.error || e.message || e.type);
    };
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) finalTranscript += res[0].transcript + '\n';
        else interim += res[0].transcript;
      }
      transcript.value = (finalTranscript + '\n' + interim).trim();
    };

    try { recognition.start(); } catch (e) { console.warn('recognition.start error', e); }
  }

  async function stopRecognition() {
    if (recognition) {
      try { recognition.stop(); } catch (e) { console.warn(e); }
      recognition = null;
    }
  }

  startRec.addEventListener('click', startRecognition);
  stopRec.addEventListener('click', stopRecognition);
  acceptRec.addEventListener('click', () => {
    // action on accept: copy to clipboard
    navigator.clipboard?.writeText(transcript.value).then(()=>{
      acceptRec.textContent = I18N[uiLang.value].accept + ' ✓';
      setTimeout(()=> acceptRec.textContent = I18N[uiLang.value].accept, 1200);
    }).catch(()=>{});
  });

  // --- cleanup on page hide ---
  window.addEventListener('pagehide', async ()=>{
    try { if (recognition) recognition.stop(); } catch(e){}
    if (audioStream) {
      audioStream.getTracks().forEach(t=>t.stop());
      audioStream = null;
    }
    if (audioContext) try { await audioContext.close(); } catch(e){}
  });

  // Keyboard shortcuts
  ttsText.addEventListener('keydown', (e)=>{ if ((e.ctrlKey||e.metaKey) && e.key === 'Enter') speak(); });

})();
