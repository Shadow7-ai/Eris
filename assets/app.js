// app.js externalizado
(()=>{
  const chat = () => document.getElementById('chat');
  const input = () => document.getElementById('mensaje');
  const btnEnviar = () => document.getElementById('btnEnviar');
  const settingsDialog = document.getElementById('settingsDialog');
  const btnSettings = document.getElementById('btnSettings');
  const btnLimpiar = document.getElementById('btnLimpiar');
  const apiKeyInput = document.getElementById('apiKeyInput');

  // Config keys
  const STORAGE_KEY = 'eris:historial';
  const SETTINGS_KEY = 'eris:settings';

  function getHora(){
    const now=new Date();
    return now.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
  }

  function appendMensaje(text, clase='eris'){
    const div=document.createElement('div');
    div.className = 'mensaje ' + clase;
    div.innerHTML = sanitize(text) + '<div class="timestamp">'+getHora()+'</div>';
    chat().appendChild(div);
    chat().scrollTop = chat().scrollHeight;
  }

  function sanitize(str){
    // simple sanitizer to prevent injection when restoring HTML
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function showTyping(){
    const divTyping=document.createElement('div');
    divTyping.className='mensaje eris typing';
    divTyping.id='typing';
    divTyping.innerHTML='<span></span><span></span><span></span>';
    chat().appendChild(divTyping);
    chat().scrollTop = chat().scrollHeight;
  }

  function hideTyping(){
    const t = document.getElementById('typing');
    if(t) t.remove();
  }

  function guardarHistorial(){
    localStorage.setItem(STORAGE_KEY, chat().innerHTML);
  }

  function cargarHistorial(){
    const h = localStorage.getItem(STORAGE_KEY);
    if(h){
      chat().innerHTML = h;
      chat().scrollTop = chat().scrollHeight;
    }
  }

  function limpiarChat(){
    if(confirm('¿Estás seguro de que quieres limpiar el chat?')){
      chat().innerHTML = '<div class="mensaje eris">Hola 👋 Soy Eris. ¿En qué puedo ayudarte hoy?<div class="timestamp">Ahora</div></div>';
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Simple rule-based responder (mismo comportamiento que antes)
  function responderLocal(texto){
    texto = texto.toLowerCase().trim();
    if(/hola|hey|buenos días|buenas noches|buenas tardes/.test(texto)){
      const saludos=['Hola 😄. ¿Cómo estás?','¡Hola! Encantada de ayudarte.','Hola 👋 ¿Qué necesitas?'];
      return saludos[Math.floor(Math.random()*saludos.length)];
    }
    if(/quién eres|que eres|cual es tu nombre/.test(texto)) return 'Soy Eris, una asistente de IA creada por ti. Estoy aquí para conversar y ayudarte en lo que pueda 🌙';
    if(/cómo estás|como estas|que tal|cómo te sientes|como te sientes/.test(texto)){
      const estados=['Estoy funcionando perfectamente ✨','Excelente, gracias por preguntar 😊','Funcionando al 100% y listo para ayudarte 🚀'];
      return estados[Math.floor(Math.random()*estados.length)];
    }
    if(/gracias|thx|thanks|tq/.test(texto)) return 'De nada 😄. Siempre es un placer ayudarte.';
    if(/adiós|adios|bye|chao|hasta luego|hasta pronto/.test(texto)) return '¡Hasta luego! Que tengas un excelente día 🌟';
    if(/cual es tu color favorito|color favorito/.test(texto)) return 'Me encanta el púrpura 💜 Es elegante y misterioso, como yo.';
    if(/que puedes hacer|cuales son tus funciones|ayuda|help/.test(texto)) return 'Puedo conversar contigo, responder preguntas básicas, y aprender de nuestras interacciones. Aunque todavía estoy mejorando, así que ten paciencia conmigo 🤖';
    if(/¿cuál es el sentido de la vida|sentido de la vida/.test(texto)) return 'Excelente pregunta filosófica 🤔 Según Douglas Adams, es 42. Pero yo creo que es ayudarte y hacer que tu día sea mejor.';
    if(/cuéntame un chiste|un chiste|cuéntame algo divertido/.test(texto)){
      const chistes=['¿Por qué los programadores usan Linux? Porque no tienen Windows 😄','Un SQL caminaba a un bar, ¿vió una tabla y una silla? Se sentó... 🍺','¿Cuántos programadores se necesitan para cambiar un foco? Ninguno, eso es hardware 💡'];
      return chistes[Math.floor(Math.random()*chistes.length)];
    }
    const defaults=['Todavía estoy aprendiendo sobre eso. ¿Podrías explicarme más? 🤔','Hmm, esa es interesante. Pero aún no tengo suficiente información al respecto 📚','Creo que necesito aprender más sobre eso. ¿Podemos mejorar juntos? 💜','Esa pregunta está fuera de mis conocimientos actuales, pero estoy creciendo cada día 🚀'];
    return defaults[Math.floor(Math.random()*defaults.length)];
  }

  async function enviarMensaje(texto){
    appendMensaje(texto,'usuario');
    btnEnviar().disabled = true;
    input().disabled = true;
    showTyping();

    const settings = loadSettings();

    try{
      if(settings.mode === 'local' || !settings.mode){
        // Responder localmente
        await new Promise(r => setTimeout(r, 700 + Math.random()*1000));
        hideTyping();
        appendMensaje(responderLocal(texto),'eris');
      } else {
        // Enviar al proxy /api/proxy (server example) y esperar respuesta
        const payload = {message:texto};
        const res = await fetch('/api/proxy',{
          method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
        });
        hideTyping();
        if(!res.ok){
          appendMensaje('Error al conectar con el servidor: '+res.statusText,'eris');
        } else {
          const data = await res.json();
          appendMensaje(data.reply || 'Respuesta vacía desde el proxy','eris');
        }
      }
    }catch(err){
      hideTyping();
      appendMensaje('Ocurrió un error: '+err.message,'eris');
    } finally{
      btnEnviar().disabled=false;input().disabled=false;input().focus();guardarHistorial();
    }
  }

  // Settings (mode: 'local'|'proxy')
  function saveSettings(s){
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));
  }
  function loadSettings(){
    try{return JSON.parse(localStorage.getItem(SETTINGS_KEY))||{mode:'local'}}catch(e){return {mode:'local'}}
  }

  function applySettingsToUI(){
    const s = loadSettings();
    const radios = settingsDialog.querySelectorAll('input[name="mode"]');
    radios.forEach(r=>r.checked = (r.value === s.mode));
    apiKeyInput.value = s.apiKey || '';
  }

  // Events
  document.getElementById('formEntrada').addEventListener('submit',function(e){
    e.preventDefault();const text=input().value.trim();if(!text) return;input().value='';enviarMensaje(text);
  });

  btnSettings.addEventListener('click',()=>{settingsDialog.showModal();applySettingsToUI();});
  document.getElementById('closeSettings').addEventListener('click',()=>settingsDialog.close());
  document.getElementById('saveSettings').addEventListener('click',()=>{
    const mode = settingsDialog.querySelector('input[name="mode"]:checked')?.value || 'local';
    const apiKey = apiKeyInput.value.trim();
    saveSettings({mode,apiKey});
    // if local, we store the key in localStorage under settings (user warned)
    settingsDialog.close();
    alert('Ajustes guardados');
  });
  btnLimpiar.addEventListener('click', limpiarChat);

  // Inicialización
  cargarHistorial();
  applySettingsToUI();

})();
