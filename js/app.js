// =====================================================================
//  MdP · Memorias de Peón · app.js  — pantallas y navegación
//  by Manuel Esteve
// =====================================================================
import * as D from './datos.js';
import { crearVisor, crearEditor, dePgn, aPgn, ejemploVacio, usarFiguras, escapar as esc } from './tablero.js';

export const VERSION = '1.0.0 (fase 1A)';
const app = document.getElementById('app');

// ---------------------------------------------------------------------
//  Iconos (trazo fino, 24×24)
// ---------------------------------------------------------------------
const P = {
  inicio: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  conceptos: 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11M9 8h6',
  repertorio: 'M6 3v18M6 8h5a4 4 0 014 4v9M15 3v5',
  entrenar: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z',
  clases: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  ajustes: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  nube: 'M7 18a4.5 4.5 0 01-.6-9A6 6 0 0118 10a4 4 0 01-1 8z',
  mas: 'M12 5v14M5 12h14',
  buscar: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4',
  atras: 'M15 5l-7 7 7 7',
  editar: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  borrar: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  enlace: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
  externo: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  flecha: 'M9 6l6 6-6 6',
  bandeja: 'M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6H3v-6z',
  subir: 'M12 16V5M7 10l5-5 5 5M5 19h14',
  arriba: 'M6 15l6-6 6 6', abajo: 'M6 9l6 6 6-6',
  rayo: 'M13 2L4 14h7l-1 8 9-12h-7z',
  corona: 'M3 19h18M4 8l4 4 4-7 4 7 4-4-2 11H6z',
  peon: 'M12 3a3 3 0 100 6 3 3 0 000-6zM9.5 10h5L14 16h-4zM7 21h10l-1.5-5h-7z',
  brujula: 'M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z',
  libro: 'M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v14',
  bandera: 'M5 21V4M5 4h12l-2.5 4L17 12H5',
  martillo: 'M14 3l7 7-3 3-7-7zM11.5 8.5L3 17l4 4 8.5-8.5',
  ojo: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  reloj: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 3',
  check: 'M5 12l5 5 9-10',
};
const ico = (n, c = '') => `<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n] || P.libro}"/></svg>`;

const COLORES = {
  rojo: '#c0392b', coral: '#d4663a', violeta: '#6d5bd0', azul: '#2f6fb5', verde: '#4a8a3a',
  ambar: '#c98a12', teal: '#198a7a', rosa: '#c2456e', gris: '#6e6a62',
};
const ICONOS_BLOQUE = ['rayo', 'corona', 'peon', 'brujula', 'libro', 'bandera', 'martillo', 'ojo', 'reloj'];
const col = c => COLORES[c] || COLORES.violeta;

// ---------------------------------------------------------------------
//  Utilidades
// ---------------------------------------------------------------------
const inl = s => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
function md(texto) {
  let html = '', lista = false;
  for (const l of esc(texto || '').split('\n')) {
    if (/^\s*[-•]\s+/.test(l)) {
      if (!lista) { html += '<ul>'; lista = true; }
      html += `<li>${inl(l.replace(/^\s*[-•]\s+/, ''))}</li>`;
    } else {
      if (lista) { html += '</ul>'; lista = false; }
      if (l.trim()) html += `<p>${inl(l)}</p>`;
    }
  }
  return html + (lista ? '</ul>' : '');
}
const ordenar = (a, b) => (a.orden ?? 0) - (b.orden ?? 0) || String(a.nombre || a.titulo).localeCompare(b.nombre || b.titulo, 'es');
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const ir = h => { location.hash = h; };
function aviso(texto) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = texto;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('fuera'), 2200);
  setTimeout(() => t.remove(), 2700);
}

// ---------------------------------------------------------------------
//  Consultas sobre los datos
// ---------------------------------------------------------------------
const bloques = () => D.lista('bloques').filter(b => !b.padre_id).sort(ordenar);
const bloquesActivos = () => bloques().filter(b => b.activo);
const temasDe = (id, soloActivos) => D.lista('bloques').filter(t => t.padre_id === id && (!soloActivos || t.activo)).sort(ordenar);
const conceptos = () => D.lista('conceptos');
function bloqueRaiz(id) {
  const b = id && D.obtener('bloques', id);
  return b ? (b.padre_id ? D.obtener('bloques', b.padre_id) : b) : null;
}
const conceptosDeBloque = id => {
  const ids = new Set([id, ...temasDe(id).map(t => t.id)]);
  return conceptos().filter(c => ids.has(c.bloque_id));
};
const ejemplosDe = id => D.lista('ejemplos').filter(e => e.concepto_id === id).sort(ordenar);
function relacionados(id) {
  return D.lista('enlaces_conceptos')
    .filter(e => e.concepto_a === id || e.concepto_b === id)
    .map(e => D.obtener('conceptos', e.concepto_a === id ? e.concepto_b : e.concepto_a))
    .filter(Boolean);
}

// ---------------------------------------------------------------------
//  Ajustes (tema, tablero, notación…)
// ---------------------------------------------------------------------
const AJ_DEF = { tema: 'auto', tablero: 'madera', notacion: 'letras', lichess: '', subida: true };
let usuario = null;
const ajustes = () => Object.assign({}, AJ_DEF, (usuario && D.obtener('ajustes', usuario.id)?.datos) || {});
async function guardarAjustes(cambios) {
  const fila = (usuario && D.obtener('ajustes', usuario.id)) || { user_id: usuario.id, datos: {} };
  fila.datos = Object.assign({}, fila.datos, cambios);
  await D.guardar('ajustes', fila);
  aplicarAjustes();
}
function aplicarAjustes() {
  const a = ajustes();
  document.documentElement.dataset.tema = a.tema;
  document.documentElement.dataset.tablero = a.tablero;
  usarFiguras(a.notacion === 'figuras');
  D.ponerSubidaAutomatica(a.subida);
  localStorage.setItem('mdp-aspecto', JSON.stringify({ tema: a.tema, tablero: a.tablero }));
  const oscuro = a.tema === 'oscuro' || (a.tema === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', oscuro ? '#161512' : '#f4f0e8');
}

// ---------------------------------------------------------------------
//  Estructura: cabecera, contenido y barra inferior
// ---------------------------------------------------------------------
let limpiezas = [];
let editando = false;
const limpiar = () => { limpiezas.forEach(f => { try { f(); } catch (e) {} }); limpiezas = []; };

function marco() {
  app.innerHTML = `
    <header class="cab">
      <a href="#/inicio" class="marca" aria-label="Inicio">
        <span class="mono">M<i>d</i>P</span>
        <span class="marca-txt"><b>Memorias de Peón</b><small>Casilla a casilla</small></span>
      </a>
      <button class="sync" id="sync"></button>
      <a href="#/ajustes" class="btn-ico" aria-label="Ajustes">${ico('ajustes')}</a>
    </header>
    <main id="vista"></main>
    <nav class="barra">
      ${[['inicio', 'Inicio'], ['conceptos', 'Conceptos'], ['repertorio', 'Repertorio'], ['entrenar', 'Entrenar'], ['clases', 'Clases']]
        .map(([r, t]) => `<a href="#/${r}" data-r="${r}">${ico(r)}<span>${t}</span></a>`).join('')}
    </nav>`;
  document.getElementById('sync').addEventListener('click', async () => {
    if (D.estadoSync.error && /Entra/.test(D.estadoSync.error)) return ir('#/entrar');
    if (!navigator.onLine) return aviso('Sin conexión: los cambios están guardados en el dispositivo');
    const ok = await D.sincronizar();
    aviso(ok ? 'Todo guardado en la nube' : (D.estadoSync.error || 'No se pudo sincronizar'));
  });
  pintarSync();
}

function pintarSync() {
  const b = document.getElementById('sync');
  if (!b) return;
  const n = D.pendientes();
  let txt, cls;
  if (D.estadoSync.enCurso) { txt = 'Guardando…'; cls = 'curso'; }
  else if (!navigator.onLine) { txt = n ? `Sin conexión · ${n}` : 'Sin conexión'; cls = 'off'; }
  else if (D.estadoSync.error) { txt = /Entra/.test(D.estadoSync.error) ? 'Entrar' : 'Reintentar'; cls = 'error'; }
  else if (n) { txt = `Subir ${n}`; cls = 'pend'; }
  else { txt = 'Al día'; cls = 'ok'; }
  b.className = 'sync ' + cls;
  b.innerHTML = `${ico(cls === 'pend' ? 'subir' : cls === 'ok' ? 'check' : 'nube')}<span>${txt}</span>`;
  b.title = n ? `${n} cambios guardados en el dispositivo, sin subir aún` : 'Todo está en la nube';
}

// ---------------------------------------------------------------------
//  Rutas
// ---------------------------------------------------------------------
const RUTAS = {
  inicio: vInicio, conceptos: vConceptos, bloque: vBloque, concepto: vConcepto, editar: vEditarConcepto,
  ejemplo: vEjemplo, catalogo: vCatalogo, entrenar: vEntrenar, ajustes: vAjustes,
  repertorio: () => vPronto('Repertorio', 'Tus aperturas con blancas y negras en árbol de variantes, con ideas, planes y entrenamiento. Llega en la fase 3.'),
  clases: () => vPronto('Diario de clases', 'Cada clase con su fecha, lo que se vio, los conceptos de ese día y los deberes. Llega en la fase 1B, junto con la nota rápida.'),
};

function pintar(conservarScroll) {
  if (!usuario) return;
  const scroll = window.scrollY;
  limpiar();
  editando = false;
  const [ruta, q] = (location.hash.slice(2) || 'inicio').split('?');
  const [nombre, id] = ruta.split('/');
  if (nombre === 'entrar') return vEntrar(true);
  if (!document.getElementById('vista')) marco();
  // Contenedor nuevo en cada pantalla: así no se acumulan eventos.
  const viejo = document.getElementById('vista');
  const vista = viejo.cloneNode(false);
  viejo.replaceWith(vista);
  document.querySelectorAll('.barra a').forEach(a => {
    const r = a.dataset.r;
    a.classList.toggle('on', r === nombre || (r === 'conceptos' && ['bloque', 'concepto', 'editar', 'ejemplo', 'catalogo'].includes(nombre)));
  });
  (RUTAS[nombre] || vInicio)(vista, id, new URLSearchParams(q || ''));
  window.scrollTo(0, conservarScroll === true ? scroll : 0);
  pintarSync();
}

// ---------------------------------------------------------------------
//  ENTRAR
// ---------------------------------------------------------------------
function vEntrar(reentrar = false) {
  limpiar();
  const guardado = JSON.parse(localStorage.getItem('mdp-usuario') || 'null');
  app.innerHTML = `
    <div class="entrar">
      <div class="logo-grande"><span class="mono">M<i>d</i>P</span></div>
      <h1 class="titulo-app">Memorias de Peón</h1>
      <p class="lema">Casilla a casilla</p>
      <form id="f-entrar" class="tarjeta">
        <label>Correo<input type="email" name="email" autocomplete="username" required value="${esc(guardado?.email || '')}"></label>
        <label>Contraseña<input type="password" name="clave" autocomplete="current-password" required></label>
        <p class="error" hidden></p>
        <button class="btn primario" type="submit">Entrar</button>
        ${reentrar && usuario ? '<a href="#/inicio" class="btn">Seguir sin conexión</a>' : ''}
      </form>
      <p class="firma">by Manuel Esteve</p>
    </div>`;
  document.getElementById('f-entrar').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, err = f.querySelector('.error'), btn = f.querySelector('button');
    if (!navigator.onLine) { err.textContent = 'Para entrar la primera vez necesitas conexión.'; err.hidden = false; return; }
    btn.disabled = true; btn.textContent = 'Entrando…'; err.hidden = true;
    const { data, error } = await D.sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.clave.value });
    if (error) {
      err.textContent = /Invalid login/i.test(error.message) ? 'Correo o contraseña incorrectos.' : error.message;
      err.hidden = false; btn.disabled = false; btn.textContent = 'Entrar';
      return;
    }
    const u = { id: data.user.id, email: data.user.email };
    if (guardado && guardado.id !== u.id) await D.borrarTodoLocal();
    localStorage.setItem('mdp-usuario', JSON.stringify(u));
    await iniciarSesion(u);
    location.hash = '#/inicio';
  });
}

async function iniciarSesion(u) {
  usuario = u;
  D.ponerUsuario(u.id);
  aplicarAjustes();
  marco();
  pintar();
  if (!navigator.onLine) return;
  try {
    if (!D.lista('bloques').length) {
      await D.sembrarCatalogo();
    }
  } catch (e) { console.error(e); }
  await D.sincronizar();
}

// ---------------------------------------------------------------------
//  INICIO
// ---------------------------------------------------------------------
function conceptoDelDia() {
  const lista = conceptos().sort((a, b) => a.id.localeCompare(b.id));
  if (!lista.length) return null;
  const hoy = new Date().toISOString().slice(0, 10);
  let h = 0;
  for (const c of hoy) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return lista[h % lista.length];
}

function saludo() {
  const h = new Date().getHours();
  return h < 7 ? 'Buenas noches' : h < 14 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
}

function filaConcepto(c) {
  const b = bloqueRaiz(c.bloque_id);
  return `<a class="fila-c" href="#/concepto/${c.id}">
      <span class="punto" style="--c:${b ? col(b.color) : 'var(--suave)'}"></span>
      <span class="fila-txt"><b>${esc(c.titulo)}</b>${c.principio ? `<small>${esc(c.principio)}</small>` : ''}</span>
      ${ico('flecha', 'peq')}
    </a>`;
}

function vInicio(v) {
  const dia = conceptoDelDia();
  const recientes = conceptos().sort((a, b) => String(b.editado_en).localeCompare(String(a.editado_en))).slice(0, 5);
  const nEj = D.lista('ejemplos').length;
  const b = dia && bloqueRaiz(dia.bloque_id);
  v.innerHTML = `
    <h1 class="saludo">${saludo()}, Manuel</h1>
    ${dia ? `
      <a class="tarjeta dia" href="#/concepto/${dia.id}" style="--c:${b ? col(b.color) : 'var(--acento)'}">
        <span class="etq">Concepto del día${b ? ' · ' + esc(b.nombre) : ''}</span>
        <h2>${esc(dia.titulo)}</h2>
        ${dia.principio ? `<blockquote>${esc(dia.principio)}</blockquote>` : ''}
        <span class="mas-txt">Repasar ${ico('flecha', 'peq')}</span>
      </a>` : `
      <div class="tarjeta dia vacia">
        <span class="etq">Empieza aquí</span>
        <h2>Tu primera ficha</h2>
        <p>Elige los bloques con los que vas a trabajar y apunta el primer concepto de tus clases.</p>
        <a class="btn primario" href="#/${bloquesActivos().length ? 'editar/nuevo' : 'catalogo'}">${bloquesActivos().length ? 'Crear ficha' : 'Elegir bloques'}</a>
      </div>`}
    <div class="acciones">
      <a class="accion" href="#/editar/nuevo">${ico('mas')}<span>Nueva ficha</span></a>
      <a class="accion" href="https://lichess.org/storm" target="_blank" rel="noopener">${ico('rayo')}<span>Calentar</span></a>
      <a class="accion" href="#/entrenar">${ico('entrenar')}<span>Entrenar</span></a>
    </div>
    <div class="cifras">
      <div><b>${conceptos().length}</b><span>fichas</span></div>
      <div><b>${nEj}</b><span>ejemplos</span></div>
      <div><b>${bloquesActivos().length}</b><span>bloques</span></div>
    </div>
    ${recientes.length ? `<h3 class="sec">Últimas fichas</h3><div class="lista">${recientes.map(filaConcepto).join('')}</div>` : ''}`;
}

// ---------------------------------------------------------------------
//  CONCEPTOS: bloques activos, Bandeja y buscador
// ---------------------------------------------------------------------
function vConceptos(v, _id, q) {
  const activos = bloquesActivos();
  const bandeja = conceptos().filter(c => !c.bloque_id);
  v.innerHTML = `
    <div class="cab-vista"><h1>Conceptos</h1>
      <a class="btn peq" href="#/catalogo">Bloques</a>
    </div>
    <label class="buscador">${ico('buscar')}<input type="search" id="buscar" placeholder="Buscar: enfilada, peón aislado…" value="${esc(q.get('q') || '')}"></label>
    <div id="resultados"></div>
    <div id="bloques">
      ${activos.length ? '' : `
        <div class="tarjeta vacia">
          <h2>Elige tus bloques</h2>
          <p>Tienes un catálogo de 9 bloques y 40 temas preparado, todo en reserva. Activa los que vayas a usar; el resto queda guardado.</p>
          <a class="btn primario" href="#/catalogo">Abrir el catálogo</a>
        </div>`}
      <div class="rejilla">
        ${activos.map(b => {
          const n = conceptosDeBloque(b.id).length;
          return `<a class="bloque" href="#/bloque/${b.id}" style="--c:${col(b.color)}">
            <span class="bl-ico">${ico(b.icono)}</span>
            <b>${esc(b.nombre)}</b><small>${n} ${n === 1 ? 'ficha' : 'fichas'}</small></a>`;
        }).join('')}
        <a class="bloque bandeja" href="#/bloque/bandeja" style="--c:var(--suave)">
          <span class="bl-ico">${ico('bandeja')}</span>
          <b>Bandeja</b><small>${bandeja.length} sin clasificar</small></a>
      </div>
      <a class="btn flotante" href="#/editar/nuevo" aria-label="Nueva ficha">${ico('mas')}</a>
    </div>`;
  const inp = v.querySelector('#buscar');
  const buscar = () => {
    const t = norm(inp.value.trim());
    v.querySelector('#bloques').hidden = !!t;
    if (!t) { v.querySelector('#resultados').innerHTML = ''; return; }
    const res = conceptos().filter(c => norm([c.titulo, c.principio, c.explicacion, (c.etiquetas || []).join(' ')].join(' ')).includes(t));
    v.querySelector('#resultados').innerHTML = res.length
      ? `<div class="lista">${res.map(filaConcepto).join('')}</div>`
      : `<p class="nada">No hay fichas con «${esc(inp.value)}».</p>`;
  };
  inp.addEventListener('input', buscar);
  buscar();
}

// ---------------------------------------------------------------------
//  BLOQUE: sus temas (plegables) y fichas
// ---------------------------------------------------------------------
function vBloque(v, id) {
  if (id === 'bandeja') {
    const lista = conceptos().filter(c => !c.bloque_id).sort(ordenar);
    v.innerHTML = `
      <div class="cab-vista"><a href="#/conceptos" class="btn-ico">${ico('atras')}</a><h1>Bandeja</h1></div>
      <p class="intro">Fichas aún sin clasificar. Ábrelas y elige su bloque cuando tengas un rato.</p>
      ${lista.length ? `<div class="lista">${lista.map(filaConcepto).join('')}</div>` : '<p class="nada">La bandeja está vacía.</p>'}
      <a class="btn flotante" href="#/editar/nuevo?bloque=bandeja" aria-label="Nueva ficha">${ico('mas')}</a>`;
    return;
  }
  const b = D.obtener('bloques', id);
  if (!b) return ir('#/conceptos');
  const temas = temasDe(id, true);
  const todas = conceptosDeBloque(id).sort(ordenar);
  const idsTemas = new Set(temas.map(t => t.id));
  const sueltas = todas.filter(c => !idsTemas.has(c.bloque_id));
  const plegados = JSON.parse(localStorage.getItem('mdp-plegados') || '{}');
  const grupo = (t, lista) => `
    <section class="grupo${plegados[t.id] ? ' plegado' : ''}" data-id="${t.id}">
      <button class="grupo-cab"><span>${esc(t.nombre)}</span><small>${lista.length}</small>${ico('abajo', 'peq')}</button>
      <div class="grupo-cuerpo">
        ${lista.length ? `<div class="lista">${lista.map(filaConcepto).join('')}</div>` : '<p class="nada peq">Sin fichas todavía.</p>'}
        <a class="anadir" href="#/editar/nuevo?bloque=${t.id}">${ico('mas', 'peq')} Ficha en «${esc(t.nombre)}»</a>
      </div>
    </section>`;
  v.innerHTML = `
    <div class="cab-vista color" style="--c:${col(b.color)}">
      <a href="#/conceptos" class="btn-ico">${ico('atras')}</a>
      <span class="bl-ico">${ico(b.icono)}</span><h1>${esc(b.nombre)}</h1>
    </div>
    ${b.descripcion ? `<p class="intro">${esc(b.descripcion)}</p>` : ''}
    ${temas.map(t => grupo(t, todas.filter(c => c.bloque_id === t.id))).join('')}
    ${sueltas.length || !temas.length ? grupo({ id: 'suelto-' + id, nombre: temas.length ? 'Sin tema' : 'Fichas' }, sueltas).replace(`?bloque=suelto-${id}`, `?bloque=${id}`) : ''}
    ${!temas.length ? '' : `<p class="nota">¿Te falta un tema? Actívalo o créalo en <a href="#/catalogo?abrir=${id}">Bloques</a>.</p>`}
    <a class="btn flotante" href="#/editar/nuevo?bloque=${id}" aria-label="Nueva ficha">${ico('mas')}</a>`;
  v.querySelectorAll('.grupo-cab').forEach(btn => btn.addEventListener('click', () => {
    const s = btn.parentElement; s.classList.toggle('plegado');
    plegados[s.dataset.id] = s.classList.contains('plegado');
    localStorage.setItem('mdp-plegados', JSON.stringify(plegados));
  }));
}

// ---------------------------------------------------------------------
//  FICHA DE CONCEPTO
// ---------------------------------------------------------------------
const LICHESS_TEMAS = [
  ['', 'Ninguno'],
  ['mateIn1', 'Mate en 1'], ['mateIn2', 'Mate en 2'], ['mateIn3', 'Mate en 3'], ['mateIn4', 'Mate en 4'],
  ['backRankMate', 'Mate del pasillo'], ['smotheredMate', 'Mate de la coz'], ['anastasiaMate', 'Mate de Anastasia'],
  ['arabianMate', 'Mate árabe'], ['bodenMate', 'Mate de Boden'], ['doubleBishopMate', 'Mate de los dos alfiles'],
  ['hookMate', 'Mate del gancho'], ['dovetailMate', 'Mate de la cola de golondrina'],
  ['pin', 'Clavada'], ['skewer', 'Enfilada'], ['fork', 'Ataque doble'], ['discoveredAttack', 'Ataque descubierto'],
  ['doubleCheck', 'Jaque doble'], ['xRayAttack', 'Rayos X'], ['hangingPiece', 'Pieza colgada'],
  ['trappedPiece', 'Pieza atrapada'], ['deflection', 'Desviación'], ['attraction', 'Atracción'],
  ['interference', 'Interferencia'], ['clearance', 'Despeje'], ['intermezzo', 'Jugada intermedia'],
  ['capturingDefender', 'Eliminar al defensor'], ['sacrifice', 'Sacrificio'], ['quietMove', 'Jugada tranquila'],
  ['defensiveMove', 'Jugada defensiva'], ['zugzwang', 'Zugzwang'], ['exposedKing', 'Rey expuesto'],
  ['kingsideAttack', 'Ataque al flanco de rey'], ['queensideAttack', 'Ataque al flanco de dama'],
  ['advancedPawn', 'Peón avanzado'], ['promotion', 'Coronación'], ['underPromotion', 'Subpromoción'],
  ['opening', 'Apertura'], ['middlegame', 'Medio juego'], ['endgame', 'Final'],
  ['pawnEndgame', 'Final de peones'], ['rookEndgame', 'Final de torres'], ['bishopEndgame', 'Final de alfiles'],
  ['knightEndgame', 'Final de caballos'], ['queenEndgame', 'Final de damas'],
];
const nombreTemaLichess = k => (LICHESS_TEMAS.find(t => t[0] === k) || [k, k])[1];

function vConcepto(v, id) {
  const c = D.obtener('conceptos', id);
  if (!c) return ir('#/conceptos');
  const b = bloqueRaiz(c.bloque_id);
  const tema = c.bloque_id && D.obtener('bloques', c.bloque_id)?.padre_id ? D.obtener('bloques', c.bloque_id) : null;
  const ejemplos = ejemplosDe(id);
  const rel = relacionados(id);
  const volver = b ? `#/bloque/${b.id}` : '#/bloque/bandeja';
  v.innerHTML = `
    <div class="cab-vista">
      <a href="${volver}" class="btn-ico" aria-label="Volver">${ico('atras')}</a>
      <span class="hueco"></span>
      <a href="#/editar/${id}" class="btn peq">${ico('editar', 'peq')} Editar</a>
    </div>
    <article class="ficha" style="--c:${b ? col(b.color) : 'var(--suave)'}">
      <span class="etq-bloque">${b ? esc(b.nombre) + (tema ? ' · ' + esc(tema.nombre) : '') : 'Bandeja'}</span>
      <h1 class="ficha-tit">${esc(c.titulo)}</h1>
      ${c.principio ? `<blockquote class="principio">${esc(c.principio)}</blockquote>` : ''}
      ${c.explicacion ? `<div class="md">${md(c.explicacion)}</div>` : ''}
      ${(c.etiquetas || []).length ? `<div class="chips">${c.etiquetas.map(t => `<a class="chip" href="#/conceptos?q=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</div>` : ''}
    </article>
    <h3 class="sec">Ejemplos <small>${ejemplos.length || ''}</small></h3>
    <div class="ejemplos">
      ${ejemplos.map((e, i) => `
        <div class="tarjeta ejemplo">
          <div class="ej-cab"><b>${esc(e.titulo || 'Ejemplo ' + (i + 1))}</b>
            <a href="#/ejemplo/${e.id}" class="btn-ico peq" aria-label="Editar ejemplo">${ico('editar')}</a></div>
          <div class="visor" data-ej="${e.id}"></div>
        </div>`).join('')}
      <a class="anadir grande" href="#/ejemplo/nuevo?concepto=${id}">${ico('mas', 'peq')} Añadir ejemplo en el tablero</a>
    </div>
    ${c.practica_lichess ? `
      <a class="tarjeta practicar" href="https://lichess.org/training/${encodeURIComponent(c.practica_lichess)}" target="_blank" rel="noopener">
        ${ico('entrenar')}<span><b>Practicar en Lichess</b><small>Puzzles de ${esc(nombreTemaLichess(c.practica_lichess))}</small></span>${ico('externo', 'peq')}
      </a>` : ''}
    ${rel.length ? `<h3 class="sec">Relacionado</h3><div class="chips">${rel.map(r => `<a class="chip" href="#/concepto/${r.id}">${ico('enlace', 'peq')} ${esc(r.titulo)}</a>`).join('')}</div>` : ''}`;
  v.querySelectorAll('.visor').forEach(el => {
    const e = D.obtener('ejemplos', el.dataset.ej);
    try {
      const vis = crearVisor(el, dePgn(e.pgn || (e.fen_inicial ? `[FEN "${e.fen_inicial}"]` : '')), { orientacion: e.orientacion });
      limpiezas.push(vis.cerrar);
    } catch (err) {
      console.error(err);
      el.innerHTML = '<p class="error">No se pudo dibujar este ejemplo.</p>';
    }
  });
}

// ---------------------------------------------------------------------
//  EDITAR / NUEVA FICHA
// ---------------------------------------------------------------------
function opcionesBloque(actual) {
  const activos = bloquesActivos();
  const raiz = bloqueRaiz(actual);
  if (raiz && !activos.find(b => b.id === raiz.id)) activos.push(raiz);
  return `<option value="">Bandeja (sin clasificar)</option>` +
    activos.map(b => `<option value="${b.id}" ${raiz && raiz.id === b.id ? 'selected' : ''}>${esc(b.nombre)}${b.activo ? '' : ' (en reserva)'}</option>`).join('');
}
function opcionesTema(bloqueId, actual) {
  if (!bloqueId) return '';
  const temas = temasDe(bloqueId, true);
  const t = actual && D.obtener('bloques', actual);
  if (t && t.padre_id === bloqueId && !temas.find(x => x.id === t.id)) temas.push(t);
  return `<option value="">Sin tema</option>` + temas.map(x => `<option value="${x.id}" ${actual === x.id ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('');
}

function vEditarConcepto(v, id, q) {
  editando = true;
  const nuevo = id === 'nuevo';
  const c = nuevo ? { titulo: '', principio: '', explicacion: '', etiquetas: [], practica_lichess: '', bloque_id: null } : D.obtener('conceptos', id);
  if (!c) return ir('#/conceptos');
  if (nuevo && q.get('bloque') && q.get('bloque') !== 'bandeja') c.bloque_id = q.get('bloque');
  const raiz = bloqueRaiz(c.bloque_id);
  const temaId = c.bloque_id && D.obtener('bloques', c.bloque_id)?.padre_id ? c.bloque_id : '';
  const relIds = new Set(nuevo ? [] : relacionados(id).map(r => r.id));
  const otros = conceptos().filter(x => x.id !== id).sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
  v.innerHTML = `
    <div class="cab-vista">
      <a href="${nuevo ? 'javascript:history.back()' : '#/concepto/' + id}" class="btn-ico" aria-label="Cancelar">${ico('atras')}</a>
      <h1>${nuevo ? 'Nueva ficha' : 'Editar ficha'}</h1>
    </div>
    <form id="f-concepto" class="form">
      <label>Concepto<input name="titulo" required maxlength="120" placeholder="Peón aislado central" value="${esc(c.titulo)}"></label>
      <div class="dos">
        <label>Bloque<select name="bloque">${opcionesBloque(c.bloque_id)}</select></label>
        <label>Tema<select name="tema" ${raiz ? '' : 'disabled'}>${opcionesTema(raiz?.id, temaId)}</select></label>
      </div>
      <label>Principio <small>la frase clave, la que quieres recordar</small>
        <input name="principio" maxlength="200" placeholder="Todo peón propio es un obstáculo" value="${esc(c.principio || '')}"></label>
      <label>Explicación <small>**negrita**, *cursiva* y listas empezando con «- »</small>
        <textarea name="explicacion" rows="7" placeholder="Lo que te explicó el maestro, con tus palabras">${esc(c.explicacion || '')}</textarea></label>
      <label>Etiquetas <small>separadas por comas</small>
        <input name="etiquetas" placeholder="medio juego, estructura" value="${esc((c.etiquetas || []).join(', '))}"></label>
      <label>Practicar en Lichess
        <select name="practica">${LICHESS_TEMAS.map(([k, t]) => `<option value="${k}" ${c.practica_lichess === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      ${otros.length ? `
        <fieldset class="rel"><legend>Relacionar con</legend>
          <input type="search" class="filtro-rel" placeholder="Filtrar fichas…">
          <div class="rel-lista">
            ${otros.map(o => `<label class="check"><input type="checkbox" value="${o.id}" ${relIds.has(o.id) ? 'checked' : ''}><span>${esc(o.titulo)}</span></label>`).join('')}
          </div>
        </fieldset>` : ''}
      <div class="botones">
        <button class="btn primario" type="submit">Guardar</button>
        ${nuevo ? '' : `<button class="btn peligro" type="button" id="borrar">${ico('borrar', 'peq')} Borrar ficha</button>`}
      </div>
    </form>`;
  const f = v.querySelector('#f-concepto');
  f.bloque.addEventListener('change', () => {
    f.tema.innerHTML = opcionesTema(f.bloque.value, '');
    f.tema.disabled = !f.bloque.value;
  });
  v.querySelector('.filtro-rel')?.addEventListener('input', e => {
    const t = norm(e.target.value);
    v.querySelectorAll('.rel-lista .check').forEach(l => { l.hidden = t && !norm(l.textContent).includes(t); });
  });
  f.addEventListener('submit', async e => {
    e.preventDefault();
    Object.assign(c, {
      titulo: f.titulo.value.trim(),
      bloque_id: f.tema.value || f.bloque.value || null,
      principio: f.principio.value.trim() || null,
      explicacion: f.explicacion.value.trim() || null,
      etiquetas: f.etiquetas.value.split(',').map(s => s.trim()).filter(Boolean),
      practica_lichess: f.practica.value || null,
    });
    const guardado = await D.guardar('conceptos', c);
    // Enlaces entre fichas (se guarda un único enlace por pareja)
    const marcados = new Set([...v.querySelectorAll('.rel-lista input:checked')].map(i => i.value));
    for (const o of otros) {
      const [a, b] = [guardado.id, o.id].sort();
      const existe = D.buscarFila('enlaces_conceptos', x => x.concepto_a === a && x.concepto_b === b);
      const activo = existe && !existe.borrado_en;
      if (marcados.has(o.id) && !activo) await D.guardar('enlaces_conceptos', Object.assign(existe || { concepto_a: a, concepto_b: b }, { borrado_en: null }));
      if (!marcados.has(o.id) && activo) await D.borrar('enlaces_conceptos', existe.id);
    }
    editando = false;
    aviso('Ficha guardada');
    ir('#/concepto/' + guardado.id);
  });
  v.querySelector('#borrar')?.addEventListener('click', async () => {
    if (!confirm(`¿Borrar la ficha «${c.titulo}» y sus ejemplos?`)) return;
    for (const ej of ejemplosDe(id)) await D.borrar('ejemplos', ej.id);
    await D.borrar('conceptos', id);
    editando = false;
    aviso('Ficha borrada');
    ir(raiz ? '#/bloque/' + raiz.id : '#/bloque/bandeja');
  });
}

// ---------------------------------------------------------------------
//  EDITOR DE EJEMPLO (tablero)
// ---------------------------------------------------------------------
function pedirPromocion(color) {
  return new Promise(ok => {
    const d = document.createElement('div');
    d.className = 'modal';
    d.innerHTML = `<div class="modal-caja"><p>Coronar en…</p><div class="promo cg-wrap">
      ${['q', 'r', 'b', 'n'].map(p => `<button data-p="${p}"><piece class="${{ q: 'queen', r: 'rook', b: 'bishop', n: 'knight' }[p]} ${color}"></piece></button>`).join('')}
      </div><button class="btn" data-p="">Cancelar</button></div>`;
    d.addEventListener('click', e => {
      const b = e.target.closest('[data-p]');
      if (!b && e.target !== d) return;
      d.remove(); ok(b ? b.dataset.p : '');
    });
    document.body.appendChild(d);
  });
}

function vEjemplo(v, id, q) {
  editando = true;
  const nuevo = id === 'nuevo';
  const fila = nuevo ? { concepto_id: q.get('concepto'), titulo: '', orientacion: 'white' } : D.obtener('ejemplos', id);
  if (!fila || !D.obtener('conceptos', fila.concepto_id)) return ir('#/conceptos');
  const concepto = D.obtener('conceptos', fila.concepto_id);
  const ej = nuevo ? ejemploVacio() : dePgn(fila.pgn || `[FEN "${fila.fen_inicial}"]`);
  let cambios = false, orientacion = fila.orientacion || 'white';
  v.innerHTML = `
    <div class="cab-vista">
      <a href="#/concepto/${concepto.id}" class="btn-ico" aria-label="Volver" id="volver">${ico('atras')}</a>
      <h1>${nuevo ? 'Nuevo ejemplo' : 'Editar ejemplo'}</h1>
    </div>
    <p class="intro">${esc(concepto.titulo)}</p>
    <label class="form solo"><span>Título del ejemplo</span>
      <input id="ej-titulo" maxlength="120" placeholder="Bloqueo del peón aislado con el caballo" value="${esc(fila.titulo || '')}"></label>
    <div id="editor" class="editor"></div>
    <div class="botones pegados">
      <button class="btn primario" id="guardar">Guardar ejemplo</button>
      ${nuevo ? '' : `<button class="btn peligro" id="borrar">${ico('borrar', 'peq')}</button>`}
    </div>`;
  const ed = crearEditor(v.querySelector('#editor'), ej, {
    orientacion,
    pedirPromocion,
    alCambiar: (_e, o) => { cambios = true; if (o) orientacion = o; },
  });
  limpiezas.push(ed.cerrar);
  v.querySelector('#ej-titulo').addEventListener('input', () => { cambios = true; });
  v.querySelector('#volver').addEventListener('click', e => {
    if (cambios && !confirm('Hay cambios sin guardar. ¿Salir sin guardar?')) e.preventDefault();
    else editando = false;
  });
  v.querySelector('#guardar').addEventListener('click', async () => {
    const err = ed.confirmar();
    if (err) return alert(err);
    Object.assign(fila, {
      titulo: v.querySelector('#ej-titulo').value.trim() || null,
      fen_inicial: ej.fen0,
      pgn: aPgn(ej),
      orientacion,
    });
    if (nuevo) fila.orden = ejemplosDe(concepto.id).length;
    await D.guardar('ejemplos', fila);
    editando = false;
    aviso('Ejemplo guardado');
    ir('#/concepto/' + concepto.id);
  });
  v.querySelector('#borrar')?.addEventListener('click', async () => {
    if (!confirm('¿Borrar este ejemplo?')) return;
    await D.borrar('ejemplos', fila.id);
    editando = false;
    ir('#/concepto/' + concepto.id);
  });
}

// ---------------------------------------------------------------------
//  CATÁLOGO DE BLOQUES Y TEMAS (activar, renombrar, ordenar, crear…)
// ---------------------------------------------------------------------
function vCatalogo(v, _id, q) {
  editando = true;
  const abiertos = new Set(q.get('abrir') ? [q.get('abrir')] : []);
  const pintarCat = () => {
    const lista = bloques();
    v.innerHTML = `
      <div class="cab-vista"><a href="#/conceptos" class="btn-ico">${ico('atras')}</a><h1>Bloques y temas</h1></div>
      <p class="intro">Activa lo que vayas a usar. Lo que está en reserva no se pierde: queda guardado con sus fichas, sin estorbar.</p>
      ${lista.map((b, i) => {
        const temas = temasDe(b.id);
        const abierto = abiertos.has(b.id);
        return `
        <section class="cat${abierto ? ' abierto' : ''}${b.activo ? '' : ' reserva'}" data-id="${b.id}" style="--c:${col(b.color)}">
          <div class="cat-cab">
            <button class="cat-nom" data-acc="abrir"><span class="bl-ico">${ico(b.icono)}</span>
              <span><b>${esc(b.nombre)}</b><small>${temas.filter(t => t.activo).length}/${temas.length} temas activos · ${conceptosDeBloque(b.id).length} fichas</small></span></button>
            <label class="interruptor" aria-label="Activo"><input type="checkbox" data-acc="activo" data-id="${b.id}" ${b.activo ? 'checked' : ''}><span></span></label>
          </div>
          ${abierto ? `
          <div class="cat-cuerpo">
            <div class="temas">
              ${temas.map((t, j) => `
                <div class="tema${t.activo ? '' : ' reserva'}">
                  <input class="tema-nom" data-acc="nombre" data-id="${t.id}" value="${esc(t.nombre)}" aria-label="Nombre del tema">
                  <button class="btn-ico peq" data-acc="subir" data-id="${t.id}" ${j ? '' : 'disabled'} aria-label="Subir">${ico('arriba')}</button>
                  <button class="btn-ico peq" data-acc="borrar" data-id="${t.id}" aria-label="Borrar tema">${ico('borrar')}</button>
                  <label class="interruptor peq"><input type="checkbox" data-acc="activo" data-id="${t.id}" ${t.activo ? 'checked' : ''}><span></span></label>
                </div>`).join('')}
              <form class="tema nuevo" data-acc="nuevo-tema"><input name="n" placeholder="Nuevo tema…"><button class="btn peq">Añadir</button></form>
            </div>
            <div class="cat-ajustes">
              <label>Nombre del bloque<input data-acc="nombre" data-id="${b.id}" value="${esc(b.nombre)}"></label>
              <label>Descripción<input data-acc="descripcion" data-id="${b.id}" value="${esc(b.descripcion || '')}" placeholder="Opcional"></label>
              <div class="paleta-col">${Object.keys(COLORES).map(k => `<button data-acc="color" data-v="${k}" style="--c:${COLORES[k]}" class="${b.color === k ? 'on' : ''}" aria-label="${k}"></button>`).join('')}</div>
              <div class="paleta-ico">${ICONOS_BLOQUE.map(k => `<button data-acc="icono" data-v="${k}" class="${b.icono === k ? 'on' : ''}">${ico(k)}</button>`).join('')}</div>
              <div class="fila-btn">
                <button class="btn peq" data-acc="mover" data-d="-1" ${i ? '' : 'disabled'}>${ico('arriba', 'peq')} Subir</button>
                <button class="btn peq" data-acc="mover" data-d="1" ${i < lista.length - 1 ? '' : 'disabled'}>${ico('abajo', 'peq')} Bajar</button>
                <button class="btn peq peligro" data-acc="borrar-bloque">${ico('borrar', 'peq')} Borrar bloque</button>
              </div>
            </div>
          </div>` : ''}
        </section>`;
      }).join('')}
      <form class="tarjeta nuevo-bloque" id="nuevo-bloque">
        <label>Crear un bloque nuevo<input name="n" placeholder="Por ejemplo: Partidas de grandes maestros"></label>
        <button class="btn">Crear</button>
      </form>`;
  };
  const reordenar = async (lista, item, d) => {
    const i = lista.indexOf(item), j = i + d;
    if (j < 0 || j >= lista.length) return;
    [lista[i], lista[j]] = [lista[j], lista[i]];
    for (let k = 0; k < lista.length; k++) if (lista[k].orden !== k + 1) { lista[k].orden = k + 1; await D.guardar('bloques', lista[k]); }
  };
  v.addEventListener('click', async e => {
    const el = e.target.closest('[data-acc]');
    if (!el || el.tagName === 'INPUT' || el.tagName === 'FORM') return;
    const sec = el.closest('.cat');
    const b = sec && D.obtener('bloques', sec.dataset.id);
    const acc = el.dataset.acc;
    if (acc === 'abrir') { abiertos.has(b.id) ? abiertos.delete(b.id) : abiertos.add(b.id); }
    if (acc === 'color') { b.color = el.dataset.v; await D.guardar('bloques', b); for (const t of temasDe(b.id)) { t.color = b.color; await D.guardar('bloques', t); } }
    if (acc === 'icono') { b.icono = el.dataset.v; await D.guardar('bloques', b); }
    if (acc === 'mover') await reordenar(bloques(), b, +el.dataset.d);
    if (acc === 'subir') { const t = D.obtener('bloques', el.dataset.id); await reordenar(temasDe(b.id), t, -1); }
    if (acc === 'borrar') {
      const t = D.obtener('bloques', el.dataset.id);
      const fichas = conceptos().filter(c => c.bloque_id === t.id);
      if (!confirm(fichas.length ? `El tema «${t.nombre}» tiene ${fichas.length} fichas. Pasarán al bloque, sin tema. ¿Borrar el tema?` : `¿Borrar el tema «${t.nombre}»?`)) return;
      for (const c of fichas) { c.bloque_id = b.id; await D.guardar('conceptos', c); }
      await D.borrar('bloques', t.id);
    }
    if (acc === 'borrar-bloque') {
      const fichas = conceptosDeBloque(b.id);
      if (!confirm(fichas.length ? `«${b.nombre}» tiene ${fichas.length} fichas. Pasarán a la Bandeja. ¿Borrar el bloque y sus temas?` : `¿Borrar el bloque «${b.nombre}» y sus temas?`)) return;
      for (const c of fichas) { c.bloque_id = null; await D.guardar('conceptos', c); }
      for (const t of temasDe(b.id)) await D.borrar('bloques', t.id);
      await D.borrar('bloques', b.id);
    }
    pintarCat();
  });
  v.addEventListener('change', async e => {
    const el = e.target;
    const acc = el.dataset.acc;
    const fila = el.dataset.id && D.obtener('bloques', el.dataset.id);
    if (!fila) return;
    if (acc === 'activo') {
      fila.activo = el.checked;
      await D.guardar('bloques', fila);
      if (!fila.padre_id && el.checked && !temasDe(fila.id).some(t => t.activo)) abiertos.add(fila.id);
      pintarCat();
    }
    if (acc === 'nombre' && el.value.trim()) { fila.nombre = el.value.trim(); await D.guardar('bloques', fila); }
    if (acc === 'descripcion') { fila.descripcion = el.value.trim() || null; await D.guardar('bloques', fila); }
  });
  v.addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, nombre = f.n.value.trim();
    if (!nombre) return;
    if (f.id === 'nuevo-bloque') {
      const nb = await D.guardar('bloques', { nombre, color: 'gris', icono: 'libro', orden: bloques().length + 1, activo: true, padre_id: null });
      abiertos.add(nb.id);
    } else {
      const b = D.obtener('bloques', f.closest('.cat').dataset.id);
      await D.guardar('bloques', { nombre, padre_id: b.id, color: b.color, orden: temasDe(b.id).length + 1, activo: true });
    }
    pintarCat();
  });
  pintarCat();
}

// ---------------------------------------------------------------------
//  ENTRENAR: enlaces directos a Lichess
// ---------------------------------------------------------------------
function vEntrenar(v) {
  const L = 'https://lichess.org';
  const t = k => `${L}/training/${k}`;
  const grupos = [
    ['Calentar', 'rayo', [['Puzzle Storm', `${L}/storm`, 'Contrarreloj de 3 minutos'], ['Puzzle Streak', `${L}/streak`, 'Racha sin fallar'], ['Puzzle Racer', `${L}/racer`, 'Carrera contra otros'], ['Puzzles', `${L}/training`, 'A tu nivel']]],
    ['Mates', 'corona', [['Mate en 1', t('mateIn1')], ['Mate en 2', t('mateIn2')], ['Mate en 3', t('mateIn3')], ['Mate en 4', t('mateIn4')], ['Mate del pasillo', t('backRankMate')], ['Mate de la coz', t('smotheredMate')], ['Mate de Anastasia', t('anastasiaMate')], ['Mate árabe', t('arabianMate')], ['Mate de Boden', t('bodenMate')]]],
    ['Táctica', 'rayo', [['Clavada', t('pin')], ['Enfilada', t('skewer')], ['Ataque doble', t('fork')], ['Ataque descubierto', t('discoveredAttack')], ['Rayos X', t('xRayAttack')], ['Pieza colgada', t('hangingPiece')], ['Desviación', t('deflection')], ['Atracción', t('attraction')], ['Interferencia', t('interference')], ['Jugada intermedia', t('intermezzo')], ['Eliminar al defensor', t('capturingDefender')], ['Jugada tranquila', t('quietMove')]]],
    ['Por fases', 'brujula', [['Apertura', t('opening')], ['Medio juego', t('middlegame')], ['Final', t('endgame')], ['Finales de peones', t('pawnEndgame')], ['Finales de torres', t('rookEndgame')], ['Todos los temas', `${L}/training/themes`]]],
    ['Aperturas', 'libro', [['Puzzles por apertura', `${L}/training/openings`, 'Elige tu apertura'], ['Explorador de aperturas', `${L}/analysis#explorer`, 'Lo que juegan los maestros']]],
    ['Práctica guiada', 'bandera', [['Práctica', `${L}/practice`, 'Mates básicos, finales de peones y torres…'], ['Coordenadas', `${L}/training/coordinate`, 'Visión del tablero'], ['Analizar', `${L}/analysis`, 'Tablero de análisis con motor']]],
  ];
  const usuarioL = ajustes().lichess;
  v.innerHTML = `
    <div class="cab-vista"><h1>Entrenar</h1></div>
    <p class="intro">Se abren en Lichess. Necesitan conexión.</p>
    ${usuarioL ? `<a class="tarjeta practicar" href="${L}/@/${encodeURIComponent(usuarioL)}" target="_blank" rel="noopener">${ico('peon')}<span><b>Mi perfil de Lichess</b><small>@${esc(usuarioL)}</small></span>${ico('externo', 'peq')}</a>` : ''}
    ${grupos.map(([g, i, enlaces]) => `
      <h3 class="sec">${ico(i, 'peq')} ${g}</h3>
      <div class="enlaces">
        ${enlaces.map(([n, u, s]) => `<a class="enlace" href="${u}" target="_blank" rel="noopener"><b>${n}</b>${s ? `<small>${s}</small>` : ''}</a>`).join('')}
      </div>`).join('')}`;
}

// ---------------------------------------------------------------------
//  AJUSTES
// ---------------------------------------------------------------------
function vAjustes(v) {
  const a = ajustes();
  const radio = (nombre, valor, texto) => `<label class="opcion"><input type="radio" name="${nombre}" value="${valor}" ${a[nombre] === valor ? 'checked' : ''}><span>${texto}</span></label>`;
  const ult = D.estadoSync.ultima ? D.estadoSync.ultima.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : 'nunca';
  v.innerHTML = `
    <div class="cab-vista"><h1>Ajustes</h1></div>
    <form id="f-aj" class="form">
      <fieldset><legend>Aspecto</legend>
        <div class="opciones">${radio('tema', 'auto', 'Según el móvil')}${radio('tema', 'claro', 'Claro')}${radio('tema', 'oscuro', 'Oscuro')}</div></fieldset>
      <fieldset><legend>Tablero</legend>
        <div class="opciones tableros">
          ${[['madera', 'Madera'], ['azul', 'Azul'], ['verde', 'Verde']].map(([k, t]) => `<label class="opcion tab-op"><input type="radio" name="tablero" value="${k}" ${a.tablero === k ? 'checked' : ''}><span class="muestra ${k}"></span><span>${t}</span></label>`).join('')}
        </div></fieldset>
      <fieldset><legend>Notación</legend>
        <div class="opciones">${radio('notacion', 'letras', 'Letras (Nf3)')}${radio('notacion', 'figuras', 'Figuras (♘f3)')}</div></fieldset>
      <fieldset><legend>Lichess</legend>
        <label>Tu usuario<input name="lichess" value="${esc(a.lichess)}" placeholder="usuario" autocapitalize="off" autocorrect="off"></label></fieldset>
      <fieldset><legend>Nube</legend>
        <label class="check"><input type="checkbox" name="subida" ${a.subida ? 'checked' : ''}><span>Subir los cambios automáticamente cuando haya conexión</span></label>
        <p class="nota">Última sincronización: ${ult}. Cambios sin subir: ${D.pendientes()}.</p>
        <button type="button" class="btn" id="sincr">${ico('nube', 'peq')} Sincronizar ahora</button>
      </fieldset>
      <fieldset><legend>Cuenta</legend>
        <p class="nota">${esc(usuario.email)}</p>
        <button type="button" class="btn peligro" id="salir">Cerrar sesión</button>
      </fieldset>
    </form>
    <p class="firma">Memorias de Peón · versión ${VERSION}<br>by Manuel Esteve</p>`;
  const f = v.querySelector('#f-aj');
  f.addEventListener('change', e => {
    const n = e.target.name;
    if (!n) return;
    guardarAjustes({ [n]: e.target.type === 'checkbox' ? e.target.checked : e.target.value.trim() });
  });
  v.querySelector('#sincr').addEventListener('click', async () => {
    const ok = await D.sincronizar();
    aviso(ok ? 'Todo guardado en la nube' : (D.estadoSync.error || 'No se pudo sincronizar'));
    pintar();
  });
  v.querySelector('#salir').addEventListener('click', async () => {
    const n = D.pendientes();
    if (n && !confirm(`Tienes ${n} cambios sin subir a la nube. Si cierras sesión ahora, se perderán. ¿Cerrar sesión igualmente?`)) return;
    if (!n && !confirm('¿Cerrar sesión en este dispositivo?')) return;
    await D.sb.auth.signOut().catch(() => {});
    await D.borrarTodoLocal();
    localStorage.removeItem('mdp-usuario');
    usuario = null;
    vEntrar();
  });
}

function vPronto(titulo, texto) {
  document.getElementById('vista').innerHTML = `
    <div class="cab-vista"><h1>${titulo}</h1></div>
    <div class="tarjeta vacia"><span class="etq">Próximamente</span><p>${texto}</p></div>`;
}

// ---------------------------------------------------------------------
//  ARRANQUE
// ---------------------------------------------------------------------
async function arrancar() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(e => console.warn('SW', e));
    let recargado = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (recargado || editando) return;
      recargado = true; location.reload();
    });
  }
  await D.cargarLocal();
  await D.leerUltimaSync();
  D.alCambiar(motivo => {
    pintarSync();
    if (motivo === 'datos' && !editando && usuario) pintar(true);
  });
  window.addEventListener('hashchange', () => pintar());
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => usuario && aplicarAjustes());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && usuario) D.sincronizar(); });
  const guardado = JSON.parse(localStorage.getItem('mdp-usuario') || 'null');
  if (!guardado) return vEntrar();
  await iniciarSesion(guardado);
}

arrancar().catch(e => {
  console.error(e);
  app.innerHTML = `<div class="entrar"><p class="error">No se pudo abrir la app: ${esc(e.message || e)}</p><button class="btn" onclick="location.reload()">Reintentar</button></div>`;
});
