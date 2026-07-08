// Guardamos la conversación aquí para enviársela siempre completa a la IA
let historialMensajes = []; 

const historialChatDiv = document.getElementById('historialChat');
const btnAccion = document.getElementById('btnAccion');
const contenedorEntrada = document.getElementById('contenedorEntrada');
const inputUsuario = document.getElementById('inputUsuario');
const btnEnviar = document.getElementById('btnEnviar');

// Al presionar "Empezar simulacro"
btnAccion.addEventListener('click', async () => {
  btnAccion.classList.add('oculto');
  contenedorEntrada.classList.remove('oculto');
  
  // Llamamos a la IA sin mensaje del usuario para recibir la primera pregunta
  agregarMensajePantalla("Andrea está pensando la primera pregunta...", "bot temp");
  await enviarAConversacionIA();
});

// Al enviar una respuesta
btnEnviar.addEventListener('click', procesarRespuestaUsuario);
inputUsuario.addEventListener('keypress', (e) => { if(e.key === 'Enter') procesarRespuestaUsuario(); });

async function procesarRespuestaUsuario() {
  const texto = inputUsuario.value.trim();
  if (!texto) return;

  inputUsuario.value = '';
  // 1. Mostrar respuesta en pantalla (Burbuja Rosa)
  agregarMensajePantalla(texto, 'usuario');
  
  // 2. Guardar en el historial para la IA
  historialMensajes.push({ role: 'user', content: texto });

  // 3. Mostrar indicador de carga de Andrea
  agregarMensajePantalla("Andrea está analizando tu respuesta...", "bot temp");

  // 4. Enviar a la IA
  await enviarAConversacionIA();
}

async function enviarAConversacionIA() {
  try {
    // LLAMADA SEGURA: Apunta a tu serverless function o backend proxy
    const respuesta = await fetch('/api/entrevista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historial: historialMensajes })
    });

    const data = await respuesta.json();

    // Remover el mensaje temporal de carga
    document.querySelector('.bot.temp')?.remove();

    // Agregar respuesta real de Andrea a la pantalla y al historial
    agregarMensajePantalla(data.resultado, 'bot');
    historialMensajes.push({ role: 'assistant', content: data.resultado });

  } catch (error) {
    document.querySelector('.bot.temp')?.remove();
    agregarMensajePantalla("Error de conexión. Inténtalo de nuevo.", "bot");
  }
}

function agregarMensajePantalla(texto, clase) {
  const div = document.createElement('div');
  div.className = `mensaje ${clase}`;
  div.innerText = texto;
  historialChatDiv.appendChild(div);
  historialChatDiv.scrollTop = historialChatDiv.scrollHeight; // Auto-scroll abajo
}