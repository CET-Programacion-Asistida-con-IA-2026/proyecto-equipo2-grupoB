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
    alert('Completá todos los campos');
    return;
  }

  localStorage.setItem('usuario', JSON.stringify({ nombre, email, pass }));
  localStorage.setItem('logueada', 'true');
  window.location.href = '../index.html';
}

function login() {
  const email = document.getElementById('log-email').value;
  const pass = document.getElementById('log-pass').value;
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || usuario.email !== email || usuario.pass !== pass) {
    alert('Email o contraseña incorrectos');
    return;
  }

  localStorage.setItem('logueada', 'true');
  window.location.href = '../index.html';
}
