// =====================================================================
//  MdP · Memorias de Peón · app.js  — pantallas y navegación
//  by Manuel Esteve
// =====================================================================
import * as D from './datos.js';
import { BIBLIOTECA } from './biblioteca.js';
import * as R from './repaso.js';
import * as RP from './repertorio.js';
import { FEN_INICIAL, crearVisor, crearEditor, crearEjercicio, crearEntrenoLinea, sirveDeEjercicio, dePgn, aPgn, ejemploVacio, usarFiguras, verSan, diagrama, textoJugadas, escapar as esc } from './tablero.js';

export const VERSION = '3.1.1 (fase 3: repertorio)';
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
  nota: 'M5 4h14v11l-5 5H5zM14 20v-5h5M9 9h6M9 12h3',
  glosario: 'M4 19V5a2 2 0 012-2h12v14H6a2 2 0 00-2 2zM4 19a2 2 0 002 2h12M9 7h6M9 10h4',
  rutina: 'M10 6h10M10 12h10M10 18h10M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17',
  guia: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9.5a2.5 2.5 0 115 0c0 1.7-2.5 2-2.5 3.7M12 17v.5',
  imprimir: 'M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z',
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
function aviso(texto) {
  document.querySelectorAll('.toast').forEach(x => x.remove());   // un aviso nuevo sustituye al anterior
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = texto;
  document.body.appendChild(t);
  const ms = texto.length > 60 ? 6000 : 2200;
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
        <span class="marca-txt"><b>Memorias de Peón</b><small class="lema-cab">Todo peón propio es un obstáculo</small><small class="autor">Casilla a casilla · by Manuel Esteve</small></span>
      </a>
      <button class="btn-ico" id="lupa" aria-label="Buscar">${ico('buscar')}</button>
      <button class="sync" id="sync"></button>
      <a href="#/ajustes" class="btn-ico" aria-label="Ajustes">${ico('ajustes')}</a>
    </header>
    <main id="vista"></main>
    <nav class="barra">
      ${[['inicio', 'Inicio'], ['conceptos', 'Conceptos'], ['repertorio', 'Repertorio'], ['entrenar', 'Entrenar'], ['clases', 'Clases']]
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
  repertorio: vRepertorio, apertura: vApertura, 'editar-apertura': vEditarApertura, linea: vLinea, 'editar-linea': vEditarLinea, 'imprimir-repertorio': vImprimirRepertorio,
  clases: vClases, clase: vClase, notas: vNotas, glosario: vGlosario, rutina: vRutina, guia: vGuia, imprimir: vImprimir,
  biblioteca: vBiblioteca,
  repaso: vRepaso, progreso: vProgreso, tecnicas: vTecnicas, preguntas: vPreguntas, pregunta: vPregunta,
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
    a.classList.toggle('on', r === nombre || (r === 'conceptos' && ['bloque', 'concepto', 'editar', 'ejemplo', 'catalogo', 'imprimir', 'biblioteca'].includes(nombre))
      || (r === 'repertorio' && ['apertura', 'editar-apertura', 'linea', 'editar-linea', 'imprimir-repertorio'].includes(nombre)) || (r === 'clases' && ['clase', 'preguntas', 'pregunta'].includes(nombre)) || (r === 'entrenar' && ['repaso', 'progreso', 'tecnicas'].includes(nombre)) || (r === 'inicio' && ['notas', 'glosario', 'rutina', 'guia'].includes(nombre)));
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
  const esbozo = c.origen === 'mdp' && !ejemplosDe(c.id).length;
  return `<a class="fila-c${esbozo ? ' esbozo' : ''}" href="#/concepto/${c.id}" ${esbozo ? 'title="Ficha sugerida: añádele tu ejemplo para trabajarla"' : ''}>
      <span class="punto" style="--c:${b ? col(b.color) : 'var(--suave)'}"></span>
      <span class="fila-txt"><b>${esc(c.titulo)}</b>${c.principio ? `<small>${esc(c.principio)}</small>` : ''}</span>
      ${ico('flecha', 'peq')}
    </a>`;
}

function vInicio(v) {
  const dia = conceptoDelDia();
  const recientes = conceptos().sort((a, b) => String(b.editado_en).localeCompare(String(a.editado_en))).slice(0, 5);
  const nEj = D.lista('ejemplos').length;
  const notasPendientes = D.lista('notas_rapidas').filter(n => !n.procesada).length;
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
      <div><b>${conceptos().length}</b><span>fichas</span></div>
      <div><b>${nEj}</b><span>ejemplos</span></div>
      <div><b>${bloquesActivos().length}</b><span>bloques</span></div>
    </div>
    ${recientes.length ? `<h3 class="sec">Últimas fichas</h3><div class="lista">${recientes.map(filaConcepto).join('')}</div>` : ''}`;
  v.querySelector('#nota-rapida').addEventListener('click', () => abrirNotaRapida());
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
    ${conceptoElegible(c) ? `<div class="mi-estado"><span>Mi estado</span><div class="segmento" id="estado-ficha">
      ${[['nuevo', 'Sin repasar'], ['repasar', 'Repasar'], ['fallo', 'Fallo'], ['domino', 'Lo domino']].map(([k, t]) => `<button data-estado="${k}" class="${(c.estado || 'nuevo') === k ? 'on ' + k : ''}">${t}</button>`).join('')}
    </div></div>` : ''}
    ${!c.original && itBiblio ? `<div class="aviso-biblio">${ico('libro', 'peq')} <span>La biblioteca tiene teoría de <b>${esc(itBiblio.titulo)}</b>.${c.principio || c.explicacion ? ' Solo se rellenará lo que esté vacío.' : ''}</span>
      <button class="btn peq" id="completar">Completar con la biblioteca</button></div>` : ''}
    ${c.pista && !ejemplos.length ? `<div class="pista"><b>Pista para tu ejemplo</b><p>${esc(c.pista)}</p></div>` : ''}
    <h3 class="sec">Ejemplos <small>${ejemplos.length || ''}</small></h3>
    <div class="ejemplos">
      ${ejemplos.map((e, i) => `
        <div class="tarjeta ejemplo">
          <div class="ej-cab"><b>${esc(e.titulo || 'Ejemplo ' + (i + 1))}</b>
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
  v.querySelector('#estado-ficha')?.addEventListener('click', async e => {
    const b = e.target.closest('[data-estado]');
    if (!b) return;
    c.estado = b.dataset.estado;
    await D.guardar('conceptos', c);
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
  // Si el nombre coincide con una ficha de la biblioteca, se ofrece su teoría
  const cajaBiblio = document.createElement('div');
  cajaBiblio.className = 'aviso-biblio'; cajaBiblio.hidden = true;
  f.titulo.closest('label').after(cajaBiblio);
  const buscarEnBiblio = () => {
    const it = BIBLIOTECA.find(x => norm(x.titulo) === norm(f.titulo.value.trim()) || (x.alias || []).some(a => norm(a) === norm(f.titulo.value.trim())));
    cajaBiblio.hidden = !it || (!nuevo && c.original?.id === it?.id);
    if (it) cajaBiblio.innerHTML = `${ico('libro', 'peq')} <span>La biblioteca tiene teoría de <b>${esc(it.titulo)}</b>.</span> <button type="button" class="btn peq" data-usar="${it.id}">Usar la teoría de la biblioteca</button>`;
  };
  f.titulo.addEventListener('input', buscarEnBiblio);
  cajaBiblio.addEventListener('click', e => {
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
  buscarEnBiblio();
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
  f.addEventListener('submit', async e => {
    e.preventDefault();
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

function vEjemplo(v, id, q) {
  editando = true;
  const nuevo = id === 'nuevo';
  const fila = nuevo ? { concepto_id: q.get('concepto'), titulo: '', orientacion: 'white' } : D.obtener('ejemplos', id);
  if (!fila || !D.obtener('conceptos', fila.concepto_id)) return ir('#/conceptos');
  const concepto = D.obtener('conceptos', fila.concepto_id);
  const ej = nuevo ? ejemploVacio() : dePgn(fila.pgn || `[FEN "${fila.fen_inicial}"]`);
  let cambios = false, orientacion = fila.orientacion || 'white';
  v.innerHTML = `
    <div class="cab-vista ej-cab">
      <a href="#/concepto/${concepto.id}" class="btn-ico" aria-label="Volver" id="volver">${ico('atras')}</a>
      <div class="ej-tit"><h1>${nuevo ? 'Nuevo ejemplo' : 'Ejemplo'}</h1><small>${esc(concepto.titulo)}</small></div>
      <button class="btn-ico" id="ampliar" aria-label="Ampliar">${ico('ampliar')}</button>
      <button class="btn primario peq" id="guardar">Guardar</button>
    </div>
    <div id="editor" class="editor"></div>
    <div class="ej-pie">
      <label class="form solo"><span>Título del ejemplo <small>opcional</small></span>
        <input id="ej-titulo" maxlength="120" placeholder="Bloqueo del peón aislado con el caballo" value="${esc(fila.titulo || '')}"></label>
      <label class="check"><input type="checkbox" id="ej-ejercicio" ${fila.es_ejercicio ? 'checked' : ''}><span>Usar como ejercicio de repaso <small>— la primera jugada que guardes será la solución</small></span></label>
      ${nuevo ? '' : `<button class="btn peligro" id="borrar">${ico('borrar', 'peq')} Borrar este ejemplo</button>`}
    </div>`;
  const ed = crearEditor(v.querySelector('#editor'), ej, {
    orientacion,
    pedirPromocion,
    alCambiar: (_e, o) => { cambios = true; if (o) orientacion = o; },
  });
  limpiezas.push(ed.cerrar);
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
  v.querySelector('#ej-ejercicio').addEventListener('change', () => { cambios = true; });
  v.querySelector('#volver').addEventListener('click', e => {
    if (cambios && !confirm('Hay cambios sin guardar. ¿Salir sin guardar?')) e.preventDefault();
    else editando = false;
  });
  v.querySelector('#guardar').addEventListener('click', async () => {
    const err = ed.confirmar();
    if (err) return alert(err);
    const comoEjercicio = v.querySelector('#ej-ejercicio').checked;
    if (comoEjercicio && !ej.jugadas.length) return alert('Para usarlo como ejercicio, juega en el tablero al menos la jugada que será la solución.');
    Object.assign(fila, {
      titulo: v.querySelector('#ej-titulo').value.trim() || null,
      es_ejercicio: comoEjercicio,
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
        if (n) aviso(`Han aparecido ${n} fichas sugeridas. Se verán translúcidas hasta que les añadas tu ejemplo.`);
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
    if (f.id === 'nuevo-bloque') {
      const nb = await D.guardar('bloques', { nombre, color: 'gris', icono: 'libro', orden: bloques().length + 1, activo: true, padre_id: null });
      abiertos.add(nb.id);
    } else {
      const b = D.obtener('bloques', f.closest('.cat').dataset.id);
      await D.guardar('bloques', { nombre, padre_id: b.id, color: b.color, orden: temasDe(b.id).length + 1, activo: true });
    }
    const n = await sembrarBiblioteca();
    if (n) aviso(`Han aparecido ${n} fichas sugeridas. Se verán translúcidas hasta que les añadas tu ejemplo.`);
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
        <div class="opciones">${radio('notacion', 'letras', 'Letras (Nf3)')}${radio('notacion', 'figuras', 'Figuras (♘f3)')}</div></fieldset>
      <fieldset><legend>Lichess</legend>
        <label>Tu usuario<input name="lichess" value="${esc(a.lichess)}" placeholder="usuario" autocapitalize="off" autocorrect="off"></label></fieldset>
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
  v.querySelector('#copia-json').addEventListener('click', () => {
    const datos = Object.fromEntries(D.TABLAS.map(t => [t, D.lista(t)]));
    descargar(`MdP-copia-${hoyISO()}.json`, JSON.stringify({ app: 'Memorias de Peón', version: VERSION, fecha: new Date().toISOString(), datos }, null, 1), 'application/json');
  });
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
        <p>Tus aperturas, elegidas por ti: hasta 3 con blancas y 3 defensas con negras. La app no te propone ninguna; te guía para que cada una quede completa, paso a paso: <b>las jugadas que la definen</b>, objetivos, <b>línea principal</b>, <b>respuestas del rival</b>, estructura, planes, rupturas, <b>trampas</b>, tácticas, partidas modelo, conceptos de tu cuaderno y, al final, revisarla con tu maestro.</p>
        <p>Cada apertura muestra su porcentaje y el <b>siguiente paso</b>. En cada línea tienes enlaces para comprobarla en Lichess: el tablero de análisis y el <b>explorador</b>, donde ves qué juegan de verdad los rivales. También puedes pegar un PGN copiado de Lichess.</p>
        <p><b>Entrenar</b>: la app hace las jugadas del rival y tú las tuyas, con dos intentos por jugada; la pista es tu comentario, nunca la jugada. Cada línea que llega al menos a tu 5.ª jugada entra en el repaso diario: la que te sale bien tarda más en volver y la que fallas vuelve mañana. Con <b>Entrenar esta apertura</b> repasas todas sus líneas cuando quieras, primero las que peor llevas. El icono de impresora saca el repertorio en PDF.</p></section>
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
//  BUSCADOR GLOBAL (lupa de la cabecera)
// ---------------------------------------------------------------------
function abrirBuscador() {
  const d = document.createElement('div');
  d.className = 'modal buscador-global';
  d.innerHTML = `<div class="modal-caja bg-caja">
      <label class="buscador">${ico('buscar')}<input type="search" id="bg-in" placeholder="Busca fichas, aperturas, glosario, clases…" autocomplete="off" autocapitalize="off"></label>
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
    const ap = top(aperturas(), a => puntuar(a.nombre, [a.eco, a.ideas, a.planes, (a.lineas || []).map(l => l.nombre).join(' ')].join(' ')));
    const grupo = (tit, html) => html ? `<h3 class="sec">${tit}</h3><div class="lista">${html}</div>` : '';
    res.innerHTML = (grupo('Fichas', fichas.map(filaConcepto).join('')) +
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
function fichaDeTarjeta(t) {
  if (t.tipo === 'linea') return null;
  if (t.tipo === 'concepto') return D.obtener('conceptos', t.ref_id);
  const e = D.obtener('ejemplos', t.ref_id);
  return e && D.obtener('conceptos', e.concepto_id);
}
const tarjetasDeFicha = c => tarjetas().filter(t => (t.tipo === 'concepto' && t.ref_id === c.id) ||
  (t.tipo === 'ejemplo' && D.obtener('ejemplos', t.ref_id)?.concepto_id === c.id));
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
        if (ej && sirveDeEjercicio(ej)) quiero.set(await idDeterminista(`${usuario.id}:ejemplo:${e.id}`), { tipo: 'ejemplo', ref_id: e.id });
      }
      for (const a of aperturas()) {
        for (const l of a.lineas || []) {
          if (lineaEntrenable(a, leerPgn(l.pgn))) quiero.set(await idDeterminista(`${usuario.id}:linea:${l.id}`), { tipo: 'linea', ref_id: l.id });
        }
      }
      for (const [id, x] of quiero) {
        const t = D.obtenerAunBorrado('tarjetas', id);
        if (!t) await D.guardar('tarjetas', { id, ...x, ply: 0, facilidad: 2.5, intervalo_dias: 0, repeticiones: 0, proxima: hoy, aciertos: 0, fallos: 0 });
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
  const salida = apertura ? '#/apertura/' + apertura.id : '#/inicio';
  v.innerHTML = '<p class="nada">Preparando tu repaso…</p>';
  await prepararTarjetas();
  if (!v.isConnected) return;
  let sesion;
  if (apertura) sesion = R.ordenarParaEntrenar(tarjetasDeApertura(apertura));
  else {
    sesion = R.seleccionar(tarjetas(), n);
    if (!sesion.length && q.get('adelantar') === '1')
      sesion = tarjetas().sort((a, b) => String(a.proxima).localeCompare(String(b.proxima))).slice(0, n);
  }
  sesion = sesion.filter(t => fichaDeTarjeta(t) || lineaDeTarjeta(t));
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
    registrarRespuesta(sesion[i], res);
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
    if (t.tipo === 'linea') return pintarLinea(t);
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
    } else {
      const fila = D.obtener('ejemplos', t.ref_id);
      const ej = ejemploDeFila(fila);
      let pistas = 0, fallos = 0, hecho = false;
      v.innerHTML = cabecera() + `
        <article class="rep-tarjeta" style="--c:${color}">
          <p class="rep-pregunta"><b>Juegan ${ej.fen0.split(' ')[1] === 'b' ? 'negras' : 'blancas'}.</b> ¿Qué jugarías?</p>
          <div class="rep-tablero"></div>
          <p class="rep-aviso" id="rep-aviso" hidden></p>
          <div class="rep-pistas" id="rep-pistas"></div>
          <div class="fila-btn" id="rep-ayuda">
            <button class="btn" id="rep-pista">${ico('guia', 'peq')} Pista</button>
            <button class="btn" id="rep-nose">No lo sé</button>
          </div>
          <div id="rep-fin" hidden></div>
        </article>`;
      const aviso = (txt, cls) => { const a = v.querySelector('#rep-aviso'); a.textContent = txt; a.className = 'rep-aviso ' + (cls || ''); a.hidden = false; };
      const terminar = (res, texto) => {
        if (hecho) return; hecho = true;
        v.querySelector('#rep-ayuda').hidden = true;
        const sol = ej.jugadas[0];
        const fin = v.querySelector('#rep-fin');
        fin.innerHTML = `<p class="rep-resultado ${res}">${texto}</p>
          <p class="rep-solucion">Solución: <b>${esc(ejer.solucion())}</b></p>
          ${sol.comentario ? `<p class="comentario-jug">${esc(sol.comentario)}</p>` : ''}
          <p class="nota">Ficha: <a href="#/concepto/${c.id}">${esc(c.titulo)}</a>${fila.titulo ? ' · ' + esc(fila.titulo) : ''}</p>
          <button class="btn primario ancho" id="rep-sig">Siguiente</button>`;
        fin.hidden = false;
        fin.querySelector('#rep-sig').addEventListener('click', () => siguiente(res));
      };
      const ejer = crearEjercicio(v.querySelector('.rep-tablero'), ej, {
        pedirPromocion,
        alResponder: ({ acierto, otraVez }) => {
          if (acierto) terminar(fallos || pistas ? 'regular' : 'bien', fallos || pistas ? '¡Correcto! (con ayuda: cuenta como Regular)' : '¡Correcto!');
          else if (otraVez) { fallos++; aviso('No es esa. Piénsalo otra vez: te queda un intento.', 'mal'); }
          else terminar('mal', 'No era esa. Esta tarjeta volverá mañana.');
        },
      });
      cerrarTablero = ejer.cerrar;
      v.querySelector('#rep-pista').addEventListener('click', e => {
        pistas++;
        const caja = v.querySelector('#rep-pistas');
        if (pistas === 1) caja.innerHTML = `<p class="pista-rep"><b>Concepto:</b> ${esc(c.titulo)}</p>`;
        if (pistas === 2) {
          caja.innerHTML += c.principio ? `<p class="pista-rep"><b>Idea:</b> ${esc(c.principio)}</p>` : '';
          e.currentTarget.hidden = true;
        }
        if (pistas === 1 && !c.principio) e.currentTarget.hidden = true;
      });
      v.querySelector('#rep-nose').addEventListener('click', () => { ejer.mostrarSolucion(); terminar('mal', 'Esta es la solución. La tarjeta volverá mañana.'); });
    }
  }

  // Una línea del repertorio: la app juega las del rival, tú las tuyas
  function pintarLinea(t) {
    const { a, l, ej } = lineaDeTarjeta(t);
    let pistas = 0, hecho = false;
    v.innerHTML = cabecera() + `
      <article class="rep-tarjeta" style="--c:var(--acento)">
        <span class="etq-bloque">${a.color === 'white' ? '♔' : '♚'} ${esc(a.nombre)} · ${TIPO_LINEA[l.tipo]}</span>
        <p class="rep-pregunta"><b>${esc(l.nombre || TIPO_LINEA[l.tipo])}</b> · Juegas con ${a.color === 'white' ? 'blancas' : 'negras'}; el rival juega solo.</p>
        <div class="rep-tablero"></div>
        <p class="rep-prog" id="rep-prog"></p>
        <p class="rep-aviso" id="rep-aviso" hidden></p>
        <div class="rep-pistas" id="rep-pistas"></div>
        <div class="fila-btn" id="rep-ayuda">
          <button class="btn" id="rep-pista">${ico('guia', 'peq')} Pista</button>
          <button class="btn" id="rep-nose">No lo sé</button>
        </div>
        <div id="rep-fin" hidden></div>
      </article>`;
    const aviso = (txt, cls) => { const x = v.querySelector('#rep-aviso'); x.textContent = txt; x.className = 'rep-aviso ' + (cls || ''); x.hidden = !txt; };
    const total = RP.jugadasPropias(ej, a.color);
    const prog = () => {   // cuenta solo tus jugadas
      const hechas = a.color === 'white' ? Math.ceil(entreno.ply() / 2) : Math.floor(entreno.ply() / 2);
      v.querySelector('#rep-prog').textContent = hechas >= total ? `${total} de ${total} jugadas tuyas` : `Tu jugada ${hechas + 1} de ${total}`;
    };
    const entreno = crearEntrenoLinea(v.querySelector('.rep-tablero'), ej, {
      color: a.color, pedirPromocion,
      alJugada: ({ ok, otraVez, perdida, jugada }) => {
        v.querySelector('#rep-pistas').innerHTML = '';
        if (ok) aviso('');
        else if (otraVez) aviso('No es esa. Te queda un intento.', 'mal');
        else if (perdida) aviso(`La buena era ${jugada}. Seguimos.`, 'mal');
        prog();
      },
      alTerminar: ({ errores, perdidas }) => {
        if (hecho) return; hecho = true;
        const res = perdidas ? 'mal' : errores || pistas ? 'regular' : 'bien';
        const texto = res === 'bien' ? '¡Línea perfecta!' : res === 'regular' ? 'Completada, con algún tropiezo o pista: cuenta como Regular.' : `${perdidas === 1 ? 'Se te escapó 1 jugada' : `Se te escaparon ${perdidas} jugadas`}. Esta línea volverá mañana.`;
        v.querySelector('#rep-ayuda').hidden = true;
        const fin = v.querySelector('#rep-fin');
        fin.innerHTML = `<p class="rep-resultado ${res}">${texto}</p>
          <p class="p-jug rep-linea-txt">${textoJugadas(ej)}</p>
          ${l.nota ? `<p class="comentario-jug">${esc(l.nota)}</p>` : ''}
          <p class="nota"><a href="#/linea/${a.id}?l=${l.id}">Ver la línea</a> · <a href="#/apertura/${a.id}">${esc(a.nombre)}</a></p>
          <button class="btn primario ancho" id="rep-sig">Siguiente</button>`;
        fin.hidden = false;
        fin.querySelector('#rep-sig').addEventListener('click', () => siguiente(res));
      },
    });
    cerrarTablero = entreno.cerrar;
    prog();
    v.querySelector('#rep-pista').addEventListener('click', () => {
      const txt = entreno.pista();
      const caja = v.querySelector('#rep-pistas');
      if (txt) { pistas++; caja.innerHTML = `<p class="pista-rep"><b>Pista:</b> ${esc(txt)}</p>`; }
      else if (l.nota && !caja.innerHTML) { pistas++; caja.innerHTML = `<p class="pista-rep"><b>La idea de la línea:</b> ${esc(l.nota)}</p>`; }
      else caja.innerHTML = '<p class="pista-rep">No hay pista para esta jugada. Escribe un comentario en ella al editar la línea y la tendrás la próxima vez.</p>';
    });
    v.querySelector('#rep-nose').addEventListener('click', () => entreno.noLoSe());
  }

  function final() {
    editando = false;
    const nt = R.nota(resultados);
    const cuenta = r => resultados.filter(x => x === r).length;
    if (!apertura) {
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
          const ln = lineaDeTarjeta(t);
          if (ln) return `<a class="fila-c" href="#/linea/${ln.a.id}?l=${ln.l.id}"><span class="res-punto ${resultados[k]}"></span><span class="fila-txt"><b>${esc(ln.l.nombre || TIPO_LINEA[ln.l.tipo])}</b><small>${esc(ln.a.nombre)} · ${TIPO_LINEA[ln.l.tipo]}</small></span>${ico('flecha', 'peq')}</a>`;
          const c = fichaDeTarjeta(t);
          return `<a class="fila-c" href="#/concepto/${c.id}"><span class="res-punto ${resultados[k]}"></span><span class="fila-txt"><b>${esc(c.titulo)}</b><small>${t.tipo === 'ejemplo' ? 'Ejercicio en el tablero' : 'Tarjeta de concepto'}</small></span>${ico('flecha', 'peq')}</a>`;
        }).join('')}</div>
        <div class="botones">
          <a class="btn primario" href="${salida}">${apertura ? 'Volver a la apertura' : 'Volver a Inicio'}</a>
          ${!apertura && quedan ? `<a class="btn" href="#/repaso?n=5">Otra ronda rápida</a>` : ''}
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
    <p class="nota">Entran en tu repaso diario. También puedes cambiar el estado de una ficha a mano, desde la propia ficha.</p>
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
    ed = crearEditor(v.querySelector('#preg-editor'), ejemplo, { pedirPromocion });
    limpiezas.push(ed.cerrar);
    conPosicion = true;
  };
  if (conPosicion) abrirEditor();
  v.querySelector('#preg-pos').addEventListener('click', e => {
    if (e.target.closest('#preg-add')) abrirEditor();
    if (e.target.closest('#preg-quitar')) {
      if (ed) ed.cerrar(); ed = null; conPosicion = false; ejemplo = ejemploVacio();
      v.querySelector('#preg-editor').hidden = true; v.querySelector('#preg-editor').innerHTML = '';
      v.querySelector('#preg-pos').innerHTML = `<button type="button" class="btn" id="preg-add">${ico('mas', 'peq')} Añadir una posición</button>`;
    }
  });
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
const lineaEntrenable = (a, ej) => !!ej && ej.fen0 === FEN_INICIAL && RP.jugadasPropias(ej, a.color) >= RP.MIN_PROPIAS;
function lineaDeTarjeta(t) {
  if (!t || t.tipo !== 'linea') return null;
  for (const a of aperturas()) {
    const l = (a.lineas || []).find(x => x.id === t.ref_id);
    if (l) { const ej = leerPgn(l.pgn); return ej ? { a, l, ej } : null; }
  }
  return null;
}
const tarjetasDeApertura = a => { const ids = new Set((a.lineas || []).map(l => l.id)); return tarjetas().filter(t => t.tipo === 'linea' && ids.has(t.ref_id)); };
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
        <p>Elige tú las aperturas: hasta ${RP.MAX_POR_COLOR} con blancas y ${RP.MAX_POR_COLOR} defensas con negras. La app no te propone ninguna; te guía paso a paso para que cada una quede completa: jugadas, línea principal, respuestas del rival, planes, trampas…</p>
      </div>`}
    ${bloque('white')}
    ${bloque('black')}`;
}

function vApertura(v, id) {
  const a = D.obtener('repertorio', id);
  if (!a) return ir('#/repertorio');
  const r = RP.analizar(a, leerPgn, verSan);
  const color = a.color;
  const sig = r.siguiente;
  const fichas = (a.conceptos || []).map(cid => D.obtener('conceptos', cid)).filter(Boolean);
  const estadoLinea = l => {
    if (!lineaEntrenable(a, l.ej)) return `<span class="res-punto corta" title="Aún corta para entrenar"></span>`;
    const t = tarjetaDeLinea(l);
    return `<span class="res-punto ${t?.ultimo_resultado || ''}" title="${t?.ultimo_resultado ? RES_TXT[t.ultimo_resultado] : 'Sin entrenar'}"></span>`;
  };
  const filaLinea = l => {
    const sep = r.principal && l.tipo !== 'principal' && l.ej ? RP.separacion(l.ej, r.principal.ej) : -1;
    const n = l.ej ? l.ej.jugadas.length : 0;
    const faltan = RP.MIN_PROPIAS - RP.jugadasPropias(l.ej, color);
    return `<a class="fila-c" href="#/linea/${a.id}?l=${l.id}">${estadoLinea(l)}
      <span class="fila-txt"><b>${esc(l.nombre || TIPO_LINEA[l.tipo])}</b>
      <small>${sep >= 0 ? `Se separa en ${esc(RP.etiquetaPly(l.ej, sep, verSan))} · ` : ''}hasta la jugada ${Math.ceil(n / 2) || 0}${faltan > 0 ? ` · para entrenarla, ${faltan} ${faltan === 1 ? 'jugada tuya más' : 'jugadas tuyas más'}` : ''}${l.nota ? ' · ' + esc(l.nota.slice(0, 60)) : ''}</small></span>
      ${ico('flecha', 'peq')}</a>`;
  };
  const entrenables = (a.lineas || []).filter(l => lineaEntrenable(a, leerPgn(l.pgn)));
  const hoyToca = R.pendientes(tarjetasDeApertura(a)).length;
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
    ${r.avisosLineas.length ? `<ul class="cobertura">${r.avisosLineas.map(x => `<li class="medio">${ico('reloj', 'peq')}<span>${esc(x.texto)}</span></li>`).join('')}</ul>` : ''}
    <details class="guia-ap"${r.pct < 100 ? ' open' : ''}><summary>La guía: ${r.pasos.filter(p => p.estado === 'hecho').length} de ${r.pasos.length} pasos</summary>
      <div class="lista">${r.pasos.map((p, i) => `<a class="fila-c paso ${p.estado}" href="${p.clave === 'revisada' ? '#/editar-apertura/' + a.id + '?campo=revisada' : pasoUrl(a, p)}">
        <span class="paso-n">${p.estado === 'hecho' ? ico('check', 'peq') : i + 1}</span>
        <span class="fila-txt"><b>${esc(p.titulo)}</b><small>${esc(p.detalle)}</small></span>${ico('flecha', 'peq')}</a>`).join('')}</div>
    </details>
    ${seccion('Objetivos', a.ideas, 'ideas')}
    <h3 class="sec">Línea principal</h3>
    ${r.principal ? `<div class="tarjeta ejemplo">
        <div class="ej-cab">${estadoLinea(r.principal)}<b>${esc(r.principal.nombre || 'Línea principal')}</b><a href="#/editar-linea/${a.id}?l=${r.principal.id}" class="btn-ico peq" aria-label="Editar">${ico('editar')}</a></div>
        <div class="visor" id="visor-principal"></div>
        ${r.principal.nota ? `<div class="md">${md(r.principal.nota)}</div>` : ''}
        <div class="fila-btn">
          <a class="chip" href="${esc(RP.urlAnalisis(r.principal.ej, color))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Analizar en Lichess</a>
          <a class="chip" href="${esc(RP.urlExplorador(fenFinal(r.principal.ej), color))}" target="_blank" rel="noopener">${ico('externo', 'peq')} Explorador al final</a>
        </div></div>`
      : `<a class="btn anadir-ej" href="#/editar-linea/${a.id}?l=nueva&tipo=principal">${ico('mas')} Crear la línea principal</a>`}
    <h3 class="sec">Respuestas del rival <small>${r.secundarias.length || ''}</small></h3>
    ${r.secundarias.length ? `<div class="lista">${r.secundarias.map(filaLinea).join('')}</div>` : '<p class="nada peq">Las alternativas del rival a tu línea principal.</p>'}
    <a class="btn anadir-ej" href="#/editar-linea/${a.id}?l=nueva&tipo=secundaria">${ico('mas')} Añadir respuesta del rival</a>
    <h3 class="sec">Trampas <small>${r.trampas.length || ''}</small></h3>
    ${r.trampas.length ? `<div class="lista">${r.trampas.map(filaLinea).join('')}</div>` : '<p class="nada peq">Las que puedes tender y en las que no debes caer.</p>'}
    <a class="btn anadir-ej" href="#/editar-linea/${a.id}?l=nueva&tipo=trampa">${ico('mas')} Añadir trampa</a>
    ${seccion('Estructura de peones', a.estructura, 'estructura')}
    ${seccion('Planes del medio juego', a.planes, 'planes')}
    ${seccion('Rupturas', a.rupturas, 'rupturas')}
    ${seccion('Tácticas típicas', a.tacticas, 'tacticas')}
    ${(a.partidas_modelo || []).length ? `<h3 class="sec">Partidas modelo</h3><div class="enlaces">${a.partidas_modelo.map(p => p.url
      ? `<a class="enlace" href="${esc(p.url)}" target="_blank" rel="noopener"><b>${esc(p.titulo || 'Partida')}</b><small>${ico('externo', 'peq')} Abrir</small></a>`
      : `<span class="enlace"><b>${esc(p.titulo || 'Partida')}</b></span>`).join('')}</div>` : ''}
    ${fichas.length ? `<h3 class="sec">Conceptos de tu cuaderno</h3><div class="chips">${fichas.map(c => `<a class="chip" href="#/concepto/${c.id}">${ico('enlace', 'peq')} ${esc(c.titulo)}</a>`).join('')}</div>` : ''}`;
  if (r.principal?.ej) {
    const vis = crearVisor(v.querySelector('#visor-principal'), r.principal.ej, { orientacion: color });
    limpiezas.push(vis.cerrar);
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

// Editar los datos y los textos de una apertura. Con ?campo=… se edita un solo
// paso de la guía, con su explicación, para ir completándola poco a poco.
function vEditarApertura(v, id, q) {
  editando = true;
  const nueva = id === 'nueva';
  const a = nueva ? { nombre: '', color: q.get('color') === 'black' ? 'black' : 'white', rol: 'principal', lineas: [], conceptos: [], partidas_modelo: [] } : D.obtener('repertorio', id);
  if (!a) return ir('#/repertorio');
  if (nueva && aperturas().some(x => x.color === a.color && x.rol === 'principal')) a.rol = 'secundaria';
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
  v.querySelector('#volver').addEventListener('click', () => { editando = false; });
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
    </div>`;
  const vis = crearVisor(v.querySelector('#visor-linea'), ej, { orientacion: a.color });
  limpiezas.push(vis.cerrar);
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
  // Una línea nueva empieza con las jugadas que definen tu apertura
  let ej = (esTronco ? leerPgn(a.tronco) : nueva ? leerPgn(a.tronco) : leerPgn(l.pgn)) || ejemploVacio();
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
      <details class="ayuda-linea"${nueva || esTronco ? ' open' : ''}><summary>Cómo hacerlo</summary><p>${esc(pasoAyuda)}</p>
        <p class="nota">Juega las jugadas en el tablero (modo Jugar). Para comentar una jugada, selecciónala y escribe en «Comentario».</p></details>
      <div class="fila-btn"><a class="chip" id="explorar" target="_blank" rel="noopener">${ico('externo', 'peq')} ¿Qué juega el rival aquí? Explorador</a></div>
      ${esTronco ? '' : `
        <label class="form solo"><span>Nombre de la línea <small>opcional</small></span>
          <input id="l-nombre" maxlength="100" placeholder="${l.tipo === 'trampa' ? 'Trampa de …' : l.tipo === 'principal' ? 'Variante principal' : 'Si juega 3...Cf6'}" value="${esc(l.nombre || '')}"></label>
        <label class="form solo"><span>Tipo</span><select id="l-tipo">${Object.entries(TIPO_LINEA).map(([k, t]) => `<option value="${k}" ${l.tipo === k ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        <label class="form solo"><span>La idea <small>por qué la juegas, qué buscas, qué evitar</small></span>
          <textarea id="l-nota" rows="3" placeholder="${l.tipo === 'trampa' ? 'Si el rival come el peón…' : 'Con …c5 ataco el centro antes de que…'}">${esc(l.nota || '')}</textarea></label>`}
      <details class="pegar-pgn"><summary>Pegar un PGN</summary>
        <p class="nota">Desde Lichess: en el tablero de análisis, «FEN y PGN», copia el PGN y pégalo aquí. Se toma la línea principal, sin variantes.</p>
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
  v.querySelector('#pgn-cargar').addEventListener('click', () => {
    const txt = v.querySelector('#pgn-txt').value.trim();
    if (!txt) return;
    const nuevoEj = leerPgn(txt);
    if (!nuevoEj || !nuevoEj.jugadas.length) return alert('No he podido leer jugadas en ese PGN. Comprueba que esté en notación inglesa (Nf3, Bb5…), como lo copia Lichess.');
    ed.cerrar(); ej = nuevoEj; montarEditor(); cambios = true;
    v.querySelector('.pegar-pgn').open = false;
    aviso(`${ej.jugadas.length} jugadas cargadas`);
  });
  v.querySelector('#volver').addEventListener('click', e => {
    if (cambios && !confirm('Hay cambios sin guardar. ¿Salir sin guardar?')) e.preventDefault();
    else editando = false;
  });
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
    aviso(esTronco ? 'Jugadas guardadas. Siguiente: los objetivos de la apertura.' : 'Línea guardada');
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
