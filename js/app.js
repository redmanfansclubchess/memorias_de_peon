// =====================================================================
//  MdP · Memorias de Peón · app.js  — pantallas y navegación
//  by Manuel Esteve
// =====================================================================
import * as D from './datos.js';
import { BIBLIOTECA } from './biblioteca.js';
import * as R from './repaso.js';
import * as RP from './repertorio.js';
import * as PA from './partidas.js';
import { FEN_INICIAL, crearVisor, crearEditor, crearEntrenoLinea, etiquetaJugada, sirveDeEjercicio, dePgn, aPgn, pgnARamas, lineasAPgn, ejemploVacio, validarFen, usarNotacion, verSan, diagrama, textoJugadas, escapar as esc } from './tablero.js';

export const VERSION = '5.4.1 (trampas explicadas con palabras: mistake, loses…)';
const app = document.getElementById('app');

// ---------------------------------------------------------------------
//  Iconos (trazo fino, 24×24)
// ---------------------------------------------------------------------
const P = {
  inicio: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  conceptos: 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11M9 8h6',
  repertorio: 'M6 3v18M6 8h5a4 4 0 014 4v9M15 3v5',
  partidas: 'M4 4h16v16H4zM12 4v16M4 12h16M4 4h8v8H4zM12 12h8v8h-8z',
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
  nota: 'M5 4h14v11l-5 5H5zM14 20v-5h5M9 9h6M9 12h3',
  glosario: 'M4 19V5a2 2 0 012-2h12v14H6a2 2 0 00-2 2zM4 19a2 2 0 002 2h12M9 7h6M9 10h4',
  rutina: 'M10 6h10M10 12h10M10 18h10M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17',
  guia: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9.5a2.5 2.5 0 115 0c0 1.7-2.5 2-2.5 3.7M12 17v.5',
  imprimir: 'M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z',
  copiar: 'M9 9h11v11H9zM5 15V4h11',
  ojo: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z',
  descargar: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  ampliar: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  reducir: 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5',
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
function aviso(texto, accion) {
  document.querySelectorAll('.toast').forEach(x => x.remove());   // un aviso nuevo sustituye al anterior
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = texto;
  if (accion) {   // { texto, href }: un botón dentro del aviso
    const a = document.createElement('a');
    a.className = 'toast-accion'; a.href = accion.href; a.textContent = accion.texto;
    a.addEventListener('click', () => t.remove());
    t.append(' ', a);
  }
  document.body.appendChild(t);
  const ms = accion ? 8000 : texto.length > 60 ? 6000 : 2200;
  setTimeout(() => t.classList.add('fuera'), ms);
  setTimeout(() => t.remove(), ms + 500);
}

// ---------------------------------------------------------------------
//  Consultas sobre los datos
// ---------------------------------------------------------------------
const bloques = () => D.lista('bloques').filter(b => !b.padre_id).sort(ordenar);
const bloquesActivos = () => bloques().filter(b => b.activo);
const temasDe = (id, soloActivos) => D.lista('bloques').filter(t => t.padre_id === id && (!soloActivos || t.activo)).sort(ordenar);
const conceptos = () => D.lista('conceptos');
// ¿Está la ficha en un bloque activo (y, si tiene tema, en un tema activo)?
function enBloqueActivo(c) {
  const b = c.bloque_id && D.obtener('bloques', c.bloque_id);
  if (!b || !b.activo) return false;
  return !b.padre_id || !!D.obtener('bloques', b.padre_id)?.activo;
}
// Fichas con las que trabajas: las de tus bloques activos y las que ya son tuyas
// (propias o trabajadas). Las de la biblioteca sin trabajar que quedaron en reserva no cuentan.
const fichasDeTrabajo = () => conceptos().filter(c => enBloqueActivo(c) || conceptoElegible(c));
// Fichas de la biblioteca en tus temas activos que aún no has trabajado (sin ejemplo tuyo)
const porTrabajar = () => conceptos().filter(c => c.origen === 'mdp' && enBloqueActivo(c) && !ejemplosDe(c.id).length);
const ubicacion = c => { const t = c.bloque_id && D.obtener('bloques', c.bloque_id), b = bloqueRaiz(c.bloque_id); return [b?.nombre, t?.padre_id ? t.nombre : null].filter(Boolean).join(' · ') || 'Bandeja'; };

// ¿Se parecen dos nombres? Entiende variantes y erratas: «clavar», «clavado»
// o «clavda» → «Clavada». Devuelve 0 (igual) … 3 (parecido) o Infinity.
function distanciaEdicion(a, b, tope) {
  let fila = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const nueva = [i];
    let minimo = i;
    for (let j = 1; j <= b.length; j++) {
      nueva[j] = Math.min(fila[j] + 1, nueva[j - 1] + 1, fila[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      minimo = Math.min(minimo, nueva[j]);
    }
    if (minimo > tope) return tope + 1;   // ya no puede parecerse: se corta antes
    fila = nueva;
  }
  return fila[b.length];
}
function parecido(texto, nombre) {
  const a = norm(texto).replace(/\s+/g, ' ').trim(), b = norm(nombre).replace(/\s+/g, ' ').trim();
  if (a.length < 3 || !b) return Infinity;
  if (a === b) return 0;
  if (b.startsWith(a) || b.split(' ').some(w => w.startsWith(a)) || (a.length >= 5 && a.startsWith(b))) return 1;
  const tope = a.length <= 4 ? 1 : a.length <= 8 ? 2 : 3;
  if (Math.abs(a.length - b.length) <= tope && distanciaEdicion(a, b, tope) <= tope) return 2;
  let k = 0; while (k < a.length && k < b.length && a[k] === b[k]) k++;   // misma raíz
  return k >= 4 && k >= 0.7 * Math.min(a.length, b.length) ? 3 : Infinity;
}
const parecidoA = (texto, x) => Math.min(parecido(texto, x.titulo), ...(x.alias || []).map(al => parecido(texto, al)));
// Fichas de tu cuaderno y de la biblioteca (que aún no tienes) con un nombre parecido
function nombresParecidos(texto, excluir) {
  const fichas = conceptos().filter(c => c.id !== excluir).map(c => [parecidoA(texto, { titulo: c.titulo, alias: biblioItem(c.original?.id)?.alias }), c])
    .filter(([n]) => n < Infinity).sort((x, y) => x[0] - y[0] || x[1].titulo.localeCompare(y[1].titulo, 'es')).slice(0, 8);
  const biblio = BIBLIOTECA.filter(it => !fichaDeBiblio(it)).map(it => [parecidoA(texto, it), it])
    .filter(([n]) => n < Infinity).sort((x, y) => x[0] - y[0]).slice(0, 5);
  return { fichas, biblio };
}
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
const AJ_DEF = { tema: 'auto', tablero: 'madera', notacion: 'letras', lichess: '', subida: true, primerosPasos: true };
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
  usarNotacion(a.notacion);
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
        <span class="marca-txt"><b>Memorias de Peón</b><small class="lema-cab">Todo peón propio es un obstáculo</small><small class="autor">Casilla a casilla · by Manuel Esteve</small></span>
      </a>
      <button class="btn-ico" id="lupa" aria-label="Buscar">${ico('buscar')}</button>
      <button class="sync" id="sync"></button>
      <a href="#/ajustes" class="btn-ico" aria-label="Ajustes">${ico('ajustes')}</a>
    </header>
    <main id="vista"></main>
    <nav class="barra">
      ${[['inicio', 'Inicio'], ['conceptos', 'Conceptos'], ['repertorio', 'Repertorio'], ['partidas', 'Partidas'], ['entrenar', 'Entrenar'], ['clases', 'Clases']]
        .map(([r, t]) => `<a href="#/${r}" data-r="${r}">${ico(r)}<span>${t}</span></a>`).join('')}
    </nav>`;
  document.getElementById('lupa').addEventListener('click', abrirBuscador);
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
  else if (n) { txt = `<em class="solo-ancho">Subir </em>${n}`; cls = 'pend'; }
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
  repertorio: vRepertorio, apertura: vApertura, 'editar-apertura': vEditarApertura, linea: vLinea, 'editar-linea': vEditarLinea, 'imprimir-repertorio': vImprimirRepertorio, 'importar-lineas': vImportarLineas,
  partidas: vPartidas, 'importar-partidas': vImportarPartidas, partida: vPartida, 'editar-partida': vEditarPartida, 'comentar-partida': vComentarPartida, momento: vMomento, 'resumen-partidas': vResumenPartidas,
  clases: vClases, clase: vClase, notas: vNotas, glosario: vGlosario, rutina: vRutina, guia: vGuia, imprimir: vImprimir,
  biblioteca: vBiblioteca,
  repaso: vRepaso, progreso: vProgreso, tecnicas: vTecnicas, preguntas: vPreguntas, pregunta: vPregunta,
};

// ---------------------------------------------------------------------
//  SALIR SIN GUARDAR: cada editor se protege con protegerSalida(). Al salir
//  por cualquier camino (←, pestañas, lupa, Ajustes, «atrás» del navegador o
//  cerrando la ventana) con cambios sin guardar, la app pregunta antes.
//  Guardar o borrar ponen editando = false, así que no preguntan.
// ---------------------------------------------------------------------
let hayCambios = null, hashActual = location.hash;
const estadoCampos = v => [...v.querySelectorAll('input, textarea, select')]
  .filter(x => x.type !== 'search' && x.type !== 'file' && !x.closest('.editor'))
  .map(x => (x.type === 'checkbox' || x.type === 'radio' ? x.checked : x.value)).join('\u0001');
// Se llama al final de montar el editor; «extra» añade cambios que no son campos (el tablero)
function protegerSalida(v, extra = () => false) {
  const inicial = estadoCampos(v);
  hayCambios = () => extra() || estadoCampos(v) !== inicial;
}
const conCambios = () => editando && !!hayCambios && hayCambios();

function pintar(conservarScroll) {
  if (!usuario) return;
  const scroll = window.scrollY;
  limpiar();
  editando = false;
  hayCambios = null;
  hashActual = location.hash;
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
    a.classList.toggle('on', r === nombre || (r === 'conceptos' && ['bloque', 'concepto', 'editar', 'ejemplo', 'catalogo', 'imprimir', 'biblioteca'].includes(nombre))
      || (r === 'repertorio' && ['apertura', 'editar-apertura', 'linea', 'editar-linea', 'imprimir-repertorio', 'importar-lineas'].includes(nombre)) || (r === 'partidas' && ['importar-partidas', 'partida', 'editar-partida', 'comentar-partida', 'momento', 'resumen-partidas'].includes(nombre)) || (r === 'clases' && ['clase', 'preguntas', 'pregunta'].includes(nombre)) || (r === 'entrenar' && ['repaso', 'progreso', 'tecnicas'].includes(nombre)) || (r === 'inicio' && ['notas', 'glosario', 'rutina', 'guia'].includes(nombre)));
  });
  vigilarPgn(vista);
  (RUTAS[nombre] || vInicio)(vista, id, new URLSearchParams(q || ''));
  ponerAyuda(vista, nombre);
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
      <p class="lema">Todo peón propio es un obstáculo</p>
      <p class="autor-entrar">Casilla a casilla · by Manuel Esteve</p>
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
  const n = await sembrarBiblioteca();
  if (n) { aviso(`${n} fichas sugeridas de la biblioteca en tus temas activos`); pintar(true); }
}

// ---------------------------------------------------------------------
//  INICIO
// ---------------------------------------------------------------------
function conceptoDelDia() {
  const lista = conceptos().filter(enBloqueActivo).sort((a, b) => a.id.localeCompare(b.id));
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
  const esbozo = c.origen === 'mdp' && !ejemplosDe(c.id).length;
  return `<a class="fila-c${esbozo ? ' esbozo' : ''}" href="#/concepto/${c.id}" ${esbozo ? 'title="Ficha sugerida: añádele tu ejemplo para trabajarla"' : ''}>
      <span class="punto" style="--c:${b ? col(b.color) : 'var(--suave)'}"></span>
      <span class="fila-txt"><b>${esc(c.titulo)}</b>${c.principio ? `<small>${esc(c.principio)}</small>` : ''}</span>
      ${ico('flecha', 'peq')}
    </a>`;
}

function vInicio(v) {
  const dia = conceptoDelDia();
  const mias = fichasDeTrabajo();
  const primeros = tarjetaPrimerosPasos();
  const recientes = [...mias].sort((a, b) => String(b.editado_en).localeCompare(String(a.editado_en))).slice(0, 5);
  const nEj = D.lista('ejemplos').length;
  const notasPendientes = D.lista('notas_rapidas').filter(n => !n.procesada).length;
  const b = dia && bloqueRaiz(dia.bloque_id);
  v.innerHTML = `
    <h1 class="saludo">${saludo()}, Manuel</h1>
    ${tarjetaCopia()}
    ${primeros}
    ${dia ? `
      <a class="tarjeta dia" href="#/concepto/${dia.id}" style="--c:${b ? col(b.color) : 'var(--acento)'}">
        <span class="etq">Concepto del día${b ? ' · ' + esc(b.nombre) : ''}</span>
        <h2>${esc(dia.titulo)}</h2>
        ${dia.principio ? `<blockquote>${esc(dia.principio)}</blockquote>` : ''}
        <span class="mas-txt">Repasar ${ico('flecha', 'peq')}</span>
      </a>` : primeros ? '' : `
      <div class="tarjeta dia vacia">
        <span class="etq">Empieza aquí</span>
        <h2>Tu primera ficha</h2>
        <p>Elige los bloques con los que vas a trabajar y apunta el primer concepto de tus clases.</p>
        <a class="btn primario" href="#/${bloquesActivos().length ? 'editar/nuevo' : 'catalogo'}">${bloquesActivos().length ? 'Crear ficha' : 'Elegir bloques'}</a>
      </div>`}
    ${tarjetaRepasoHoy()}
    <div class="acciones">
      <a class="accion" href="#/editar/nuevo">${ico('mas')}<span>Nueva ficha</span></a>
      <button class="accion" id="nota-rapida">${ico('nota')}<span>Nota rápida</span></button>
      <a class="accion" href="https://lichess.org/storm" target="_blank" rel="noopener">${ico('rayo')}<span>Calentar</span></a>
    </div>
    ${notasPendientes ? `<a class="tarjeta aviso-notas" href="#/notas">${ico('nota')}<span><b>${notasPendientes} ${notasPendientes === 1 ? 'nota rápida' : 'notas rápidas'} por ordenar</b><small>Conviértelas en fichas cuando tengas un rato</small></span>${ico('flecha', 'peq')}</a>` : ''}
    <div class="atajos">
      <a href="#/biblioteca">${ico('libro')}<span>Biblioteca</span></a>
      <a href="#/preguntas">${ico('guia')}<span>Preguntas${preguntas().filter(p => !p.respondida).length ? ' (' + preguntas().filter(p => !p.respondida).length + ')' : ''}</span></a>
      <a href="#/rutina">${ico('rutina')}<span>Rutina</span></a>
      <a href="#/glosario">${ico('glosario')}<span>Glosario</span></a>
      <a href="#/notas">${ico('nota')}<span>Notas</span></a>
      <a href="#/guia">${ico('guia')}<span>Guía</span></a>
    </div>
    <div class="cifras">
      <div><b>${mias.length}</b><span>fichas</span></div>
      <div><b>${nEj}</b><span>ejemplos</span></div>
      <div><b>${bloquesActivos().length}</b><span>bloques</span></div>
    </div>
    ${seccionPorTrabajar()}
    ${recientes.length ? `<h3 class="sec">Últimas fichas</h3><div class="lista">${recientes.map(filaConcepto).join('')}</div>` : ''}`;
  v.querySelector('#nota-rapida').addEventListener('click', () => abrirNotaRapida());
  v.addEventListener('click', e => {   // «Ver las fichas por trabajar» (desde Primeros pasos)
    if (!e.target.closest('[data-pt]')) return;
    const sec = v.querySelector('#por-trabajar');
    sec?.querySelector('details')?.setAttribute('open', '');
    sec?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  v.querySelector('#copia-ya')?.addEventListener('click', () => { descargarCopia(); aviso('Copia descargada. Guárdala en un sitio seguro.'); pintar(true); });
  v.querySelector('#copia-luego')?.addEventListener('click', async () => { await guardarAjustes({ copiaPospuesta: R.sumarDias(R.hoyISO(), 7) }); pintar(true); });
  v.querySelector('#pp-ocultar')?.addEventListener('click', async () => {
    await guardarAjustes({ primerosPasos: false });
    aviso('Ocultados. Puedes volver a mostrarlos en Ajustes → Ayuda.');
    pintar(true);
  });
  // Tarjetas nuevas (fichas o ejercicios recientes): se crean y se actualiza el contador
  const antes = R.pendientes(tarjetas()).length + ':' + tarjetas().length;
  prepararTarjetas().then(() => {
    if (v.isConnected && R.pendientes(tarjetas()).length + ':' + tarjetas().length !== antes) pintar(true);
  });
}

// ---------------------------------------------------------------------
//  CONCEPTOS: bloques activos, Bandeja y buscador
// ---------------------------------------------------------------------
function vConceptos(v, _id, q) {
  const activos = bloquesActivos();
  const bandeja = conceptos().filter(c => !c.bloque_id);
  v.innerHTML = `
    <div class="cab-vista"><h1>Conceptos</h1>
      <a class="btn-ico" href="#/imprimir" aria-label="Imprimir">${ico('imprimir')}</a>
      <a class="btn peq" href="#/biblioteca">${ico('libro', 'peq')} Biblioteca</a>
      <a class="btn peq" href="#/catalogo">Bloques</a>
    </div>
    <label class="buscador">${ico('buscar')}<input type="search" id="buscar" placeholder="Buscar: enfilada, peón aislado…" value="${esc(q.get('q') || '')}"></label>
    <div id="resultados"></div>
    <div id="bloques">
      ${activos.length ? '' : `
        <div class="tarjeta vacia">
          <h2>Elige tus bloques</h2>
          <p>Tu cuaderno se ordena en <b>Bloque → Tema → Ficha</b> (por ejemplo, Táctica → Motivos tácticos → Enfilada). Tienes un catálogo de 9 bloques y 40 temas preparado, en reserva: activa los que vayas a usar.</p>
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
function vBloque(v, id, q = new URLSearchParams()) {
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
  // Llegas desde Bloques a un tema concreto: se despliega y se muestra
  const destino = q.get('tema') && v.querySelector(`.grupo[data-id="${CSS.escape(q.get('tema'))}"]`);
  if (destino) {
    destino.classList.remove('plegado');
    destino.classList.add('resaltado');
    requestAnimationFrame(() => destino.scrollIntoView({ block: 'start' }));
  }
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
// Secciones de Lichess que no son temas de puzzles
const LICHESS_SECCIONES = [
  ['https://lichess.org/practice', 'Práctica guiada (finales y mates básicos)', 'Práctica guiada'],
  ['https://lichess.org/training/coordinate', 'Coordenadas (visualización)', 'Entrenamiento de coordenadas'],
  ['https://lichess.org/analysis', 'Tablero de análisis', 'Tablero de análisis con motor'],
  ['attackingF2F7', 'Ataque a f2/f7', 'Puzzles de ataque a f2/f7'],
];
const nombreTemaLichess = k => (LICHESS_TEMAS.find(t => t[0] === k) || LICHESS_SECCIONES.find(t => t[0] === k) || [k, k])[1];
const textoPractica = k => { const sec = LICHESS_SECCIONES.find(t => t[0] === k); return sec ? sec[2] : 'Puzzles de ' + nombreTemaLichess(k); };
const urlPractica = k => /^https?:/.test(k) ? k : `https://lichess.org/training/${encodeURIComponent(k)}`;

// Mi estado en una ficha: lo deciden tus repasos (no se pone a mano) y debajo, tus números
const ESTADO_FICHA = { nuevo: 'Sin repasar', repasar: 'Repasando', fallo: 'Fallo', domino: 'Lo domino' };
function miEstadoFicha(c) {
  const tf = tarjetasDeFicha(c), ids = new Set(tf.map(t => t.id));
  const estado = R.estadoDe(tf);
  if (c.estado !== estado) { c.estado = estado; D.guardar('conceptos', c); }   // al día con tus repasos
  const regs = D.lista('registro_repaso').filter(r => ids.has(r.tarjeta_id)).sort((x, y) => String(x.fecha).localeCompare(String(y.fecha)));
  const ejercicios = tf.filter(t => t.tipo !== 'concepto').length;
  const bien = regs.filter(r => r.resultado === 'bien').length;
  const ultimo = { bien: 'bien', dudoso: 'regular', mal: 'mal' }[regs.at(-1)?.resultado];
  const numeros = !tf.length ? 'Aún no tiene tarjetas de repaso.'
    : [ejercicios ? `${ejercicios} ${ejercicios === 1 ? 'ejercicio' : 'ejercicios'}` : 'solo la tarjeta de la ficha',
       regs.length ? `repasada ${regs.length} ${regs.length === 1 ? 'vez' : 'veces'}` : 'aún sin practicar',
       regs.length ? `${Math.round(bien / regs.length * 100)} % de aciertos` : '',
       ultimo ? `último: ${ultimo}` : ''].filter(Boolean).join(' · ');
  return `<div class="mi-estado"><span>Mi estado</span><span class="estado-ficha ${estado}">${ESTADO_FICHA[estado]}</span>
      <p class="mi-numeros">${numeros}</p>
      ${tf.length ? `<a class="btn primario peq" href="#/repaso?ficha=${c.id}">${ico('entrenar', 'peq')} Practicar esta ficha ahora</a>` : ''}
      <p class="nota">${estado === 'domino' ? 'La dominas: todo acertado, y cada ejercicio al menos 3 veces.' : 'Se pone sola según tus repasos. «Lo domino» llega cuando aciertas todo, y cada ejercicio al menos 3 veces.'}</p></div>`;
}

function vConcepto(v, id) {
  const c = D.obtener('conceptos', id);
  if (!c) return ir('#/conceptos');
  const b = bloqueRaiz(c.bloque_id);
  const tema = c.bloque_id && D.obtener('bloques', c.bloque_id)?.padre_id ? D.obtener('bloques', c.bloque_id) : null;
  const ejemplos = ejemplosDe(id);
  const rel = relacionados(id);
  const clase = c.clase_id && D.obtener('clases', c.clase_id);
  const mapa = terminos();
  const termino = terminoDeFicha(c, mapa);
  const itBiblio = BIBLIOTECA.find(x => norm(x.titulo) === norm(c.titulo) || (x.alias || []).some(a => norm(a) === norm(c.titulo)));
  const enAperturas = aperturas().filter(a => (a.conceptos || []).includes(id));
  const volver = b ? `#/bloque/${b.id}` : '#/bloque/bandeja';
  v.innerHTML = `
    <div class="cab-vista">
      <a href="${volver}" class="btn-ico" aria-label="Volver">${ico('atras')}</a>
      <span class="hueco"></span>
      <a href="#/imprimir?ficha=${id}" class="btn-ico" aria-label="Imprimir">${ico('imprimir')}</a>
      <a href="#/editar/${id}" class="btn peq">${ico('editar', 'peq')} Editar</a>
    </div>
    <article class="ficha" style="--c:${b ? col(b.color) : 'var(--suave)'}">
      <div class="etqs">
        <span class="etq-bloque">${b ? esc(b.nombre) + (tema ? ' · ' + esc(tema.nombre) : '') : 'Bandeja'}</span>
        <span class="estado ${ejemplos.length ? 'hecho' : ''}">${ejemplos.length ? ico('check', 'peq') + ' Trabajada' : 'Pendiente de ejemplo'}</span>
        ${c.origen === 'mdp' ? (biblioItem(c.original?.id)?.maestro ? '<span class="estado maestro">★ Principio del maestro</span>' : `<span class="estado mdp">${adaptada(c) ? 'Biblioteca MdP · adaptada' : 'Sugerida por MdP'}</span>`) : ''}
      </div>
      <h1 class="ficha-tit">${esc(c.titulo)}</h1>
      ${termino && termino.en ? `<p class="ficha-en"><span class="g-en">${esc(termino.en)}</span> en inglés · <a href="#/glosario?q=${encodeURIComponent(termino.es)}">glosario</a></p>` : ''}
      ${c.principio ? `<blockquote class="principio">${esc(c.principio)}</blockquote>` : ''}
      ${c.explicacion ? `<div class="md">${enlazar(md(c.explicacion), mapa, norm(c.titulo))}</div>` : ''}
      ${(c.etiquetas || []).length ? `<div class="chips">${c.etiquetas.map(t => `<a class="chip" href="#/conceptos?q=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</div>` : ''}
      ${clase ? `<a class="de-clase" href="#/clase/${clase.id}">${ico('clases', 'peq')} Visto en la clase del ${fechaLarga(clase.fecha)}</a>` : ''}
    </article>
    ${conceptoElegible(c) ? miEstadoFicha(c) : ''}
    ${!c.original && itBiblio ? `<div class="aviso-biblio">${ico('libro', 'peq')} <span>La biblioteca tiene teoría de <b>${esc(itBiblio.titulo)}</b>.${c.principio || c.explicacion ? ' Solo se rellenará lo que esté vacío.' : ''}</span>
      <button class="btn peq" id="completar">Completar con la biblioteca</button></div>` : ''}
    ${c.pista && !ejemplos.length ? `<div class="pista"><b>Pista para tu ejemplo</b><p>${esc(c.pista)}</p></div>` : ''}
    <h3 class="sec">Ejemplos <small>${ejemplos.length || ''}</small></h3>
    <div class="ejemplos">
      ${ejemplos.map((e, i) => `
        <div class="tarjeta ejemplo">
          <div class="ej-cab"><b>${esc(e.titulo || 'Ejemplo ' + (i + 1))}</b>
            <button class="btn-ico peq" data-dup="${e.id}" aria-label="Duplicar ejemplo" title="Duplicar (para otra respuesta del rival)">${ico('copiar')}</button>
            <a href="#/ejemplo/${e.id}" class="btn-ico peq" aria-label="Editar ejemplo">${ico('editar')}</a></div>
          <div class="visor" data-ej="${e.id}"></div>
        </div>`).join('')}
      <a class="btn anadir-ej" href="#/ejemplo/nuevo?concepto=${id}">${ico('mas')} Añadir ejemplo en el tablero</a>
    </div>
    ${c.practica_lichess ? `
      <a class="tarjeta practicar" href="${esc(urlPractica(c.practica_lichess))}" target="_blank" rel="noopener">
        ${ico('entrenar')}<span><b>Practicar en Lichess</b><small>${esc(textoPractica(c.practica_lichess))}</small></span>${ico('externo', 'peq')}
      </a>` : ''}
    ${enAperturas.length ? `<h3 class="sec">En tu repertorio</h3><div class="chips">${enAperturas.map(a => `<a class="chip" href="#/apertura/${a.id}">${a.color === 'white' ? '♔' : '♚'} ${esc(a.nombre)}</a>`).join('')}</div>` : ''}
    ${rel.length ? `<h3 class="sec">Relacionado</h3><div class="chips">${rel.map(r => `<a class="chip" href="#/concepto/${r.id}">${ico('enlace', 'peq')} ${esc(r.titulo)}</a>`).join('')}</div>` : ''}`;
  v.querySelectorAll('.enl').forEach(bt => bt.addEventListener('click', () => abrirTermino(bt.dataset.k, mapa)));
  // Duplicar: copia el ejemplo y abre la copia, para cambiar la respuesta del rival
  v.querySelectorAll('[data-dup]').forEach(bt => bt.addEventListener('click', async () => {
    const o = D.obtener('ejemplos', bt.dataset.dup);
    if (!o) return;
    const copia = Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('_') && !['id', 'editado_en', 'actualizado_en', 'creado_en', 'borrado_en'].includes(k)));
    copia.titulo = `${o.titulo || 'Ejemplo'} (copia)`;
    const nueva = await D.guardar('ejemplos', copia);
    aviso('Ejemplo duplicado. Cambia la respuesta del rival y guarda.');
    ir('#/ejemplo/' + nueva.id);
  }));
  v.querySelector('#completar')?.addEventListener('click', async () => {
    const it = itBiblio;
    c.principio = c.principio || it.principio;
    c.explicacion = c.explicacion || it.explicacion;
    c.pista = c.pista || it.pista;
    c.practica_lichess = c.practica_lichess || it.lichess || null;
    c.original = { id: it.id, titulo: it.titulo, principio: it.principio, explicacion: it.explicacion };
    await D.guardar('conceptos', c);
    aviso('Ficha completada con la teoría de la biblioteca');
    pintar(true);
  });
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
  if (nuevo && q.get('titulo')) c.titulo = q.get('titulo');
  const pregunta = nuevo && q.get('pregunta') && D.obtener('preguntas_maestro', q.get('pregunta'));
  if (pregunta) {
    c.titulo = (pregunta.texto || '').split('\n')[0].slice(0, 120);
    c.explicacion = pregunta.respuesta || null;
    c.clase_id = pregunta.clase_id || null;
  }
  const nota = nuevo && q.get('nota') && D.obtener('notas_rapidas', q.get('nota'));
  if (nota) {
    const lineas = (nota.texto || '').split('\n');
    c.titulo = lineas[0].slice(0, 120);
    c.explicacion = lineas.slice(1).join('\n').trim() || null;
    c.clase_id = nota.clase_id || null;
  }
  if (nuevo && !nota) c.clase_id = q.get('clase') || claseDeHoy()?.id || null;
  const clasesOrd = D.lista('clases').sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
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
      <label>Nombre del concepto <small>el título de la ficha</small><input name="titulo" required maxlength="120" placeholder="Enfilada" value="${esc(c.titulo)}"></label>
      <div class="dos">
        <label>Bloque<select name="bloque">${opcionesBloque(c.bloque_id)}</select></label>
        <label>Tema<select name="tema" ${raiz ? '' : 'disabled'}>${opcionesTema(raiz?.id, temaId)}</select></label>
      </div>
      <p class="nota" id="aviso-tema" hidden>Este bloque no tiene temas activos. Puedes guardar la ficha sin tema, o activar sus temas en <a href="#/catalogo">Bloques</a>.</p>
      <label>Principio <small>la idea clave en una frase, la que te enseñó el maestro (opcional)</small>
        <input name="principio" maxlength="200" placeholder="Todo peón propio es un obstáculo" value="${esc(c.principio || '')}"></label>
      <label>Explicación <small>**negrita**, *cursiva* y listas empezando con «- »</small>
        <textarea name="explicacion" rows="7" placeholder="Lo que te explicó el maestro, con tus palabras">${esc(c.explicacion || '')}</textarea></label>
      <label>Etiquetas <small>separadas por comas</small>
        <input name="etiquetas" placeholder="medio juego, estructura" value="${esc((c.etiquetas || []).join(', '))}"></label>
      <label>Clase <small>en qué clase lo viste</small>
        <select name="clase"><option value="">Ninguna</option>${clasesOrd.map(k => `<option value="${k.id}" ${c.clase_id === k.id ? 'selected' : ''}>${fechaLarga(k.fecha)}${k.titulo ? ' · ' + esc(k.titulo) : ''}</option>`).join('')}</select></label>
      <label>Practicar en Lichess
        <select name="practica">${[...LICHESS_TEMAS, ...LICHESS_SECCIONES]
          .concat(c.practica_lichess && ![...LICHESS_TEMAS, ...LICHESS_SECCIONES].some(x => x[0] === c.practica_lichess) ? [[c.practica_lichess, c.practica_lichess]] : [])
          .map(([k, t]) => `<option value="${esc(k)}" ${c.practica_lichess === k ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>
      ${otros.length ? `
        <fieldset class="rel"><legend>Relacionar con</legend>
          <input type="search" class="filtro-rel" placeholder="Filtrar fichas…">
          <div class="rel-lista">
            ${otros.map(o => `<label class="check"><input type="checkbox" value="${o.id}" ${relIds.has(o.id) ? 'checked' : ''}><span>${esc(o.titulo)}</span></label>`).join('')}
          </div>
        </fieldset>` : ''}
      ${c.original ? `<button class="btn" type="button" id="original">Recuperar el texto original de la biblioteca</button>` : ''}
      <div class="botones">
        <button class="btn primario" type="submit">Guardar</button>
        ${nuevo ? '' : `<button class="btn peligro" type="button" id="borrar">${ico('borrar', 'peq')} Borrar ficha</button>`}
      </div>
    </form>`;
  const f = v.querySelector('#f-concepto');
  // Mientras escribes el nombre: fichas parecidas que ya tienes (para no repetirlas)
  // y teoría de la biblioteca que aún no está en tu cuaderno
  const cajaBiblio = document.createElement('div');
  cajaBiblio.className = 'aviso-biblio parecidos'; cajaBiblio.hidden = true;
  f.titulo.closest('label').after(cajaBiblio);
  const buscarParecidos = () => {
    const texto = f.titulo.value.trim();
    const { fichas, biblio } = nombresParecidos(texto, nuevo ? null : id);
    const biblioUtil = biblio.filter(([, it]) => nuevo || !c.original);
    cajaBiblio.hidden = !fichas.length && !biblioUtil.length;
    if (cajaBiblio.hidden) return;
    cajaBiblio.innerHTML = `
      ${fichas.length ? `<p class="par-tit">${ico('conceptos', 'peq')} <span><b>Ya ${fichas.length === 1 ? 'tienes esta ficha' : 'tienes estas fichas'} en tu cuaderno</b> — ¿es alguna?</span></p>
        ${fichas.map(([, x]) => `<div class="par-fila"><span><b>${esc(x.titulo)}</b><small>${esc(ubicacion(x))}${x.origen === 'mdp' && !ejemplosDe(x.id).length ? ' · de la biblioteca, por trabajar' : ''}</small></span>
          <a class="btn peq" href="#/concepto/${x.id}" data-salir>Abrirla</a></div>`).join('')}` : ''}
      ${biblioUtil.length ? `<p class="par-tit">${ico('libro', 'peq')} <span><b>En la biblioteca</b> (aún no en tu cuaderno)</span></p>
        ${biblioUtil.map(([, it]) => `<div class="par-fila"><span><b>${esc(it.titulo)}</b><small>${esc(it.bloque)} · ${esc(it.tema)}</small></span>
          <button type="button" class="btn peq" data-usar="${it.id}">Usar su teoría</button></div>`).join('')}` : ''}
      <p class="nota">Si es otra cosa, sigue y guarda tu ficha nueva.</p>`;
  };
  f.titulo.addEventListener('input', buscarParecidos);
  cajaBiblio.addEventListener('click', e => {
    if (e.target.closest('[data-salir]')) { editando = false; return; }
    const it = biblioItem(e.target.closest('[data-usar]')?.dataset.usar);
    if (!it) return;
    if (f.principio.value.trim() || f.explicacion.value.trim()) {
      if (!confirm('Ya has escrito principio o explicación. ¿Sustituirlos por la teoría de la biblioteca?')) return;
    }
    f.titulo.value = it.titulo; f.principio.value = it.principio; f.explicacion.value = it.explicacion;
    if (!f.practica.value) f.practica.value = it.lichess || '';
    c.original = { id: it.id, titulo: it.titulo, principio: it.principio, explicacion: it.explicacion };
    c.pista = c.pista || it.pista;
    cajaBiblio.hidden = true;
    aviso('Teoría de la biblioteca añadida. Puedes cambiarla a tu manera.');
  });
  buscarParecidos();
  const avisoTema = () => { v.querySelector('#aviso-tema').hidden = !f.bloque.value || temasDe(f.bloque.value, true).length > 0; };
  f.bloque.addEventListener('change', () => {
    f.tema.innerHTML = opcionesTema(f.bloque.value, '');
    f.tema.disabled = !f.bloque.value;
    avisoTema();
  });
  avisoTema();
  v.querySelector('.filtro-rel')?.addEventListener('input', e => {
    const t = norm(e.target.value);
    v.querySelectorAll('.rel-lista .check').forEach(l => { l.hidden = t && !norm(l.textContent).includes(t); });
  });
  protegerSalida(v);
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (nuevo) {
      const [n, igual] = nombresParecidos(f.titulo.value.trim(), null).fichas[0] || [];
      if (igual && n <= 2 && !confirm(`Ya tienes «${igual.titulo}» en tu cuaderno (${ubicacion(igual)}). ¿Crear otra ficha igualmente?`)) return;
    }
    Object.assign(c, {
      titulo: f.titulo.value.trim(),
      bloque_id: f.tema.value || f.bloque.value || null,
      principio: f.principio.value.trim() || null,
      explicacion: f.explicacion.value.trim() || null,
      etiquetas: f.etiquetas.value.split(',').map(s => s.trim()).filter(Boolean),
      practica_lichess: f.practica.value || null,
      clase_id: f.clase.value || null,
    });
    const guardado = await D.guardar('conceptos', c);
    if (nota) { nota.procesada = true; await D.guardar('notas_rapidas', nota); }
    if (pregunta && pregunta.pgn && !ejemplosDe(guardado.id).length)
      await D.guardar('ejemplos', { concepto_id: guardado.id, titulo: 'De mi pregunta al maestro', fen_inicial: pregunta.fen || dePgn(pregunta.pgn).fen0, pgn: pregunta.pgn, orientacion: 'white', orden: 0 });
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
    aviso(nuevo ? 'Ficha guardada. Ahora puedes añadirle ejemplos en el tablero.' : 'Ficha guardada');
    ir('#/concepto/' + guardado.id);
  });
  v.querySelector('#original')?.addEventListener('click', () => {
    if (!confirm('¿Sustituir el texto por el original de la biblioteca? Tus cambios en el texto se perderán al guardar.')) return;
    const o = c.original;
    f.titulo.value = o.titulo || ''; f.principio.value = o.principio || ''; f.explicacion.value = o.explicacion || '';
    aviso('Texto original recuperado. Pulsa Guardar para quedártelo.');
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

// ---------------------------------------------------------------------
//  PEGAR: un FEN (posición), un PGN (jugadas, en notación inglesa o española)
//  o un enlace de Lichess (partida, estudio o tablero de análisis) → ejemplo
// ---------------------------------------------------------------------
function ejemploDesdeFen(texto) {
  const p = texto.trim().split(/\s+/);
  const def = ['w', '-', '-', '0', '1'];
  const fen = [p[0], ...def.map((d, i) => p[i + 1] || d)].join(' ');
  const err = validarFen(fen);
  if (err) throw new Error('Ese FEN no es una posición válida: ' + err);
  return ejemploVacio(fen);
}
function ejemploDesdePgn(texto) {
  const [p] = PA.separarPgn(texto);
  const pgn = p ? (p.cab.FEN ? `[FEN "${p.cab.FEN}"]\n` : '') + p.cuerpo : texto;
  const ej = leerPgn(pgn);
  if (!ej || (!ej.jugadas.length && !(p && p.cab.FEN))) throw new Error('No he encontrado jugadas ni posición en lo que has pegado.');
  return ej;
}
// Donde se pega un PGN también se puede cargar un archivo .pgn: con el botón
// «Elegir archivo .pgn» o arrastrándolo encima (Safari, si no, escribe su ruta)
const AREAS_PGN = 'textarea#pg-txt, textarea#pgn-txt, #f-imp textarea, #f-pegar textarea';
function aceptarArchivoPgn(area) {
  if (area.dataset.archivo) return;
  area.dataset.archivo = '1';
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'btn peq archivo-pgn';
  btn.innerHTML = `${ico('subir', 'peq')} Elegir archivo .pgn`;
  const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.pgn,.txt,text/plain,application/x-chess-pgn', hidden: true });
  area.after(btn, input);
  const leer = async f => {
    if (!f) return;
    area.value = await f.text();
    area.dispatchEvent(new Event('input', { bubbles: true }));
    aviso(`Archivo cargado: ${f.name}`);
  };
  btn.addEventListener('click', e => { e.preventDefault(); input.click(); });
  input.addEventListener('change', () => { leer(input.files[0]); input.value = ''; });
  area.addEventListener('dragover', e => { if ([...(e.dataTransfer?.types || [])].includes('Files')) { e.preventDefault(); area.classList.add('soltar'); } });
  area.addEventListener('dragleave', () => area.classList.remove('soltar'));
  area.addEventListener('drop', e => {
    area.classList.remove('soltar');
    const f = e.dataTransfer?.files?.[0];
    if (f) { e.preventDefault(); leer(f); }
  });
}
function vigilarPgn(vista) {
  const buscar = () => vista.querySelectorAll(AREAS_PGN).forEach(aceptarArchivoPgn);
  new MutationObserver(buscar).observe(vista, { childList: true, subtree: true });
}
// ¿Lo pegado es solo un enlace de Lichess? (un PGN de Lichess también lleva enlaces en
// sus cabeceras [Site "…"], y entonces hay que leer el PGN, no descargar nada)
const soloEnlaceLichess = t => /^\s*https?:\/\/(?:www\.)?lichess\.org\/\S+\s*$/.test(String(t || ''));
// El PGN de una partida o de un estudio (o capítulo) de Lichess a partir de su enlace
async function pgnDeLichess(texto) {
  const u = decodeURIComponent((String(texto).match(/https?:\/\/(?:www\.)?lichess\.org\/\S+/) || [''])[0]);
  const estudio = u.match(/lichess\.org\/(?:api\/)?study\/([A-Za-z0-9]{8})(?:\/([A-Za-z0-9]{8}))?/);   // también el enlace de descarga (api/study/….pgn)
  const partida = !estudio && PA.idDeLichess(u);
  const pedir = estudio ? `https://lichess.org/api/study/${estudio[1]}${estudio[2] ? '/' + estudio[2] : ''}.pgn?clocks=false`
    : partida ? `https://lichess.org/game/export/${partida}?clocks=false&evals=false` : null;
  if (!pedir) throw new Error('No reconozco ese enlace de Lichess. Pega su PGN.');
  let r = null;
  try { r = await fetch(pedir, { headers: { Accept: 'application/x-chess-pgn' } }); } catch (e) { r = null; }
  if (!r || !r.ok) throw new Error('Lichess no ha dejado leer ese enlace desde aquí (o el estudio es privado). Copia allí el PGN («Compartir y exportar») y pégalo.');
  return r.text();
}
async function textoAEjemplo(texto) {
  const t = String(texto || '').trim();
  if (!t) throw new Error('Pega primero un FEN, un PGN o un enlace de Lichess.');
  const enlace = soloEnlaceLichess(t) && t.match(/https?:\/\/(?:www\.)?lichess\.org\/\S+/);
  if (enlace) {
    const u = decodeURIComponent(enlace[0]);
    const pgnEnUrl = u.match(/lichess\.org\/analysis\/pgn\/([^?#]+)/);
    if (pgnEnUrl) return ejemploDesdePgn(pgnEnUrl[1].replace(/_/g, ' '));
    const fenEnUrl = u.match(/lichess\.org\/(?:analysis|editor)\/(?:standard\/|fromPosition\/)?([^?#]+)/);
    if (fenEnUrl && fenEnUrl[1].split('/').length >= 8) return ejemploDesdeFen(fenEnUrl[1].replace(/_/g, ' '));
    return ejemploDesdePgn(await pgnDeLichess(u));
  }
  if (/^[pnbrqkPNBRQK1-8]+(\/[pnbrqkPNBRQK1-8]+){7}(\s|$)/.test(t)) return ejemploDesdeFen(t);
  return ejemploDesdePgn(t);
}
// «Crear ejemplo desde aquí» (desde una partida o una línea): eliges la ficha y si
// quieres las jugadas hasta esa posición o solo la posición; se abre el editor con ello.
function crearEjemploDesde(ej, ply, color = 'white') {
  const fichas = [...conceptos()].sort((a, b) => (conceptoElegible(b) - conceptoElegible(a)) || a.titulo.localeCompare(b.titulo, 'es'));
  const d = document.createElement('div');
  d.className = 'modal hoja-abajo';
  d.innerHTML = `<div class="modal-caja termino crear-desde">
      <div class="t-cab"><b>Crear un ejemplo desde aquí</b></div>
      <p class="nota">${ply ? `Posición tras <b>${esc(etiquetaJ(ej, ply - 1))}</b>` : 'Posición inicial'}. ¿En qué ficha va?</p>
      <div class="segmento" id="cd-modo"><button class="on" data-m="jugadas">Con las jugadas hasta aquí</button><button data-m="posicion">Solo esta posición</button></div>
      <input type="search" id="cd-buscar" placeholder="Busca la ficha…" autocomplete="off">
      <div class="lista cd-lista">${fichas.map(c => `<button type="button" class="fila-c" data-c="${c.id}"><span class="fila-txt"><b>${esc(c.titulo)}</b><small>${esc(ubicacion(c))}</small></span>${ico('flecha', 'peq')}</button>`).join('') || '<p class="nada">Aún no tienes fichas: crea primero la ficha del concepto.</p>'}</div>
      <div class="botones"><button class="btn" data-cerrar>Cancelar</button></div>
    </div>`;
  let modo = 'jugadas';
  d.addEventListener('click', e => {
    if (e.target === d || e.target.closest('[data-cerrar]')) return d.remove();
    const m = e.target.closest('[data-m]');
    if (m) { modo = m.dataset.m; d.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('on', b === m)); return; }
    const f = e.target.closest('[data-c]');
    if (!f) return;
    const base = modo === 'posicion' ? ejemploVacio(ply ? ej.jugadas[ply - 1].fen : ej.fen0) : { ...ej, jugadas: ej.jugadas.slice(0, ply) };
    sessionStorage.setItem('mdp-borrador-ejemplo', aPgn(base));
    sessionStorage.setItem('mdp-borrador-color', color);
    d.remove();
    ir(`#/ejemplo/nuevo?concepto=${f.dataset.c}&borrador=1`);
  });
  d.querySelector('#cd-buscar').addEventListener('input', e => {
    const t = norm(e.target.value);
    d.querySelectorAll('.cd-lista [data-c]').forEach(b => { b.hidden = !!t && !norm(b.textContent).includes(t); });
  });
  document.body.appendChild(d);
}

const AYUDA_PEGAR = 'FEN: la posición (en Lichess, tablero de análisis o editor, campo «FEN»). PGN: las jugadas, en notación inglesa o española. Enlace: de una partida, un capítulo de estudio o el tablero de análisis de Lichess. De un PGN con variantes se toma la línea principal.';

function vEjemplo(v, id, q) {
  editando = true;
  const nuevo = id === 'nuevo';
  const fila = nuevo ? { concepto_id: q.get('concepto'), titulo: '', orientacion: 'white' } : D.obtener('ejemplos', id);
  if (!fila || !D.obtener('conceptos', fila.concepto_id)) return ir('#/conceptos');
  const concepto = D.obtener('conceptos', fila.concepto_id);
  // Desde otra pantalla («Crear ejemplo desde aquí») llega un borrador con la posición
  const borrador = nuevo && q.get('borrador') === '1' ? sessionStorage.getItem('mdp-borrador-ejemplo') : null;
  if (borrador) { sessionStorage.removeItem('mdp-borrador-ejemplo'); fila.orientacion = sessionStorage.getItem('mdp-borrador-color') || 'white'; }
  const ej = borrador ? dePgn(borrador) : nuevo ? ejemploVacio() : dePgn(fila.pgn || `[FEN "${fila.fen_inicial}"]`);
  let cambios = !!borrador, orientacion = fila.orientacion || 'white';
  let pregunta = fila.ply_pregunta || 0;   // jugada que es la pregunta del ejercicio (índice desde 0)
  // Si hay jugadas antes de la pregunta: jugarlas desde el principio (de serie) o verlas pasar
  let desdeInicio = nuevo ? true : fila.desde_inicio !== false;
  v.innerHTML = `
    <div class="cab-vista ej-cab">
      <a href="#/concepto/${concepto.id}" class="btn-ico" aria-label="Volver" id="volver">${ico('atras')}</a>
      <div class="ej-tit"><h1>${nuevo ? 'Nuevo ejemplo' : 'Ejemplo'}</h1><small>${esc(concepto.titulo)}</small></div>
      <button class="btn-ico" id="ampliar" aria-label="Ampliar">${ico('ampliar')}</button>
      <button class="btn primario peq" id="guardar">Guardar</button>
    </div>
    <div id="editor" class="editor"></div>
    <div class="ej-pie">
      <details class="pegar-pgn"><summary>Pegar FEN, PGN o enlace de Lichess</summary>
        <p class="nota">${AYUDA_PEGAR}</p>
        <textarea id="pg-txt" rows="3" placeholder="r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"></textarea>
        <button type="button" class="btn peq" id="pg-cargar">Cargar en el tablero</button></details>
      <label class="form solo"><span>Título del ejemplo <small>opcional</small></span>
        <input id="ej-titulo" maxlength="120" placeholder="Bloqueo del peón aislado con el caballo" value="${esc(fila.titulo || '')}"></label>
      <label class="check"><input type="checkbox" id="ej-ejercicio" ${fila.es_ejercicio ? 'checked' : ''}><span>Usar como ejercicio de repaso <small>— como un puzzle: tú juegas y la app contesta</small></span></label>
      <div class="ej-panel" id="ej-panel"${fila.es_ejercicio ? '' : ' hidden'}>
        <div class="ej-preg" id="ej-preg-txt"></div>
        <button type="button" class="btn peq" id="ej-marcar"></button>
        <label class="form solo"><span>Tu pregunta <small>opcional</small></span>
          <input id="ej-enunciado" maxlength="160" value="${esc(fila.enunciado || '')}"></label>
        <div class="ej-antes" id="ej-antes" hidden>
          <p class="ej-antes-tit" id="ej-antes-tit"></p>
          <label class="check"><input type="radio" name="ej-modo" value="jugar"><span><b>Jugarlas desde el principio</b> <small>— juegas tus jugadas y la app las del rival hasta llegar a la pregunta</small></span></label>
          <label class="check"><input type="radio" name="ej-modo" value="ver"><span><b>Verlas pasar y empezar en la pregunta</b> <small>— la app las reproduce despacio y se para en la pregunta</small></span></label>
        </div>
      </div>
      ${nuevo ? '' : `<button class="btn peligro" id="borrar">${ico('borrar', 'peq')} Borrar este ejemplo</button>`}
    </div>`;
  // Panel del ejercicio: la pregunta es la jugada que estás viendo en el tablero
  const ladoEn = i => ((i <= 0 ? ej.fen0 : ej.jugadas[i - 1].fen).split(' ')[1] === 'b' ? 'negras' : 'blancas');
  const pintarPregunta = plyActual => {
    if (!v.querySelector('#ej-panel')) return;
    const p = Math.min(pregunta, Math.max(0, ej.jugadas.length - 1));
    const txt = v.querySelector('#ej-preg-txt'), btn = v.querySelector('#ej-marcar');
    const antes = v.querySelector('#ej-antes');
    antes.hidden = !p;
    if (p) {
      v.querySelector('#ej-antes-tit').innerHTML = `Hay <b>${p} ${p === 1 ? 'jugada' : 'jugadas'}</b> antes de la pregunta. Al entrenar:`;
      v.querySelectorAll('[name=ej-modo]').forEach(r => { r.checked = r.value === (desdeInicio ? 'jugar' : 'ver'); });
    }
    txt.innerHTML = ej.jugadas.length ? `
      <p><span class="ej-preg-etq">Pregunta</span> <b>${esc(etiquetaJ(ej, p))}</b> · juegan ${ladoEn(p)} <small>(solo lo ves tú: en la lista, con «?»)</small></p>
      <p><span class="ej-preg-etq">Empieza</span> ${!p ? 'en la posición inicial del ejemplo: la pregunta es la primera jugada' : desdeInicio ? 'desde el principio: juegas también las jugadas de antes' : 'viendo pasar las jugadas de antes (en gris); te paras en la pregunta'}</p>
      <p class="nota">Cuando aciertes, la app contesta con la jugada del rival y sigues hasta el final del ejemplo.</p>`
      : '<p class="nota">Juega primero las jugadas en el tablero (modo Jugar).</p>';
    v.querySelector('#ej-enunciado').placeholder = `Juegan ${ladoEn(p)}. ${concepto.titulo}: ¿cuál es la mejor jugada?`;
    const n = plyActual ?? ed?.ply() ?? 0;
    btn.disabled = !n || n - 1 === p;
    btn.textContent = !n ? 'Para cambiar la pregunta, toca su jugada en la lista' : n - 1 === p ? `✓ ${etiquetaJ(ej, n - 1)} es la pregunta` : `Marcar ${etiquetaJ(ej, n - 1)} como pregunta`;
  };
  // En la lista de jugadas: la pregunta con «?» y las de antes en gris
  const marcas = () => (v.querySelector('#ej-ejercicio')?.checked && ej.jugadas.length
    ? { pregunta: Math.min(pregunta, ej.jugadas.length - 1), previas: !desdeInicio } : null);
  let ed;
  const montarEditor = () => {
    ed = crearEditor(v.querySelector('#editor'), ej, {
      orientacion,
      pedirPromocion,
      alCambiar: (_e, o) => { cambios = true; if (o) orientacion = o; },
      alPly: n => pintarPregunta(n),
      marcas,
    });
  };
  montarEditor();
  pintarPregunta();
  // Pegar: se sustituye lo que hay en el tablero (el ejemplo es el mismo objeto)
  v.querySelector('#pg-cargar').addEventListener('click', async () => {
    let nuevoEj;
    try { nuevoEj = await textoAEjemplo(v.querySelector('#pg-txt').value); } catch (err) { return alert(err.message); }
    // ¿Son las mismas jugadas desde la misma posición? Entonces solo cambian comentarios y
    // dibujos: se conservan la pregunta, cómo empieza y la orientación del tablero
    const firma = e => `${e.fen0}|${e.jugadas.map(j => j.san).join(' ')}`;
    const mismas = ej.jugadas.length > 0 && firma(ej) === firma(nuevoEj);
    if (!mismas && (ej.jugadas.length || ej.fen0 !== FEN_INICIAL) && !confirm('Se sustituirá lo que hay ahora en el tablero. ¿Seguir?')) return;
    ed.cerrar();
    Object.assign(ej, nuevoEj);
    if (!mismas) pregunta = 0;
    cambios = true;
    montarEditor(); pintarPregunta();
    v.querySelector('.pegar-pgn').open = false;
    aviso(mismas ? 'Comentarios y dibujos actualizados; la pregunta sigue donde estaba'
      : nuevoEj.jugadas.length ? `${nuevoEj.jugadas.length} jugadas cargadas: la primera es la pregunta` : 'Posición cargada');
  });
  v.querySelector('#ej-marcar').addEventListener('click', () => {
    pregunta = ed.ply() - 1; cambios = true; ed.repintar();
    if (pregunta > 0) { aviso('Hay jugadas antes de la pregunta: elige debajo cómo empezar'); v.querySelector('#ej-antes').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  });
  v.querySelector('#ej-enunciado').addEventListener('input', () => { cambios = true; });
  v.querySelectorAll('[name=ej-modo]').forEach(r => r.addEventListener('change', () => { desdeInicio = r.value === 'jugar'; cambios = true; ed.repintar(); }));
  limpiezas.push(() => ed.cerrar());
  // «Ampliar»: oculta cabecera, barra inferior y título para dejar sitio al tablero
  const ampliar = v.querySelector('#ampliar');
  const ponerEnfoque = (si, guardarEleccion) => {
    document.body.classList.toggle('enfoque', si);
    ampliar.setAttribute('aria-label', si ? 'Reducir' : 'Ampliar');
    ampliar.querySelector('path').setAttribute('d', si ? P.reducir : P.ampliar);
    if (guardarEleccion) localStorage.setItem('mdp-enfoque', si ? '1' : '0');
    window.scrollTo(0, 0);
    ed.ajustar();
  };
  ampliar.addEventListener('click', () => ponerEnfoque(!document.body.classList.contains('enfoque'), true));
  // En el móvil se abre ampliado de serie; si lo cambias, se recuerda tu elección.
  const eleccion = localStorage.getItem('mdp-enfoque');
  ponerEnfoque(eleccion ? eleccion === '1' : window.innerWidth < 700, false);
  limpiezas.push(() => document.body.classList.remove('enfoque'));
  v.querySelector('#ej-titulo').addEventListener('input', () => { cambios = true; });
  v.querySelector('#ej-ejercicio').addEventListener('change', e => { cambios = true; v.querySelector('#ej-panel').hidden = !e.target.checked; ed.repintar(); });
  protegerSalida(v, () => cambios);
  v.querySelector('#guardar').addEventListener('click', async () => {
    const err = ed.confirmar();
    if (err) return alert(err);
    const comoEjercicio = v.querySelector('#ej-ejercicio').checked;
    if (comoEjercicio && !ej.jugadas.length) return alert('Para usarlo como ejercicio, juega en el tablero al menos la jugada que será la pregunta.');
    Object.assign(fila, {
      titulo: v.querySelector('#ej-titulo').value.trim() || null,
      es_ejercicio: comoEjercicio,
      ply_pregunta: Math.min(pregunta, Math.max(0, ej.jugadas.length - 1)),
      enunciado: v.querySelector('#ej-enunciado').value.trim() || null,
      desde_inicio: desdeInicio,
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
  // Fichas que verás al abrir el bloque: las de sus temas activos y las sueltas
  const nVisibles = id => { const act = new Set(temasDe(id, true).map(t => t.id)); return conceptosDeBloque(id).filter(c => c.bloque_id === id || act.has(c.bloque_id)).length; };
  const verlas = fila => ({ texto: 'Verlas', href: fila.padre_id ? `#/bloque/${fila.padre_id}?tema=${fila.id}` : `#/bloque/${fila.id}` });
  const pintarCat = () => {
    const lista = bloques();
    v.innerHTML = `
      <div class="cab-vista"><a href="#/conceptos" class="btn-ico">${ico('atras')}</a><h1>Bloques y temas</h1></div>
      <div class="tarjeta guia">
        <p><b>Cómo se ordena tu cuaderno:</b> <span class="ruta-guia">Bloque → Tema → Ficha</span></p>
        <p>Ejemplo: <b>Táctica</b> → <b>Motivos tácticos</b> → <b>Enfilada</b>. Los bloques y los temas son las carpetas; las fichas, tus apuntes.</p>
        <p>Activa (interruptor verde) lo que vayas a usar. Lo que está en reserva no se pierde: queda guardado, sin estorbar. Toca un bloque para ver y activar sus temas.</p>
      </div>
      ${lista.length < 9 ? `<button class="btn anadir-cat" data-acc="catalogo">${ico('mas', 'peq')} Añadir lo que falte del catálogo (9 bloques y 40 temas)</button>` : ''}
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
          ${b.activo ? `<a class="cat-ir" href="#/bloque/${b.id}">Ver sus ${nVisibles(b.id)} fichas ${ico('flecha', 'peq')}</a>` : ''}
          ${abierto ? `
          <div class="cat-cuerpo">
            <div class="temas">
              ${temas.map((t, j) => `
                <div class="tema${t.activo ? '' : ' reserva'}">
                  <input class="tema-nom" data-acc="nombre" data-id="${t.id}" value="${esc(t.nombre)}" aria-label="Nombre del tema">
                  <button class="btn-ico peq" data-acc="subir" data-id="${t.id}" ${j ? '' : 'disabled'} aria-label="Subir">${ico('arriba')}</button>
                  <button class="btn-ico peq" data-acc="borrar" data-id="${t.id}" aria-label="Borrar tema">${ico('borrar')}</button>
                  ${b.activo && t.activo ? `<a class="tema-ir" href="#/bloque/${b.id}?tema=${t.id}" aria-label="Ver las fichas de ${esc(t.nombre)}">${conceptos().filter(c => c.bloque_id === t.id).length} fichas ${ico('flecha', 'peq')}</a>` : ''}
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
    if (acc === 'catalogo') {
      if (!navigator.onLine) return aviso('Necesitas conexión para traer el catálogo');
      el.disabled = true; el.textContent = 'Trayendo el catálogo…';
      try {
        await D.sincronizar();
        const n = await D.sembrarCatalogo();
        await D.sincronizar();
        aviso(n ? `Añadidos ${n} bloques y temas, en reserva` : 'Ya tenías todo el catálogo');
      } catch (err) { aviso('No se pudo: ' + err.message); }
    }
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
      if (el.checked) {
        const n = await sembrarBiblioteca();
        if (n) aviso(`Han aparecido ${n} fichas sugeridas, translúcidas hasta que les añadas tu ejemplo.`, verlas(fila));
      }
      pintarCat();
    }
    if (acc === 'nombre' && el.value.trim()) { fila.nombre = el.value.trim(); await D.guardar('bloques', fila); }
    if (acc === 'descripcion') { fila.descripcion = el.value.trim() || null; await D.guardar('bloques', fila); }
  });
  v.addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, nombre = f.n.value.trim();
    if (!nombre) return;
    let nueva;
    if (f.id === 'nuevo-bloque') {
      nueva = await D.guardar('bloques', { nombre, color: 'gris', icono: 'libro', orden: bloques().length + 1, activo: true, padre_id: null });
      abiertos.add(nueva.id);
    } else {
      const b = D.obtener('bloques', f.closest('.cat').dataset.id);
      nueva = await D.guardar('bloques', { nombre, padre_id: b.id, color: b.color, orden: temasDe(b.id).length + 1, activo: true });
    }
    const n = await sembrarBiblioteca();
    if (n) aviso(`Han aparecido ${n} fichas sugeridas, translúcidas hasta que les añadas tu ejemplo.`, verlas(nueva));
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
    ${tarjetaRepasoHoy() || '<a class="tarjeta practicar" href="#/repaso">' + ico('entrenar') + '<span><b>Repaso inteligente</b><small>Tus fichas y ejercicios, como en Anki</small></span>' + ico('flecha', 'peq') + '</a>'}
    <div class="dos-enlaces">
      <a class="tarjeta practicar" href="#/progreso">${ico('check')}<span><b>Mi progreso</b><small>Domino · repasar · fallo</small></span></a>
      <a class="tarjeta practicar" href="#/tecnicas">${ico('bandera')}<span><b>Técnicas</b><small>Lo esencial, dominado</small></span></a>
    </div>
    ${jugadasDificiles().length ? `<a class="tarjeta practicar" href="#/repaso?dificiles=1">${ico('rayo')}<span><b>Mis jugadas difíciles</b><small>${jugadasDificiles().length} jugadas de tu repertorio que sueles fallar</small></span>${ico('flecha', 'peq')}</a>` : ''}
    <a class="tarjeta practicar" href="#/repaso?n=5&ciegas=1">${ico('ojo')}<span><b>Repaso a ciegas</b><small>Nivel básico: mira la posición, oculta las piezas y juega de memoria</small></span>${ico('flecha', 'peq')}</a>
    <h3 class="sec">${ico('externo', 'peq')} En Lichess</h3>
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
        <div class="opciones">${radio('notacion', 'espanol', 'Española (Cf3)')}${radio('notacion', 'letras', 'Inglesa (Nf3)')}${radio('notacion', 'figuras', 'Figuras (♘f3)')}</div></fieldset>
      <fieldset><legend>Lichess</legend>
        <label>Tu usuario<input name="lichess" value="${esc(a.lichess)}" placeholder="usuario" autocapitalize="off" autocorrect="off"></label></fieldset>
      <fieldset><legend>Ayuda</legend>
        <label class="check"><input type="checkbox" name="primerosPasos" ${a.primerosPasos !== false ? 'checked' : ''}><span>Mostrar «Primeros pasos» en Inicio <small>(desaparece sola cuando los completas)</small></span></label>
        <p class="nota">En cada pantalla, el botón <b>?</b> explica para qué sirve. El manual completo está en <a href="#/guia">Guía</a>.</p></fieldset>
      <fieldset><legend>Nube</legend>
        <label class="check"><input type="checkbox" name="subida" ${a.subida ? 'checked' : ''}><span>Subir los cambios automáticamente cuando haya conexión</span></label>
        <p class="nota">Última sincronización: ${ult}. Cambios sin subir: ${D.pendientes()}.</p>
        ${D.estadoSync.error ? `<p class="error">${esc(D.estadoSync.error)}${D.estadoSync.detalle ? `<br><small>Detalle técnico: ${esc(D.estadoSync.detalle)}</small>` : ''}</p>` : ''}
        <button type="button" class="btn" id="sincr">${ico('nube', 'peq')} Sincronizar ahora</button>
      </fieldset>
      <fieldset><legend>Copia de seguridad</legend>
        <p class="nota">Tus datos ya están en Supabase. Esto es una copia extra en un archivo, por si acaso.</p>
        <div class="fila-btn">
          <button type="button" class="btn" id="copia-json">${ico('descargar', 'peq')} Descargar copia completa</button>
          <button type="button" class="btn" id="copia-pgn">${ico('descargar', 'peq')} Ejemplos en PGN</button>
        </div>
        <p class="nota">Para recuperar una copia descargada antes: elige el archivo <b>MdP-copia-….json</b>. Vuelve todo lo que había en ella; lo que hayas creado después se conserva.</p>
        <label class="btn subir-copia">${ico('subir', 'peq')} Restaurar desde una copia<input type="file" id="restaurar" accept=".json,application/json" hidden></label>
      </fieldset>
      <details class="peligro-zona">
        <summary>Zona peligrosa</summary>
        <p><b>Empezar de cero</b> borra todas tus fichas, ejemplos, clases, notas, repasos y preguntas, en este dispositivo y en la nube. La app queda como recién instalada, con el catálogo en reserva. Tus ajustes se conservan.</p>
        <p class="nota">Consejo: descarga antes una copia completa, por si acaso.</p>
        <label>Para confirmar, escribe <b>BORRAR</b><input id="confirmar-borrar" autocomplete="off" autocapitalize="characters" placeholder="BORRAR"></label>
        <button type="button" class="btn peligro" id="empezar-cero" disabled>Borrar todo y empezar de cero</button>
      </details>
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
  v.querySelector('#copia-json').addEventListener('click', descargarCopia);
  v.querySelector('#copia-pgn').addEventListener('click', () => {
    const partes = [];
    for (const e of D.lista('ejemplos')) {
      const c = D.obtener('conceptos', e.concepto_id);
      if (!c) continue;
      const b = bloqueRaiz(c.bloque_id);
      const cuerpo = (e.pgn || '').replace(/\[(SetUp|FEN)[^\]]*\]\s*/g, '').trim() || '*';
      const cab = [`[Event "${(c.titulo || '').replace(/"/g, "'")}"]`, `[Site "Memorias de Peón"]`, `[White "${(e.titulo || 'Ejemplo').replace(/"/g, "'")}"]`,
        `[Black "${(b ? b.nombre : 'Bandeja').replace(/"/g, "'")}"]`, `[Result "*"]`];
      if (e.fen_inicial && !e.fen_inicial.startsWith('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w')) cab.push('[SetUp "1"]', `[FEN "${e.fen_inicial}"]`);
      partes.push(cab.join('\n') + '\n\n' + cuerpo);
    }
    if (!partes.length) return aviso('Aún no tienes ejemplos');
    descargar(`MdP-ejemplos-${hoyISO()}.pgn`, partes.join('\n\n') + '\n', 'application/x-chess-pgn');
  });
  v.querySelector('#restaurar').addEventListener('change', async e => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    try {
      const copia = JSON.parse(await archivo.text());
      const fecha = copia.fecha ? new Date(copia.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : 'desconocida';
      if (!confirm(`¿Restaurar la copia del ${fecha}? Lo que había en ella volverá a tu cuaderno.`)) return;
      const n = await D.restaurarCopia(copia);
      aviso(`Copia restaurada: ${n} elementos recuperados`);
      pintar();
    } catch (err) { alert('No se pudo restaurar: ' + err.message); }
    e.target.value = '';
  });
  const conf = v.querySelector('#confirmar-borrar'), btnCero = v.querySelector('#empezar-cero');
  conf.addEventListener('input', () => { btnCero.disabled = conf.value.trim().toUpperCase() !== 'BORRAR'; });
  btnCero.addEventListener('click', async () => {
    if (conf.value.trim().toUpperCase() !== 'BORRAR') return;
    if (!confirm('Última comprobación: se borrará TODO tu cuaderno, aquí y en la nube. ¿Seguir?')) return;
    btnCero.disabled = true; btnCero.textContent = 'Borrando…';
    try {
      await D.borrarTodo();
      await iniciarSesion(usuario);
      aviso('Listo: la app está como recién instalada');
      ir('#/inicio');
    } catch (err) { alert(err.message); btnCero.disabled = false; btnCero.textContent = 'Borrar todo y empezar de cero'; }
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

// ---------------------------------------------------------------------
//  Utilidades de la fase 1B
// ---------------------------------------------------------------------
const hoyISO = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
function fechaLarga(f) {
  if (!f) return '';
  const d = new Date(f + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined });
}
const claseDeHoy = () => D.lista('clases').find(k => k.fecha === hoyISO()) || null;
const adaptada = c => c.original && ['titulo', 'principio', 'explicacion'].some(k => (c[k] || '') !== (c.original[k] || ''));
// Copia de seguridad completa (y se anota la fecha para el recordatorio mensual)
function descargarCopia() {
  const datos = Object.fromEntries(D.TABLAS.map(t => [t, D.lista(t)]));
  descargar(`MdP-copia-${hoyISO()}.json`, JSON.stringify({ app: 'Memorias de Peón', version: VERSION, fecha: new Date().toISOString(), datos }, null, 1), 'application/json');
  guardarAjustes({ ultimaCopia: R.hoyISO(), copiaPospuesta: null });
}
// Recordatorio en Inicio: si hay datos y la última copia tiene más de 30 días (o no hay ninguna)
function tarjetaCopia() {
  const a = ajustes(), hoy = R.hoyISO();
  if (!(fichasDeTrabajo().some(conceptoElegible) || aperturas().length || partidas().length)) return '';
  if (a.copiaPospuesta && a.copiaPospuesta > hoy) return '';
  const dias = a.ultimaCopia ? Math.round((new Date(hoy) - new Date(a.ultimaCopia)) / 864e5) : null;
  if (dias !== null && dias < 30) return '';
  return `<section class="tarjeta aviso-copia">
      <b>${ico('descargar', 'peq')} Toca hacer tu copia de seguridad</b>
      <p>${dias === null ? 'Aún no has descargado ninguna copia.' : `Tu última copia es de hace ${dias} días.`} Tus datos están en la nube, pero una copia en tu ordenador es la mejor garantía.</p>
      <div class="fila-btn"><button class="btn primario peq" id="copia-ya">Descargar copia</button><button class="btn peq" id="copia-luego">En una semana</button></div>
    </section>`;
}

function descargar(nombre, texto, tipo) {
  const url = URL.createObjectURL(new Blob([texto], { type: tipo + ';charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = nombre;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ---------------------------------------------------------------------
//  NOTA RÁPIDA (ventana para apuntar en diez segundos)
// ---------------------------------------------------------------------
function abrirNotaRapida() {
  const hoy = claseDeHoy();
  const d = document.createElement('div');
  d.className = 'modal';
  d.innerHTML = `<form class="modal-caja nota-caja">
      <p>Nota rápida</p>
      <textarea name="t" rows="5" placeholder="La primera línea será el título si luego la conviertes en ficha" required></textarea>
      <label class="check"><input type="checkbox" name="clase" ${hoy ? 'checked' : ''}><span>${hoy ? `De la clase de hoy${hoy.titulo ? ' · ' + esc(hoy.titulo) : ''}` : 'Crear la clase de hoy y apuntarla ahí'}</span></label>
      <div class="botones"><button type="button" class="btn" data-cerrar>Cancelar</button><button class="btn primario">Guardar</button></div>
    </form>`;
  document.body.appendChild(d);
  const f = d.querySelector('form');
  setTimeout(() => f.t.focus(), 50);
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-cerrar]')) d.remove(); });
  f.addEventListener('submit', async e => {
    e.preventDefault();
    let claseId = null;
    if (f.clase.checked) claseId = (hoy || await D.guardar('clases', { fecha: hoyISO(), titulo: null })).id;
    await D.guardar('notas_rapidas', { texto: f.t.value.trim(), clase_id: claseId, procesada: false });
    d.remove();
    aviso('Nota guardada');
    pintar(true);
  });
}

// ---------------------------------------------------------------------
//  NOTAS RÁPIDAS
// ---------------------------------------------------------------------
function vNotas(v) {
  const notas = D.lista('notas_rapidas').sort((a, b) => (a.procesada - b.procesada) || String(b.editado_en).localeCompare(String(a.editado_en)));
  v.innerHTML = `
    <div class="cab-vista"><a href="#/inicio" class="btn-ico">${ico('atras')}</a><h1>Notas rápidas</h1></div>
    <p class="intro">Lo que apuntas deprisa en clase. Conviértelo en ficha cuando tengas un rato.</p>
    ${notas.length ? notas.map(n => {
      const k = n.clase_id && D.obtener('clases', n.clase_id);
      return `<div class="tarjeta nota${n.procesada ? ' hecha' : ''}" data-id="${n.id}">
        <div class="md">${md(n.texto)}</div>
        <small class="nota-meta">${k ? `Clase del ${fechaLarga(k.fecha)} · ` : ''}${new Date(n.editado_en).toLocaleDateString('es-ES')}</small>
        <div class="fila-btn">
          ${n.procesada ? '<span class="estado hecho">Ordenada</span>' : `<a class="btn peq primario" href="#/editar/nuevo?nota=${n.id}">Hacer ficha</a>
          <button class="btn peq" data-acc="hecha">Marcar como ordenada</button>`}
          <button class="btn-ico peq" data-acc="borrar" aria-label="Borrar">${ico('borrar')}</button>
        </div></div>`;
    }).join('') : '<p class="nada">No tienes notas. Usa «Nota rápida» en Inicio.</p>'}
    <button class="btn flotante" id="nueva-nota" aria-label="Nota rápida">${ico('nota')}</button>`;
  v.querySelector('#nueva-nota').addEventListener('click', () => abrirNotaRapida());
  v.addEventListener('click', async e => {
    const b = e.target.closest('[data-acc]');
    if (!b) return;
    const n = D.obtener('notas_rapidas', b.closest('[data-id]').dataset.id);
    if (b.dataset.acc === 'hecha') { n.procesada = true; await D.guardar('notas_rapidas', n); }
    if (b.dataset.acc === 'borrar') { if (!confirm('¿Borrar esta nota?')) return; await D.borrar('notas_rapidas', n.id); }
    pintar(true);
  });
}

// ---------------------------------------------------------------------
//  DIARIO DE CLASES
// ---------------------------------------------------------------------
function vClases(v) {
  const clases = D.lista('clases').sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
  v.innerHTML = `
    <div class="cab-vista"><h1>Diario de clases</h1>
      <a class="btn peq" href="#/preguntas">${ico('guia', 'peq')} Preguntas${preguntas().filter(p => !p.respondida).length ? ' · ' + preguntas().filter(p => !p.respondida).length : ''}</a></div>
    ${clases.length ? `<div class="lista">${clases.map(k => {
      const n = conceptos().filter(c => c.clase_id === k.id).length;
      return `<a class="fila-c" href="#/clase/${k.id}">
        <span class="fecha-cal"><b>${new Date(k.fecha + 'T12:00:00').getDate()}</b><small>${new Date(k.fecha + 'T12:00:00').toLocaleDateString('es-ES', { month: 'short' })}</small></span>
        <span class="fila-txt"><b>${esc(k.titulo || 'Clase del ' + fechaLarga(k.fecha))}</b><small>${n} ${n === 1 ? 'ficha' : 'fichas'}${k.deberes ? ' · con deberes' : ''}</small></span>
        ${ico('flecha', 'peq')}</a>`;
    }).join('')}</div>` : `<div class="tarjeta vacia"><h2>Tu primera clase</h2><p>Apunta la fecha, lo que visteis y los deberes. Las fichas que crees ese día quedarán unidas a la clase.</p></div>`}
    <button class="btn flotante" id="nueva-clase" aria-label="Nueva clase">${ico('mas')}</button>`;
  v.querySelector('#nueva-clase').addEventListener('click', async () => {
    const hoy = claseDeHoy();
    if (hoy) return ir('#/clase/' + hoy.id);
    const k = await D.guardar('clases', { fecha: hoyISO(), titulo: null });
    ir('#/clase/' + k.id + '?editar=1');
  });
}

function vClase(v, id, q) {
  const k = D.obtener('clases', id);
  if (!k) return ir('#/clases');
  const fichas = conceptos().filter(c => c.clase_id === id).sort(ordenar);
  const notas = D.lista('notas_rapidas').filter(n => n.clase_id === id);
  const editar = q.get('editar') === '1';
  editando = editar;
  v.innerHTML = `
    <div class="cab-vista"><a href="#/clases" class="btn-ico">${ico('atras')}</a><h1>${esc(k.titulo || 'Clase')}</h1>
      ${editar ? '' : `<a href="#/clase/${id}?editar=1" class="btn peq">${ico('editar', 'peq')} Editar</a>`}</div>
    ${editar ? `
      <form id="f-clase" class="form">
        <div class="dos"><label>Fecha<input type="date" name="fecha" required value="${esc(k.fecha)}"></label>
          <label>Título <small>opcional</small><input name="titulo" value="${esc(k.titulo || '')}" placeholder="Estructuras de peones"></label></div>
        <label>Lo que vimos<textarea name="resumen" rows="6" placeholder="Ideas principales de la clase">${esc(k.resumen || '')}</textarea></label>
        <label>Deberes<textarea name="deberes" rows="3" placeholder="Ejercicios o partidas para la próxima clase">${esc(k.deberes || '')}</textarea></label>
        <div class="botones"><button class="btn primario">Guardar</button><button type="button" class="btn peligro" id="borrar-clase">${ico('borrar', 'peq')}</button></div>
      </form>` : `
      <p class="intro">${fechaLarga(k.fecha)}</p>
      ${k.resumen ? `<div class="tarjeta"><span class="etq">Lo que vimos</span><div class="md">${md(k.resumen)}</div></div>` : ''}
      ${k.deberes ? `<div class="tarjeta deberes"><span class="etq">Deberes</span><div class="md">${md(k.deberes)}</div></div>` : ''}
      <h3 class="sec">Fichas de esta clase <small>${fichas.length || ''}</small></h3>
      ${fichas.length ? `<div class="lista">${fichas.map(filaConcepto).join('')}</div>` : ''}
      <a class="btn anadir-ej" href="#/editar/nuevo?clase=${id}">${ico('mas')} Nueva ficha de esta clase</a>
      ${preguntas().filter(p => p.clase_id === id).length ? `<h3 class="sec">Preguntas al maestro</h3><div class="lista">${preguntas().filter(p => p.clase_id === id).map(filaPregunta).join('')}</div>` : ''}
      ${notas.length ? `<h3 class="sec">Notas rápidas</h3>${notas.map(n => `<div class="tarjeta nota${n.procesada ? ' hecha' : ''}"><div class="md">${md(n.texto)}</div></div>`).join('')}` : ''}`}`;
  if (editar) protegerSalida(v);
  v.querySelector('#f-clase')?.addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    Object.assign(k, { fecha: f.fecha.value, titulo: f.titulo.value.trim() || null, resumen: f.resumen.value.trim() || null, deberes: f.deberes.value.trim() || null });
    await D.guardar('clases', k);
    editando = false;
    aviso('Clase guardada');
    ir('#/clase/' + id);
  });
  v.querySelector('#borrar-clase')?.addEventListener('click', async () => {
    if (!confirm('¿Borrar esta clase? Sus fichas y notas no se borran, solo dejan de estar unidas a ella.')) return;
    for (const c of fichas) { c.clase_id = null; await D.guardar('conceptos', c); }
    for (const n of notas) { n.clase_id = null; await D.guardar('notas_rapidas', n); }
    await D.borrar('clases', id);
    editando = false;
    ir('#/clases');
  });
}

// ---------------------------------------------------------------------
//  GLOSARIO español – inglés
// ---------------------------------------------------------------------
// Términos básicos. Los que define la biblioteca (biblioteca.js) no se repiten aquí.
const GLOSARIO = [
  ['Apertura', 'Opening', 'Primera fase: desarrollo, centro y seguridad del rey.'],
  ['Bloqueo', 'Blockade', 'Situar una pieza delante de un peón para frenarlo. Ideal: el caballo.'],
  ['Enroque', 'Castling', 'Movimiento de rey y torre que protege al rey y activa la torre.'],
  ['Final', 'Endgame', 'Fase con poco material, donde el rey se vuelve una pieza activa.'],
  ['Medio juego', 'Middlegame', 'Fase de planes, ataques y maniobras tras el desarrollo.'],
  ['Sacrificio', 'Sacrifice', 'Entregar material a cambio de ataque, posición o mate.'],
  ['Tablas', 'Draw', 'Final de partida sin ganador.'],
  ['Zugzwang', 'Zugzwang', 'Cualquier jugada empeora la posición: estar obligado a mover perjudica.'],
];
function vGlosario(v, _id, q) {
  const mapa = terminos();
  const todos = [...mapa.values()].filter(t => t.def || t.en).sort((a, b) => a.es.localeCompare(b.es, 'es'));
  v.innerHTML = `
    <div class="cab-vista"><a href="#/inicio" class="btn-ico">${ico('atras')}</a><h1>Glosario</h1></div>
    <p class="intro">${todos.length} términos. «Ver ficha» abre tu ficha con tus ejemplos; «Ver en la biblioteca», la teoría de serie.</p>
    <label class="buscador">${ico('buscar')}<input type="search" id="g-buscar" placeholder="Busca en español o en inglés" value="${esc(q.get('q') || '')}"></label>
    <div class="lista glosario">${todos.map(t => `
      <div class="g-fila" data-t="${esc(norm(t.es + ' ' + (t.en || '') + ' ' + (t.def || '') + ' ' + t.alias.join(' ')))}">
        <div><b>${esc(t.es)}</b> <span class="g-en">${esc(t.en || '')}</span>${t.propio ? ' <span class="estado">mío</span>' : ''}</div>
        <small>${esc(t.def || '')}</small>
        <div class="g-acc">
          ${t.ficha ? `<a class="chip" href="#/concepto/${t.ficha}">${ico('conceptos', 'peq')} Ver ficha</a>`
            : t.biblio ? `<a class="chip" href="#/biblioteca/${t.biblio}">${ico('libro', 'peq')} Ver en la biblioteca</a>`
            : `<a class="chip" href="#/editar/nuevo?titulo=${encodeURIComponent(t.es)}">${ico('mas', 'peq')} Crear ficha</a>`}
          ${t.propio ? `<button class="btn-ico peq g-borrar" data-id="${t.propio}" aria-label="Borrar">${ico('borrar')}</button>` : ''}
        </div>
      </div>`).join('')}</div>
    <form class="tarjeta form" id="g-nuevo">
      <b>Añadir un término</b>
      <div class="dos"><input name="es" placeholder="Español" required><input name="en" placeholder="Inglés"></div>
      <input name="def" placeholder="Definición breve">
      <button class="btn">Añadir</button>
    </form>`;
  const inp = v.querySelector('#g-buscar');
  const filtrar = () => {
    const t = norm(inp.value);
    v.querySelectorAll('.g-fila').forEach(f => { f.hidden = t && !f.dataset.t.includes(t); });
  };
  inp.addEventListener('input', filtrar);
  filtrar();
  v.querySelector('#g-nuevo').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    await D.guardar('glosario', { termino_es: f.es.value.trim(), termino_en: f.en.value.trim() || null, definicion: f.def.value.trim() || null });
    aviso('Término añadido');
    pintar(true);
  });
  v.querySelectorAll('.g-borrar').forEach(b => b.addEventListener('click', async () => {
    if (!confirm('¿Borrar este término?')) return;
    await D.borrar('glosario', b.dataset.id); pintar(true);
  }));
}

// ---------------------------------------------------------------------
//  RUTINA DE PENSAMIENTO
// ---------------------------------------------------------------------
const RUTINA_DEF = [
  '¿Qué amenaza la última jugada del rival?',
  'Jugadas forzantes: jaques, capturas y amenazas (mías y suyas)',
  '¿Hay piezas desprotegidas o mal defendidas?',
  '¿Cuál es la peor pieza que tengo? ¿Cómo la mejoro?',
  'Jugadas candidatas: elige dos o tres',
  'Calcula y evalúa la posición final',
  'Antes de jugar: ¿dejo algo colgado? (comprobación final)',
];
function vRutina(v, _id, q) {
  const pasos = ajustes().rutina || RUTINA_DEF;
  const editar = q.get('editar') === '1';
  editando = editar;
  v.innerHTML = `
    <div class="cab-vista"><a href="#/inicio" class="btn-ico">${ico('atras')}</a><h1>Rutina de pensamiento</h1>
      ${editar ? '' : `<a href="#/rutina?editar=1" class="btn peq">${ico('editar', 'peq')} Editar</a>`}</div>
    ${editar ? `
      <form id="f-rutina" class="form">
        <label>Un paso por línea<textarea name="pasos" rows="10">${esc(pasos.join('\n'))}</textarea></label>
        <div class="botones"><button class="btn primario">Guardar</button><button type="button" class="btn" id="r-def">Volver a la de serie</button></div>
      </form>` : `
      <p class="intro">Repásala antes de cada jugada importante, hasta que salga sola.</p>
      <ol class="rutina">${pasos.map(p => `<li><label><input type="checkbox"><span>${esc(p)}</span></label></li>`).join('')}</ol>`}`;
  v.querySelector('#f-rutina')?.addEventListener('submit', async e => {
    e.preventDefault();
    await guardarAjustes({ rutina: e.target.pasos.value.split('\n').map(s => s.trim()).filter(Boolean) });
    editando = false; ir('#/rutina');
  });
  v.querySelector('#r-def')?.addEventListener('click', async () => { await guardarAjustes({ rutina: null }); editando = false; ir('#/rutina'); });
}

// ---------------------------------------------------------------------
//  GUÍA
// ---------------------------------------------------------------------
function vGuia(v) {
  v.innerHTML = `
    <div class="cab-vista"><a href="#/inicio" class="btn-ico">${ico('atras')}</a><h1>Guía</h1></div>
    <div class="guia-app">
      <section class="tarjeta"><h2>Cómo se ordena</h2>
        <p class="ruta-guia">Bloque → Tema → Ficha</p>
        <p>Ejemplo: <b>Táctica</b> → <b>Motivos tácticos</b> → <b>Enfilada</b>. Bloques y temas son las carpetas; las fichas, tus apuntes. Actívalos o déjalos en reserva en <a href="#/catalogo">Conceptos → Bloques</a>.</p></section>
      <section class="tarjeta"><h2>La biblioteca</h2>
        <p>En <a href="#/biblioteca">Biblioteca</a> tienes la teoría de serie, ordenada por bloques y temas. Lo que está en reserva lo puedes leer igualmente y añadirlo a tu cuaderno con un toque. Las fichas de serie aparecen translúcidas hasta que les añades tu propio ejemplo: el tablero lo pones tú.</p></section>
      <section class="tarjeta"><h2>Una ficha</h2>
        <p><b>Nombre del concepto</b> (Enfilada), <b>principio</b> (la frase clave), <b>explicación</b> (con **negrita**, *cursiva* y listas «- »), etiquetas, la clase en que lo viste y su enlace a los puzzles de Lichess.</p>
        <p>Una ficha está <b>Trabajada</b> cuando le añades al menos un ejemplo tuyo.</p></section>
      <section class="tarjeta"><h2>El tablero</h2>
        <p>Dentro de cada ficha: <b>Añadir ejemplo en el tablero</b>. Tres modos:</p>
        <ul><li><b>Posición</b>: <i>Vaciar</i> y coloca las piezas que quieras (la ✕ las quita). Indica quién juega.</li>
        <li><b>Jugar</b>: mueve; la notación se escribe sola. Escribe un comentario en cada jugada.</li>
        <li><b>Dibujar</b>: elige color, toca salida y llegada para una flecha; dos veces la misma casilla para marcarla.</li></ul></section>
      <section class="tarjeta"><h2>Repaso diario</h2>
        <p>Como en Anki: cada día, en Inicio, «Repaso · 10» o «Rápido · 5», con nota sobre 10. Entran tus fichas y las de la biblioteca que ya has trabajado. En el tablero, la pista te da primero el concepto y después la idea, nunca la jugada; si la usas, cuenta como Regular. Lo que aciertas vuelve más tarde; lo que fallas, mañana. En <a href="#/progreso">Mi progreso</a> ves qué dominas, qué repasar y en qué fallas.</p>
        <p>Para crear ejercicios de tablero, marca «Usar como ejercicio de repaso» en un ejemplo: la primera jugada será la solución.</p></section>
      <section class="tarjeta"><h2>Repertorio</h2>
        <p>Tus aperturas, elegidas por ti: hasta 5 por color (3 principales y 2 secundarias). La app no te propone ninguna; te guía para que cada una quede completa, paso a paso: <b>las jugadas que la definen</b>, objetivos, <b>línea principal</b>, <b>respuestas del rival</b>, estructura, planes, rupturas, <b>trampas</b>, tácticas, partidas modelo, conceptos de tu cuaderno y, al final, revisarla con tu maestro.</p>
        <p>Cada apertura muestra su porcentaje y el <b>siguiente paso</b>. En cada línea tienes enlaces para comprobarla en Lichess: el tablero de análisis y el <b>explorador</b>, donde ves qué juegan de verdad los rivales. También puedes pegar un PGN copiado de Lichess.</p>
        <p><b>Entrenar</b>: la app hace las jugadas del rival y tú las tuyas, con dos intentos por jugada; la pista es tu comentario, nunca la jugada. Cada línea que llega al menos a tu 5.ª jugada entra en el repaso diario: la que te sale bien tarda más en volver y la que fallas vuelve mañana. Con <b>Entrenar esta apertura</b> repasas todas sus líneas cuando quieras, primero las que peor llevas. El icono de impresora saca el repertorio en PDF.</p></section>
      <section class="tarjeta"><h2>Mis partidas</h2>
        <p>Solo las que eliges: las que jugaste pensando. Tráelas de Lichess marcándolas en la lista de tus últimas partidas, o pega su enlace o su PGN. Cada partida tiene su <b>guía de revisión</b>: los datos, tu apertura (la app detecta dónde se salió alguien de tu repertorio y te deja añadir la respuesta del rival como línea nueva), <b>tus ideas antes del motor</b>, los <b>momentos clave</b>, el motor de Lichess, tus <b>errores convertidos en ejercicios</b> de repaso, los conceptos de tu cuaderno y <b>la lección</b>.</p>
        <p>Para marcar un momento, ve a la jugada en el tablero de la partida y pulsa «Marcar momento». En <b>Resumen</b> ves tus resultados por color y apertura, y tus errores más repetidos.</p></section>
      <section class="tarjeta"><h2>En clase</h2>
        <p><b>Nota rápida</b> (en Inicio) para apuntar al vuelo; luego, en <a href="#/notas">Notas</a>, la conviertes en ficha. En <a href="#/clases">Clases</a> tienes el diario: lo que visteis, deberes y las fichas de cada día.</p></section>
      <section class="tarjeta"><h2>Sin conexión</h2>
        <p>Todo se guarda al momento en el móvil. Arriba verás <b>Subir N</b> si hay cambios pendientes, y <b>Al día</b> cuando ya están en la nube. Para que funcione sin cobertura, instala la app: Safari → Compartir → <b>Añadir a pantalla de inicio</b>.</p></section>
      <section class="tarjeta"><h2>Papel y copias</h2>
        <p><b>Imprimir</b>: desde una ficha (icono de impresora) o desde Conceptos. En la ventana de impresión elige «Guardar como PDF». En Ajustes tienes la <b>copia de seguridad</b> y la exportación de tus ejemplos en PGN.</p></section>
    </div>`;
}

// ---------------------------------------------------------------------
//  IMPRIMIR / PDF
// ---------------------------------------------------------------------
function vImprimir(v, _id, q) {
  const ficha = q.get('ficha');
  const sel = q.get('bloque') || (ficha ? '' : 'todos');
  const conEj = q.get('ej') !== '0';
  let lista;
  if (ficha) lista = [D.obtener('conceptos', ficha)].filter(Boolean);
  else if (sel === 'todos') lista = bloquesActivos().flatMap(b => conceptosDeBloque(b.id));
  else if (sel === 'bandeja') lista = conceptos().filter(c => !c.bloque_id);
  else lista = conceptosDeBloque(sel);
  const ordenBloque = id => { const b = bloqueRaiz(id); return b ? b.orden : 999; };
  lista.sort((a, b) => ordenBloque(a.bloque_id) - ordenBloque(b.bloque_id) || ordenar(a, b));
  const titulo = ficha ? (lista[0]?.titulo || '') : sel === 'todos' ? 'Todos mis bloques' : sel === 'bandeja' ? 'Bandeja' : (D.obtener('bloques', sel)?.nombre || '');
  const fichaHtml = c => {
    const b = bloqueRaiz(c.bloque_id);
    const t = c.bloque_id && D.obtener('bloques', c.bloque_id)?.padre_id ? D.obtener('bloques', c.bloque_id) : null;
    const ejs = conEj ? ejemplosDe(c.id) : [];
    return `<article class="p-ficha" style="--c:${b ? col(b.color) : '#888'}">
      <div class="p-cab"><span>${b ? esc(b.nombre) + (t ? ' · ' + esc(t.nombre) : '') : 'Bandeja'}</span></div>
      <h2>${esc(c.titulo)}</h2>
      ${c.principio ? `<blockquote>${esc(c.principio)}</blockquote>` : ''}
      ${c.explicacion ? `<div class="md">${md(c.explicacion)}</div>` : ''}
      ${ejs.map((e, i) => {
        let ej; try { ej = dePgn(e.pgn || `[FEN "${e.fen_inicial}"]`); } catch (err) { return ''; }
        return `<div class="p-ej">${diagrama(ej, { orientacion: e.orientacion })}
          <div class="p-ej-txt"><b>${esc(e.titulo || 'Ejemplo ' + (i + 1))}</b>
          ${ej.comentario0 ? `<p>${esc(ej.comentario0)}</p>` : ''}
          ${ej.jugadas.length ? `<p class="p-jug">${textoJugadas(ej)}</p>` : `<p class="p-turno">Juegan ${ej.fen0.split(' ')[1] === 'b' ? 'negras' : 'blancas'}</p>`}</div></div>`;
      }).join('')}
    </article>`;
  };
  v.innerHTML = `
    <div class="no-imp">
      <div class="cab-vista"><a href="${ficha ? '#/concepto/' + ficha : '#/conceptos'}" class="btn-ico">${ico('atras')}</a><h1>Imprimir</h1></div>
      ${ficha ? '' : `<div class="form"><label>Qué imprimir
        <select id="p-sel"><option value="todos" ${sel === 'todos' ? 'selected' : ''}>Todos los bloques activos</option>
        ${bloquesActivos().map(b => `<option value="${b.id}" ${sel === b.id ? 'selected' : ''}>${esc(b.nombre)}</option>`).join('')}
        <option value="bandeja" ${sel === 'bandeja' ? 'selected' : ''}>Bandeja</option></select></label></div>`}
      <label class="check"><input type="checkbox" id="p-ej" ${conEj ? 'checked' : ''}><span>Incluir los ejemplos con su diagrama</span></label>
      <p class="nota">${lista.length} ${lista.length === 1 ? 'ficha' : 'fichas'}. En la ventana de impresión elige «Guardar como PDF» si lo quieres en archivo.</p>
      <button class="btn primario ancho" id="p-imp">${ico('imprimir', 'peq')} Imprimir o guardar en PDF</button>
      <h3 class="sec">Vista previa</h3>
    </div>
    <div class="hoja">
      <header class="p-portada"><span class="mono">M<i>d</i>P</span><div><b>Memorias de Peón</b><small>${esc(titulo)} · ${new Date().toLocaleDateString('es-ES')}</small></div></header>
      ${lista.map(fichaHtml).join('') || '<p class="nada">No hay fichas que imprimir.</p>'}
      <footer class="p-pie">Memorias de Peón · Casilla a casilla · by Manuel Esteve</footer>
    </div>`;
  const recargar = () => {
    const p = new URLSearchParams();
    if (ficha) p.set('ficha', ficha); else p.set('bloque', v.querySelector('#p-sel').value);
    if (!v.querySelector('#p-ej').checked) p.set('ej', '0');
    history.replaceState(null, '', '#/imprimir?' + p.toString());
    pintar(true);
  };
  v.querySelector('#p-sel')?.addEventListener('change', recargar);
  v.querySelector('#p-ej').addEventListener('change', recargar);
  v.querySelector('#p-imp').addEventListener('click', () => window.print());
}

// ---------------------------------------------------------------------
//  BIBLIOTECA: las fichas de serie aparecen al activar su tema
// ---------------------------------------------------------------------
async function idDeterminista(texto) {
  // Mismo id en todos tus dispositivos, para que nunca se dupliquen.
  const h = new Uint8Array(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(texto)));
  h[6] = (h[6] & 0x0f) | 0x50; h[8] = (h[8] & 0x3f) | 0x80;
  const x = [...h.slice(0, 16)].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20, 32)}`;
}
let sembrando = false;
async function sembrarBiblioteca() {
  if (sembrando || !usuario || !crypto.subtle) return 0;
  sembrando = true;
  let n = 0;
  try {
    const titulos = new Set(conceptos().map(c => norm(c.titulo)));
    for (const it of BIBLIOTECA) {
      const { b, t } = ubicar(it);
      if (!b || !t || !b.activo || !t.activo) continue;
      const id = await idDeterminista(usuario.id + ':' + it.id);
      if (D.obtenerAunBorrado('conceptos', id)) continue;            // ya está (o la borraste tú)
      if (titulos.has(norm(it.titulo))) continue;                     // ya tienes tu propia ficha
      await D.guardar('conceptos', {
        id, titulo: it.titulo, principio: it.principio, explicacion: it.explicacion, pista: it.pista,
        practica_lichess: it.lichess, bloque_id: t.id, etiquetas: [], origen: 'mdp', orden: BIBLIOTECA.indexOf(it) + 1,
        original: { id: it.id, titulo: it.titulo, principio: it.principio, explicacion: it.explicacion },
      });
      titulos.add(norm(it.titulo));
      n++;
    }
  } catch (e) { console.error(e); }
  sembrando = false;
  return n;
}

// ---------------------------------------------------------------------
//  TÉRMINOS: glosario + biblioteca + tus fichas, todo enlazado
// ---------------------------------------------------------------------
const GENERICOS = new Set(['final', 'centro', 'tablas', 'desarrollo', 'apertura', 'medio juego', 'sacrificio', 'enroque', 'bloqueo', 'iniciativa', 'gambito']);
function terminos() {
  const mapa = new Map();
  const poner = (es, en, def, extra = {}) => {
    const k = norm(es);
    const prev = mapa.get(k) || { es, alias: [] };
    mapa.set(k, Object.assign(prev, { es, en: en || prev.en, def: def || prev.def }, extra, { alias: [...prev.alias, ...(extra.alias || [])] }));
  };
  for (const [es, en, def] of GLOSARIO) poner(es, en, def);
  for (const it of BIBLIOTECA) poner(it.titulo, it.en, it.def, { alias: it.alias || [], biblio: it.id });
  for (const g of D.lista('glosario')) poner(g.termino_es, g.termino_en, g.definicion, { propio: g.id });
  // ¿Qué término tiene ficha?
  const fichas = conceptos();
  for (const [k, t] of mapa) {
    const c = fichas.find(f => (t.biblio && f.original?.id === t.biblio)) ||
      fichas.find(f => norm(f.titulo) === k || t.alias.some(a => norm(a) === norm(f.titulo)));
    if (c) t.ficha = c.id;
  }
  // Tus fichas sin término en el glosario también se enlazan
  for (const f of fichas) {
    const k = norm(f.titulo);
    if (![...mapa.values()].some(t => t.ficha === f.id)) mapa.set(k, { es: f.titulo, alias: [], ficha: f.id, def: f.principio || '' });
  }
  return mapa;
}
function terminoDeFicha(c, mapa = terminos()) {
  return [...mapa.values()].find(t => t.ficha === c.id) || null;
}

// Convierte en enlaces las palabras con ficha o glosario dentro de un texto ya en HTML
function enlazar(html, mapa, excluir) {
  const variantes = [];
  for (const [k, t] of mapa) {
    if (k === excluir || GENERICOS.has(k) || t.es.includes('/') || t.es.length < 4) continue;
    for (const v of [t.es, ...t.alias]) if (v && v.length >= 4 && norm(v) !== excluir) variantes.push([v, k]);
  }
  if (!variantes.length) return html;
  variantes.sort((a, b) => b[0].length - a[0].length);
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^|[^\\p{L}])(${variantes.map(v => escRe(esc(v[0]))).join('|')})(?![\\p{L}])`, 'giu');
  const clave = new Map(variantes.map(([v, k]) => [esc(v).toLowerCase(), k]));
  const usados = new Set();
  return html.split(/(<[^>]+>)/).map(trozo => trozo.startsWith('<') ? trozo : trozo.replace(re, (m, antes, pal) => {
    const k = clave.get(pal.toLowerCase());
    if (!k || usados.has(k)) return m;
    usados.add(k);
    return `${antes}<button class="enl" data-k="${esc(k)}">${pal}</button>`;
  })).join('');
}

// Globo con la definición, el diagrama de tu ejemplo y el enlace a la ficha
function abrirTermino(k, mapa = terminos()) {
  const t = mapa.get(k);
  if (!t) return;
  const c = t.ficha && D.obtener('conceptos', t.ficha);
  const e = c && ejemplosDe(c.id)[0];
  let dg = '';
  if (e) { try { dg = diagrama(dePgn(e.pgn || `[FEN "${e.fen_inicial}"]`), { orientacion: e.orientacion }); } catch (err) { dg = ''; } }
  const d = document.createElement('div');
  d.className = 'modal hoja-abajo';
  d.innerHTML = `<div class="modal-caja termino">
      <div class="t-cab"><b>${esc(t.es)}</b>${t.en ? `<span class="g-en">${esc(t.en)}</span>` : ''}</div>
      ${t.def ? `<p class="t-def">${esc(t.def)}</p>` : ''}
      ${c && c.principio && c.principio !== t.def ? `<blockquote class="t-principio">${esc(c.principio)}</blockquote>` : ''}
      ${dg ? `<div class="t-dg">${dg}<small>${esc(e.titulo || 'Tu ejemplo')}</small></div>` : (c ? '<p class="nota">Esta ficha aún no tiene ejemplo tuyo.</p>' : '')}
      <div class="botones">
        <button class="btn" data-cerrar>Cerrar</button>
        ${c ? `<a class="btn primario" href="#/concepto/${c.id}">Abrir ficha</a>`
          : t.biblio ? `<a class="btn primario" href="#/biblioteca/${t.biblio}">Ver en la biblioteca</a>`
          : `<a class="btn primario" href="#/editar/nuevo?titulo=${encodeURIComponent(t.es)}">Crear ficha</a>`}
      </div></div>`;
  d.addEventListener('click', ev => { if (ev.target === d || ev.target.closest('[data-cerrar]') || ev.target.closest('a')) d.remove(); });
  document.body.appendChild(d);
}

// ---------------------------------------------------------------------
//  AYUDA: «Primeros pasos» en Inicio y el botón «?» de cada pantalla
// ---------------------------------------------------------------------
//  Los pasos se marcan solos según lo que ya has hecho. La tarjeta desaparece
//  al completarlos (o si la ocultas; se recupera en Ajustes → Ayuda).
const PRIMEROS_PASOS = [
  { titulo: 'Elige tus bloques y temas', ir: () => '#/catalogo',
    ayuda: 'Activa solo lo que estés trabajando con tu maestro. Al activar un tema aparecen, translúcidas, las fichas de la biblioteca de ese tema.',
    hecho: () => D.lista('bloques').some(t => t.padre_id && t.activo && D.obtener('bloques', t.padre_id)?.activo) },
  { titulo: 'Trabaja tu primera ficha', ir: () => (porTrabajar().length ? '#pt' : '#/editar/nuevo'),
    ayuda: () => (porTrabajar().length
      ? `Tienes ${porTrabajar().length} fichas de la biblioteca en tus temas activos, abajo en «Por trabajar». Abre una, léela y adáptala con Editar a lo que te dijo tu maestro. Si te enseñó algo que no está, crea una ficha nueva.`
      : 'Un concepto de tus clases, con tus palabras. Si su nombre ya está en tu cuaderno o en la biblioteca, la app te lo dirá.'),
    hecho: () => conceptos().some(c => c.origen !== 'mdp' || adaptada(c) || ejemplosDe(c.id).length) },
  { titulo: 'Un ejemplo en el tablero',
    ir: () => {   // a tu ficha más reciente (o a una de tus bloques activos)
      const c = [...conceptos().filter(conceptoElegible)].sort((x, y) => String(y.editado_en).localeCompare(String(x.editado_en)))[0] || porTrabajar()[0];
      return c ? `#/ejemplo/nuevo?concepto=${c.id}` : '#/conceptos';
    },
    ayuda: 'Dentro de una ficha, «Añadir ejemplo en el tablero». Con su ejemplo, la ficha queda Trabajada y entra en el repaso.',
    hecho: () => D.lista('ejemplos').length > 0 },
  { titulo: 'Apunta tu clase', ir: () => '#/clases',
    ayuda: 'En Clases, con el botón +: lo que visteis y los deberes. Las fichas que crees ese día quedan unidas a la clase.',
    hecho: () => D.lista('clases').length > 0 },
  { titulo: 'Tu primera apertura', ir: () => '#/repertorio',
    ayuda: 'Tu apertura principal con blancas o tu defensa contra 1.e4. La guía te irá pidiendo cada parte.',
    hecho: () => aperturas().length > 0 },
  { titulo: 'Tu primera partida', ir: () => '#/importar-partidas',
    ayuda: 'Trae de Lichess una partida que jugaras pensando y revísala con su guía.',
    hecho: () => partidas().length > 0 },
  { titulo: 'Tu primer repaso', ir: () => (tarjetas().length ? '#/repaso?n=5' : null),
    ayuda: 'Cuando tengas fichas trabajadas, «Repaso · 10» o «Rápido · 5», aquí en Inicio. Unos minutos al día, como en Anki.',
    hecho: () => D.lista('registro_repaso').length > 0 },
];

function seccionPorTrabajar() {
  const lista = porTrabajar();
  if (!lista.length) return '';
  const grupos = new Map();
  for (const c of lista.sort(ordenar)) { if (!grupos.has(c.bloque_id)) grupos.set(c.bloque_id, []); grupos.get(c.bloque_id).push(c); }
  const orden = id => { const t = D.obtener('bloques', id), b = bloqueRaiz(id); return (b?.orden || 0) * 1000 + (t?.padre_id ? t.orden || 0 : 0); };
  return `<section id="por-trabajar">
      <h3 class="sec">Por trabajar <small>${lista.length}</small></h3>
      <p class="nota">Fichas de la biblioteca en tus temas activos. Ábrelas, léelas, adáptalas con Editar a lo que te dijo tu maestro y añádeles tu ejemplo.</p>
      ${[...grupos].sort((x, y) => orden(x[0]) - orden(y[0])).map(([tid, fichas], i) => `
        <details class="pt-grupo"${i === 0 ? ' open' : ''}><summary>${esc(ubicacion(fichas[0]))} <small>${fichas.length}</small></summary>
          <div class="lista">${fichas.map(filaConcepto).join('')}</div></details>`).join('')}
    </section>`;
}

function tarjetaPrimerosPasos() {
  if (ajustes().primerosPasos === false) return '';
  const pasos = PRIMEROS_PASOS.map(p => ({ ...p, ok: p.hecho() }));
  const hechos = pasos.filter(p => p.ok).length;
  if (hechos === pasos.length) return '';
  const sig = pasos.find(p => !p.ok);
  return `<section class="tarjeta primeros">
      <div class="pp-cab"><span class="etq">Primeros pasos · ${hechos} de ${pasos.length}</span>
        <button class="btn-ico peq" id="pp-ocultar" aria-label="Ocultar los primeros pasos" title="Ocultar">✕</button></div>
      <div class="progreso-barra"><span style="width:${Math.round(hechos / pasos.length * 100)}%"></span></div>
      <div class="pp-lista">${pasos.map((p, i) => {
        const url = !p.ok && p.ir();
        return `<div class="pp-paso${p.ok ? ' hecho' : ''}${p === sig ? ' actual' : ''}">
          <span class="paso-n">${p.ok ? ico('check', 'peq') : i + 1}</span>
          <div class="pp-txt"><b>${esc(p.titulo)}</b>${p === sig ? `<small>${esc(typeof p.ayuda === 'function' ? p.ayuda() : p.ayuda)}</small>${
            url === '#pt' ? `<span class="fila-btn"><button class="btn primario peq" data-pt>Ver las ${porTrabajar().length} fichas por trabajar</button><a class="btn peq" href="#/editar/nuevo">Crear una nueva</a></span>`
            : url ? `<a class="btn primario peq" href="${url}">Hacerlo ahora ${ico('flecha', 'peq')}</a>` : ''}` : ''}</div>
          ${p !== sig && !p.ok && url ? (url === '#pt' ? `<button class="btn-ico peq" data-pt aria-label="Ver">${ico('flecha', 'peq')}</button>` : `<a class="btn-ico peq" href="${url}" aria-label="Ir">${ico('flecha', 'peq')}</a>`) : ''}
        </div>`;
      }).join('')}</div>
      <p class="nota">Se marcan solos al hacerlos. Cuando termines, esta tarjeta desaparece.</p>
    </section>`;
}

// Texto corto de cada pantalla (el manual completo está en la Guía)
const AYUDAS = {
  conceptos: ['Conceptos', 'Tu cuaderno, ordenado en **Bloque → Tema → Ficha**. Arriba buscas. «Bloques» para activar lo que estudias o dejarlo en reserva; «Biblioteca» para leer toda la teoría de serie; con + creas una ficha. La Bandeja guarda las fichas sin clasificar.'],
  bloque: ['Un bloque', 'Sus temas y sus fichas. Las **translúcidas** son de la biblioteca: ábrelas, adáptalas a lo que te dijo tu maestro y añádeles tu ejemplo para que pasen a **Trabajada**.'],
  catalogo: ['Bloques y temas', 'Activa con el interruptor solo lo que estés estudiando. Toca un bloque para ver sus temas. Al activar un tema aparecen sus fichas de la biblioteca, translúcidas. Lo que dejas en reserva **no se borra**.'],
  biblioteca: ['Biblioteca', 'La teoría de serie de MdP, solo texto: definición, principio y explicación. Puedes leerla aunque esté en reserva y añadirla a tu cuaderno con un toque. **El tablero lo pones tú.**'],
  concepto: ['Una ficha', 'Principio, explicación y tus ejemplos. Las palabras subrayadas abren el glosario. **«Añadir ejemplo en el tablero»** la deja Trabajada y la mete en el repaso. «Editar» cambia el texto (abajo está «Borrar ficha»); la impresora la saca en PDF.'],
  editar: ['Editar la ficha', 'Nombre, bloque y tema, el **principio** (la frase clave) y la explicación, con **negrita**, *cursiva* y listas empezando con «- ». Si el nombre está en la biblioteca, puedes traer su teoría.'],
  ejemplo: ['El tablero', 'Tres modos. **Posición**: «Vaciar» y coloca las piezas; indica quién juega. **Jugar**: mueve y la notación se escribe sola; comenta cada jugada. **Dibujar**: elige color y toca salida y llegada para una flecha. Marca «Usar como ejercicio» para que entre en el repaso.'],
  repertorio: ['Repertorio', 'Tus aperturas, **elegidas por ti**: hasta 5 por color (3 principales y 2 secundarias). Cada una tiene su guía, su **árbol** de líneas y se puede **importar y exportar** a Lichess con variantes. Debajo de cada color, la app te avisa de las respuestas del rival que aún no tienes preparadas.'],
  apertura: ['Una apertura', 'Arriba, el **siguiente paso** con «Hacerlo ahora»; en «La guía», los 12 pasos. Cada línea lleva un punto de color según cómo te sale al entrenarla. **«Entrenar esta apertura»** repasa todas sus líneas, primero las que peor llevas.'],
  'editar-linea': ['Una línea', 'Juega las jugadas desde la posición inicial, o pega un PGN copiado de Lichess. **«¿Qué juega el rival aquí?»** abre el explorador de Lichess donde has llegado. Comenta las jugadas clave: esos comentarios serán tus pistas al entrenar.'],
  partidas: ['Mis partidas', 'Solo las que jugaste pensando. **«Traer de Lichess»** te enseña tus últimas partidas para que marques las que quieras; también puedes pegar un enlace o un PGN. Cada partida tiene su guía de revisión. «Resumen»: tus resultados y tus errores más repetidos.'],
  partida: ['Revisar una partida', 'Sigue el **siguiente paso** de arriba. Para marcar un momento clave, ve a la jugada con las flechas del tablero y pulsa **«Marcar momento»**. En «Tu repertorio» ves si alguien se salió de lo preparado.'],
  momento: ['Un momento clave', 'Elige si fue error, buena jugada, duda o momento clave. Si fue un error, **juega en el tablero la jugada buena** y marca «Usar como ejercicio»: entrará en tu repaso. Enlázalo con su ficha o mándalo como pregunta al maestro.'],
  entrenar: ['Entrenar', 'El **repaso inteligente**, como Anki: tus fichas trabajadas, tus ejercicios, las líneas del repertorio y los errores de tus partidas. Además, Mi progreso, las Técnicas esenciales y los entrenamientos de Lichess.'],
  progreso: ['Mi progreso', 'Tus fichas según cómo te van en el repaso: **en lo que fallas**, lo que tienes que repasar y lo que dominas. Lo que falles es buen material para preguntar en clase.'],
  clases: ['Diario de clases', 'Con **+** apuntas la clase de hoy: lo que visteis y los deberes. Las fichas que crees ese día quedan unidas a ella. «Preguntas» guarda tus dudas para el maestro.'],
  preguntas: ['Preguntas para el maestro', 'Apunta las dudas cuando te surjan, con la posición si hace falta. Cuando te responda, escribe la respuesta y **conviértela en ficha**.'],
};

function ponerAyuda(v, nombre) {
  const a = AYUDAS[nombre];
  const cab = a && v.querySelector('.cab-vista');
  if (!cab || cab.querySelector('.btn-ayuda')) return;
  const ancla = cab.querySelector(':scope > h1') || cab.querySelector('.ej-tit');
  const b = document.createElement('button');
  b.className = 'btn-ayuda'; b.type = 'button'; b.textContent = '?';
  b.setAttribute('aria-label', 'Ayuda de esta pantalla');
  b.addEventListener('click', () => abrirAyuda(a));
  ancla ? ancla.after(b) : cab.append(b);
}

function abrirAyuda([titulo, texto]) {
  const d = document.createElement('div');
  d.className = 'modal hoja-abajo';
  d.innerHTML = `<div class="modal-caja termino">
      <div class="t-cab"><b>${esc(titulo)}</b></div>
      <p class="t-def">${inl(esc(texto))}</p>
      <div class="botones"><a class="btn" href="#/guia">${ico('guia', 'peq')} Guía completa</a><button class="btn primario" data-cerrar>Entendido</button></div>
    </div>`;
  d.addEventListener('click', ev => { if (ev.target === d || ev.target.closest('[data-cerrar]') || ev.target.closest('a')) d.remove(); });
  document.body.appendChild(d);
}

// ---------------------------------------------------------------------
//  BUSCADOR GLOBAL (lupa de la cabecera)
// ---------------------------------------------------------------------
function abrirBuscador() {
  const d = document.createElement('div');
  d.className = 'modal buscador-global';
  d.innerHTML = `<div class="modal-caja bg-caja">
      <label class="buscador">${ico('buscar')}<input type="search" id="bg-in" placeholder="Busca fichas, aperturas, partidas, glosario…" autocomplete="off" autocapitalize="off"></label>
      <div id="bg-res"><p class="nota">Escribe las primeras letras: «enf», «peon ais», «skewer»…</p></div>
    </div>`;
  document.body.appendChild(d);
  const inp = d.querySelector('#bg-in'), res = d.querySelector('#bg-res');
  const cerrar = () => { d.remove(); document.removeEventListener('keydown', tecla); };
  const tecla = e => { if (e.key === 'Escape') cerrar(); };
  document.addEventListener('keydown', tecla);
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('a')) cerrar(); });
  setTimeout(() => inp.focus(), 30);
  const mapa = terminos();
  inp.addEventListener('input', () => {
    const q = norm(inp.value.trim());
    if (!q) { res.innerHTML = '<p class="nota">Escribe las primeras letras: «enf», «peon ais», «skewer»…</p>'; return; }
    const puntuar = (titulo, resto) => { const t = norm(titulo); return t.startsWith(q) ? 0 : t.split(/\s+/).some(p => p.startsWith(q)) ? 1 : t.includes(q) ? 2 : norm(resto).includes(q) ? 3 : 9; };
    const top = (lista, f) => lista.map(x => [f(x), x]).filter(([p]) => p < 9).sort((a, b) => a[0] - b[0]).slice(0, 6).map(([, x]) => x);
    const fichas = top(conceptos(), c => puntuar(c.titulo, [c.principio, c.explicacion, (c.etiquetas || []).join(' ')].join(' ')));
    const gl = top([...mapa.entries()].filter(([, t]) => t.def || t.en), ([, t]) => Math.min(puntuar(t.es, t.def || ''), puntuar(t.en || '', '')));
    const cl = top(D.lista('clases'), k => puntuar(k.titulo || '', [k.resumen, k.deberes, fechaLarga(k.fecha)].join(' ')));
    const nt = top(D.lista('notas_rapidas'), n => puntuar((n.texto || '').split('\n')[0], n.texto));
    const pt = top(partidas(), p => puntuar(p.rival || '', [p.apertura, p.leccion, p.notas].join(' ')));
    const ap = top(aperturas(), a => puntuar(a.nombre, [a.eco, a.ideas, a.planes, (a.lineas || []).map(l => l.nombre).join(' ')].join(' ')));
    const grupo = (tit, html) => html ? `<h3 class="sec">${tit}</h3><div class="lista">${html}</div>` : '';
    res.innerHTML = (grupo('Fichas', fichas.map(filaConcepto).join('')) +
      grupo('Partidas', pt.map(p => `<a class="fila-c" href="#/partida/${p.id}">${ico('partidas', 'peq')}<span class="fila-txt"><b>vs ${esc(p.rival || 'rival')}</b><small>${[p.fecha && fechaLarga(p.fecha), p.apertura].filter(Boolean).map(esc).join(' · ')}</small></span></a>`).join('')) +
      grupo('Repertorio', ap.map(a => `<a class="fila-c" href="#/apertura/${a.id}">${ico('repertorio', 'peq')}<span class="fila-txt"><b>${esc(a.nombre)}</b><small>${COLOR_TXT[a.color]}</small></span></a>`).join('')) +
      grupo('Glosario y biblioteca', gl.map(([k, t]) => `<a class="fila-c" href="${t.ficha ? '#/concepto/' + t.ficha : t.biblio ? '#/biblioteca/' + t.biblio : '#/glosario?q=' + encodeURIComponent(t.es)}">${ico('glosario', 'peq')}<span class="fila-txt"><b>${esc(t.es)} <span class="g-en">${esc(t.en || '')}</span></b><small>${esc(t.def || '')}</small></span></a>`).join('')) +
      grupo('Clases', cl.map(k => `<a class="fila-c" href="#/clase/${k.id}">${ico('clases', 'peq')}<span class="fila-txt"><b>${esc(k.titulo || 'Clase')}</b><small>${fechaLarga(k.fecha)}</small></span></a>`).join('')) +
      grupo('Notas', nt.map(n => `<a class="fila-c" href="#/notas">${ico('nota', 'peq')}<span class="fila-txt"><b>${esc((n.texto || '').split('\n')[0])}</b></span></a>`).join(''))) ||
      `<p class="nada">Nada con «${esc(inp.value)}».</p>`;
  });
}

// ---------------------------------------------------------------------
//  BIBLIOTECA: ver toda la teoría de serie, esté o no en tu cuaderno
// ---------------------------------------------------------------------
const ESTILO_CATALOGO = {
  'Táctica': ['rojo', 'rayo'], 'Ataque y defensa del rey': ['coral', 'corona'], 'Estructuras de peones': ['violeta', 'peon'],
  'Estrategia': ['azul', 'brujula'], 'Aperturas': ['verde', 'libro'], 'Finales': ['ambar', 'bandera'],
  'Técnica': ['teal', 'martillo'], 'Cálculo y visualización': ['rosa', 'ojo'], 'Juego práctico': ['gris', 'reloj'],
};
const biblioItem = id => BIBLIOTECA.find(x => x.id === id) || null;
function ubicar(it) {
  const b = bloques().find(x => norm(x.nombre) === norm(it.bloque));
  const t = b && temasDe(b.id).find(x => norm(x.nombre) === norm(it.tema));
  return { b, t };
}
const fichaDeBiblio = it => conceptos().find(c => c.original?.id === it.id) || conceptos().find(c => norm(c.titulo) === norm(it.titulo)) || null;
const colorBiblio = it => { const { b } = ubicar(it); return col(b ? b.color : (ESTILO_CATALOGO[it.bloque] || ['gris'])[0]); };

// Añade una ficha de la biblioteca a tu cuaderno: activa su bloque y su tema
async function anadirDeBiblioteca(it) {
  let { b, t } = ubicar(it);
  const [color, icono] = ESTILO_CATALOGO[it.bloque] || ['gris', 'libro'];
  if (!b) b = await D.guardar('bloques', { nombre: it.bloque, color, icono, orden: bloques().length + 1, activo: true, padre_id: null });
  else if (!b.activo) { b.activo = true; await D.guardar('bloques', b); }
  if (!t) t = await D.guardar('bloques', { nombre: it.tema, padre_id: b.id, color: b.color, orden: temasDe(b.id).length + 1, activo: true });
  else if (!t.activo) { t.activo = true; await D.guardar('bloques', t); }
  const borrada = D.obtenerAunBorrado('conceptos', await idDeterminista(usuario.id + ':' + it.id));
  if (borrada && borrada.borrado_en) { borrada.borrado_en = null; borrada.bloque_id = t.id; await D.guardar('conceptos', borrada); }
  await sembrarBiblioteca();
  return fichaDeBiblio(it);
}

function vBiblioteca(v, id, q) {
  if (id) return vBiblioItem(v, id);
  const bloquesB = [...new Set(BIBLIOTECA.map(x => x.bloque))];
  const enCuaderno = BIBLIOTECA.filter(fichaDeBiblio).length;
  v.innerHTML = `
    <div class="cab-vista"><a href="#/conceptos" class="btn-ico">${ico('atras')}</a><h1>Biblioteca</h1></div>
    <p class="intro">${BIBLIOTECA.length} fichas de teoría de serie · ${enCuaderno} ya en tu cuaderno. Las demás están en reserva: aparecen al activar su tema o con «Añadir a mi cuaderno».</p>
    <label class="buscador">${ico('buscar')}<input type="search" id="b-buscar" placeholder="Filtrar: clavada, peón pasado…" value="${esc(q.get('q') || '')}"></label>
    ${bloquesB.map(nb => {
      const items = BIBLIOTECA.filter(x => x.bloque === nb);
      const temas = [...new Set(items.map(x => x.tema))];
      return `<section class="b-bloque" style="--c:${colorBiblio(items[0])}">
        <h2 class="b-tit"><span class="bl-ico">${ico((ESTILO_CATALOGO[nb] || [, 'libro'])[1])}</span>${esc(nb)}</h2>
        ${temas.map(tm => `<h3 class="sec">${esc(tm)}</h3><div class="lista">${items.filter(x => x.tema === tm).map(it => {
          const c = fichaDeBiblio(it);
          const est = c ? (ejemplosDe(c.id).length ? `<span class="estado hecho">${ico('check', 'peq')} Trabajada</span>` : '<span class="estado">En tu cuaderno</span>') : '<span class="estado reserva">En reserva</span>';
          return `<a class="fila-c b-fila" href="${c ? '#/concepto/' + c.id : '#/biblioteca/' + it.id}" data-t="${esc(norm([it.titulo, it.en, it.principio, (it.alias || []).join(' ')].join(' ')))}">
            <span class="punto" style="--c:${colorBiblio(it)}"></span>
            <span class="fila-txt"><b>${it.maestro ? '★ ' : ''}${esc(it.titulo)}</b><small>${esc(it.principio)}</small></span>${est}</a>`;
        }).join('')}</div>`).join('')}
      </section>`;
    }).join('')}`;
  const inp = v.querySelector('#b-buscar');
  const filtrar = () => {
    const t = norm(inp.value.trim());
    v.querySelectorAll('.b-fila').forEach(f => { f.hidden = t && !f.dataset.t.includes(t); });
    v.querySelectorAll('.b-bloque .lista').forEach(l => { const s = l.previousElementSibling; const vis = [...l.children].some(f => !f.hidden); l.hidden = !vis; s.hidden = !vis; });
    v.querySelectorAll('.b-bloque').forEach(s => { s.hidden = ![...s.querySelectorAll('.b-fila')].some(f => !f.hidden); });
  };
  inp.addEventListener('input', filtrar);
  filtrar();
}

function vBiblioItem(v, id) {
  const it = biblioItem(id);
  if (!it) return ir('#/biblioteca');
  const c = fichaDeBiblio(it);
  if (c) return ir('#/concepto/' + c.id);       // ya está en tu cuaderno: se abre tu ficha
  const mapa = terminos();
  v.innerHTML = `
    <div class="cab-vista"><a href="#/biblioteca" class="btn-ico" aria-label="Volver">${ico('atras')}</a><span class="hueco"></span></div>
    <article class="ficha" style="--c:${colorBiblio(it)}">
      <div class="etqs">
        <span class="etq-bloque">${esc(it.bloque)} · ${esc(it.tema)}</span>
        <span class="estado reserva">En reserva</span>
        ${it.maestro ? '<span class="estado maestro">★ Principio del maestro</span>' : '<span class="estado mdp">Biblioteca MdP</span>'}
      </div>
      <h1 class="ficha-tit">${esc(it.titulo)}</h1>
      ${it.en ? `<p class="ficha-en"><span class="g-en">${esc(it.en)}</span> en inglés</p>` : ''}
      <blockquote class="principio">${esc(it.principio)}</blockquote>
      <div class="md">${enlazar(md(it.explicacion), mapa, norm(it.titulo))}</div>
    </article>
    <div class="pista"><b>Pista para tu ejemplo</b><p>${esc(it.pista)}</p></div>
    ${it.lichess ? `<a class="tarjeta practicar" href="${esc(urlPractica(it.lichess))}" target="_blank" rel="noopener">${ico('entrenar')}<span><b>Practicar en Lichess</b><small>${esc(textoPractica(it.lichess))}</small></span>${ico('externo', 'peq')}</a>` : ''}
    <button class="btn primario ancho" id="anadir">${ico('mas', 'peq')} Añadir a mi cuaderno</button>
    <p class="nota">Se activará el tema «${esc(it.tema)}» y aparecerán también sus otras fichas, translúcidas hasta que les añadas tu ejemplo.</p>`;
  v.querySelectorAll('.enl').forEach(bt => bt.addEventListener('click', () => abrirTermino(bt.dataset.k, mapa)));
  v.querySelector('#anadir').addEventListener('click', async e => {
    e.target.disabled = true;
    const f = await anadirDeBiblioteca(it);
    aviso('Añadida a tu cuaderno. Ahora créale tu ejemplo en el tablero.');
    ir(f ? '#/concepto/' + f.id : '#/conceptos');
  });
}

// =====================================================================
//  FASE 2 · REPASO, PROGRESO, TÉCNICAS Y PREGUNTAS PARA EL MAESTRO
// =====================================================================
const tarjetas = () => D.lista('tarjetas');
const conceptoElegible = c => c.origen !== 'mdp' || ejemplosDe(c.id).length > 0;   // las translúcidas no entran
function ejemploDeFila(e) { try { return dePgn(e.pgn || `[FEN "${e.fen_inicial}"]`); } catch (err) { return null; } }
function momentoDeTarjeta(t) {
  if (!t || t.tipo !== 'momento') return null;
  const m = D.obtener('momentos', t.ref_id), p = m && D.obtener('partidas', m.partida_id);
  const ej = m && m.pgn && leerPgn(m.pgn);
  return ej && p ? { m, p, ej } : null;
}
function fichaDeTarjeta(t) {
  if (t.tipo === 'linea') return null;
  if (t.tipo === 'momento') { const m = D.obtener('momentos', t.ref_id); return m?.concepto_id ? D.obtener('conceptos', m.concepto_id) : null; }
  if (t.tipo === 'concepto') return D.obtener('conceptos', t.ref_id);
  const e = D.obtener('ejemplos', t.ref_id);
  return e && D.obtener('conceptos', e.concepto_id);
}
const tarjetasDeFicha = c => tarjetas().filter(t => (t.tipo === 'concepto' && t.ref_id === c.id) ||
  (t.tipo === 'ejemplo' && D.obtener('ejemplos', t.ref_id)?.concepto_id === c.id) ||
  (t.tipo === 'momento' && D.obtener('momentos', t.ref_id)?.concepto_id === c.id));
const diasRepasados = () => D.lista('registro_repaso').map(r => R.hoyISO(new Date(r.fecha)));

// Crea (sin duplicar) las tarjetas de tus fichas y de tus ejemplos marcados como ejercicio
let preparando = null;
function prepararTarjetas() {
  // .finally libera el bloqueo siempre, aunque no haya nada que preparar
  if (!preparando) preparando = crearTarjetasQueFalten().finally(() => { preparando = null; });
  return preparando;
}
async function crearTarjetasQueFalten() {
    try {
      const hoy = R.hoyISO();
      const quiero = new Map();
      for (const c of conceptos()) if (conceptoElegible(c)) quiero.set(await idDeterminista(`${usuario.id}:concepto:${c.id}`), { tipo: 'concepto', ref_id: c.id });
      for (const e of D.lista('ejemplos')) {
        if (!e.es_ejercicio || !D.obtener('conceptos', e.concepto_id)) continue;
        const ej = ejemploDeFila(e);
        if (ej && sirveDeEjercicio(ej) && ej.jugadas.length > (e.ply_pregunta || 0)) quiero.set(await idDeterminista(`${usuario.id}:ejemplo:${e.id}`), { tipo: 'ejemplo', ref_id: e.id });
      }
      for (const m of D.lista('momentos')) {
        if (m.es_ejercicio && D.obtener('partidas', m.partida_id) && leerPgn(m.pgn)?.jugadas.length)
          quiero.set(await idDeterminista(`${usuario.id}:momento:${m.id}`), { tipo: 'momento', ref_id: m.id });
      }
      for (const a of aperturas()) {
        for (const l of a.lineas || []) {
          if (lineaEntrenable(a, leerPgn(l.pgn), l)) quiero.set(await idDeterminista(`${usuario.id}:linea:${l.id}`), { tipo: 'linea', ref_id: l.id });
        }
      }
      for (const [id, x] of quiero) {
        const t = D.obtenerAunBorrado('tarjetas', id);
        if (!t) await D.guardar('tarjetas', { id, ...x, ply: 0, facilidad: 2.5, intervalo_dias: 0, repeticiones: 0, proxima: hoy, aciertos: 0, fallos: 0, datos: {} });
        else if (t.borrado_en) { t.borrado_en = null; await D.guardar('tarjetas', t); }
      }
      for (const t of tarjetas()) if (!quiero.has(t.id)) await D.borrar('tarjetas', t.id);
    } catch (e) { console.error(e); }
}

async function registrarRespuesta(t, res) {
  const nueva = R.planificar(t, res);
  await D.guardar('tarjetas', nueva);
  await D.guardar('registro_repaso', { tarjeta_id: t.id, fecha: new Date().toISOString(), resultado: R.resultadoBD(res) });
  const c = fichaDeTarjeta(t);
  if (c) {
    const estado = R.estadoDe(tarjetasDeFicha(c));
    if (c.estado !== estado) { c.estado = estado; await D.guardar('conceptos', c); }
  }
  const ln = lineaDeTarjeta(t);
  if (ln) {   // el estado de la apertura sale de cómo llevas sus líneas
    const estado = R.estadoDe(tarjetasDeApertura(ln.a));
    if (ln.a.estado !== estado) { ln.a.estado = estado; await D.guardar('repertorio', ln.a); }
  }
}

// ---------------------------------------------------------------------
//  Tarjeta «Repaso de hoy» para Inicio
// ---------------------------------------------------------------------
function tarjetaRepasoHoy() {
  const n = R.pendientes(tarjetas()).length;
  const ra = R.racha(diasRepasados());
  if (!tarjetas().length) return '';
  return `<div class="tarjeta repaso-hoy">
      <div class="rh-txt"><span class="etq">Repaso de hoy</span>
        <b id="rep-n">${n ? `${n} ${n === 1 ? 'tarjeta' : 'tarjetas'}` : '¡Al día!'}</b>
        <small>${ra ? `Racha: ${ra} ${ra === 1 ? 'día' : 'días seguidos'}` : 'Empieza hoy tu racha'}</small></div>
      <div class="rh-btn">
        <a class="btn primario" href="#/repaso?n=10">${ico('entrenar', 'peq')} Repaso · 10</a>
        <a class="btn" href="#/repaso?n=5">${ico('rayo', 'peq')} Rápido · 5</a>
      </div></div>`;
}

// ---------------------------------------------------------------------
//  SESIÓN DE REPASO
// ---------------------------------------------------------------------
async function vRepaso(v, _id, q) {
  editando = true;
  const n = q.get('n') === '5' ? R.SESION_RAPIDA : R.SESION_NORMAL;
  // «Entrenar esta apertura»: todas sus líneas, primero las que peor llevas
  const apertura = q.get('ap') ? D.obtener('repertorio', q.get('ap')) : null;
  const ciegasSesion = q.get('ciegas') === '1';
  const modoDificiles = q.get('dificiles') === '1';
  // «Practicar esta ficha ahora»: todos sus ejercicios, aunque no te toquen hoy (y cuentan)
  const ficha = q.get('ficha') ? D.obtener('conceptos', q.get('ficha')) : null;
  const salida = apertura ? '#/apertura/' + apertura.id : ficha ? '#/concepto/' + ficha.id : '#/inicio';
  v.innerHTML = '<p class="nada">Preparando tu repaso…</p>';
  await prepararTarjetas();
  if (!v.isConnected) return;
  let sesion;
  if (modoDificiles) sesion = jugadasDificiles(apertura).slice(0, R.SESION_NORMAL);
  else if (apertura) sesion = R.ordenarParaEntrenar(tarjetasDeApertura(apertura));
  else if (ficha) sesion = R.ordenarParaEntrenar(tarjetasDeFicha(ficha));
  else {
    sesion = R.seleccionar(tarjetas(), n);
    if (!sesion.length && q.get('adelantar') === '1')
      sesion = tarjetas().sort((a, b) => String(a.proxima).localeCompare(String(b.proxima))).slice(0, n);
  }
  sesion = sesion.filter(t => t.dificil || (t.tipo === 'momento' ? momentoDeTarjeta(t) : fichaDeTarjeta(t) || lineaDeTarjeta(t)));
  // Líneas nuevas poco a poco, como en Chessable: como mucho 3 al día
  const hoyR = R.hoyISO();
  let nuevasHoy = tarjetas().filter(t => t.tipo === 'linea' && t.datos?.aprendidaEn === hoyR).length;
  sesion = sesion.filter(t => {
    if (t.dificil || t.tipo !== 'linea' || t.ultimo_resultado || t.datos?.aprendida) return true;
    if (nuevasHoy >= 3) return false;
    nuevasHoy++; return true;
  });
  if (!sesion.length && ficha) {
    editando = false;
    v.innerHTML = `
      <div class="cab-vista"><a href="${salida}" class="btn-ico">${ico('atras')}</a><h1>${esc(ficha.titulo)}</h1></div>
      <div class="tarjeta vacia"><span class="etq">Sin ejercicios</span><h2>Esta ficha aún no tiene nada que practicar</h2>
        <p>Añade un ejemplo en el tablero y márcalo como «Usar como ejercicio de repaso».</p>
        <a class="btn primario" href="${salida}">Volver a la ficha</a></div>`;
    return;
  }
  if (!sesion.length && modoDificiles) {
    editando = false;
    v.innerHTML = `
      <div class="cab-vista"><a href="${salida}" class="btn-ico">${ico('atras')}</a><h1>Jugadas difíciles</h1></div>
      <div class="tarjeta vacia"><span class="etq">¡Limpio!</span><h2>No tienes jugadas difíciles</h2>
        <p>Cuando falles una jugada al entrenar tus líneas, aparecerá aquí hasta que te salga bien.</p>
        <a class="btn primario" href="${salida}">Volver</a></div>`;
    return;
  }
  if (!sesion.length && apertura) {
    editando = false;
    v.innerHTML = `
      <div class="cab-vista"><a href="${salida}" class="btn-ico">${ico('atras')}</a><h1>Entrenar</h1></div>
      <div class="tarjeta vacia"><h2>Aún no hay líneas para entrenar</h2>
        <p>Entran las líneas de «${esc(apertura.nombre)}» que llegan al menos a tu ${RP.MIN_PROPIAS}.ª jugada.</p>
        <a class="btn primario" href="${salida}">Volver a la apertura</a></div>`;
    return;
  }
  if (!sesion.length) {
    editando = false;
    v.innerHTML = `
      <div class="cab-vista"><a href="#/inicio" class="btn-ico">${ico('atras')}</a><h1>Repaso</h1></div>
      ${tarjetas().length ? `<div class="tarjeta vacia"><span class="etq">¡Al día!</span><h2>Hoy no te toca nada</h2>
          <p>Tus tarjetas volverán cuando toque. Si quieres, puedes adelantar trabajo.</p>
          <a class="btn primario" href="#/repaso?n=${n}&adelantar=1">Repasar por adelantado</a></div>`
        : `<div class="tarjeta vacia"><h2>Aún no hay tarjetas</h2>
          <p>Entran en el repaso tus fichas y las de la biblioteca que ya has trabajado con tu ejemplo, y las líneas de tu repertorio que llegan al menos a tu ${RP.MIN_PROPIAS}.ª jugada. Además, en cualquier ejemplo puedes marcar «Usar como ejercicio de repaso».</p>
          <a class="btn primario" href="#/conceptos">Ir a mis fichas</a></div>`}`;
    return;
  }
  const resultados = [];
  let i = 0, cerrarTablero = null;

  const cabecera = () => `
    <div class="rep-cab">
      <button class="btn-ico" id="rep-salir" aria-label="Salir">${ico('atras')}</button>
      <div class="rep-barra"><span style="width:${Math.round(i / sesion.length * 100)}%"></span></div>
      <b>${Math.min(i + 1, sesion.length)}/${sesion.length}</b>
    </div>`;
  const siguiente = res => {
    resultados.push(res);
    if (!sesion[i].dificil) registrarRespuesta(sesion[i], res);   // las jugadas difíciles no cambian el calendario
    i++;
    if (cerrarTablero) { cerrarTablero(); cerrarTablero = null; }
    i < sesion.length ? pintarTarjeta() : final();
  };
  const botonesNota = () => `<div class="rep-notas">
      <button class="btn mal" data-res="mal">Mal</button>
      <button class="btn regular" data-res="regular">Regular</button>
      <button class="btn bien" data-res="bien">Bien</button></div>`;

  function pintarTarjeta() {
    const t = sesion[i];
    if (t.dificil) return pintarDificil(t);
    if (t.tipo === 'linea') return pintarLinea(t);
    if (t.tipo === 'momento') return pintarMomento(t);
    const c = fichaDeTarjeta(t);
    const b = bloqueRaiz(c.bloque_id);
    const color = b ? col(b.color) : 'var(--suave)';
    if (t.tipo === 'concepto') {
      v.innerHTML = cabecera() + `
        <article class="rep-tarjeta" style="--c:${color}">
          <span class="etq-bloque">${b ? esc(b.nombre) : 'Bandeja'}</span>
          <h1 class="ficha-tit">${esc(c.titulo)}</h1>
          <p class="rep-pregunta">¿Recuerdas la idea? Piénsala antes de darle la vuelta.</p>
          <div id="rep-dorso" hidden>
            ${c.principio ? `<blockquote class="principio">${esc(c.principio)}</blockquote>` : ''}
            ${c.explicacion ? `<div class="md">${md(c.explicacion)}</div>` : '<p class="nota">Esta ficha aún no tiene explicación.</p>'}
            <p class="rep-pregunta">¿Lo sabías?</p>${botonesNota()}
          </div>
          <button class="btn primario ancho" id="rep-girar">Mostrar la respuesta</button>
        </article>`;
      v.querySelector('#rep-girar').addEventListener('click', e => { v.querySelector('#rep-dorso').hidden = false; e.target.remove(); });
    } else pintarEjemplo(t, c, color);
  }

  // ENTRENAR EN EL TABLERO, como un puzzle que sigue: empieza en la pregunta (o
  // desde el principio), tú juegas tus jugadas y la app contesta con las del rival
  // hasta el final. Dos intentos por jugada. La pista es tu comentario de esa
  // jugada (y, si no hay, la idea de la ficha); nunca la jugada.
  // Nota: todo a la primera = Bien; algún fallo o pista = Regular; si se escapa una jugada = Mal.
  // A ciegas (nivel básico): miras la posición, ocultas las piezas y juegas de memoria.
  // Las jugadas del rival se anuncian por escrito. Volver a ver las piezas cuenta como pista.
  function pintarEntreno({ ej, color, inicio = 0, fin = Infinity, ver = 0, aprender = false, etiqueta = '', pregunta, extras = [], nota = '', pie = '', css = 'var(--acento)', alFinal = () => {} }) {
    let ciegas = false, ocultadas = false;
    const falladas = new Set(), limpias = new Set();   // índices de tus jugadas: falladas y acertadas a la primera
    const hasta = Math.min(fin, ej.jugadas.length);
    const lado = i => ((ej.fen0.split(' ')[1] === 'b') === (i % 2 === 0) ? 'black' : 'white');
    const mias = desde => ej.jugadas.slice(desde, hasta).filter((_, k) => lado(desde + k) === color).length;
    const desdeTuyas = Math.max(inicio, ver);   // si se ven pasar las jugadas de antes, no cuentan
    const total = mias(desdeTuyas);
    const pistasExtra = extras.filter(([, txt]) => txt);
    let pistas = 0, extrasUsadas = 0, hecho = false;
    v.innerHTML = cabecera() + `
      <article class="rep-tarjeta" style="--c:${css}">
        ${etiqueta}
        <p class="rep-pregunta">${pregunta}</p>
        <div class="rep-tablero"></div>
        <p class="rep-prog" id="rep-prog"></p>
        <p class="rep-aviso" id="rep-aviso" hidden></p>
        <div class="rep-pistas" id="rep-pistas"></div>
        <div class="fila-btn rep-ver" id="rep-ver"${ver > inicio ? '' : ' hidden'}>
          <button class="btn primario" id="rep-ver-sig">Siguiente jugada ▸</button>
          <button class="btn" id="rep-ver-fin">Ir a la pregunta ⏭</button>
        </div>
        <div class="fila-btn" id="rep-ayuda"${aprender || ver > inicio ? ' hidden' : ''}>
          <button class="btn" id="rep-pista">${ico('guia', 'peq')} Pista</button>
          <button class="btn" id="rep-ciegas">${ico('ojo', 'peq')} <span>${ciegasSesion ? 'Ya la tengo: ocultar' : 'A ciegas'}</span></button>
          <button class="btn" id="rep-nose">No lo sé</button>
        </div>
        ${ciegasSesion ? '<p class="nota" id="rep-ciegas-txt">Memoriza la posición. Cuando la tengas, oculta las piezas y juega de memoria.</p>' : ''}
        <div id="rep-fin" hidden></div>
      </article>`;
    const ponerCiegas = si => {
      ciegas = si;
      v.querySelector('.rep-tablero').classList.toggle('a-ciegas', si);
      v.querySelector('#rep-ciegas span').textContent = si ? 'Ver piezas' : 'A ciegas';
      v.querySelector('#rep-ciegas-txt')?.remove();
    };
    const avisar = (txt, cls) => { const x = v.querySelector('#rep-aviso'); x.textContent = txt; x.className = 'rep-aviso ' + (cls || ''); x.hidden = !txt; };
    const prog = () => {   // cuenta solo tus jugadas
      const hechas = total - mias(Math.max(desdeTuyas, Math.min(entreno.ply(), ej.jugadas.length)));
      v.querySelector('#rep-prog').textContent = total <= 1 ? '' : hechas >= total ? `${total} de ${total} jugadas tuyas` : `${aprender ? 'Aprendiendo · ' : ''}Tu jugada ${hechas + 1} de ${total}`;
    };
    const entreno = crearEntrenoLinea(v.querySelector('.rep-tablero'), ej, {
      color, inicio, fin, ver, aprender, pedirPromocion,
      alVer: (jugada, comentario, ultima) => {   // cómo se llega a la pregunta, jugada a jugada, a tu ritmo
        v.querySelector('#rep-pistas').innerHTML = comentario ? `<p class="pista-rep rival"><b>${esc(jugada)}</b> ${esc(comentario)}</p>` : '';
        if (ultima) {
          v.querySelector('#rep-ver').hidden = true;
          v.querySelector('#rep-ayuda').hidden = aprender;
          avisar('Ahora tú: ¿cuál es la mejor jugada?');
        } else avisar(`Mira cómo se llega: ${jugada}`);
      },
      alTurno: ({ comentario }) => {   // aprendiendo: la flecha en el tablero y tu comentario aquí
        if (comentario) v.querySelector('#rep-pistas').insertAdjacentHTML('beforeend', `<p class="pista-rep"><b>Idea:</b> ${esc(comentario)}</p>`);
        avisar('Juega la jugada de la flecha.');
      },
      alRival: (jugada, comentario) => {   // la respuesta del rival y su porqué (tu comentario en esa jugada)
        if (ciegas) avisar(`El rival juega ${jugada}`);
        v.querySelector('#rep-pistas').innerHTML = comentario ? `<p class="pista-rep rival"><b>${esc(jugada)}</b> ${esc(comentario)}</p>` : '';
      },
      alJugada: ({ ok, otraVez, perdida, jugada, ply: p }) => {
        if (!aprender) {
          if (otraVez) falladas.add(p);
          else if (perdida) falladas.add(p - 1);
          else if (ok && !falladas.has(p - 1)) limpias.add(p - 1);
        }
        if (!otraVez) v.querySelector('#rep-pistas').innerHTML = '';   // si fallas, sigue a la vista lo que jugó el rival
        if (aprender && otraVez) return avisar('Esa no: juega la de la flecha.', 'mal');
        if (ok) avisar(entreno.ply() < ej.jugadas.length ? '¡Bien! Sigue: el rival contesta.' : '');
        else if (otraVez) avisar('No es esa. Te queda un intento.', 'mal');
        else if (perdida) avisar(`La buena era ${jugada}. Seguimos.`, 'mal');
        prog();
      },
      alTerminar: ({ errores, perdidas }) => {
        if (hecho) return; hecho = true;
        if (ciegas) ponerCiegas(false);   // al terminar se ven las piezas
        const res = aprender ? 'bien' : perdidas ? 'mal' : errores || pistas ? 'regular' : 'bien';
        alFinal({ falladas, limpias, res });
        const texto = aprender ? 'Línea aprendida. Volverá mañana para que la juegues tú solo.'
          : res === 'bien' ? `¡Perfecto, todo a la primera${ocultadas ? ' y a ciegas' : ''}!` : res === 'regular' ? 'Bien, con algún tropiezo o pista: cuenta como Regular.'
          : `${perdidas === 1 ? 'Se te escapó 1 jugada' : `Se te escaparon ${perdidas} jugadas`}. Volverá mañana.`;
        v.querySelector('#rep-ayuda').hidden = true;
        avisar('');
        const fin = v.querySelector('#rep-fin');
        fin.innerHTML = `<p class="rep-resultado ${res}">${texto}</p>
          <p class="p-jug rep-linea-txt">${textoJugadas(ej)}</p>
          ${nota ? `<p class="comentario-jug">${esc(nota)}</p>` : ''}
          ${pie ? `<p class="nota">${pie}</p>` : ''}
          <button class="btn primario ancho" id="rep-sig">Siguiente</button>`;
        fin.hidden = false;
        fin.querySelector('#rep-sig').addEventListener('click', () => siguiente(res));
      },
    });
    cerrarTablero = entreno.cerrar;
    prog();
    v.querySelector('#rep-pista').addEventListener('click', () => {
      const caja = v.querySelector('#rep-pistas');
      const propia = entreno.pista();
      if (propia) { pistas++; caja.innerHTML = `<p class="pista-rep"><b>Pista:</b> ${esc(propia)}</p>`; return; }
      if (extrasUsadas < pistasExtra.length) {
        const [b, txt] = pistasExtra[extrasUsadas++];
        pistas++; caja.insertAdjacentHTML('beforeend', `<p class="pista-rep"><b>${esc(b)}:</b> ${esc(txt)}</p>`);
        return;
      }
      caja.insertAdjacentHTML('beforeend', '<p class="pista-rep">No hay más pistas. Escribe un comentario en esta jugada al editar y la tendrás la próxima vez.</p>');
    });
    v.querySelector('#rep-nose').addEventListener('click', () => entreno.noLoSe());
    v.querySelector('#rep-ver-sig').addEventListener('click', () => entreno.verSiguiente());
    v.querySelector('#rep-ver-fin').addEventListener('click', () => entreno.verHastaPregunta());
    if (entreno.viendo()) {   // antes de la primera jugada: la introducción del ejemplo y cómo pasar
      if (ej.comentario0) v.querySelector('#rep-pistas').innerHTML = `<p class="pista-rep rival">${esc(ej.comentario0.trim())}</p>`;
      avisar('Pasa las jugadas a tu ritmo: «Siguiente jugada» (o la flecha →, espacio). «Ir a la pregunta» salta hasta tu turno.');
    }
    v.querySelector('#rep-ciegas').addEventListener('click', () => {
      if (ciegas) pistas++;   // volver a mirar cuenta como pista
      else ocultadas = true;
      ponerCiegas(!ciegas);
    });
  }
  // «Practicar más en Lichess» con el tema de la ficha (o el de su teoría original)
  const masEnLichess = c => {
    const k = c && (c.practica_lichess || biblioItem(c.original?.id)?.lichess);
    return k ? ` · <a href="${esc(urlPractica(k))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Practicar más en Lichess</a>` : '';
  };
  const quienJuega = (ej, i) => { const f = i <= 0 ? ej.fen0 : ej.jugadas[i - 1].fen; return f.split(' ')[1] === 'b' ? 'black' : 'white'; };
  const juegan = c => (c === 'white' ? 'Juegan blancas' : 'Juegan negras');

  // Ejercicio de un ejemplo de la ficha: empieza en la jugada que elegiste como pregunta
  function pintarEjemplo(t, c, css) {
    const fila = D.obtener('ejemplos', t.ref_id);
    const ej = ejemploDeFila(fila);
    const preg = Math.min(fila.ply_pregunta || 0, ej.jugadas.length - 1);
    const color = quienJuega(ej, preg);
    const jugarAntes = preg > 0 && fila.desde_inicio !== false;   // de serie, desde el principio
    const pregunta = fila.enunciado ? esc(fila.enunciado)
      : jugarAntes ? `<b>Juegas con ${color === 'white' ? 'blancas' : 'negras'}.</b> ${esc(c.titulo)}: juega desde el principio; la app mueve las del rival y, al llegar a la pregunta, busca la mejor jugada.`
      : `<b>${juegan(color)}.</b> ${esc(c.titulo)}: ¿cuál es la mejor jugada?`;
    pintarEntreno({
      ej, color, inicio: 0, ver: jugarAntes ? 0 : preg, pregunta, css,
      extras: [['Idea', c.principio]],
      pie: `Ficha: <a href="#/concepto/${c.id}">${esc(c.titulo)}</a>${fila.titulo ? ' · ' + esc(fila.titulo) : ''}${masEnLichess(c)}`,
    });
  }

  // Momento de una partida tuya convertido en ejercicio
  function pintarMomento(t) {
    const { m, p, ej } = momentoDeTarjeta(t);
    const c = m.concepto_id && D.obtener('conceptos', m.concepto_id);
    const color = quienJuega(ej, 0);
    pintarEntreno({
      ej, color,
      etiqueta: `<span class="etq-bloque">${ico('partidas', 'peq')} Tu partida contra ${esc(p.rival || 'tu rival')}${p.fecha ? ' · ' + esc(fechaLarga(p.fecha)) : ''}</span>`,
      pregunta: `<b>${juegan(color)}.</b> ${c ? esc(c.titulo) + ': ' : ''}¿qué debiste jugar?`,
      extras: [['Idea', c?.principio], ['Lo que anotaste', m.comentario]],
      pie: `De <a href="#/partida/${p.id}">tu partida contra ${esc(p.rival || 'tu rival')}</a>${c ? ` · Ficha: <a href="#/concepto/${c.id}">${esc(c.titulo)}</a>` : ''}${masEnLichess(c)}`,
    });
  }

  // Una jugada difícil: empieza justo antes de ella y sigue unas jugadas más
  function pintarDificil(it) {
    const { t, idx, a, l, ej, veces } = it;
    pintarEntreno({
      ej, color: a.color, inicio: idx, fin: Math.min(RP.limitePlies(a), idx + 6),
      alFinal: async ({ falladas, limpias }) => { anotarDificiles(t, falladas, limpias); await D.guardar('tarjetas', t); },
      etiqueta: `<span class="etq-bloque">${ico('rayo', 'peq')} Jugada difícil · ${esc(a.nombre)}</span>`,
      pregunta: `<b>${juegan(a.color)}.</b> ${esc(l.nombre || TIPO_LINEA[l.tipo])}: aquí has fallado ${veces} ${veces === 1 ? 'vez' : 'veces'}. ¿Tu jugada?`,
      nota: l.nota,
      pie: `<a href="#/linea/${a.id}?l=${l.id}">Ver la línea</a> · <a href="#/apertura/${a.id}">${esc(a.nombre)}</a>`,
    });
  }

  // Una línea del repertorio, desde el principio: la app juega las del rival
  function pintarLinea(t) {
    const { a, l, ej } = lineaDeTarjeta(t);
    const nueva = !t.ultimo_resultado && !t.datos?.aprendida;
    pintarEntreno({
      ej, color: colorLinea(a, l), fin: RP.limitePlies(a), aprender: nueva,
      alFinal: ({ falladas, limpias }) => {
        anotarDificiles(t, falladas, limpias);
        if (nueva) t.datos = { ...t.datos, aprendida: true, aprendidaEn: R.hoyISO() };
      },
      etiqueta: `<span class="etq-bloque">${a.color === 'white' ? '♔' : '♚'} ${esc(a.nombre)} · ${TIPO_LINEA[l.tipo]}</span>`,
      pregunta: nueva ? `<b>Aprender: ${esc(l.nombre || TIPO_LINEA[l.tipo])}</b> · Línea nueva: sigue la flecha y repite cada jugada tuya.`
        : `<b>${esc(l.nombre || TIPO_LINEA[l.tipo])}</b> · Juegas con ${colorLinea(a, l) === 'white' ? 'blancas' : 'negras'}${l.juega && l.juega !== a.color ? ' (el bando que castiga: así aprendes a no caer)' : ''}; el rival juega solo.`,
      extras: [['La idea de la línea', l.nota]], nota: l.nota,
      pie: `<a href="#/linea/${a.id}?l=${l.id}">Ver la línea</a> · <a href="#/apertura/${a.id}">${esc(a.nombre)}</a>`,
    });
  }

  function final() {
    editando = false;
    const nt = R.nota(resultados);
    const cuenta = r => resultados.filter(x => x === r).length;
    if (!apertura && !modoDificiles) {
      const sesiones = [...(ajustes().sesiones || []), { fecha: R.hoyISO(), n: resultados.length, nota: nt }].slice(-60);
      guardarAjustes({ sesiones });
    }
    const ra = R.racha([...diasRepasados(), R.hoyISO()]);
    const msg = nt >= 9 ? '¡Excelente!' : nt >= 7 ? 'Muy bien' : nt >= 5 ? 'Aprobado: sigue así' : 'Hoy ha costado. Lo fallado volverá mañana, y así se aprende.';
    const quedan = R.pendientes(tarjetas()).length;
    v.innerHTML = `
      <div class="rep-final">
        <span class="etq">Repaso terminado</span>
        <div class="rep-nota"><b>${String(nt).replace('.', ',')}</b><small>/ 10</small></div>
        <p class="rep-msg">${msg}</p>
        <div class="cifras">
          <div><b class="ok">${cuenta('bien')}</b><span>bien</span></div>
          <div><b class="reg">${cuenta('regular')}</b><span>regular</span></div>
          <div><b class="ko">${cuenta('mal')}</b><span>mal</span></div>
        </div>
        <p class="nota">Racha: ${ra} ${ra === 1 ? 'día' : 'días seguidos'}.</p>
        <div class="lista">${sesion.map((t, k) => {
          if (t.dificil) return `<a class="fila-c" href="#/linea/${t.a.id}?l=${t.l.id}"><span class="res-punto ${resultados[k]}"></span><span class="fila-txt"><b>${esc(etiquetaJ(t.ej, t.idx))} · ${esc(t.l.nombre || TIPO_LINEA[t.l.tipo])}</b><small>Jugada difícil · ${esc(t.a.nombre)}</small></span>${ico('flecha', 'peq')}</a>`;
          const mo = momentoDeTarjeta(t);
          if (mo) return `<a class="fila-c" href="#/partida/${mo.p.id}"><span class="res-punto ${resultados[k]}"></span><span class="fila-txt"><b>${esc(TIPO_MOMENTO[mo.m.tipo])} · vs ${esc(mo.p.rival || 'rival')}</b><small>Momento de tu partida</small></span>${ico('flecha', 'peq')}</a>`;
          const ln = lineaDeTarjeta(t);
          if (ln) return `<a class="fila-c" href="#/linea/${ln.a.id}?l=${ln.l.id}"><span class="res-punto ${resultados[k]}"></span><span class="fila-txt"><b>${esc(ln.l.nombre || TIPO_LINEA[ln.l.tipo])}</b><small>${esc(ln.a.nombre)} · ${TIPO_LINEA[ln.l.tipo]}</small></span>${ico('flecha', 'peq')}</a>`;
          const c = fichaDeTarjeta(t);
          return `<a class="fila-c" href="#/concepto/${c.id}"><span class="res-punto ${resultados[k]}"></span><span class="fila-txt"><b>${esc(c.titulo)}</b><small>${t.tipo === 'ejemplo' ? 'Ejercicio en el tablero' : 'Tarjeta de concepto'}</small></span>${ico('flecha', 'peq')}</a>`;
        }).join('')}</div>
        <div class="botones">
          <a class="btn primario" href="${salida}">${apertura ? 'Volver a la apertura' : ficha ? 'Volver a la ficha' : 'Volver a Inicio'}</a>
          ${ficha ? `<a class="btn" href="#/repaso?ficha=${ficha.id}&otra=${Date.now()}">Practicarla otra vez</a>` : !apertura && quedan ? `<a class="btn" href="#/repaso?n=5">Otra ronda rápida</a>` : ''}
        </div>
      </div>`;
  }

  v.addEventListener('click', e => {
    const b = e.target.closest('[data-res]');
    if (b) return siguiente(b.dataset.res);
    if (e.target.closest('#rep-salir')) {
      if (!resultados.length || confirm('¿Salir del repaso? Lo que ya has respondido queda guardado.')) { editando = false; ir(salida); }
    }
  });
  limpiezas.push(() => { if (cerrarTablero) cerrarTablero(); });
  pintarTarjeta();
}

// ---------------------------------------------------------------------
//  MI PROGRESO
// ---------------------------------------------------------------------
const ESTADOS = [
  ['fallo', '🔴', 'En lo que fallo', 'Lo que has fallado en tu último repaso. Buen material para preguntar en clase.'],
  ['repasar', '🟡', 'Lo que tengo que repasar', 'Va entrando, pero aún necesita repasos.'],
  ['domino', '🟢', 'Lo que domino', 'Acertado varias veces seguidas.'],
];
function vProgreso(v) {
  prepararTarjetas();
  const fichas = conceptos().filter(conceptoElegible);
  const registros = D.lista('registro_repaso');
  const ses = (ajustes().sesiones || []).slice(-7);
  const media = ses.length ? Math.round(ses.reduce((s, x) => s + x.nota, 0) / ses.length * 10) / 10 : null;
  const dom = D.lista('tecnicas').filter(t => t.estado === 'domino').length;
  v.innerHTML = `
    <div class="cab-vista"><a href="#/entrenar" class="btn-ico">${ico('atras')}</a><h1>Mi progreso</h1></div>
    <div class="cifras">
      <div><b>${R.racha(diasRepasados())}</b><span>días de racha</span></div>
      <div><b>${registros.length}</b><span>repasos</span></div>
      <div><b>${media === null ? '–' : String(media).replace('.', ',')}</b><span>nota media</span></div>
    </div>
    ${ESTADOS.map(([k, e, tit, sub]) => {
      const l = fichas.filter(c => c.estado === k);
      return `<h3 class="sec">${e} ${tit} <small>${l.length}</small></h3>
        ${l.length ? `<div class="lista">${l.map(filaConcepto).join('')}</div>` : `<p class="nada peq">${sub}</p>`}`;
    }).join('')}
    <h3 class="sec">⚪ Sin repasar todavía <small>${fichas.filter(c => !c.estado || c.estado === 'nuevo').length}</small></h3>
    <p class="nota">Entran en tu repaso diario. El estado de cada ficha se pone solo según tus repasos; desde la ficha puedes practicarla cuando quieras.</p>
    <a class="tarjeta practicar" href="#/tecnicas">${ico('bandera')}<span><b>Técnicas esenciales</b><small>${dom} de ${TECNICAS.length} dominadas</small></span>${ico('flecha', 'peq')}</a>`;
}

// ---------------------------------------------------------------------
//  TÉCNICAS ESENCIALES (el «carné» de habilidades)
// ---------------------------------------------------------------------
const TECNICAS = [
  ['mate-dama', 'Mate con dama', 'Mates básicos', 'fin-mate-dama'],
  ['mate-torre', 'Mate con torre', 'Mates básicos', 'fin-mate-torre'],
  ['escalera', 'Mate de la escalera', 'Mates básicos', 'fin-escalera'],
  ['dos-alfiles', 'Mate con dos alfiles', 'Mates básicos', 'fin-dos-alfiles'],
  ['alfil-caballo', 'Mate con alfil y caballo', 'Mates básicos', 'fin-alfil-caballo'],
  ['oposicion', 'Oposición', 'Finales de peones', 'fin-oposicion'],
  ['cuadrado', 'Regla del cuadrado', 'Finales de peones', 'fin-cuadrado'],
  ['casillas-clave', 'Casillas clave', 'Finales de peones', 'fin-casillas-clave'],
  ['triangulacion', 'Triangulación', 'Finales de peones', 'fin-triangulacion'],
  ['ruptura-coronar', 'Ruptura para coronar', 'Finales de peones', 'est-ruptura-coronar'],
  ['pasado-alejado', 'Peón pasado alejado', 'Finales de peones', 'est-pasado-alejado'],
  ['lucena', 'Posición de Lucena', 'Finales de torres', 'fin-lucena'],
  ['philidor', 'Posición de Philidor', 'Finales de torres', 'fin-philidor'],
  ['alfil-equivocado', 'Alfil equivocado y peón de torre', 'Piezas menores', 'fin-alfil-equivocado'],
  ['dama-peon', 'Dama contra peón en séptima', 'Finales de damas', 'fin-dama-peon'],
  ['perpetuo', 'Jaque perpetuo', 'Recursos de defensa', 'tec-perpetuo'],
];
const ESTADO_TEC = [['nuevo', 'Pendiente'], ['repasar', 'Practicando'], ['domino', 'Dominada']];
async function vTecnicas(v) {
  const ids = await Promise.all(TECNICAS.map(([k]) => idDeterminista(`${usuario.id}:tecnica:${k}`)));
  if (!v.isConnected) return;
  const filaDe = i => D.obtener('tecnicas', ids[i]);
  const dom = TECNICAS.filter((_, i) => filaDe(i)?.estado === 'domino').length;
  const grupos = [...new Set(TECNICAS.map(t => t[2]))];
  v.innerHTML = `
    <div class="cab-vista"><a href="#/progreso" class="btn-ico">${ico('atras')}</a><h1>Técnicas esenciales</h1></div>
    <p class="intro">Lo que todo ajedrecista debe saber hacer sin pensar. Practícalo en Lichess y márcalo cuando lo domines.</p>
    <div class="progreso-barra"><span style="width:${Math.round(dom / TECNICAS.length * 100)}%"></span></div>
    <p class="nota">${dom} de ${TECNICAS.length} dominadas</p>
    ${grupos.map(g => `<h3 class="sec">${esc(g)}</h3><div class="lista">${TECNICAS.map((t, i) => [t, i]).filter(([t]) => t[2] === g).map(([[k, tit, , bid], i]) => {
      const it = biblioItem(bid), f = it && fichaDeBiblio(it), est = filaDe(i)?.estado || 'nuevo';
      return `<div class="tec-fila${est === 'domino' ? ' hecha' : ''}" data-i="${i}">
        <div class="tec-txt"><b>${esc(tit)}</b>
          <span class="tec-enl"><a href="${f ? '#/concepto/' + f.id : '#/biblioteca/' + bid}">Teoría</a> ·
          <a href="${esc(urlPractica(it?.lichess || 'https://lichess.org/practice'))}" target="_blank" rel="noopener">Practicar</a></span></div>
        <div class="segmento">${ESTADO_TEC.map(([e, n]) => `<button data-e="${e}" class="${est === e ? 'on ' + e : ''}">${n}</button>`).join('')}</div>
      </div>`;
    }).join('')}</div>`).join('')}`;
  v.addEventListener('click', async e => {
    const b = e.target.closest('[data-e]');
    if (!b) return;
    const i = +b.closest('[data-i]').dataset.i;
    const [k, tit, cat, bid] = TECNICAS[i];
    const fila = filaDe(i) || { id: ids[i], titulo: tit, categoria: cat, enlace_lichess: biblioItem(bid)?.lichess || null, orden: i + 1 };
    fila.estado = b.dataset.e;
    await D.guardar('tecnicas', fila);
    pintar(true);
  });
}

// ---------------------------------------------------------------------
//  PREGUNTAS PARA EL MAESTRO
// ---------------------------------------------------------------------
const preguntas = () => D.lista('preguntas_maestro').sort((a, b) => (a.respondida - b.respondida) || String(b.editado_en).localeCompare(String(a.editado_en)));
function filaPregunta(p) {
  const k = p.clase_id && D.obtener('clases', p.clase_id);
  return `<a class="fila-c${p.respondida ? ' respondida' : ''}" href="#/pregunta/${p.id}">
    <span class="res-punto ${p.respondida ? 'bien' : 'regular'}"></span>
    <span class="fila-txt"><b>${esc((p.texto || '').split('\n')[0])}</b>
      <small>${p.respondida ? 'Respondida' : 'Pendiente'}${p.pgn ? ' · con posición' : ''}${k ? ' · clase del ' + fechaLarga(k.fecha) : ''}</small></span>${ico('flecha', 'peq')}</a>`;
}
function vPreguntas(v) {
  const l = preguntas(), pend = l.filter(p => !p.respondida);
  v.innerHTML = `
    <div class="cab-vista"><a href="#/clases" class="btn-ico">${ico('atras')}</a><h1>Preguntas para el maestro</h1></div>
    <p class="intro">Apunta tus dudas durante la semana y llévalas a clase. Con la posición, si hace falta.</p>
    <h3 class="sec">Pendientes <small>${pend.length}</small></h3>
    ${pend.length ? `<div class="lista">${pend.map(filaPregunta).join('')}</div>` : '<p class="nada peq">No tienes dudas pendientes.</p>'}
    ${l.length > pend.length ? `<h3 class="sec">Respondidas</h3><div class="lista">${l.filter(p => p.respondida).map(filaPregunta).join('')}</div>` : ''}
    <a class="btn flotante" href="#/pregunta/nueva" aria-label="Nueva pregunta">${ico('mas')}</a>`;
}
function vPregunta(v, id, q = new URLSearchParams()) {
  editando = true;
  const nueva = id === 'nueva';
  const p = nueva ? { texto: q.get('texto') || '', respuesta: '', respondida: false, clase_id: null, pgn: q.get('pgn') || null } : D.obtener('preguntas_maestro', id);
  if (!p) return ir('#/preguntas');
  const ej = p.pgn ? dePgn(p.pgn) : (p.fen ? ejemploVacio(p.fen) : null);
  let conPosicion = !!ej, ejemplo = ej || ejemploVacio(), ed = null;
  const clasesOrd = D.lista('clases').sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
  v.innerHTML = `
    <div class="cab-vista"><a href="#/preguntas" class="btn-ico">${ico('atras')}</a><h1>${nueva ? 'Nueva pregunta' : 'Pregunta'}</h1></div>
    <form id="f-preg" class="form">
      <label>Tu duda<textarea name="texto" rows="3" required placeholder="¿Por qué aquí no conviene cambiar el alfil?">${esc(p.texto || '')}</textarea></label>
      <div id="preg-pos">${conPosicion ? '' : `<button type="button" class="btn" id="preg-add">${ico('mas', 'peq')} Añadir una posición</button>`}</div>
      <div id="preg-editor" class="editor"${conPosicion ? '' : ' hidden'}></div>
      <label>Clase <small>en la que se la preguntaste</small>
        <select name="clase"><option value="">Aún no</option>${clasesOrd.map(k => `<option value="${k.id}" ${p.clase_id === k.id ? 'selected' : ''}>${fechaLarga(k.fecha)}${k.titulo ? ' · ' + esc(k.titulo) : ''}</option>`).join('')}</select></label>
      <label>Respuesta del maestro<textarea name="respuesta" rows="4" placeholder="Lo que te explicó">${esc(p.respuesta || '')}</textarea></label>
      <div class="botones">
        <button class="btn primario">Guardar</button>
        ${nueva ? '' : `<button type="button" class="btn peligro" id="preg-borrar">${ico('borrar', 'peq')}</button>`}
      </div>
      ${!nueva && p.respondida ? `<a class="btn ancho" href="#/editar/nuevo?pregunta=${p.id}">${ico('conceptos', 'peq')} Convertir en ficha</a>` : ''}
    </form>`;
  const abrirEditor = () => {
    v.querySelector('#preg-editor').hidden = false;
    v.querySelector('#preg-pos').innerHTML = `<button type="button" class="btn peq" id="preg-quitar">Quitar la posición</button>`;
    ed = crearEditor(v.querySelector('#preg-editor'), ejemplo, { pedirPromocion, alCambiar: () => { tableroCambiado = true; } });
    limpiezas.push(ed.cerrar);
    conPosicion = true;
  };
  let tableroCambiado = false;
  if (conPosicion) abrirEditor();
  v.querySelector('#preg-pos').addEventListener('click', e => {
    if (e.target.closest('#preg-add')) { abrirEditor(); tableroCambiado = true; }
    if (e.target.closest('#preg-quitar')) {
      tableroCambiado = true;
      if (ed) ed.cerrar(); ed = null; conPosicion = false; ejemplo = ejemploVacio();
      v.querySelector('#preg-editor').hidden = true; v.querySelector('#preg-editor').innerHTML = '';
      v.querySelector('#preg-pos').innerHTML = `<button type="button" class="btn" id="preg-add">${ico('mas', 'peq')} Añadir una posición</button>`;
    }
  });
  protegerSalida(v, () => tableroCambiado);
  v.querySelector('#f-preg').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    if (ed) { const err = ed.confirmar(); if (err) return alert(err); }
    Object.assign(p, {
      texto: f.texto.value.trim(), respuesta: f.respuesta.value.trim() || null,
      respondida: !!f.respuesta.value.trim(), clase_id: f.clase.value || null,
      fen: conPosicion ? ejemplo.fen0 : null, pgn: conPosicion ? aPgn(ejemplo) : null,
    });
    await D.guardar('preguntas_maestro', p);
    editando = false;
    aviso(p.respondida ? 'Pregunta respondida. Puedes convertirla en ficha.' : 'Pregunta guardada para tu próxima clase');
    ir(p.respondida ? '#/pregunta/' + p.id : '#/preguntas');
  });
  v.querySelector('#preg-borrar')?.addEventListener('click', async () => {
    if (!confirm('¿Borrar esta pregunta?')) return;
    await D.borrar('preguntas_maestro', p.id); editando = false; ir('#/preguntas');
  });
}

// ---------------------------------------------------------------------
//  REPERTORIO (fase 3): tus aperturas, construidas por ti, con guía
// ---------------------------------------------------------------------
const aperturas = () => D.lista('repertorio').sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.nombre.localeCompare(b.nombre, 'es'));
const leerPgn = p => { if (!p) return null; try { return dePgn(p); } catch (e) { return null; } };
const COLOR_TXT = { white: 'Con blancas', black: 'Con negras' };
const TIPO_LINEA = { principal: 'Línea principal', secundaria: 'Respuesta del rival', trampa: 'Trampa' };
const ESTADO_PASO = { hecho: ['check', 'Hecho'], medio: ['reloj', 'A medias'], falta: ['mas', 'Falta'] };
const pasoUrl = (a, p) => (p.ir ? p.ir(a) : `#/editar-apertura/${a.id}?campo=${p.campo || p.clave}`);
const fenFinal = ej => (ej.jugadas.length ? ej.jugadas[ej.jugadas.length - 1].fen : ej.fen0);
// Las líneas también son tarjetas de repaso (desde el principio de la partida)
// Cada línea se entrena con el color de la apertura, salvo las trampas «para no caer», que juegas con el bando que castiga
const colorLinea = (a, l) => l?.juega || a.color;
const lineaEntrenable = (a, ej, l) => !!ej && ej.fen0 === FEN_INICIAL && RP.jugadasPropias(ej, colorLinea(a, l)) >= RP.MIN_PROPIAS;
function lineaDeTarjeta(t) {
  if (!t || t.tipo !== 'linea') return null;
  for (const a of aperturas()) {
    const l = (a.lineas || []).find(x => x.id === t.ref_id);
    if (l) { const ej = leerPgn(l.pgn); return ej ? { a, l, ej } : null; }
  }
  return null;
}
const tarjetasDeApertura = a => { const ids = new Set((a.lineas || []).map(l => l.id)); return tarjetas().filter(t => t.tipo === 'linea' && ids.has(t.ref_id)); };
// Jugadas difíciles: las que más fallas de tus líneas (cada tarjeta recuerda en
// datos.dificiles cuántas veces fallaste cada jugada tuya)
function jugadasDificiles(a) {
  const lista = [];
  for (const t of (a ? tarjetasDeApertura(a) : tarjetas().filter(x => x.tipo === 'linea'))) {
    const ln = lineaDeTarjeta(t);
    if (!ln) continue;
    const tope = Math.min(RP.limitePlies(ln.a), ln.ej.jugadas.length);
    for (const [k, veces] of Object.entries(t.datos?.dificiles || {})) if (veces > 0 && +k < tope) lista.push({ dificil: true, t, idx: +k, veces, ...ln });
  }
  return lista.sort((x, y) => y.veces - x.veces);
}
// Apunta en la tarjeta las jugadas falladas y descuenta las que ya salen bien
function anotarDificiles(t, falladas, limpias) {
  const d = { ...(t.datos || {}) }, f = { ...(d.dificiles || {}) };
  for (const k of falladas) f[k] = (f[k] || 0) + 1;
  for (const k of limpias) if (f[k]) { f[k]--; if (!f[k]) delete f[k]; }
  d.dificiles = f;
  t.datos = d;
}
const tarjetaDeLinea = l => tarjetas().find(t => t.tipo === 'linea' && t.ref_id === l.id);
const RES_TXT = { bien: 'Te sale bien', regular: 'Regular', mal: 'Fallada' };
const filaAvisos = l => l.map(x => `<li class="${x.tipo}">${ico(ESTADO_PASO[x.tipo][0], 'peq')}<span>${esc(x.texto)}</span></li>`).join('');

function vRepertorio(v) {
  const todas = aperturas();
  const cob = RP.cobertura(todas, leerPgn, verSan);
  const bloque = color => {
    const lista = todas.filter(a => a.color === color);
    return `
      <h3 class="sec">${color === 'white' ? '♔' : '♚'} ${COLOR_TXT[color]} <small>${lista.length} de ${RP.MAX_POR_COLOR}</small></h3>
      ${lista.length ? `<div class="lista">${lista.map(a => {
        const r = RP.analizar(a, leerPgn, verSan);
        return `<a class="fila-ap" href="#/apertura/${a.id}">
          <span class="fila-txt"><b>${esc(a.nombre)}</b> <span class="rol ${a.rol}">${a.rol === 'principal' ? 'Principal' : 'Secundaria'}</span>
            <small>${r.tronco && r.tronco.jugadas.length ? esc(RP.jugadasTexto(r.tronco, verSan)) : 'Sin jugadas todavía'}</small>
            <span class="progreso-barra"><span style="width:${r.pct}%"></span></span>
            <small class="sig">${r.siguiente ? `Siguiente: ${esc(r.siguiente.titulo)}` : '✓ Completa'} · ${r.pct}%</small></span>
          ${ico('flecha', 'peq')}</a>`;
      }).join('')}</div>` : ''}
      <ul class="cobertura">${filaAvisos(cob[color])}</ul>
      <a class="btn anadir-ej" href="#/editar-apertura/nueva?color=${color}">${ico('mas')} ${color === 'white' ? 'Añadir apertura con blancas' : 'Añadir defensa con negras'}</a>`;
  };
  v.innerHTML = `
    <div class="cab-vista"><h1>Repertorio</h1>${todas.length ? `<span class="hueco"></span><a href="#/imprimir-repertorio" class="btn-ico" aria-label="Imprimir">${ico('imprimir')}</a>` : ''}</div>
    ${todas.length ? '' : `
      <div class="tarjeta dia vacia">
        <span class="etq">Tu repertorio, a tu manera</span>
        <h2>Empieza por tu apertura principal</h2>
        <p>Elige tú las aperturas: hasta ${RP.MAX_POR_COLOR} por color, ${RP.MAX_ROL.principal} principales y ${RP.MAX_ROL.secundaria} secundarias. La app no te propone ninguna; te guía paso a paso para que cada una quede completa: jugadas, línea principal, respuestas del rival, planes, trampas…</p>
      </div>`}
    ${bloque('white')}
    ${bloque('black')}
    ${todas.some(a => (a.lineas || []).length) ? `<h3 class="sec">Exportar a Lichess</h3>
      <p class="nota">Todo tu repertorio en un PGN: cada apertura será un capítulo de tu estudio de Lichess, con sus variantes.</p>
      <div class="fila-btn"><button class="btn" id="exp-copiar">${ico('copiar', 'peq')} Copiar PGN</button><button class="btn" id="exp-bajar">${ico('descargar', 'peq')} Descargar PGN</button></div>` : ''}`;
  v.querySelector('#exp-copiar')?.addEventListener('click', () => exportarPgn(pgnDeVarias(todas), 'repertorio', 'copiar'));
  v.querySelector('#exp-bajar')?.addEventListener('click', () => exportarPgn(pgnDeVarias(todas), 'repertorio', 'bajar'));
}

function vApertura(v, id) {
  const a = D.obtener('repertorio', id);
  if (!a) return ir('#/repertorio');
  const r = RP.analizar(a, leerPgn, verSan);
  const color = a.color;
  const sig = r.siguiente;
  const fichas = (a.conceptos || []).map(cid => D.obtener('conceptos', cid)).filter(Boolean);
  const estadoLinea = l => {
    if (!lineaEntrenable(a, l.ej, l)) return `<span class="res-punto corta" title="Aún corta para entrenar"></span>`;
    const t = tarjetaDeLinea(l);
    return `<span class="res-punto ${t?.ultimo_resultado || ''}" title="${t?.ultimo_resultado ? RES_TXT[t.ultimo_resultado] : 'Sin entrenar'}"></span>`;
  };
  const filaLinea = l => {
    const sep = r.principal && l.tipo !== 'principal' && l.ej ? RP.separacion(l.ej, r.principal.ej) : -1;
    const n = l.ej ? l.ej.jugadas.length : 0;
    const faltan = RP.MIN_PROPIAS - RP.jugadasPropias(l.ej, colorLinea(a, l));
    return `<a class="fila-c" href="#/linea/${a.id}?l=${l.id}">${estadoLinea(l)}
      <span class="fila-txt"><b>${esc(l.nombre || TIPO_LINEA[l.tipo])}</b>
      <small>${sep >= 0 ? `Se separa en ${esc(RP.etiquetaPly(l.ej, sep, verSan))} · ` : ''}hasta la jugada ${Math.ceil(n / 2) || 0}${faltan > 0 ? ` · para entrenarla, ${faltan} ${faltan === 1 ? 'jugada tuya más' : 'jugadas tuyas más'}` : ''}${l.nota ? ' · ' + esc(l.nota.slice(0, 60)) : ''}</small></span>
      ${ico('flecha', 'peq')}</a>`;
  };
  const entrenables = (a.lineas || []).filter(l => lineaEntrenable(a, leerPgn(l.pgn), l));
  const hoyToca = R.pendientes(tarjetasDeApertura(a)).length;
  const dificiles = jugadasDificiles(a).length;
  const seccion = (titulo, contenido, clave) => contenido ? `<h3 class="sec">${titulo} <a class="btn-ico peq" href="#/editar-apertura/${a.id}?campo=${clave}" aria-label="Editar">${ico('editar')}</a></h3><div class="md">${md(contenido)}</div>` : '';
  v.innerHTML = `
    <div class="cab-vista">
      <a href="#/repertorio" class="btn-ico" aria-label="Volver">${ico('atras')}</a>
      <span class="hueco"></span>
      <a href="#/imprimir-repertorio?ap=${a.id}" class="btn-ico" aria-label="Imprimir">${ico('imprimir')}</a>
      <a href="#/editar-apertura/${a.id}" class="btn peq">${ico('editar', 'peq')} Editar</a>
    </div>
    <article class="ficha ap-cab">
      <div class="etqs"><span class="etq-bloque">${COLOR_TXT[color]}${a.eco ? ' · ' + esc(a.eco) : ''}</span>
        <span class="rol ${a.rol}">${a.rol === 'principal' ? 'Principal' : 'Secundaria'}</span>
        ${a.revisada ? `<span class="estado hecho">${ico('check', 'peq')} Revisada con el maestro</span>` : ''}</div>
      <h1 class="ficha-tit">${esc(a.nombre)}</h1>
      ${r.tronco && r.tronco.jugadas.length ? `<p class="tronco">${esc(RP.jugadasTexto(r.tronco, verSan))}
        <a href="${esc(RP.urlExplorador(fenFinal(r.tronco), color))}" target="_blank" rel="noopener" class="chip">${ico('externo', 'peq')} Explorador</a></p>` : ''}
      <div class="progreso-barra grande"><span style="width:${r.pct}%"></span></div>
      <p class="nota">Preparada al <b>${r.pct}%</b></p>
    </article>
    ${sig ? `<div class="pista siguiente"><b>Siguiente paso · ${esc(sig.titulo)}</b><p>${esc(sig.ayuda)}</p>
      ${sig.clave === 'revisada' ? `<div class="fila-btn"><button class="btn primario peq" id="revisada">${ico('check', 'peq')} Ya la he revisado</button>
        <a class="btn peq" href="#/pregunta/nueva?texto=${encodeURIComponent(`Repertorio · ${a.nombre}: `)}">Apuntar una pregunta</a></div>`
        : `<a class="btn primario peq" href="${pasoUrl(a, sig)}">Hacerlo ahora ${ico('flecha', 'peq')}</a>`}</div>`
      : `<div class="pista siguiente"><b>¡Apertura completa!</b><p>Ahora toca jugarla y repasarla. Cuando tu maestro te corrija algo, edítalo: la guía te avisará si falta algo.</p></div>`}
    ${entrenables.length ? `<a class="tarjeta practicar" href="#/repaso?ap=${a.id}">${ico('entrenar')}<span><b>Entrenar esta apertura</b>
        <small>${entrenables.length} ${entrenables.length === 1 ? 'línea' : 'líneas'}${hoyToca ? ` · ${hoyToca} ${hoyToca === 1 ? 'toca' : 'tocan'} hoy` : ''} · primero las que peor llevas</small></span>${ico('flecha', 'peq')}</a>` : ''}
    ${dificiles ? `<a class="tarjeta practicar" href="#/repaso?dificiles=1&ap=${a.id}">${ico('rayo')}<span><b>Mis jugadas difíciles</b>
        <small>${dificiles} ${dificiles === 1 ? 'jugada que sueles fallar' : 'jugadas que sueles fallar'} en esta apertura</small></span>${ico('flecha', 'peq')}</a>` : ''}
    ${r.avisosLineas.length ? `<ul class="cobertura">${r.avisosLineas.map(x => `<li class="medio">${ico('reloj', 'peq')}<span>${esc(x.texto)}</span></li>`).join('')}</ul>` : ''}
    <details class="guia-ap"${r.pct < 100 ? ' open' : ''}><summary>La guía: ${r.pasos.filter(p => p.estado === 'hecho').length} de ${r.pasos.length} pasos</summary>
      <div class="lista">${r.pasos.map((p, i) => `<a class="fila-c paso ${p.estado}" href="${p.clave === 'revisada' ? '#/editar-apertura/' + a.id + '?campo=revisada' : pasoUrl(a, p)}">
        <span class="paso-n">${p.estado === 'hecho' ? ico('check', 'peq') : i + 1}</span>
        <span class="fila-txt"><b>${esc(p.titulo)}</b><small>${esc(p.detalle)}</small></span>${ico('flecha', 'peq')}</a>`).join('')}</div>
    </details>
    ${seccion('Objetivos', a.ideas, 'ideas')}
    ${arbolHtml(a)}
    <h3 class="sec">Línea principal</h3>
    ${r.principal ? `<div class="tarjeta ejemplo">
        <div class="ej-cab">${estadoLinea(r.principal)}<b>${esc(r.principal.nombre || 'Línea principal')}</b><a href="#/editar-linea/${a.id}?l=${r.principal.id}" class="btn-ico peq" aria-label="Editar">${ico('editar')}</a></div>
        <div class="visor" id="visor-principal"></div>
        ${r.principal.nota ? `<div class="md">${md(r.principal.nota)}</div>` : ''}
        <div class="fila-btn">
          <a class="chip" href="${esc(RP.urlAnalisis(r.principal.ej, color))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Analizar en Lichess</a>
          <a class="chip" href="${esc(RP.urlExplorador(fenFinal(r.principal.ej), color))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Explorador al final</a>
          <button class="chip" id="crear-ej">${ico('mas', 'peq')} Crear ejemplo desde aquí</button>
        </div></div>`
      : `<a class="btn anadir-ej" href="#/editar-linea/${a.id}?l=nueva&tipo=principal">${ico('mas')} Crear la línea principal</a>`}
    <h3 class="sec">Respuestas del rival <small>${r.secundarias.length || ''}</small></h3>
    ${r.secundarias.length ? `<div class="lista">${r.secundarias.map(filaLinea).join('')}</div>` : '<p class="nada peq">Las alternativas del rival a tu línea principal.</p>'}
    <a class="btn anadir-ej" href="#/editar-linea/${a.id}?l=nueva&tipo=secundaria">${ico('mas')} Añadir respuesta del rival</a>
    <h3 class="sec">Trampas <small>${r.trampas.length || ''}</small></h3>
    ${r.trampas.length ? `<div class="lista">${r.trampas.map(filaLinea).join('')}</div>` : '<p class="nada peq">Las que puedes tender y en las que no debes caer.</p>'}
    <a class="btn anadir-ej" href="#/editar-linea/${a.id}?l=nueva&tipo=trampa">${ico('mas')} Añadir trampa</a>
    <a class="btn anadir-ej" href="#/importar-lineas/${a.id}">${ico('descargar')} Importar líneas (PGN o estudio de Lichess)</a>
    ${seccion('Estructura de peones', a.estructura, 'estructura')}
    ${seccion('Planes del medio juego', a.planes, 'planes')}
    ${seccion('Rupturas', a.rupturas, 'rupturas')}
    ${seccion('Tácticas típicas', a.tacticas, 'tacticas')}
    ${(a.partidas_modelo || []).length ? `<h3 class="sec">Partidas modelo</h3><div class="enlaces">${a.partidas_modelo.map(p => p.url
      ? `<a class="enlace" href="${esc(p.url)}" target="_blank" rel="noopener"><b>${esc(p.titulo || 'Partida')}</b><small>${ico('externo', 'peq')} Abrir</small></a>`
      : `<span class="enlace"><b>${esc(p.titulo || 'Partida')}</b></span>`).join('')}</div>` : ''}
    ${fichas.length ? `<h3 class="sec">Conceptos de tu cuaderno</h3><div class="chips">${fichas.map(c => `<a class="chip" href="#/concepto/${c.id}">${ico('enlace', 'peq')} ${esc(c.titulo)}</a>`).join('')}</div>` : ''}
    ${(a.lineas || []).length ? `<h3 class="sec">Exportar a Lichess</h3>
      <p class="nota">Todas sus líneas juntas en un PGN con variantes. En Lichess: tu estudio → Añadir capítulo → PGN, y pega o sube el archivo.</p>
      <div class="fila-btn"><button class="btn" id="exp-copiar">${ico('copiar', 'peq')} Copiar PGN</button><button class="btn" id="exp-bajar">${ico('descargar', 'peq')} Descargar PGN</button></div>` : ''}`;
  v.querySelector('#exp-copiar')?.addEventListener('click', () => exportarPgn(pgnDeApertura(a), a.nombre, 'copiar'));
  v.querySelector('#exp-bajar')?.addEventListener('click', () => exportarPgn(pgnDeApertura(a), a.nombre, 'bajar'));
  if (r.principal?.ej) {
    const vis = crearVisor(v.querySelector('#visor-principal'), r.principal.ej, { orientacion: color });
    limpiezas.push(vis.cerrar);
    v.querySelector('#crear-ej')?.addEventListener('click', () => crearEjemploDesde(r.principal.ej, vis.ply(), color));
  }
  const antes = tarjetasDeApertura(a).length;
  prepararTarjetas().then(() => { if (v.isConnected && tarjetasDeApertura(a).length !== antes) pintar(true); });
  v.querySelector('#revisada')?.addEventListener('click', async () => {
    a.revisada = true;
    await D.guardar('repertorio', a);
    aviso('Apertura revisada con tu maestro');
    pintar(true);
  });
}

// ---------------------------------------------------------------------
//  REPERTORIO 5.0: árbol, importar y exportar (PGN con variantes ⇄ Lichess)
// ---------------------------------------------------------------------
const ORDEN_TIPO = ['principal', 'secundaria', 'trampa'];
const lineasOrdenadas = a => [...(a.lineas || [])].sort((x, y) => ORDEN_TIPO.indexOf(x.tipo) - ORDEN_TIPO.indexOf(y.tipo))
  .map(l => ({ l, ej: leerPgn(l.pgn) })).filter(x => x.ej);

// El árbol de la apertura: las líneas juntas hasta donde coinciden, y sus ramas
function arbolHtml(a) {
  const lineas = lineasOrdenadas(a);
  if (lineas.length < 2) return '';
  const num = (ply, forzar) => (ply % 2 === 1 ? `${(ply + 1) / 2}.` : forzar ? `${ply / 2}…` : '');
  const tramo = (n, forzar) => {   // jugadas seguidas sin ramas, hasta una bifurcación o un final
    let txt = '', x = n, primera = true;
    for (;;) {
      txt += `${num(x.ply, primera && forzar)}${esc(verSan(x.san))} `;
      primera = false;
      if (x.hijos.length !== 1 || x.lineas.length) break;
      x = x.hijos[0];
    }
    const finales = x.lineas.map(l => `<a class="arb-fin ${l.tipo}" href="#/linea/${a.id}?l=${l.id}">${esc(l.nombre || TIPO_LINEA[l.tipo])}</a>`).join(' ');
    return `<span class="arb-tramo">${txt.trim()}</span>${finales ? ' ' + finales : ''}${x.hijos.length > 1 || (x.hijos.length && x.lineas.length) ? ramas(x) : ''}`;
  };
  const ramas = n => `<ul class="arbol">${n.hijos.map(h => `<li>${tramo(h, true)}</li>`).join('')}</ul>`;
  const raiz = RP.arbol(lineas);
  return `<details class="arbol-caja" open><summary>${ico('repertorio', 'peq')} El árbol de tu apertura <small>${lineas.length} líneas</small></summary>
      <div class="arbol-raiz">${raiz.hijos.length === 1 ? tramo(raiz.hijos[0], false) : ramas(raiz)}</div></details>`;
}

// PGN con variantes de una apertura (para Lichess: Estudio → Añadir capítulo → PGN)
function pgnDeApertura(a) {
  const lineas = lineasOrdenadas(a).map(({ l, ej }) => ({ ej, nombre: l.nombre || TIPO_LINEA[l.tipo], nota: l.nota }));
  if (!lineas.length) return null;
  return lineasAPgn(lineas, {
    Event: a.nombre, Site: 'Memorias de Peón', White: a.color === 'white' ? 'Mi repertorio' : '?', Black: a.color === 'black' ? 'Mi repertorio' : '?',
    Result: '*', ECO: a.eco || '', Annotator: 'Memorias de Peón',
  });
}
const nombreArchivo = t => `MdP-${norm(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'repertorio'}.pgn`;
async function copiarTexto(texto) {
  try { await navigator.clipboard.writeText(texto); return true; } catch (e) { return false; }
}
const pgnDeVarias = lista => lista.map(pgnDeApertura).filter(Boolean).join('\n\n');
// Exportar: descargar el archivo .pgn o copiarlo para pegarlo en Lichess
async function exportarPgn(texto, nombre, como) {
  if (!texto) return alert('Aún no hay líneas que exportar.');
  if (como === 'copiar') return aviso(await copiarTexto(texto) ? 'PGN copiado. En Lichess: tu estudio → Añadir capítulo → PGN → pégalo.' : 'No se ha podido copiar: usa «Descargar PGN».');
  descargar(nombreArchivo(nombre), texto, 'application/x-chess-pgn');
}

// Importar líneas a una apertura: un PGN (con variantes) o un estudio de Lichess
// Nombre de un capítulo de un estudio de Lichess (o de una partida de un PGN con varias)
function nombreCapitulo(cab, i) {
  if (cab.ChapterName) return cab.ChapterName;
  const ev = cab.Event || '';
  if (cab.StudyName && ev.startsWith(cab.StudyName + ': ')) return ev.slice(cab.StudyName.length + 2);
  if (cab.White && cab.Black && !/^\?*$/.test(cab.White)) return `${cab.White} – ${cab.Black}`;
  return ev && !/^\?*$/.test(ev) ? ev : `Capítulo ${i + 1}`;
}
// Un capítulo que es una partida jugada (con jugadores y resultado), no una línea de repertorio
const esPartidaJugada = cab => !!cab.White && !!cab.Black && !/^\?*$/.test(cab.White) && !/^\?*$/.test(cab.Black) && /^(1-0|0-1|1\/2-1\/2)$/.test(cab.Result || '');

function vImportarLineas(v, apId) {
  const a = D.obtener('repertorio', apId);
  if (!a) return ir('#/repertorio');
  editando = true;
  let ramas = [];
  v.innerHTML = `
    <div class="cab-vista"><a href="#/apertura/${a.id}" class="btn-ico">${ico('atras')}</a><div class="ej-tit"><h1>Importar líneas</h1><small>${esc(a.nombre)}</small></div></div>
    <form id="f-imp" class="form">
      <label>PGN o enlace de un estudio de Lichess
        <small class="ayuda-paso">Cada variante del PGN se convierte en una línea de tu apertura. En Lichess, abre tu estudio y copia su enlace (o el del capítulo), o su PGN desde «Compartir y exportar». Notación inglesa o española.</small>
        <textarea name="t" rows="7" placeholder="1. e4 c6 2. d4 d5 3. e5 (3. exd5 cxd5 4. Bd3) (3. Nc3 dxe4 4. Nxe4) 3... Bf5 *"></textarea></label>
      <button class="btn primario" type="submit">Ver las líneas</button>
    </form>
    <div id="imp-res"></div>`;
  const caja = v.querySelector('#imp-res');
  const existentes = (a.lineas || []).map(l => (leerPgn(l.pgn)?.jugadas || []).map(j => j.san).join(' '));
  const yaEsta = s => existentes.some(e => e === s || e.startsWith(s + ' '));
  v.querySelector('#f-imp').addEventListener('submit', async e => {
    e.preventDefault();
    let texto = e.target.t.value.trim();
    if (!texto) return;
    try {
      if (soloEnlaceLichess(texto)) texto = await pgnDeLichess(texto);
    } catch (err) { return alert(err.message); }
    // Cada línea recuerda de qué capítulo del estudio viene (y si ese capítulo es una partida jugada)
    ramas = PA.separarPgn(texto).flatMap((p, ci) => pgnARamas((p.cab.FEN ? `[FEN "${p.cab.FEN}"]\n` : '') + p.cuerpo)
      .map(r => ({ ...r, cap: ci, capNombre: nombreCapitulo(p.cab, ci), partida: esPartidaJugada(p.cab) })));
    if (!ramas.length) ramas = pgnARamas(texto);
    ramas = ramas.filter(r => r.fen0 === FEN_INICIAL);
    if (!ramas.length) return alert('No he encontrado líneas desde la posición inicial en lo que has pegado.');
    // Un estudio repite a menudo el mismo comienzo en varios capítulos: fuera las líneas
    // repetidas y las que ya están dentro de otra más larga (el árbol las enseña igual)
    // Trampas del autor (jugadas marcadas con ? o ??, o comentarios que hablan de trampas)
    const trampasYa = (a.lineas || []).filter(l => l.tipo === 'trampa').map(l => (leerPgn(l.pgn)?.jugadas || []).map(j => j.san).join(' '));
    const trampas = RP.buscarTrampas(ramas, a.color, trampasYa, verSan);
    const sanes = ramas.map(r => r.jugadas.map(j => j.san).join(' '));
    const vistas = new Set(), total = ramas.length;
    ramas = ramas.filter((r, i) => {
      if (vistas.has(sanes[i])) return false;
      vistas.add(sanes[i]);
      return !sanes.some((o, k) => k !== i && o.startsWith(sanes[i] + ' '));
    });
    const omitidas = total - ramas.length;
    const principal = (a.lineas || []).find(l => l.tipo === 'principal');
    // Sin principal todavía: se propone la primera que empieza como la mayoría (y la puedes cambiar)
    const cuenta = {};
    ramas.forEach(r => { const k = r.jugadas[0]?.san; cuenta[k] = (cuenta[k] || 0) + 1; });
    const mayoria = Object.keys(cuenta).sort((x, y) => cuenta[y] - cuenta[x])[0];
    let elegida = principal ? -1 : Math.max(0, ramas.findIndex(r => r.jugadas[0]?.san === mayoria && !r.partida));
    // Capítulos en el orden del estudio (solo se enseñan si hay más de uno)
    const caps = [];
    ramas.forEach((r, i) => {
      let c = caps.find(x => x.cap === r.cap);
      if (!c) caps.push(c = { cap: r.cap, nombre: r.capNombre, partida: r.partida, idx: [] });
      c.idx.push(i);
    });
    const porCapitulos = caps.length > 1;
    const marcadasTr = new Set(trampas.map((t, i) => (t.tender && !t.partida ? i : -1)).filter(i => i >= 0));
    const verNombre = n => n;   // el nombre ya viene con la notación elegida
    const pintarLista = () => {
      const base = principal ? leerPgn(principal.pgn) : ramas[elegida];
      const marcadas = new Set([...caja.querySelectorAll('.imp-fila input:checked')].map(x => +x.value));
      const primeraVez = !caja.querySelector('.imp-lista');
      caja.innerHTML = `
      <h3 class="sec">${ramas.length} ${ramas.length === 1 ? 'línea encontrada' : 'líneas encontradas'}</h3>
      ${omitidas ? `<p class="nota">He quitado ${omitidas} ${omitidas === 1 ? 'línea repetida o que ya va dentro de otra más larga' : 'líneas repetidas o que ya van dentro de otras más largas'}.</p>` : ''}
      ${principal ? '' : '<p class="nota">Elige con ★ cuál es tu <b>línea principal</b>; las demás serán respuestas del rival.</p>'}
      ${porCapitulos ? '<p class="nota">Las líneas van agrupadas por capítulos del estudio. Toca la casilla de un capítulo para quitarlo o ponerlo entero; los que son partidas jugadas vienen desmarcados.</p>' : ''}
      <div class="lista imp-lista">${(porCapitulos ? caps : [{ idx: ramas.map((_, i) => i) }]).map(c => (porCapitulos ? `
        <label class="imp-cap"><input type="checkbox" class="imp-cap-chk" data-cap="${c.cap}" aria-label="Todo el capítulo">
          <b>${esc(c.nombre)}</b><small>${c.idx.length} ${c.idx.length === 1 ? 'línea' : 'líneas'}${c.partida ? ' · parece una partida jugada' : ''}</small></label>` : '') + c.idx.map(i => {
        const r = ramas[i];
        const ya = yaEsta(r.jugadas.map(j => j.san).join(' '));
        const larga = r.jugadas.length > RP.limitePlies(a);
        const sep = i === elegida ? -1 : RP.separacion(r, base);
        const marcada = primeraVez ? !ya && r.jugadas[0]?.san === mayoria && !r.partida : marcadas.has(i) || i === elegida;
        return `<div class="fila-c imp-fila${ya ? ' ya' : ''}${i === elegida ? ' princ' : ''}" data-cap="${r.cap ?? ''}">
          <input type="checkbox" value="${i}" ${ya ? 'disabled' : i === elegida ? 'checked disabled' : marcada ? 'checked' : ''} aria-label="Importar esta línea">
          <span class="fila-txt"><b>${i === elegida ? '★ Línea principal' : sep >= 0 ? `Desde ${esc(RP.etiquetaPly(r, sep, verSan))}` : 'Línea'}</b>
          <small>${esc(RP.jugadasTexto(r, verSan)).slice(0, 140)}${ya ? ' · <b>ya la tienes</b>' : ''}${larga ? ` · pasa de la jugada ${RP.LIMITE_JUGADAS[a.rol] || 15}: se entrenará hasta ahí` : ''}${r.jugadas[0]?.san !== mayoria ? ' · <b>empieza distinto</b>' : ''}</small></span>
          ${principal || ya ? '' : `<button type="button" class="btn-ico imp-princ" data-i="${i}" aria-label="Hacer principal" title="Hacer principal">${i === elegida ? '★' : '☆'}</button>`}</div>`;
      }).join('')).join('')}</div>
      ${trampas.length ? `
      <h3 class="sec">Trampas encontradas <small>${trampas.length}</small></h3>
      <p class="nota"><b>Para tender</b>: se equivoca el rival y tú castigas (vienen marcadas). <b>Para no caer</b>: se equivoca tu bando; las entrenarás con el bando que castiga, para ver cómo te machacan y no caer (vienen desmarcadas). Las <b>posibles</b> son jugadas que el autor explica con palabras («mistake», «loses a pawn»…) sin marcarlas con ?: míralas antes de guardarlas. Marca las que quieras: se guardan en las Trampas de la apertura y salen como tarjetas.</p>
      <div class="lista imp-trampas">${trampas.map((t, i) => `
        <div class="fila-c imp-tr"><input type="checkbox" value="${i}" ${marcadasTr.has(i) ? 'checked' : ''} aria-label="Guardar esta trampa">
          <span class="fila-txt"><b>${esc(verNombre(t.nombre))}</b><small>${t.posible ? `El autor lo comenta como error: revísala (${t.tender ? 'para tender' : 'para no caer'})` : t.tender ? 'Para tender' : 'Para no caer'}${t.capNombre ? ' · ' + esc(t.capNombre) : ''} · ${esc(RP.jugadasTexto(t.ej, verSan)).slice(0, 120)}</small></span></div>`).join('')}</div>` : ''}
      <div class="botones"><button class="btn primario" id="imp-ok">Añadir a ${esc(a.nombre)}</button></div>`;
      caja.querySelectorAll('.imp-princ').forEach(b => b.addEventListener('click', () => { elegida = +b.dataset.i; pintarLista(); }));
      caja.querySelectorAll('.imp-fila:not(.ya)').forEach(f => f.addEventListener('click', e => {   // tocar la fila marca o desmarca
        if (e.target.closest('button, input')) return;
        const c = f.querySelector('input'); if (!c.disabled) c.checked = !c.checked;   // la principal siempre va
      }));
      // La casilla del capítulo refleja sus líneas y las marca o desmarca todas a la vez
      const filasCap = cap => [...caja.querySelectorAll(`.imp-fila[data-cap="${cap}"]:not(.ya) input`)];
      const reflejar = () => caja.querySelectorAll('.imp-cap-chk').forEach(ch => {
        const xs = filasCap(ch.dataset.cap), n = xs.filter(x => x.checked).length;
        ch.checked = n > 0 && n === xs.length; ch.indeterminate = n > 0 && n < xs.length; ch.disabled = !xs.length;
      });
      caja.querySelectorAll('.imp-cap-chk').forEach(ch => ch.addEventListener('change', () => {
        filasCap(ch.dataset.cap).forEach(x => { x.checked = ch.checked || +x.value === elegida; });
        reflejar();
      }));
      caja.querySelector('.imp-lista').addEventListener('click', () => setTimeout(reflejar));
      caja.querySelectorAll('.imp-tr').forEach(f => {
        const c = f.querySelector('input');
        const anotar = () => { c.checked ? marcadasTr.add(+c.value) : marcadasTr.delete(+c.value); };
        c.addEventListener('change', anotar);
        f.addEventListener('click', e => { if (e.target.closest('input')) return; c.checked = !c.checked; anotar(); });
      });
      reflejar();
      caja.querySelector('#imp-ok').addEventListener('click', guardar);
    };
    const guardar = async () => {
      const marcadas = [...caja.querySelectorAll('.imp-fila input:checked')].map(x => +x.value);   // solo líneas, no las casillas de capítulo
      const tr = [...marcadasTr].sort((x, y) => x - y).map(i => trampas[i]);
      if (!marcadas.length && !tr.length) return;
      // La principal va primero
      const orden = principal ? marcadas : [elegida, ...marcadas.filter(i => i !== elegida)];
      const base = principal ? leerPgn(principal.pgn) : ramas[elegida];
      a.lineas = a.lineas || [];
      const elegidas = marcadas.length ? orden.map(i => ramas[i]) : [];
      elegidas.forEach(r => {
        const tipo = !principal && r === ramas[elegida] ? 'principal' : 'secundaria';
        const sep = tipo === 'principal' ? -1 : RP.separacion(r, base);
        a.lineas.push({ id: D.nuevoId(), tipo, nombre: tipo === 'principal' ? 'Línea principal' : sep >= 0 ? `Desde ${RP.etiquetaPly(r, sep, verSan)}` : 'Importada', nota: null, pgn: aPgn(r) });
      });
      tr.forEach(t => a.lineas.push({ id: D.nuevoId(), tipo: 'trampa', nombre: t.nombre, nota: t.nota, pgn: aPgn(t.ej), ...(t.juega !== a.color ? { juega: t.juega } : {}) }));
      // Si la apertura aún no tenía sus jugadas, se toman las comunes a todas las líneas
      if (elegidas.length && !leerPgn(a.tronco)?.jugadas.length) {
        const ss = elegidas.map(r => r.jugadas.map(j => j.san));
        let k = 0; while (k < 8 && ss.every(x => x[k] && x[k] === ss[0][k])) k++;
        const t = elegidas[0]; a.tronco = aPgn({ ...t, jugadas: t.jugadas.slice(0, Math.max(k, Math.min(2, t.jugadas.length))).map(j => ({ ...j, comentario: '', formas: [] })) });
      }
      await D.guardar('repertorio', a);
      editando = false;
      aviso([elegidas.length ? `${elegidas.length} ${elegidas.length === 1 ? 'línea añadida' : 'líneas añadidas'}` : '', tr.length ? `${tr.length} ${tr.length === 1 ? 'trampa' : 'trampas'}` : ''].filter(Boolean).join(' y '));
      ir('#/apertura/' + a.id);
    };
    pintarLista();
  });
}

// Imprimir el repertorio (o una apertura): guía, líneas en notación y diagramas
function vImprimirRepertorio(v, _id, q) {
  const sel = q.get('ap') || 'todas';
  const conDiag = q.get('diag') !== '0';
  const lista = sel === 'todas' ? aperturas().sort((a, b) => (a.color === b.color ? 0 : a.color === 'white' ? -1 : 1)) : [D.obtener('repertorio', sel)].filter(Boolean);
  const volver = sel === 'todas' ? '#/repertorio' : '#/apertura/' + sel;
  const bloqueTxt = (tit, t) => t ? `<h3 class="p-sub">${tit}</h3><div class="md">${md(t)}</div>` : '';
  const lineaHtml = (a, l) => {
    const ej = leerPgn(l.pgn);
    if (!ej) return '';
    return `<div class="p-ej">${conDiag ? diagrama(ej, { orientacion: a.color, ply: ej.jugadas.length }) : ''}
      <div class="p-ej-txt"><b>${esc(l.nombre || TIPO_LINEA[l.tipo])}</b> <small>· ${TIPO_LINEA[l.tipo]}</small>
      <p class="p-jug">${textoJugadas(ej)}</p>${l.nota ? `<p>${esc(l.nota)}</p>` : ''}</div></div>`;
  };
  const apHtml = a => {
    const r = RP.analizar(a, leerPgn, verSan);
    const orden = ['principal', 'secundaria', 'trampa'];
    const lineas = [...(a.lineas || [])].sort((x, y) => orden.indexOf(x.tipo) - orden.indexOf(y.tipo));
    const fichas = (a.conceptos || []).map(cid => D.obtener('conceptos', cid)).filter(Boolean);
    return `<article class="p-ficha p-apertura" style="--c:${a.color === 'white' ? '#b9a27c' : '#2a241d'}">
      <div class="p-cab"><span>${COLOR_TXT[a.color]} · ${a.rol === 'principal' ? 'Principal' : 'Secundaria'}${a.eco ? ' · ' + esc(a.eco) : ''} · preparada al ${r.pct}%</span></div>
      <h2>${esc(a.nombre)}</h2>
      ${r.tronco && r.tronco.jugadas.length ? `<blockquote>${esc(RP.jugadasTexto(r.tronco, verSan))}</blockquote>` : ''}
      ${bloqueTxt('Objetivos', a.ideas)}
      ${lineas.length ? `<h3 class="p-sub">Líneas</h3>${lineas.map(l => lineaHtml(a, l)).join('')}` : ''}
      ${bloqueTxt('Estructura de peones', a.estructura)}
      ${bloqueTxt('Planes del medio juego', a.planes)}
      ${bloqueTxt('Rupturas', a.rupturas)}
      ${bloqueTxt('Tácticas típicas', a.tacticas)}
      ${(a.partidas_modelo || []).length ? `<h3 class="p-sub">Partidas modelo</h3><ul>${a.partidas_modelo.map(pm => `<li>${esc(pm.titulo || pm.url)}</li>`).join('')}</ul>` : ''}
      ${fichas.length ? `<h3 class="p-sub">Conceptos</h3><p>${fichas.map(c => esc(c.titulo)).join(' · ')}</p>` : ''}
    </article>`;
  };
  v.innerHTML = `
    <div class="no-imp">
      <div class="cab-vista"><a href="${volver}" class="btn-ico">${ico('atras')}</a><h1>Imprimir repertorio</h1></div>
      <div class="form"><label>Qué imprimir
        <select id="p-sel"><option value="todas" ${sel === 'todas' ? 'selected' : ''}>Todo el repertorio</option>
        ${aperturas().map(a => `<option value="${a.id}" ${sel === a.id ? 'selected' : ''}>${a.color === 'white' ? '♔' : '♚'} ${esc(a.nombre)}</option>`).join('')}</select></label></div>
      <label class="check"><input type="checkbox" id="p-diag" ${conDiag ? 'checked' : ''}><span>Un diagrama al final de cada línea</span></label>
      <p class="nota">Cada apertura empieza en una página nueva. En la ventana de impresión elige «Guardar como PDF» si lo quieres en archivo.</p>
      <button class="btn primario ancho" id="p-imp">${ico('imprimir', 'peq')} Imprimir o guardar en PDF</button>
      <h3 class="sec">Vista previa</h3>
    </div>
    <div class="hoja">
      <header class="p-portada"><span class="mono">M<i>d</i>P</span><div><b>Memorias de Peón · Repertorio</b><small>${sel === 'todas' ? 'Todo el repertorio' : esc(lista[0]?.nombre || '')} · ${new Date().toLocaleDateString('es-ES')}</small></div></header>
      ${lista.map(apHtml).join('') || '<p class="nada">Aún no tienes aperturas.</p>'}
      <footer class="p-pie">Memorias de Peón · Casilla a casilla · by Manuel Esteve</footer>
    </div>`;
  const recargar = () => {
    const p = new URLSearchParams({ ap: v.querySelector('#p-sel').value });
    if (!v.querySelector('#p-diag').checked) p.set('diag', '0');
    history.replaceState(null, '', '#/imprimir-repertorio?' + p.toString());
    pintar(true);
  };
  v.querySelector('#p-sel').addEventListener('change', recargar);
  v.querySelector('#p-diag').addEventListener('change', recargar);
  v.querySelector('#p-imp').addEventListener('click', () => window.print());
}

// ---------------------------------------------------------------------
//  MIS PARTIDAS (fase 4): solo las que eliges, revisadas con una guía
// ---------------------------------------------------------------------
const partidas = () => D.lista('partidas').sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || '')) || String(b.editado_en).localeCompare(String(a.editado_en)));
const momentosDe = id => D.lista('momentos').filter(m => m.partida_id === id).sort((a, b) => a.ply - b.ply);
const sanesDe = ej => (ej ? ej.jugadas.map(j => j.san) : []);
const repDePartida = (p, ej) => PA.enRepertorio(sanesDe(ej), p.color, aperturas(), leerPgn, verSan);
const CLASE_RES = { victoria: 'bien', tablas: 'regular', derrota: 'mal' };
const TIPO_MOMENTO = { error: 'Error', acierto: 'Buena jugada', duda: 'Duda', clave: 'Momento clave' };
const vsRival = p => `${p.color === 'white' ? '♔' : p.color === 'black' ? '♚' : ''} vs ${esc(p.rival || 'rival sin nombre')}${p.elo_rival ? ` <small>(${p.elo_rival})</small>` : ''}`;
const urlPartidaLichess = (p, ej) => (p.lichess_id ? `https://lichess.org/${p.lichess_id}${p.color === 'black' ? '/black' : ''}` : RP.urlAnalisis(ej, p.color || 'white'));
// Jugada que se marca en un momento: «ply» es la posición ANTES de esa jugada
const fenAntes = (ej, ply) => (ply <= 0 ? ej.fen0 : ej.jugadas[ply - 1].fen);
const etiquetaJ = (ej, i) => (ej.jugadas[i] ? etiquetaJugada(ej, i + 1) : '');   // i: índice de la jugada (desde 0)
function revisionDe(p) {
  const ej = leerPgn(p.pgn);
  return { ej, rep: repDePartida(p, ej), ...PA.analizar(p, momentosDe(p.id), ej, repDePartida(p, ej)) };
}

function filaPartida(p) {
  const r = revisionDe(p);
  const res = PA.miResultado(p);
  return `<a class="fila-c" href="#/partida/${p.id}"><span class="res-punto ${CLASE_RES[res] || ''}" title="${PA.TEXTO_RESULTADO[res] || ''}"></span>
    <span class="fila-txt"><b>${vsRival(p)}</b>
      <small>${[p.fecha ? fechaLarga(p.fecha) : '', p.ritmo, p.apertura].filter(Boolean).map(esc).join(' · ')}</small>
      <small class="sig">${r.siguiente ? `Revisión ${r.pct}% · siguiente: ${esc(r.siguiente.titulo)}` : '✓ Revisada'}</small></span>
    ${ico('flecha', 'peq')}</a>`;
}

function vPartidas(v) {
  const todas = partidas();
  const pend = todas.filter(p => revisionDe(p).siguiente), hechas = todas.filter(p => !pend.includes(p));
  v.innerHTML = `
    <div class="cab-vista"><h1>Mis partidas</h1>${todas.length ? `<span class="hueco"></span><a class="btn peq" href="#/resumen-partidas">${ico('check', 'peq')} Resumen</a>` : ''}</div>
    ${todas.length ? '' : `<div class="tarjeta dia vacia"><span class="etq">Aprender de tus partidas</span>
      <h2>Solo las que jugaste pensando</h2>
      <p>Trae de Lichess las partidas que quieras revisar, una a una o eligiéndolas de una lista. La app te guía: tus ideas antes del motor, los momentos clave, tus errores convertidos en ejercicios y la lección que te llevas.</p></div>`}
    <div class="fila-btn">
      <a class="btn primario" href="#/importar-partidas">${ico('descargar', 'peq')} Traer de Lichess</a>
      <a class="btn" href="#/importar-partidas?modo=pegar">${ico('mas', 'peq')} Pegar PGN o enlace</a>
    </div>
    ${pend.length ? `<h3 class="sec">Por revisar <small>${pend.length}</small></h3><div class="lista">${pend.map(filaPartida).join('')}</div>` : ''}
    ${hechas.length ? `<h3 class="sec">Revisadas <small>${hechas.length}</small></h3><div class="lista">${hechas.map(filaPartida).join('')}</div>` : ''}`;
}

// Guardar partidas nuevas sin duplicar: el id sale del id de Lichess
async function guardarPartida(fila) {
  const datos = { ...fila };
  delete datos.blancas; delete datos.negras; delete datos.rated; delete datos.jugadas;
  if (datos.lichess_id) {
    const id = await idDeterminista(`${usuario.id}:partida:${datos.lichess_id}`);
    const previa = D.obtenerAunBorrado('partidas', id);
    if (previa && !previa.borrado_en) return { fila: previa, nueva: false };
    return { fila: await D.guardar('partidas', Object.assign(previa || {}, datos, { id, borrado_en: null })), nueva: true };
  }
  return { fila: await D.guardar('partidas', datos), nueva: true };
}

function vImportarPartidas(v, _id, q) {
  const pegar = q.get('modo') === 'pegar';
  const usuarioL = ajustes().lichess || '';
  v.innerHTML = `
    <div class="cab-vista"><a href="#/partidas" class="btn-ico">${ico('atras')}</a><h1>Traer partidas</h1></div>
    <div class="segmento" id="modo"><button data-m="lichess" class="${pegar ? '' : 'on'}">Elegir de Lichess</button><button data-m="pegar" class="${pegar ? 'on' : ''}">Pegar PGN o enlace</button></div>
    <section id="m-lichess"${pegar ? ' hidden' : ''}>
      <p class="nota">Tus últimas partidas de Lichess. Marca solo las que quieras revisar.</p>
      <form id="f-lichess" class="form">
        <div class="dos">
          <label>Tu usuario de Lichess<input name="u" required value="${esc(usuarioL)}" placeholder="usuario" autocapitalize="off" autocomplete="off"></label>
          <label>Ritmo<select name="ritmo"><option value="rapid,classical">Rápidas y clásicas</option><option value="blitz,rapid,classical">También blitz</option><option value="">Todas</option></select></label>
        </div>
        <button class="btn primario" type="submit">${ico('descargar', 'peq')} Ver mis últimas partidas</button>
      </form>
      <div id="l-res"></div>
    </section>
    <section id="m-pegar"${pegar ? '' : ' hidden'}>
      <form id="f-pegar" class="form">
        <label>PGN o enlace de la partida<small class="ayuda-paso">En Lichess, abre la partida y copia su enlace, o su PGN (en «Compartir y exportar» o en «FEN y PGN» del tablero de análisis). Puedes pegar varias partidas seguidas.</small>
          <textarea name="t" rows="8" placeholder="https://lichess.org/abcd1234  ·  o  [Event &quot;Rated Rapid game&quot;] …"></textarea></label>
        <button class="btn primario" type="submit">Añadir</button>
      </form>
    </section>`;
  v.querySelector('#modo').addEventListener('click', e => {
    const m = e.target.closest('[data-m]')?.dataset.m; if (!m) return;
    v.querySelectorAll('#modo button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
    v.querySelector('#m-lichess').hidden = m !== 'lichess'; v.querySelector('#m-pegar').hidden = m !== 'pegar';
  });
  // --- Elegir de Lichess
  let juegos = [];
  v.querySelector('#f-lichess').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, u = f.u.value.trim(), caja = v.querySelector('#l-res');
    if (!navigator.onLine) return alert('Necesitas conexión para traer partidas de Lichess.');
    if (u !== usuarioL) guardarAjustes({ lichess: u });
    caja.innerHTML = '<p class="nada">Pidiendo tus partidas a Lichess…</p>';
    try {
      const url = `https://lichess.org/api/games/user/${encodeURIComponent(u)}?max=40&pgnInJson=true&opening=true&clocks=false&evals=false${f.ritmo.value ? '&perfType=' + f.ritmo.value : ''}`;
      const r = await fetch(url, { headers: { Accept: 'application/x-ndjson' } });
      if (r.status === 404) throw new Error(`Lichess no encuentra al usuario «${u}».`);
      if (r.status === 429) throw new Error('Lichess pide esperar un minuto antes de volver a pedir partidas.');
      if (!r.ok) throw new Error(`Lichess respondió con un error (${r.status}).`);
      juegos = (await r.text()).split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(g => g.variant === 'standard' || !g.variant).map(g => PA.filaDeLichess(g, u));
    } catch (err) {
      caja.innerHTML = `<div class="pista"><b>No se han podido traer</b><p>${esc(err.message && !/fetch|network|load/i.test(err.message) ? err.message : 'Lichess no ha dejado a la app leer tus partidas desde aquí.')} Puedes traerlas igualmente con «Pegar PGN o enlace».</p></div>`;
      return;
    }
    const ya = new Set(D.lista('partidas').map(p => p.lichess_id).filter(Boolean));
    caja.innerHTML = juegos.length ? `
      <div class="lista imp-lista">${juegos.map((g, i) => {
        const res = PA.miResultado(g);
        return `<label class="fila-c imp-fila${ya.has(g.lichess_id) ? ' ya' : ''}">
          <input type="checkbox" value="${i}" ${ya.has(g.lichess_id) ? 'disabled' : ''}>
          <span class="res-punto ${CLASE_RES[res] || ''}"></span>
          <span class="fila-txt"><b>${vsRival(g)}</b>
          <small>${[g.fecha ? fechaLarga(g.fecha) : '', g.ritmo, g.rated ? 'valorada' : 'amistosa', Math.ceil(g.jugadas / 2) + ' jugadas'].filter(Boolean).map(esc).join(' · ')}</small>
          <small>${esc(g.apertura || '')}${ya.has(g.lichess_id) ? ' · <b>ya la tienes</b>' : ''}</small></span></label>`;
      }).join('')}</div>
      <div class="botones pegados"><button class="btn primario" id="importar" disabled>Traer las marcadas</button></div>`
      : '<p class="nada">No hay partidas con ese ritmo.</p>';
    const boton = caja.querySelector('#importar');
    caja.querySelector('.imp-lista')?.addEventListener('change', () => {
      const n = caja.querySelectorAll('.imp-lista input:checked').length;
      boton.disabled = !n; boton.textContent = n ? `Traer ${n} ${n === 1 ? 'partida' : 'partidas'}` : 'Traer las marcadas';
    });
    boton?.addEventListener('click', async () => {
      const elegidas = [...caja.querySelectorAll('.imp-lista input:checked')].map(x => juegos[+x.value]);
      let ultima = null;
      for (const g of elegidas) ultima = (await guardarPartida(g)).fila;
      aviso(`${elegidas.length} ${elegidas.length === 1 ? 'partida traída' : 'partidas traídas'}. Empieza su revisión cuando quieras.`);
      ir(elegidas.length === 1 ? '#/partida/' + ultima.id : '#/partidas');
    });
  });
  // --- Pegar PGN o enlace
  v.querySelector('#f-pegar').addEventListener('submit', async e => {
    e.preventDefault();
    let texto = e.target.t.value.trim();
    if (!texto) return;
    const lid = PA.idDeLichess(texto);
    if (lid && !/\d\.\s*\S/.test(texto.replace(/https?:\S+/g, ''))) {   // solo un enlace: se pide el PGN a Lichess
      try {
        const r = await fetch(`https://lichess.org/game/export/${lid}?clocks=false&evals=false&opening=true`, { headers: { Accept: 'application/x-chess-pgn' } });
        if (!r.ok) throw new Error();
        texto = await r.text();
      } catch (err) {
        return alert('Lichess no ha dejado a la app leer esa partida desde aquí. Pega su PGN: en Lichess, abre la partida y cópialo en «Compartir y exportar» (o en «FEN y PGN» del tablero de análisis).');
      }
    }
    const filas = PA.separarPgn(texto).map(x => PA.filaDePgn(x, ajustes().lichess)).filter(f => leerPgn(f.pgn)?.jugadas.length);
    if (!filas.length) return alert('No he encontrado jugadas en lo que has pegado. Comprueba que sea un PGN (notación inglesa: Nf3, Bb5…).');
    let ultima = null, nuevas = 0;
    for (const f of filas) { const r = await guardarPartida(f); ultima = r.fila; if (r.nueva) nuevas++; }
    aviso(nuevas ? `${nuevas} ${nuevas === 1 ? 'partida añadida' : 'partidas añadidas'}` : 'Ya tenías esa partida');
    ir(filas.length === 1 ? '#/partida/' + ultima.id : '#/partidas');
  });
}

function vPartida(v, id) {
  const p = D.obtener('partidas', id);
  if (!p) return ir('#/partidas');
  const r = revisionDe(p), ej = r.ej || ejemploVacio(), rep = r.rep;
  const ms = momentosDe(id);
  const res = PA.miResultado(p);
  const sig = r.siguiente;
  const errSinEj = ms.find(m => m.tipo === 'error' && !m.es_ejercicio), sinConcepto = ms.find(m => !m.concepto_id);
  const accion = paso => ({
    datos: `#/editar-partida/${id}`, comentarios: `#/comentar-partida/${id}`, leccion: `#/editar-partida/${id}?campo=leccion`,
    ejercicios: errSinEj ? `#/momento/${errSinEj.id}` : null, conceptos: sinConcepto ? `#/momento/${sinConcepto.id}` : null,
  }[paso.clave] || null);
  const filaMomento = m => `<a class="fila-c" href="#/momento/${m.id}"><span class="tipo-m ${m.tipo}">${TIPO_MOMENTO[m.tipo]}</span>
    <span class="fila-txt"><b>${m.ply < ej.jugadas.length ? esc(etiquetaJ(ej, m.ply)) : 'Posición final'}</b>
    <small>${[m.tipo === 'error' && PA.TIPOS_ERROR[m.tipo_error]?.nombre, m.comentario, m.es_ejercicio ? 'ejercicio de repaso' : '', m.concepto_id && D.obtener('conceptos', m.concepto_id)?.titulo].filter(Boolean).map(esc).join(' · ')}</small></span>${ico('flecha', 'peq')}</a>`;
  v.innerHTML = `
    <div class="cab-vista">
      <a href="#/partidas" class="btn-ico" aria-label="Volver">${ico('atras')}</a>
      <span class="hueco"></span>
      <a href="${esc(urlPartidaLichess(p, ej))}" target="_blank" rel="noopener" class="btn peq">${ico('externo', 'peq')} Lichess</a>
      <a href="#/editar-partida/${id}" class="btn peq">${ico('editar', 'peq')} Editar</a>
    </div>
    <article class="ficha ap-cab">
      <div class="etqs"><span class="etq-bloque">${[p.color === 'white' ? 'Con blancas' : p.color === 'black' ? 'Con negras' : 'Color sin indicar', p.ritmo, p.fecha && fechaLarga(p.fecha)].filter(Boolean).map(esc).join(' · ')}</span>
        ${res ? `<span class="resultado ${CLASE_RES[res]}">${PA.TEXTO_RESULTADO[res]}</span>` : ''}</div>
      <h1 class="ficha-tit">${vsRival(p)}</h1>
      ${p.apertura ? `<p class="nota">${esc(p.apertura)}</p>` : ''}
      ${p.notas ? `<div class="contexto-p"><small>Contexto de la partida</small><div class="md">${md(p.notas)}</div></div>` : ''}
      <div class="progreso-barra grande"><span style="width:${r.pct}%"></span></div>
      <p class="nota">Revisada al <b>${r.pct}%</b></p>
    </article>
    ${sig ? `<div class="pista siguiente"><b>Siguiente paso · ${esc(sig.titulo)}</b><p>${esc(sig.ayuda)}</p>
      ${sig.clave === 'motor' ? `<div class="fila-btn"><a class="btn peq" href="${esc(urlPartidaLichess(p, ej))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Analizar en Lichess</a><button class="btn primario peq" id="analizada">${ico('check', 'peq')} Ya la he analizado</button></div>`
        : sig.clave === 'apertura' ? `<a class="btn primario peq" href="#rep-caja" id="ir-rep">Verlo ${ico('flecha', 'peq')}</a>`
        : sig.clave === 'momentos' ? `<a class="btn primario peq" href="#tablero-partida" id="ir-tablero">Ir al tablero ${ico('flecha', 'peq')}</a>`
        : accion(sig) ? `<a class="btn primario peq" href="${accion(sig)}">Hacerlo ahora ${ico('flecha', 'peq')}</a>` : ''}</div>`
      : `<div class="pista siguiente"><b>¡Partida revisada!</b><p>Sus errores ya están en tu repaso. Relee la lección antes de tu próxima partida.</p></div>`}
    <details class="guia-ap"${r.pct < 100 ? '' : ''}><summary>La guía: ${r.pasos.filter(x => x.estado === 'hecho').length} de ${r.pasos.length} pasos</summary>
      <div class="lista">${r.pasos.map((x, i) => `<a class="fila-c paso ${x.estado}" ${accion(x) ? `href="${accion(x)}"` : ''}>
        <span class="paso-n">${x.estado === 'hecho' ? ico('check', 'peq') : i + 1}</span>
        <span class="fila-txt"><b>${esc(x.titulo)}</b><small>${esc(x.detalle)}</small></span></a>`).join('')}</div>
    </details>
    <div class="tarjeta ejemplo" id="tablero-partida">
      <div class="visor" id="visor-partida"></div>
      <div class="fila-btn"><button class="btn primario" id="marcar">${ico('bandera', 'peq')} <span>Marcar momento</span></button>
        <a class="btn" href="#/comentar-partida/${id}">${ico('editar', 'peq')} Comentar jugadas</a>
        <button class="btn" id="crear-ej">${ico('mas', 'peq')} Crear ejemplo desde aquí</button></div>
      ${ms.length ? `<div class="chips momentos-chips">${ms.map(m => `<button class="chip tipo-${m.tipo}" data-ir="${m.ply + 1}">${esc(etiquetaJ(ej, m.ply) || 'Final')}</button>`).join('')}</div>` : ''}
    </div>
    <section class="tarjeta rep-caja" id="rep-caja"><h3 class="sec">${ico('repertorio', 'peq')} Tu repertorio</h3>
      <p>${esc(rep.texto)}</p>
      <div class="fila-btn">
        ${rep.estado === 'rival' && rep.apertura ? `<a class="btn primario peq" href="#/editar-linea/${rep.apertura.id}?l=nueva&tipo=secundaria&partida=${id}&desde=${rep.ply}&hasta=${Math.min(rep.ply + 8, ej.jugadas.length)}">${ico('mas', 'peq')} Añadirla a mi repertorio</a>` : ''}
        ${rep.estado === 'yo' && rep.linea ? `<a class="btn primario peq" href="#/linea/${rep.apertura.id}?l=${rep.linea.id}">Repasar mi línea</a><a class="btn peq" href="#/repaso?ap=${rep.apertura.id}">Entrenar la apertura</a>` : ''}
        ${rep.estado === 'sin-color' ? `<a class="btn peq" href="#/editar-partida/${id}">Indicar mi color</a>` : ''}
        ${p.apertura_vista ? `<span class="estado hecho">${ico('check', 'peq')} Revisado</span>` : `<button class="btn peq" id="rep-visto">${ico('check', 'peq')} Visto</button>`}
      </div></section>
    <h3 class="sec">Momentos clave <small>${ms.length || ''}</small></h3>
    ${ms.length ? `<div class="lista">${ms.map(filaMomento).join('')}</div>` : '<p class="nada peq">Ve a una jugada en el tablero y pulsa «Marcar momento».</p>'}
    ${p.leccion ? `<h3 class="sec">La lección <a class="btn-ico peq" href="#/editar-partida/${id}?campo=leccion" aria-label="Editar">${ico('editar')}</a></h3><blockquote class="principio">${esc(p.leccion)}</blockquote>` : ''}
`;
  // Tablero: el botón marca la jugada que estás viendo
  const marcar = v.querySelector('#marcar');
  const vis = crearVisor(v.querySelector('#visor-partida'), ej, {
    orientacion: p.color || 'white', ply: Math.min(1, ej.jugadas.length),
    alMover: n => {
      if (!marcar) return;
      marcar.disabled = n === 0;
      marcar.querySelector('span').textContent = n ? `Marcar momento: ${etiquetaJ(ej, n - 1)}` : 'Elige una jugada';
    },
  });
  limpiezas.push(vis.cerrar);
  marcar.addEventListener('click', () => ir(`#/momento/nuevo?partida=${id}&ply=${vis.ply() - 1}`));
  v.querySelector('#crear-ej').addEventListener('click', () => crearEjemploDesde(ej, vis.ply(), p.color || 'white'));
  v.querySelector('.momentos-chips')?.addEventListener('click', e => { const b = e.target.closest('[data-ir]'); if (b) vis.ir(+b.dataset.ir); });
  const desplazar = (sel, e) => { e.preventDefault(); v.querySelector(sel).scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  v.querySelector('#ir-rep')?.addEventListener('click', e => desplazar('#rep-caja', e));
  v.querySelector('#ir-tablero')?.addEventListener('click', e => desplazar('#tablero-partida', e));
  v.querySelector('#rep-visto')?.addEventListener('click', async () => { p.apertura_vista = true; await D.guardar('partidas', p); pintar(true); });
  v.querySelector('#analizada')?.addEventListener('click', async () => { p.analizada = true; await D.guardar('partidas', p); aviso('Ahora marca como momento cada error que te enseñó el motor'); pintar(true); });
}

function vEditarPartida(v, id, q) {
  editando = true;
  const p = D.obtener('partidas', id);
  if (!p) return ir('#/partidas');
  const solo = q.get('campo') === 'leccion';
  const paso = PA.PASOS.find(x => x.clave === 'leccion');
  const sel = (n, ops, val) => `<select name="${n}">${ops.map(([k, t]) => `<option value="${k}" ${val === k ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
  v.innerHTML = `
    <div class="cab-vista"><a href="#/partida/${id}" class="btn-ico" id="volver">${ico('atras')}</a><h1>${solo ? 'La lección' : 'Editar partida'}</h1></div>
    <form id="f-partida" class="form">
      ${solo ? '' : `
      <div class="dos"><label>Rival<input name="rival" value="${esc(p.rival || '')}" maxlength="60"></label>
        <label>Jugué con${sel('color', [['', '—'], ['white', 'Blancas'], ['black', 'Negras']], p.color || '')}</label></div>
      <div class="dos"><label>Resultado${sel('resultado', [['', '—'], ['1-0', '1-0 (ganan blancas)'], ['0-1', '0-1 (ganan negras)'], ['1/2-1/2', '½-½ (tablas)']], p.resultado || '')}</label>
        <label>Ritmo${sel('ritmo', [['', '—'], ['bala', 'Bala'], ['blitz', 'Blitz'], ['rápida', 'Rápida'], ['clásica', 'Clásica'], ['correspondencia', 'Correspondencia']], p.ritmo || '')}</label></div>
      <div class="dos"><label>Fecha<input type="date" name="fecha" value="${esc(p.fecha || '')}"></label>
        <label>Apertura<input name="apertura" value="${esc(p.apertura || '')}" maxlength="120"></label></div>
      <div class="dos"><label>Mi Elo<input name="elo_propio" inputmode="numeric" value="${p.elo_propio || ''}"></label>
        <label>Elo del rival<input name="elo_rival" inputmode="numeric" value="${p.elo_rival || ''}"></label></div>
      <label>Contexto de la partida <small class="ayuda-paso">Lo que quieras recordar: torneo, ronda, ritmo, quién era el rival, cómo llegabas. Escríbelo a tu manera.</small>
        <textarea name="notas" rows="3" placeholder="Liga · tablero 3 · 90+30 · rival 1850 FIDE · llegué cansado">${esc(p.notas || '')}</textarea></label>
      <label class="check"><input type="checkbox" name="analizada" ${p.analizada ? 'checked' : ''}><span>Ya la he analizado con el motor</span></label>`}
      <label>La lección<small class="ayuda-paso">${esc(paso.ayuda)}</small><textarea name="leccion" rows="${solo ? 6 : 3}" placeholder="Antes de cambiar piezas, mira qué estructura queda.">${esc(p.leccion || '')}</textarea></label>
      <div class="botones"><button class="btn primario" type="submit">Guardar</button>
        ${solo ? '' : `<button type="button" class="btn peligro" id="borrar-p">${ico('borrar', 'peq')} Borrar partida</button>`}</div>
    </form>`;
  const f = v.querySelector('#f-partida');
  if (solo) f.leccion.focus();
  protegerSalida(v);
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const val = k => (f.elements[k] ? f.elements[k].value.trim() : undefined);
    if (!solo) {
      Object.assign(p, { rival: val('rival') || null, color: val('color') || null, resultado: val('resultado') || null, ritmo: val('ritmo') || null,
        fecha: val('fecha') || null, apertura: val('apertura') || null, elo_propio: +val('elo_propio') || null, elo_rival: +val('elo_rival') || null,
        analizada: f.analizada.checked, notas: val('notas') || null });
    }
    p.leccion = val('leccion') || null;
    await D.guardar('partidas', p);
    editando = false; aviso('Guardado'); ir('#/partida/' + id);
  });
  v.querySelector('#borrar-p')?.addEventListener('click', async () => {
    if (!confirm('¿Borrar esta partida con sus momentos clave?')) return;
    for (const m of momentosDe(id)) await D.borrar('momentos', m.id);
    await D.borrar('partidas', id);
    editando = false; aviso('Partida borrada'); ir('#/partidas');
  });
}

// Comentar las jugadas de la partida (tus ideas, antes del motor)
function vComentarPartida(v, id) {
  editando = true;
  const p = D.obtener('partidas', id);
  const ej = p && leerPgn(p.pgn);
  if (!ej) return ir('#/partidas');
  const antes = sanesDe(ej).join(' ');
  let cambios = false;
  v.innerHTML = `
    <div class="cab-vista ej-cab">
      <a href="#/partida/${id}" class="btn-ico" id="volver">${ico('atras')}</a>
      <div class="ej-tit"><h1>Comentar jugadas</h1><small>vs ${esc(p.rival || 'rival')}</small></div>
      <button class="btn primario peq" id="guardar">Guardar</button>
    </div>
    <div id="editor" class="editor"></div>
    <div class="ej-pie"><details class="ayuda-linea" open><summary>Cómo hacerlo</summary>
      <p>${esc(PA.PASOS.find(x => x.clave === 'comentarios').ayuda)}</p>
      <p class="nota">Elige una jugada en la lista o con las flechas y escribe en «Comentario». También puedes dibujar flechas. No cambies las jugadas: aquí solo se comenta.</p></details></div>`;
  const ed = crearEditor(v.querySelector('#editor'), ej, { orientacion: p.color || 'white', pedirPromocion, alCambiar: () => { cambios = true; } });
  limpiezas.push(ed.cerrar);
  protegerSalida(v, () => cambios);
  v.querySelector('#guardar').addEventListener('click', async () => {
    const err = ed.confirmar(); if (err) return alert(err);
    if (sanesDe(ej).join(' ') !== antes && !confirm('Has cambiado jugadas de la partida. ¿Guardar así? Los momentos marcados podrían no coincidir.')) return;
    p.pgn = aPgn(ej);
    await D.guardar('partidas', p);
    editando = false; aviso('Comentarios guardados'); ir('#/partida/' + id);
  });
}

// Un momento clave: qué pasó, la jugada buena, su ficha y, si quieres, ejercicio
function vMomento(v, id, q) {
  editando = true;
  const nuevo = id === 'nuevo';
  const m = nuevo ? { partida_id: q.get('partida'), ply: Math.max(0, +q.get('ply') || 0), tipo: 'error', comentario: '', concepto_id: null, es_ejercicio: false } : D.obtener('momentos', id);
  const p = m && D.obtener('partidas', m.partida_id);
  const ej = p && leerPgn(p.pgn);
  if (!ej) return ir('#/partidas');
  m.fen = m.fen || fenAntes(ej, m.ply);
  const jugada = ej.jugadas[m.ply];
  const jugueYo = jugada && (m.ply % 2 === 0) === (p.color !== 'black');
  const pos = (m.pgn && leerPgn(m.pgn)) || ejemploVacio(m.fen);
  const fichas = conceptos().sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));
  let cambios = false;
  v.innerHTML = `
    <div class="cab-vista ej-cab">
      <a href="#/partida/${p.id}" class="btn-ico" id="volver">${ico('atras')}</a>
      <div class="ej-tit"><h1>${nuevo ? 'Nuevo momento' : 'Momento clave'}</h1><small>vs ${esc(p.rival || 'rival')}${jugada ? ' · ' + esc(etiquetaJ(ej, m.ply)) : ''}</small></div>
      <button class="btn primario peq" id="guardar">Guardar</button>
    </div>
    <div class="segmento" id="tipo">${Object.entries(TIPO_MOMENTO).map(([k, t]) => `<button data-t="${k}" class="${m.tipo === k ? 'on ' + k : ''}">${t}</button>`).join('')}</div>
    ${jugada ? `<p class="nota">En la partida se jugó <b>${esc(etiquetaJ(ej, m.ply))}</b>${jugueYo ? ' (tu jugada)' : ' (jugada del rival)'}. Abajo, la posición de antes.</p>` : ''}
    <div id="editor" class="editor"></div>
    <div class="ej-pie">
      <p class="nota">Si fue un error, juega en el tablero <b>la jugada buena</b> (y, si quieres, cómo sigue).</p>
      <label class="form solo"><span>Qué pasó <small>lo que pensabas, lo que no viste</small></span>
        <textarea id="m-com" rows="3" placeholder="No vi que el caballo quedaba clavado…">${esc(m.comentario || '')}</textarea></label>
      <label class="form solo"><span>Concepto de tu cuaderno</span>
        <select id="m-concepto"><option value="">Ninguno</option>${fichas.map(c => `<option value="${c.id}" ${m.concepto_id === c.id ? 'selected' : ''}>${esc(c.titulo)}</option>`).join('')}</select></label>
      <a class="nota" id="m-nueva-ficha" href="#/editar/nuevo">¿No está la ficha? Crear una nueva</a>
      <div class="tipo-error" id="te"${m.tipo === 'error' ? '' : ' hidden'}>
        <span class="te-tit">Tipo de error <small id="te-sug"></small></span>
        <div class="te-ops">${Object.entries(PA.TIPOS_ERROR).map(([k, x]) => `<button type="button" data-te="${k}" class="${m.tipo_error === k ? 'on' : ''}"><b>${x.nombre}</b><small>${x.ayuda}</small></button>`).join('')}</div>
      </div>
      <label class="check"><input type="checkbox" id="m-ejercicio" ${m.es_ejercicio ? 'checked' : ''}><span>Usar como ejercicio de repaso <small>— la primera jugada que juegues es la solución; si sigues jugando, el repaso continúa con ellas</small></span></label>
      <div class="fila-btn">
        <a class="btn peq" href="#/pregunta/nueva?texto=${encodeURIComponent(`Partida contra ${p.rival || 'rival'}${jugada ? ', ' + etiquetaJ(ej, m.ply) : ''}: `)}&pgn=${encodeURIComponent(`[FEN "${m.fen}"]`)}">${ico('guia', 'peq')} Preguntar al maestro</a>
        <a class="btn peq" href="${esc(RP.urlExplorador(m.fen, p.color || 'white').replace('#explorer', ''))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Analizar en Lichess</a>
      </div>
      ${nuevo ? '' : `<button class="btn peligro" id="borrar">${ico('borrar', 'peq')} Borrar este momento</button>`}
    </div>`;
  const ed = crearEditor(v.querySelector('#editor'), pos, { orientacion: p.color || 'white', pedirPromocion, alCambiar: () => { cambios = true; } });
  limpiezas.push(ed.cerrar);
  // Tipo de error: la app sugiere (por la ficha enlazada o la posición) y tú eliges
  let tipoError = m.tipo_error || null;
  const sugerir = () => {
    const c = D.obtener('conceptos', v.querySelector('#m-concepto').value);
    const sg = PA.sugerirTipoError({ bloque: c && bloqueRaiz(c.bloque_id)?.nombre, titulo: c?.titulo, ply: m.ply, fen: m.fen });
    v.querySelector('#te-sug').textContent = sg ? `· la app sugiere ${PA.TIPOS_ERROR[sg.tipo].nombre} (${sg.porque})` : '· elige el que mejor lo describa';
    v.querySelectorAll('[data-te]').forEach(b => { b.className = [b.dataset.te === tipoError && 'on', sg && b.dataset.te === sg.tipo && 'sug'].filter(Boolean).join(' '); });
  };
  sugerir();
  v.querySelector('#m-concepto').addEventListener('change', sugerir);
  v.querySelector('.te-ops').addEventListener('click', e => {
    const b = e.target.closest('[data-te]'); if (!b) return;
    tipoError = tipoError === b.dataset.te ? null : b.dataset.te; cambios = true; sugerir();
  });
  v.querySelector('#tipo').addEventListener('click', e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    m.tipo = b.dataset.t; cambios = true;
    v.querySelectorAll('#tipo button').forEach(x => { x.className = x === b ? 'on ' + x.dataset.t : ''; });
    v.querySelector('#te').hidden = m.tipo !== 'error';
  });
  v.querySelectorAll('#m-com, #m-concepto, #m-ejercicio').forEach(x => x.addEventListener('input', () => { cambios = true; }));
  protegerSalida(v, () => cambios);
  v.querySelector('#guardar').addEventListener('click', async () => {
    const err = ed.confirmar(); if (err) return alert(err);
    const comoEj = v.querySelector('#m-ejercicio').checked;
    if (comoEj && !pos.jugadas.length) return alert('Para usarlo como ejercicio, juega en el tablero la jugada buena: será la solución.');
    Object.assign(m, { comentario: v.querySelector('#m-com').value.trim() || null, concepto_id: v.querySelector('#m-concepto').value || null,
      tipo_error: m.tipo === 'error' ? tipoError : null,
      es_ejercicio: comoEj, pgn: pos.jugadas.length || pos.comentario0 ? aPgn(pos) : null });
    await D.guardar('momentos', m);
    editando = false;
    aviso(comoEj ? 'Momento guardado: ya está en tu repaso' : 'Momento guardado');
    ir('#/partida/' + p.id);
  });
  v.querySelector('#borrar')?.addEventListener('click', async () => {
    if (!confirm('¿Borrar este momento?')) return;
    await D.borrar('momentos', m.id);
    editando = false; ir('#/partida/' + p.id);
  });
}

// Un consejo para el tipo de error que más se repite
const CONSEJO_ERROR = {
  tactico: 'Haz cada día unos ejercicios de táctica (en tu repaso o en Lichess) y enlaza cada error con su ficha de motivo táctico.',
  calculo: 'Antes de jugar, calcula hasta el final y vuelve a mirar la posición: ¿qué jugada fuerte tiene el rival? Practica con «A ciegas».',
  plan: 'Antes de mover, pregúntate qué quieres hacer en las próximas jugadas y dónde van tus piezas. Coméntalo con tu maestro.',
  apertura: 'Entrena tus aperturas y añade a tu repertorio las jugadas del rival que te sorprendieron.',
  final: 'Repasa tus fichas de finales y técnica: son pocas posiciones que se repiten mucho.',
  descuido: 'Antes de cada jugada: ¿qué amenaza el rival? ¿qué piezas tengo colgadas? Un minuto de comprobación ahorra muchos puntos.',
};

function vResumenPartidas(v) {
  const ps = partidas();
  const nombreAp = p => { const r = repDePartida(p, leerPgn(p.pgn)); return r.apertura ? `${r.apertura.color === 'white' ? '♔' : '♚'} ${r.apertura.nombre}` : (p.apertura || '').split(':')[0]; };
  const s = PA.resumen(ps, D.lista('momentos').filter(m => D.obtener('partidas', m.partida_id)), nombreAp);
  const marcador = x => `<span class="marcador"><b class="ok">${x.v}</b> <b class="reg">${x.t}</b> <b class="ko">${x.d}</b></span>`;
  const ejercicios = D.lista('momentos').filter(m => m.es_ejercicio).length;
  v.innerHTML = `
    <div class="cab-vista"><a href="#/partidas" class="btn-ico">${ico('atras')}</a><h1>Resumen</h1></div>
    <div class="cifras">
      <div><b>${s.total.n}</b><span>partidas</span></div>
      <div><b>${s.total.n ? Math.round((s.total.v + s.total.t / 2) / s.total.n * 100) : 0}%</b><span>puntos</span></div>
      <div><b>${ejercicios}</b><span>ejercicios</span></div>
    </div>
    <p class="nota">Marcador: <b class="ok">victorias</b> · <b class="reg">tablas</b> · <b class="ko">derrotas</b>.</p>
    <div class="lista">
      <div class="fila-c"><span class="fila-txt"><b>♔ Con blancas</b><small>${s.porColor.white.n} partidas</small></span>${marcador(s.porColor.white)}</div>
      <div class="fila-c"><span class="fila-txt"><b>♚ Con negras</b><small>${s.porColor.black.n} partidas</small></span>${marcador(s.porColor.black)}</div>
    </div>
    <h3 class="sec">Por apertura</h3>
    ${s.porApertura.length ? `<div class="lista">${s.porApertura.map(x => `<div class="fila-c"><span class="fila-txt"><b>${esc(x.nombre)}</b><small>${x.n} ${x.n === 1 ? 'partida' : 'partidas'}</small></span>${marcador(x)}</div>`).join('')}</div>` : '<p class="nada peq">Sin partidas todavía.</p>'}
    <h3 class="sec">Tus errores por tipo</h3>
    ${s.porTipo.length ? `<div class="tipos-err">${s.porTipo.map(x => `<div class="te-barra"><span class="te-nombre"><b>${esc(PA.TIPOS_ERROR[x.tipo].nombre)}</b><small>${x.n} ${x.n === 1 ? 'error' : 'errores'}</small></span>
        <span class="te-pista"><span style="width:${x.pct}%"></span></span><b class="te-pct">${x.pct}%</b></div>`).join('')}</div>
      <p class="nota">Sobre ${s.conTipo} ${s.conTipo === 1 ? 'error' : 'errores'} con tipo elegido.${s.sinTipo ? ` ${s.sinTipo} ${s.sinTipo === 1 ? 'error no tiene' : 'errores no tienen'} tipo todavía: ábrelos y elígelo.` : ''}</p>
      ${s.porTipo[0].pct >= 40 && s.conTipo >= 3 ? `<div class="pista"><b>Lo que más se repite: ${esc(PA.TIPOS_ERROR[s.porTipo[0].tipo].nombre.toLowerCase())}</b><p>${esc(CONSEJO_ERROR[s.porTipo[0].tipo])}</p></div>` : ''}`
      : `<p class="nada peq">${s.sinTipo ? `Tienes ${s.sinTipo} ${s.sinTipo === 1 ? 'error' : 'errores'} sin tipo. Abre cada momento y elige de qué tipo fue: aquí verás el porcentaje de cada uno.` : 'Cuando marques errores en tus partidas y elijas su tipo, aquí verás el porcentaje de cada uno.'}</p>`}
    <h3 class="sec">Tus errores más repetidos</h3>
    ${s.repetidos.length ? `<div class="lista">${s.repetidos.map(x => { const c = D.obtener('conceptos', x.id); return c ? `<a class="fila-c" href="#/concepto/${c.id}"><span class="fila-txt"><b>${esc(c.titulo)}</b><small>${x.n} ${x.n === 1 ? 'error' : 'errores'} en tus partidas</small></span>${ico('flecha', 'peq')}</a>` : ''; }).join('')}</div>
      <p class="nota">Buen material para tu próxima clase.</p>` : '<p class="nada peq">Cuando enlaces tus errores con fichas del cuaderno, aquí verás los que más se repiten.</p>'}
    ${s.sinConcepto ? `<p class="nota">${s.sinConcepto} ${s.sinConcepto === 1 ? 'error sin concepto enlazado' : 'errores sin concepto enlazado'}.</p>` : ''}`;
}

// Editar los datos y los textos de una apertura. Con ?campo=… se edita un solo
// paso de la guía, con su explicación, para ir completándola poco a poco.
function vEditarApertura(v, id, q) {
  editando = true;
  const nueva = id === 'nueva';
  const a = nueva ? { nombre: '', color: q.get('color') === 'black' ? 'black' : 'white', rol: 'principal', lineas: [], conceptos: [], partidas_modelo: [] } : D.obtener('repertorio', id);
  if (!a) return ir('#/repertorio');
  if (nueva && aperturas().filter(x => x.color === a.color && x.rol === 'principal').length >= RP.MAX_ROL.principal) a.rol = 'secundaria';
  const campo = nueva ? null : q.get('campo');
  const paso = campo && RP.PASOS.find(p => (p.campo || p.clave) === campo);
  const mostrar = k => !campo || campo === k;
  const ayuda = k => { const p = RP.PASOS.find(x => x.campo === k); return p ? `<small class="ayuda-paso">${esc(p.ayuda)}</small>` : ''; };
  const area = (k, titulo, filas, ph) => mostrar(k) ? `<label>${titulo}${ayuda(k)}<textarea name="${k}" rows="${campo ? 9 : filas}" placeholder="${esc(ph)}">${esc(a[k] || '')}</textarea></label>` : '';
  const todas = conceptos().sort((x, y) => x.titulo.localeCompare(y.titulo, 'es'));
  const marcadas = new Set(a.conceptos || []);
  let partidas = (a.partidas_modelo || []).map(p => ({ ...p }));
  const volver = nueva ? '#/repertorio' : '#/apertura/' + id;
  v.innerHTML = `
    <div class="cab-vista">
      <a href="${volver}" class="btn-ico" aria-label="Cancelar" id="volver">${ico('atras')}</a>
      <h1>${nueva ? (a.color === 'white' ? 'Nueva apertura' : 'Nueva defensa') : paso ? esc(paso.titulo) : 'Editar apertura'}</h1>
    </div>
    ${paso && !paso.campo ? '' : ''}
    <form id="f-apertura" class="form">
      ${!campo ? `
        <label>Nombre <small>como tú la llamas</small><input name="nombre" required maxlength="80" value="${esc(a.nombre)}" placeholder="${a.color === 'white' ? 'Italiana, Londres, Gambito de dama…' : 'Caro-Kann, Siciliana Najdorf, Nimzoindia…'}"></label>
        <div class="dos">
          <label>Color<select name="color"><option value="white" ${a.color === 'white' ? 'selected' : ''}>Con blancas</option><option value="black" ${a.color === 'black' ? 'selected' : ''}>Con negras</option></select></label>
          <label>Papel<select name="rol"><option value="principal" ${a.rol === 'principal' ? 'selected' : ''}>Principal</option><option value="secundaria" ${a.rol === 'secundaria' ? 'selected' : ''}>Secundaria</option></select></label>
        </div>
        ${nueva ? `<p class="nota">Después de guardar, la app te irá pidiendo cada parte: primero las jugadas que la definen y luego la línea principal, las respuestas del rival, los planes, las trampas…</p>` : `<label>Código ECO <small>opcional, lo ves en el explorador de Lichess</small><input name="eco" maxlength="8" value="${esc(a.eco || '')}" placeholder="B12"></label>`}` : ''}
      ${nueva ? '' : `
        ${area('ideas', 'Objetivos de la apertura', 4, 'Qué busco con ella…')}
        ${area('estructura', 'Estructura de peones', 3, 'Cómo quedan los peones…')}
        ${area('planes', 'Planes del medio juego', 5, 'Mi plan: …\nEl plan del rival: …')}
        ${area('rupturas', 'Rupturas', 3, '…c5 para atacar el centro…')}
        ${area('tacticas', 'Tácticas típicas', 3, 'Clavada del Nc6 con el alfil…')}
        ${mostrar('partidas') ? `<fieldset class="rel"><legend>Partidas modelo</legend>${ayuda('partidas')}
          <div id="partidas"></div>
          <button type="button" class="btn peq" id="mas-partida">${ico('mas', 'peq')} Añadir partida</button></fieldset>` : ''}
        ${mostrar('conceptos') ? `<fieldset class="rel"><legend>Conceptos de tu cuaderno</legend>${ayuda('conceptos')}
          ${todas.length ? `<input type="search" class="filtro-rel" placeholder="Filtrar fichas…">
          <div class="rel-lista">${todas.map(c => `<label class="check"><input type="checkbox" value="${c.id}" ${marcadas.has(c.id) ? 'checked' : ''}><span>${esc(c.titulo)}</span></label>`).join('')}</div>`
          : '<p class="nada peq">Aún no tienes fichas en tu cuaderno.</p>'}</fieldset>` : ''}
        ${mostrar('revisada') ? `${campo ? `<p class="nota">${esc(RP.PASOS.find(p => p.clave === 'revisada').ayuda)}</p>` : ''}
          <label class="check"><input type="checkbox" name="revisada" ${a.revisada ? 'checked' : ''}><span>Revisada con mi maestro</span></label>
          ${campo ? `<a class="btn" href="#/pregunta/nueva?texto=${encodeURIComponent(`Repertorio · ${a.nombre}: `)}">${ico('guia', 'peq')} Apuntar una pregunta para el maestro</a>` : ''}` : ''}`}
      <div class="botones">
        <button class="btn primario" type="submit">Guardar</button>
        ${!nueva && !campo ? `<button type="button" class="btn peligro" id="borrar-ap">${ico('borrar', 'peq')} Borrar apertura</button>` : ''}
      </div>
      ${campo ? `<a class="nota" href="#/editar-apertura/${id}">Editar toda la apertura</a>` : ''}
    </form>`;
  const f = v.querySelector('#f-apertura');
  const pintarPartidas = () => {
    const caja = v.querySelector('#partidas');
    if (!caja) return;
    caja.innerHTML = partidas.length ? partidas.map((p, i) => `<div class="partida-fila" data-i="${i}">
        <input data-k="titulo" placeholder="Capablanca – Alekhine, 1927" value="${esc(p.titulo || '')}">
        <input data-k="url" type="url" placeholder="https://lichess.org/…" value="${esc(p.url || '')}">
        <button type="button" class="btn-ico peq" data-quitar="${i}" aria-label="Quitar">${ico('borrar')}</button></div>`).join('')
      : '<p class="nada peq">Ninguna todavía.</p>';
  };
  pintarPartidas();
  v.querySelector('#mas-partida')?.addEventListener('click', () => { partidas.push({ titulo: '', url: '' }); pintarPartidas(); v.querySelector('.partida-fila:last-child input')?.focus(); });
  v.querySelector('#partidas')?.addEventListener('input', e => { const i = e.target.closest('[data-i]')?.dataset.i; if (i != null) partidas[i][e.target.dataset.k] = e.target.value; });
  v.querySelector('#partidas')?.addEventListener('click', e => { const i = e.target.closest('[data-quitar]')?.dataset.quitar; if (i != null) { partidas.splice(+i, 1); pintarPartidas(); } });
  v.querySelector('.filtro-rel')?.addEventListener('input', e => {
    const t = norm(e.target.value);
    v.querySelectorAll('.rel-lista .check').forEach(l => { l.hidden = t && !norm(l.textContent).includes(t); });
  });
  if (campo) f.querySelector(`[name="${campo}"]`)?.focus();
  protegerSalida(v);
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const val = k => (f.elements[k] ? f.elements[k].value.trim() : undefined);
    if (!campo) {
      a.nombre = val('nombre');
      a.color = val('color'); a.rol = val('rol');
      if (!nueva) a.eco = val('eco') || null;
      if (!a.nombre) return alert('Escribe el nombre de la apertura.');
    }
    for (const k of ['ideas', 'estructura', 'planes', 'rupturas', 'tacticas']) if (f.elements[k]) a[k] = val(k) || null;
    if (v.querySelector('#partidas')) a.partidas_modelo = partidas.map(p => ({ titulo: (p.titulo || '').trim(), url: (p.url || '').trim() })).filter(p => p.titulo || p.url);
    if (v.querySelector('.rel-lista')) a.conceptos = [...v.querySelectorAll('.rel-lista input:checked')].map(i => i.value);
    if (f.elements.revisada) a.revisada = f.elements.revisada.checked;
    if (nueva) a.orden = aperturas().filter(x => x.color === a.color).length;
    await D.guardar('repertorio', a);
    editando = false;
    if (nueva) { aviso('Apertura creada. Primer paso: juega las jugadas que la definen.'); return ir(`#/editar-linea/${a.id}?tronco=1`); }
    aviso('Guardado');
    ir('#/apertura/' + a.id);
  });
  v.querySelector('#borrar-ap')?.addEventListener('click', async () => {
    if (!confirm(`¿Borrar «${a.nombre}» con todas sus líneas?`)) return;
    await D.borrar('repertorio', a.id);
    editando = false;
    aviso('Apertura borrada');
    ir('#/repertorio');
  });
}

function vLinea(v, apId, q) {
  const a = D.obtener('repertorio', apId);
  const l = a && (a.lineas || []).find(x => x.id === q.get('l'));
  if (!l) return ir(a ? '#/apertura/' + apId : '#/repertorio');
  const ej = leerPgn(l.pgn);
  if (!ej) return ir('#/apertura/' + apId);
  const principal = (a.lineas || []).find(x => x.tipo === 'principal');
  const sep = principal && l.tipo !== 'principal' ? RP.separacion(ej, leerPgn(principal.pgn)) : -1;
  v.innerHTML = `
    <div class="cab-vista">
      <a href="#/apertura/${a.id}" class="btn-ico" aria-label="Volver">${ico('atras')}</a>
      <div class="ej-tit"><h1>${esc(l.nombre || TIPO_LINEA[l.tipo])}</h1><small>${esc(a.nombre)} · ${TIPO_LINEA[l.tipo]}</small></div>
      <a href="#/editar-linea/${a.id}?l=${l.id}" class="btn peq">${ico('editar', 'peq')} Editar</a>
    </div>
    ${sep >= 0 ? `<p class="nota">Se separa de tu línea principal en <b>${esc(RP.etiquetaPly(ej, sep, verSan))}</b>.</p>` : ''}
    <div class="visor" id="visor-linea"></div>
    ${l.nota ? `<div class="md">${md(l.nota)}</div>` : ''}
    <div class="fila-btn">
      <a class="chip" href="${esc(RP.urlAnalisis(ej, a.color))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Analizar en Lichess</a>
      <a class="chip" href="${esc(RP.urlExplorador(fenFinal(ej), a.color))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Explorador al final</a>
      <a class="chip" href="#/pregunta/nueva?texto=${encodeURIComponent(`${a.nombre} · ${l.nombre || TIPO_LINEA[l.tipo]}: `)}&pgn=${encodeURIComponent(l.pgn)}">${ico('guia', 'peq')} Preguntar al maestro</a>
      <button class="chip" id="crear-ej">${ico('mas', 'peq')} Crear ejemplo desde aquí</button>
    </div>`;
  const vis = crearVisor(v.querySelector('#visor-linea'), ej, { orientacion: a.color });
  limpiezas.push(vis.cerrar);
  v.querySelector('#crear-ej').addEventListener('click', () => crearEjemploDesde(ej, vis.ply(), a.color));
}

// Editor de una línea (o de las jugadas que definen la apertura, con ?tronco=1)
function vEditarLinea(v, apId, q) {
  editando = true;
  const a = D.obtener('repertorio', apId);
  if (!a) return ir('#/repertorio');
  a.lineas = a.lineas || [];
  const esTronco = q.get('tronco') === '1';
  const nueva = !esTronco && (q.get('l') || 'nueva') === 'nueva';
  const l = esTronco ? null : nueva ? { id: D.nuevoId(), tipo: ['principal', 'secundaria', 'trampa'].includes(q.get('tipo')) ? q.get('tipo') : 'secundaria', nombre: '', nota: '', pgn: '' } : a.lineas.find(x => x.id === q.get('l'));
  if (!esTronco && !l) return ir('#/apertura/' + apId);
  if (nueva && l.tipo === 'principal' && a.lineas.some(x => x.tipo === 'principal')) l.tipo = 'secundaria';
  // Una línea nueva empieza con las jugadas que definen tu apertura, o con las
  // de una partida tuya cuando el rival se salió de lo preparado
  const desdePartida = nueva && q.get('partida') ? D.obtener('partidas', q.get('partida')) : null;
  let ej = (esTronco ? leerPgn(a.tronco) : nueva ? leerPgn(a.tronco) : leerPgn(l.pgn)) || ejemploVacio();
  if (desdePartida) {
    const pj = leerPgn(desdePartida.pgn);
    if (pj) {
      const k = +q.get('desde');
      const jugada = pj.jugadas[k] ? `${Math.floor(k / 2) + 1}.${k % 2 ? '..' : ''} ${verSan(pj.jugadas[k].san)}` : '';
      l.nombre = `${jugada ? jugada + ' ' : ''}(partida contra ${desdePartida.rival || 'mi rival'})`;
      ej = pj; ej.comentario0 = '';
      ej.jugadas = ej.jugadas.slice(0, +q.get('hasta') || ej.jugadas.length).map(j => ({ ...j, comentario: '', formas: [] }));
    }
  }
  const pasoAyuda = esTronco ? RP.PASOS[0].ayuda : RP.PASOS.find(p => p.clave === (l.tipo === 'principal' ? 'principal' : l.tipo === 'trampa' ? 'trampas' : 'secundarias')).ayuda;
  let cambios = false, ed;
  v.innerHTML = `
    <div class="cab-vista ej-cab">
      <a href="#/apertura/${a.id}" class="btn-ico" aria-label="Volver" id="volver">${ico('atras')}</a>
      <div class="ej-tit"><h1>${esTronco ? 'Jugadas que la definen' : nueva ? 'Nueva: ' + TIPO_LINEA[l.tipo].toLowerCase() : 'Editar línea'}</h1><small>${esc(a.nombre)}</small></div>
      <button class="btn-ico" id="ampliar" aria-label="Ampliar">${ico('ampliar')}</button>
      <button class="btn primario peq" id="guardar">Guardar</button>
    </div>
    <div id="editor" class="editor"></div>
    <div class="ej-pie">
      ${desdePartida ? `<p class="nota">Son las jugadas de tu partida contra ${esc(desdePartida.rival || 'tu rival')}. Corta donde quieras que acabe la línea (selecciona la jugada y usa el corte del tablero) y escribe tu idea.</p>` : ''}
      <details class="ayuda-linea"${nueva || esTronco ? ' open' : ''}><summary>Cómo hacerlo</summary><p>${esc(pasoAyuda)}</p>
        <p class="nota">Juega las jugadas en el tablero (modo Jugar). Para comentar una jugada, selecciónala y escribe en «Comentario».</p></details>
      <div class="fila-btn"><a class="chip" id="explorar" target="_blank" rel="noopener">${ico('externo', 'peq')} ¿Qué juega el rival aquí? Explorador</a></div>
      ${esTronco ? '' : `
        <label class="form solo"><span>Nombre de la línea <small>opcional</small></span>
          <input id="l-nombre" maxlength="100" placeholder="${l.tipo === 'trampa' ? 'Trampa de …' : l.tipo === 'principal' ? 'Variante principal' : 'Si juega 3...Cf6'}" value="${esc(l.nombre || '')}"></label>
        <label class="form solo"><span>Tipo</span><select id="l-tipo">${Object.entries(TIPO_LINEA).map(([k, t]) => `<option value="${k}" ${l.tipo === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        <label class="form solo"><span>La idea <small>por qué la juegas, qué buscas, qué evitar</small></span>
          <textarea id="l-nota" rows="3" placeholder="${l.tipo === 'trampa' ? 'Si el rival come el peón…' : 'Con …c5 ataco el centro antes de que…'}">${esc(l.nota || '')}</textarea></label>`}
      <details class="pegar-pgn"><summary>Pegar un PGN o un enlace de Lichess</summary>
        <p class="nota">Un PGN (en notación inglesa o española) o el enlace de una partida o de un estudio de Lichess. Se toma la línea principal, sin variantes.</p>
        <textarea id="pgn-txt" rows="4" placeholder="1. e4 c6 2. d4 d5 3. e5 Af5"></textarea>
        <button type="button" class="btn peq" id="pgn-cargar">Cargar en el tablero</button></details>
      ${!nueva && !esTronco ? `<button class="btn peligro" id="borrar">${ico('borrar', 'peq')} Borrar esta línea</button>` : ''}
    </div>`;
  const montarEditor = () => {
    ed = crearEditor(v.querySelector('#editor'), ej, { orientacion: a.color, pedirPromocion, alCambiar: () => { cambios = true; } });
  };
  montarEditor();
  limpiezas.push(() => ed.cerrar());
  const ampliar = v.querySelector('#ampliar');
  const ponerEnfoque = (si, guardarEleccion) => {
    document.body.classList.toggle('enfoque', si);
    ampliar.setAttribute('aria-label', si ? 'Reducir' : 'Ampliar');
    ampliar.querySelector('path').setAttribute('d', si ? P.reducir : P.ampliar);
    if (guardarEleccion) localStorage.setItem('mdp-enfoque', si ? '1' : '0');
    window.scrollTo(0, 0);
    ed.ajustar();
  };
  ampliar.addEventListener('click', () => ponerEnfoque(!document.body.classList.contains('enfoque'), true));
  // Igual que en los ejemplos: en el móvil se abre ampliado, salvo que prefieras lo contrario
  const eleccion = localStorage.getItem('mdp-enfoque');
  ponerEnfoque(eleccion ? eleccion === '1' : window.innerWidth < 700, false);
  limpiezas.push(() => document.body.classList.remove('enfoque'));
  // El explorador se abre en la posición a la que has llegado
  v.querySelector('#explorar').addEventListener('pointerdown', e => { e.currentTarget.href = RP.urlExplorador(fenFinal(ej), a.color); });
  v.querySelector('#explorar').href = RP.urlExplorador(fenFinal(ej), a.color);
  v.querySelectorAll('#l-nombre, #l-nota, #l-tipo').forEach(x => x.addEventListener('input', () => { cambios = true; }));
  v.querySelector('#pgn-cargar').addEventListener('click', async () => {
    let nuevoEj;
    try { nuevoEj = await textoAEjemplo(v.querySelector('#pgn-txt').value); } catch (err) { return alert(err.message); }
    if (!nuevoEj.jugadas.length) return alert('Para una línea hacen falta jugadas desde la posición inicial: pega un PGN o el enlace de una partida.');
    ed.cerrar(); ej = nuevoEj; montarEditor(); cambios = true;
    v.querySelector('.pegar-pgn').open = false;
    aviso(`${ej.jugadas.length} jugadas cargadas`);
  });
  protegerSalida(v, () => cambios);
  v.querySelector('#guardar').addEventListener('click', async () => {
    const err = ed.confirmar();
    if (err) return alert(err);
    if (ej.fen0 !== FEN_INICIAL) return alert('Las líneas del repertorio empiezan desde la posición inicial. En el modo Posición, pulsa «Inicial».');
    if (!ej.jugadas.length) return alert('Juega al menos una jugada en el tablero.');
    if (esTronco) {
      a.tronco = aPgn(ej);
    } else {
      l.nombre = v.querySelector('#l-nombre').value.trim() || null;
      l.nota = v.querySelector('#l-nota').value.trim() || null;
      l.tipo = v.querySelector('#l-tipo').value;
      l.pgn = aPgn(ej);
      const tronco = leerPgn(a.tronco);
      if (tronco && tronco.jugadas.length && !RP.empiezaCon(ej, tronco)
        && !confirm(`Esta línea no empieza con ${RP.jugadasTexto(tronco, verSan)}. ¿Guardarla igualmente?`)) return;
      const otra = a.lineas.find(x => x.tipo === 'principal' && x.id !== l.id);
      if (l.tipo === 'principal' && otra) {
        if (!confirm('Ya tienes una línea principal. ¿Esta pasa a ser la principal y la otra, una respuesta del rival?')) return;
        otra.tipo = 'secundaria';
      }
      if (nueva) a.lineas.push(l);
    }
    await D.guardar('repertorio', a);
    editando = false;
    const larga = !esTronco && ej.jugadas.length > RP.limitePlies(a);
    aviso(esTronco ? 'Jugadas guardadas. Siguiente: los objetivos de la apertura.'
      : larga ? `Línea guardada. Pasa de la jugada ${RP.LIMITE_JUGADAS[a.rol]} recomendada para una apertura ${a.rol}: se entrenará hasta ahí.` : 'Línea guardada');
    if (desdePartida) {
      desdePartida.apertura_vista = true;
      await D.guardar('partidas', desdePartida);
      return ir('#/partida/' + desdePartida.id);
    }
    ir('#/apertura/' + a.id);
  });
  v.querySelector('#borrar')?.addEventListener('click', async () => {
    if (!confirm('¿Borrar esta línea?')) return;
    a.lineas = a.lineas.filter(x => x.id !== l.id);
    await D.guardar('repertorio', a);
    editando = false;
    ir('#/apertura/' + a.id);
  });
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
  window.addEventListener('hashchange', () => {
    if (conCambios() && !confirm('Tienes cambios sin guardar. ¿Salir sin guardar?')) {
      history.replaceState(null, '', hashActual);   // te quedas donde estabas, con lo escrito
      return;
    }
    pintar();
  });
  window.addEventListener('beforeunload', e => { if (conCambios()) { e.preventDefault(); e.returnValue = ''; } });
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
