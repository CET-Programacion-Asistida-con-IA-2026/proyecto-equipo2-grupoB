// ========================================
// Simulacro de Entrevista - versión SIMULADA (sin backend, sin API key)
// Usa el mismo patrón que index.js: preguntas fijas + delay artificial
// ========================================

// Guardamos la conversación solo para mostrarla en pantalla (ya no se envía a ninguna IA)
let historialMensajes = [];

const historialChatDiv = document.getElementById('historialChat');
const btnAccion = document.getElementById('btnAccion');
const contenedorEntrada = document.getElementById('contenedorEntrada');
const inputUsuario = document.getElementById('inputUsuario');
const btnEnviar = document.getElementById('btnEnviar');

// ----------------------------------------
// Banco de preguntas fijas (podés agregar o cambiar las que quieras)
// ----------------------------------------
const preguntasSimuladas = [
  '¿Qué te inspiró a dar el salto al sector tecnológico?',
  '¿Qué habilidades de tu carrera anterior te serán más útiles en tech?',
  '¿Cómo te mantenés actualizada con las tecnologías que cambian rápidamente?',
  '¿Qué herramientas o recursos usás para resolver un problema de código?',
  '¿Cómo manejás la frustración cuando un proyecto no sale como esperabas?',
  '¿Cómo priorizás tus tareas cuando tenés múltiples entregas pendientes?',
  '¿De qué manera comunicás ideas técnicas a personas que no son del área?',
  '¿Qué buscás en la cultura laboral de una empresa tecnológica?'
];

// Frases cortas de "feedback" que se muestran después de cada respuesta de la usuaria
const feedbacksSimulados = [
  '¡Muy buena respuesta! Esa perspectiva es exactamente lo que buscan los recruiters 💪',
  '¡Excelente! Seguimos con la próxima pregunta.',
  '¡Me encanta ese enfoque! Avancemos.',
  '¡Genial! Eso demuestra madurez profesional 🌟'
];
let preguntaIndex = 0;

// Al presionar "Empezar simulacro"
btnAccion.addEventListener('click', async () => {
  btnAccion.classList.add('oculto');
  contenedorEntrada.classList.remove('oculto');

  // Mostramos el indicador de "pensando" antes de la primera pregunta
  agregarMensajePantalla('Andrea está pensando la primera pregunta...', 'bot temp');
  await enviarRespuestaSimulada(true);
});

// Al enviar una respuesta
btnEnviar.addEventListener('click', procesarRespuestaUsuario);
inputUsuario.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') procesarRespuestaUsuario();
});

async function procesarRespuestaUsuario() {
  const texto = inputUsuario.value.trim();
  if (!texto) return;

  inputUsuario.value = '';
  // 1. Mostrar respuesta en pantalla (Burbuja Rosa)
  agregarMensajePantalla(texto, 'usuario');

  // 2. Guardar en el historial (solo para referencia visual)
  historialMensajes.push({ role: 'user', content: texto });

  // 3. Mostrar indicador de carga de Andrea
  agregarMensajePantalla('Andrea está analizando tu respuesta...', 'bot temp');

  // 4. Simular la respuesta (ya no llama a ninguna IA externa)
  await enviarRespuestaSimulada(false);
}

// ----------------------------------------
// Reemplaza a la vieja enviarAConversacionIA(): ya no usa fetch ni backend
// ----------------------------------------
function enviarRespuestaSimulada(esPrimeraPregunta) {
  return new Promise((resolve) => {
    // Simulamos el tiempo que tardaría una IA en responder
    setTimeout(() => {
      // Remover el mensaje temporal de carga
      document.querySelector('.bot.temp')?.remove();

      // Si ya mostramos todas las preguntas, cerramos el simulacro
      if (preguntaIndex >= preguntasSimuladas.length) {
        agregarMensajePantalla(
          '¡Excelente! Eso fue todo por hoy. Seguí practicando, vas muy bien 💪',
          'bot'
        );
        contenedorEntrada.classList.add('oculto');
        resolve();
        return;
      }

      let texto = '';

      if (esPrimeraPregunta) {
        // Primer mensaje: saludo + primera pregunta
        texto = `¡Hola! Empecemos. ${preguntasSimuladas[preguntaIndex]}`;
      } else {
        // Feedback corto (elegido al azar) + siguiente pregunta
        const feedback =
          feedbacksSimulados[Math.floor(Math.random() * feedbacksSimulados.length)];
        texto = `${feedback} ${preguntasSimuladas[preguntaIndex]}`;
      }

      agregarMensajePantalla(texto, 'bot');
      historialMensajes.push({ role: 'assistant', content: texto });

      preguntaIndex++;
      resolve();
    }, 1200); // 1.2s de "pensando", igual de sensación que antes
  });
}

function agregarMensajePantalla(texto, clase) {
  const div = document.createElement('div');
  div.className = `mensaje ${clase}`;
  div.innerText = texto;
  historialChatDiv.appendChild(div);
  historialChatDiv.scrollTop = historialChatDiv.scrollHeight; // Auto-scroll abajo
}