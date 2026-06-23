// ========================================
// TechSisterhood - script.js
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initToast();
  initNavCTAs();
  initStatsCounter();
  initFeatureCards();
  initSimulacro();
  initSmoothScroll();
});

// ----------------------------------------
// Toast simple para confirmar acciones
// ----------------------------------------
function initToast() {
  const toast = document.createElement('div');
  toast.className = 'nav-toast';
  toast.textContent = '';
  document.body.appendChild(toast);

  window.showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };
}

// ----------------------------------------
// Botones tipo CTA ("Quiero unirme", etc.)
// ----------------------------------------
function initNavCTAs() {
  const joinButtons = document.querySelectorAll(
    '.nav-cta, .btn-primary, .btn-outline'
  );

  joinButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim().toLowerCase();

      if (text.includes('unirme')) {
        showToast('¡Gracias por tu interés! Pronto vas a poder registrarte 💖');
      } else if (text.includes('conocer')) {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      } else if (text.includes('simulacro')) {
        startSimulacro();
      }
    });
  });

  // Botón "Unirme a la comunidad"
  const joinCommunityBtn = document.getElementById('join-community-btn');
  joinCommunityBtn?.addEventListener('click', () => {
    showToast('¡Bienvenida al foro! Pronto vas a poder publicar 🚀');
  });

  // Botón final
  const ctaFinalBtn = document.getElementById('cta-final-btn');
  ctaFinalBtn?.addEventListener('click', () => {
    showToast('¡Listo! Te vamos a contactar para que empieces 🙌');
  });
}

// ----------------------------------------
// Animación de contadores en sección "problem"
// ----------------------------------------
function initStatsCounter() {
  const nums = document.querySelectorAll('.stat-box .num');
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  nums.forEach((num) => observer.observe(num));
}

// ----------------------------------------
// Tarjetas de features clickeables
// ----------------------------------------
function initFeatureCards() {
  const cards = document.querySelectorAll('.feature-card');

  const messages = {
    0: 'Te llevamos a la sección de Simulacros 👇',
    1: 'Te llevamos a la sección de Comunidad 👇',
    2: 'Próximamente: guía de LinkedIn paso a paso ✍️',
    3: 'Te llevamos a la sección de Mercado laboral 👇'
  };

  const targets = {
    0: '#simulacros',
    1: '#community',
    2: null,
    3: '#mercado'
  };

  cards.forEach((card, i) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      showToast(messages[i]);
      const target = targets[i];
      if (target) {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ----------------------------------------
// Simulacro de entrevista interactivo
// ----------------------------------------
const simulacroQuestions = [
  {
    question: '¿Qué diferencia hay entre let, const y var en JavaScript?',
    answer: '“let” y “const” tienen scope de bloque, mientras que “var” tiene scope de función. “const” no permite reasignación, “let” sí. “var” además sufre hoisting con valor undefined.'
  },
  {
    question: '¿Qué es una API REST y qué métodos HTTP conocés?',
    answer: 'Una API REST expone recursos a través de URLs y usa métodos HTTP como GET, POST, PUT, PATCH y DELETE para operar sobre esos recursos de forma estándar.'
  },
  {
    question: '¿Cómo manejarías el estado en una app de React?',
    answer: 'Para estado local uso useState o useReducer. Para estado compartido entre componentes, Context API o librerías como Redux o Zustand, dependiendo de la complejidad.'
  },
  {
    question: '¿Qué es la normalización en bases de datos?',
    answer: 'Es el proceso de organizar las tablas para reducir la redundancia de datos y mejorar la integridad, dividiendo la información en tablas relacionadas mediante claves.'
  }
];

let simulacroIndex = 0;
let simulacroRunning = false;

function initSimulacro() {
  const btn = document.getElementById('simulacro-btn');
  btn?.addEventListener('click', startSimulacro);
}

function startSimulacro() {
  const chatMockup = document.getElementById('chat-mockup');
  if (!chatMockup) return;

  if (simulacroRunning) {
    showToast('El simulacro ya está en curso 👀');
    return;
  }

  simulacroRunning = true;
  simulacroIndex = 0;

  // Limpiar burbujas previas, dejando solo el header
  const header = chatMockup.querySelector('.chat-header');
  chatMockup.innerHTML = '';
  chatMockup.appendChild(header);

  showToast('¡Arrancó el simulacro de entrevista! 🎤');
  nextSimulacroQuestion(chatMockup);
}

function nextSimulacroQuestion(chatMockup) {
  if (simulacroIndex >= simulacroQuestions.length) {
    const endBubble = document.createElement('div');
    endBubble.className = 'chat-bubble bubble-recruiter';
    endBubble.textContent = '¡Excelente! Eso fue todo por hoy. Seguí practicando, vas muy bien 💪';
    chatMockup.appendChild(endBubble);
    simulacroRunning = false;
    return;
  }

  const current = simulacroQuestions[simulacroIndex];

  // Pregunta del recruiter
  const questionBubble = document.createElement('div');
  questionBubble.className = 'chat-bubble bubble-recruiter';
  questionBubble.textContent = current.question;
  chatMockup.appendChild(questionBubble);

  // Indicador de "escribiendo..."
  const typingBubble = document.createElement('div');
  typingBubble.className = 'chat-bubble bubble-user typing';
  typingBubble.innerHTML = '<span></span><span></span><span></span>';
  chatMockup.appendChild(typingBubble);

  setTimeout(() => {
    typingBubble.remove();

    const answerBubble = document.createElement('div');
    answerBubble.className = 'chat-bubble bubble-user';
    answerBubble.textContent = current.answer;
    chatMockup.appendChild(answerBubble);

    simulacroIndex++;
    setTimeout(() => nextSimulacroQuestion(chatMockup), 1400);
  }, 1500);
}

// ----------------------------------------
// Scroll suave para enlaces del nav
// ----------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('nav ul a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}