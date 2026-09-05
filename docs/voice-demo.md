# Voice demo — Eris

This folder contains an improved bilingual voice demo for the Eris repository.

Files added in branch feat/voice-demo-improvements:

- docs/voice-demo.html — main demo page (loads assets)
- docs/assets/css/voice.css — styles
- docs/assets/js/voice.js — logic (TTS, STT, VU meter, VAD, recording)

Quick notes
- UI is bilingual (Spanish / English). Use the selector on the top-right.
- TTS uses the browser's SpeechSynthesis API. Voices depend on OS/browser.
- STT uses Web Speech API (SpeechRecognition) — best supported on Chrome/Edge.
- Recording download (WAV) is available for the microphone capture, but browsers do not provide a direct client-side method to export speechSynthesis output to WAV/MP3 without server-side support or third-party encoders.

How to test
1. Open the page from the branch or publish `docs/` with GitHub Pages.
2. Allow microphone access when prompted.
3. Use the UI to switch language, speak, and test.

If you want MP3/TTS export, we can add optional server-side endpoints or integrate a cloud TTS provider (requires API keys).
