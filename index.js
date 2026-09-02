// ========================================
// TechSisterhood - script.js
// ========================================
window.addEventListener('load', () => {
  const logueada = localStorage.getItem('logueada');
  if (logueada) {
    const cp = document.querySelector('.contenido-protegido');
    if (cp) cp.style.display = 'block';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initToast();
  initJoinButtons();
  initStatsCounter();
  initFeatureCards();
  initSmoothScroll();
  initAuthCheck();
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
// Botones de unirse -> abren el modal de registro
// (unificado: antes había dos listeners separados
// que hacían cosas distintas sobre los mismos botones)
// ----------------------------------------
function initJoinButtons() {
  // Solo los botones de "Quiero unirme" (hero y CTA final).
  // "Iniciar sesión" queda afuera: ya tiene su propio onclick
  // en el HTML que redirige a login.html, no debe abrir el modal.
  const joinButtons = document.querySelectorAll(
    '#botonPrincipal, .cta-final .btn-primary'
  );

  joinButtons.forEach((btn) => {
    btn.addEventListener('click', abrirModal);
  });

  // Botón "Unirme a la comunidad"
  document.querySelectorAll('.community-text .btn-pink-outline').forEach((btn) => {
    // ya tiene onclick="abrirModalComunidad()" en el HTML, no se toca
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
    3: 'Te llevamos a la sección de Mercado laboral 👇'
  };

  const targets = {
    0: '#simulacros',
    1: '#community',
    3: '#mercado'
  };

  cards.forEach((card, i) => {
    // La tarjeta de LinkedIn (índice 2) queda afuera: su propia
    // flecha ya tiene onclick="abrirLinkedin()" en el HTML.
    // Si se agrega este listener también, al tocar la flecha
    // se disparaban el toast Y el modal al mismo tiempo.
    if (i === 2) return;

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

// ----------------------------------------
// Modal de registro / login
// ----------------------------------------
function abrirModal() {
  document.getElementById('modal').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modal').style.display = 'none';
}

function mostrarLogin() {
  document.getElementById('vista-registro').style.display = 'none';
  document.getElementById('vista-login').style.display = 'block';
}

function mostrarRegistro() {
  document.getElementById('vista-login').style.display = 'none';
  document.getElementById('vista-registro').style.display = 'block';
}

function registrar() {
  const nombre = document.getElementById('reg-nombre').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-pass').value;

  if (!nombre || !email || !pass) {
    showToast('Completá todos los campos');
    return;
  }

  // Nota: esto guarda la contraseña sin cifrar en localStorage.
  // Sirve para una demo, pero no para datos reales de usuarias.
  localStorage.setItem('usuario', JSON.stringify({ nombre, email, pass }));
  localStorage.setItem('logueada', 'true');
  cerrarModal();
  showToast(`¡Bienvenida, ${nombre}! 🎉`);
  const cp = document.querySelector('.contenido-protegido');
  if (cp) cp.style.display = 'block';
}

function login() {
  const email = document.getElementById('log-email').value;
  const pass = document.getElementById('log-pass').value;
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  if (!usuario || usuario.email !== email || usuario.pass !== pass) {
    showToast('Email o contraseña incorrectos');
    return;
  }

  localStorage.setItem('logueada', 'true');
  cerrarModal();
  showToast('¡Bienvenida de nuevo! 👋');
  const cp = document.querySelector('.contenido-protegido');
  if (cp) cp.style.display = 'block';
}

function initAuthCheck() {
  if (localStorage.getItem('logueada')) {
    const cp = document.querySelector('.contenido-protegido');
    if (cp) cp.style.display = 'block';
  }
}

// ----------------------------------------
// Modal de comunidad
// ----------------------------------------
function abrirModalComunidad() {
  document.getElementById('modal-comunidad').style.display = 'flex';
}

function cerrarModalComunidad() {
  document.getElementById('modal-comunidad').style.display = 'none';
}

function publicarComentario() {
  const usuario = document.getElementById('com-usuario').value.trim();
  const mensaje = document.getElementById('com-mensaje').value.trim();

  if (!usuario || !mensaje) {
    showToast('Completá tu nombre y mensaje');
    return;
  }

  const foro = document.querySelector('.forum-mockup');
  const colores = ['#e91e8c', '#7c3aed', '#0891b2', '#059669', '#d97706'];
  const color = colores[Math.floor(Math.random() * colores.length)];
  const inicial = usuario.charAt(0).toUpperCase();

  const nuevoPost = document.createElement('div');
  nuevoPost.className = 'forum-post';
  nuevoPost.style.animation = 'fadeIn 0.4s ease';
  nuevoPost.innerHTML = `
    <div class="avatar" style="background:${color}">${inicial}</div>
    <div class="post-body">
      <div><span class="post-user">${usuario}</span><span class="post-time">ahora</span></div>
      <div class="post-text">${mensaje}</div>
    </div>
  `;

  foro.insertBefore(nuevoPost, foro.firstChild);

  document.getElementById('com-usuario').value = '';
  document.getElementById('com-mensaje').value = '';
  cerrarModalComunidad();

  setTimeout(() => {
    showToast('¡Gracias por compartir! Tu mensaje ya está en la comunidad 💜');
  }, 300);
}

// ----------------------------------------
// Modal de LinkedIn
// ----------------------------------------
function abrirLinkedin() {
  document.getElementById('modal-linkedin').style.display = 'flex';
}

function cerrarLinkedin() {
  document.getElementById('modal-linkedin').style.display = 'none';
}

function verificarChecklist() {
  const checks = document.querySelectorAll('.linkedin-checklist input[type="checkbox"]');
  const total = checks.length;
  const completados = [...checks].filter(c => c.checked).length;

  const porcentaje = (completados / total) * 100;
  document.getElementById('progreso-fill').style.width = porcentaje + '%';
  document.getElementById('progreso-texto').textContent = `${completados}/${total} completados`;

  document.getElementById('btn-guia').style.display =
    completados === total ? 'block' : 'none';
}

// ----------------------------------------
// Helper para acciones que requieren estar logueada
// (no se usa todavía en el HTML, queda disponible)
// ----------------------------------------
function accionProtegida(callback) {
  const logueada = localStorage.getItem('logueada');
  if (!logueada) {
    abrirModal();
  } else {
    callback();
  }
}

function irSimulacro() {
  accionProtegida(() => {
    window.location.href = 'btnsimulacro/btn.html';
  });
}