// =====================================================================
//  MdP · tablero.js
//  Tablero de Lichess (chessground) + reglas (chess.js) + PGN propio.
//  Un ejemplo se guarda en PGN estándar; las flechas y casillas usan
//  el formato de Lichess dentro de los comentarios: [%cal Gf6d5] [%csl Rd4]
// =====================================================================
import { Chessground } from 'https://cdn.jsdelivr.net/npm/chessground@9/+esm';
import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1/+esm';

export const FEN_INICIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const COLORES = { G: 'green', R: 'red', B: 'blue', Y: 'yellow' };
const LETRA = { green: 'G', red: 'R', blue: 'B', yellow: 'Y' };
const FIGURAS = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘' };

let notacion = 'letras';
// Notación al mostrar jugadas: 'letras' (inglesa: Nf3), 'figuras' (♘f3) o 'espanol' (Cf3).
// Internamente todo se guarda en notación inglesa (SAN), como Lichess.
const ESPANOL = { K: 'R', Q: 'D', R: 'T', B: 'A', N: 'C' };
export function usarNotacion(modo) { notacion = ['figuras', 'espanol'].includes(modo) ? modo : 'letras'; }
export function verSan(san) {
  if (notacion === 'figuras') return san.replace(/[KQRBN]/g, l => FIGURAS[l]);
  if (notacion === 'espanol') return san.replace(/[KQRBN]/g, l => ESPANOL[l]);
  return san;
}
// Una jugada escrita en notación española (Cf3, Axb5, Tfe1, Dd2, R-e2, e8=D) a inglesa
const DE_ESPANOL = { R: 'K', D: 'Q', T: 'R', A: 'B', C: 'N' };
const deEspanol = san => san.replace(/^[RDTAC]/, l => DE_ESPANOL[l]).replace(/=([DTAC])/, (_, l) => '=' + DE_ESPANOL[l]);

// ---------------------------------------------------------------------
//  Modelo de un ejemplo
//  { fen0, comentario0, formas0:[], jugadas:[{san, uci, fen, comentario, formas:[]}] }
//  formas: [{orig:'f6', dest:'d5', brush:'green'}]  (sin dest = círculo)
// ---------------------------------------------------------------------
export function ejemploVacio(fen = FEN_INICIAL) {
  return { fen0: fen, comentario0: '', formas0: [], jugadas: [] };
}

function textoFormas(formas) {
  const cal = formas.filter(f => f.dest).map(f => LETRA[f.brush] + f.orig + f.dest);
  const csl = formas.filter(f => !f.dest).map(f => LETRA[f.brush] + f.orig);
  let t = '';
  if (cal.length) t += `[%cal ${cal.join(',')}] `;
  if (csl.length) t += `[%csl ${csl.join(',')}] `;
  return t;
}

function leerFormas(texto) {
  const formas = [];
  texto = texto.replace(/\[%(cal|csl)\s+([^\]]*)\]/g, (_, tipo, lista) => {
    lista.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
      const brush = COLORES[s[0]] || 'green';
      if (tipo === 'cal' && s.length >= 5) formas.push({ orig: s.slice(1, 3), dest: s.slice(3, 5), brush });
      if (tipo === 'csl' && s.length >= 3) formas.push({ orig: s.slice(1, 3), brush });
    });
    return '';
  });
  return { formas, texto: texto.replace(/\s+/g, ' ').trim() };
}

function comentarioPgn(texto, formas) {
  const t = (textoFormas(formas) + (texto || '').replace(/[{}]/g, '')).trim();
  return t ? ` { ${t} }` : '';
}

export function aPgn(ej) {
  let pgn = '';
  if (ej.fen0 !== FEN_INICIAL) pgn += `[SetUp "1"]\n[FEN "${ej.fen0}"]\n\n`;
  const partes = ej.fen0.split(' ');
  let turno = partes[1] || 'w';
  let num = parseInt(partes[5] || '1', 10) || 1;
  let cuerpo = comentarioPgn(ej.comentario0, ej.formas0).trim();
  ej.jugadas.forEach((j, i) => {
    if (turno === 'w') cuerpo += ` ${num}.`;
    else if (i === 0 || ej.jugadas[i - 1].comentario || ej.jugadas[i - 1].formas.length) cuerpo += ` ${num}...`;
    cuerpo += ` ${j.san}` + comentarioPgn(j.comentario, j.formas);
    if (turno === 'b') num++;
    turno = turno === 'w' ? 'b' : 'w';
  });
  return (pgn + cuerpo.trim() + ' *').trim();
}

export function dePgn(pgn) {
  pgn = pgn || '';
  const fenTag = pgn.match(/\[FEN\s+"([^"]+)"\]/);
  const ej = ejemploVacio(fenTag ? fenTag[1] : FEN_INICIAL);
  const cuerpo = pgn.replace(/\[[A-Za-z]+\s+"[^"]*"\]/g, ' ');
  const chess = new Chess(ej.fen0);
  let i = 0, nivel = 0;
  while (i < cuerpo.length) {
    const c = cuerpo[i];
    if (c === '{') {
      const fin = cuerpo.indexOf('}', i);
      const bruto = cuerpo.slice(i + 1, fin < 0 ? cuerpo.length : fin);
      i = fin < 0 ? cuerpo.length : fin + 1;
      if (nivel > 0) continue;
      const { formas, texto } = leerFormas(bruto);
      const destino = ej.jugadas.length ? ej.jugadas[ej.jugadas.length - 1] : null;
      if (destino) { destino.comentario = [destino.comentario, texto].filter(Boolean).join(' '); destino.formas.push(...formas); }
      else { ej.comentario0 = [ej.comentario0, texto].filter(Boolean).join(' '); ej.formas0.push(...formas); }
      continue;
    }
    if (c === '(') { nivel++; i++; continue; }
    if (c === ')') { nivel = Math.max(0, nivel - 1); i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    let fin = i;
    while (fin < cuerpo.length && !/[\s{}()]/.test(cuerpo[fin])) fin++;
    const tok = cuerpo.slice(i, fin);
    i = fin;
    if (nivel > 0) continue;
    const limpio = tok.replace(/^\d+\.+/, '').replace(/[!?]+$/, '');
    if (!limpio || /^\$\d+$/.test(limpio) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(limpio)) continue;
    let m = null;
    try { m = chess.move(limpio); } catch (e) {
      try { m = chess.move(deEspanol(limpio)); } catch (e2) { m = null; }   // ¿notación española?
    }
    if (!m) break;
    ej.jugadas.push({ san: m.san, uci: m.from + m.to + (m.promotion || ''), fen: chess.fen(), comentario: '', formas: [] });
  }
  return ej;
}

// ---------------------------------------------------------------------
//  Utilidades de posición
// ---------------------------------------------------------------------
function destinos(chess) {
  const d = new Map();
  for (const m of chess.moves({ verbose: true })) {
    if (!d.has(m.from)) d.set(m.from, []);
    d.get(m.from).push(m.to);
  }
  return d;
}
const colorDe = fen => (fen.split(' ')[1] === 'b' ? 'black' : 'white');
export const fenDe = (ej, ply) => (ply === 0 ? ej.fen0 : ej.jugadas[ply - 1].fen);
const formasDe = (ej, ply) => (ply === 0 ? ej.formas0 : ej.jugadas[ply - 1].formas);

function montar(el, config) {
  el.innerHTML = '<div class="cg-caja"></div>';
  const api = Chessground(el.firstChild, Object.assign({ coordinates: true, blockTouchScroll: true, animation: { duration: 180 } }, config));
  // Redibujar solo si el tamaño cambia de verdad (en píxeles enteros) y, como
  // mucho, una vez por fotograma. Sin esto, Safari puede entrar en un bucle:
  // redibujar mueve medio píxel, eso avisa de otro cambio, y vuelta a empezar.
  let ancho = Math.round(el.clientWidth), alto = Math.round(el.clientHeight), marco = 0;
  const ro = new ResizeObserver(() => {
    const w = Math.round(el.clientWidth), h = Math.round(el.clientHeight);
    if (w === ancho && h === alto) return;
    ancho = w; alto = h;
    cancelAnimationFrame(marco);
    marco = requestAnimationFrame(() => api.redrawAll());
  });
  ro.observe(el);
  return { api, cerrar: () => { cancelAnimationFrame(marco); ro.disconnect(); api.destroy(); } };
}

export function etiquetaJugada(ej, ply) {
  const fen = fenDe(ej, ply - 1);
  const p = fen.split(' ');
  return (p[1] === 'w' ? `${p[5]}.` : `${p[5]}…`) + ' ' + verSan(ej.jugadas[ply - 1].san);
}

function listaJugadas(ej, actual) {
  if (!ej.jugadas.length) return '';
  const p = ej.fen0.split(' ');
  let turno = p[1], num = parseInt(p[5], 10) || 1, html = '';
  ej.jugadas.forEach((j, i) => {
    if (turno === 'w') html += `<span class="jnum">${num}.</span>`;
    else if (i === 0) html += `<span class="jnum">${num}…</span>`;
    html += `<button class="jug${actual === i + 1 ? ' on' : ''}" data-ply="${i + 1}">${verSan(j.san)}</button>`;
    if (turno === 'b') num++;
    turno = turno === 'w' ? 'b' : 'w';
  });
  return html;
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------------------
//  VARIANTES: un PGN con variantes ⇄ varias líneas (cada línea, un camino
//  desde el principio). Así se guardan las líneas del repertorio y así se
//  intercambian con Lichess.
// ---------------------------------------------------------------------
// Lee un PGN con variantes y devuelve una línea (ejemplo) por cada rama
export function pgnARamas(pgn) {
  pgn = pgn || '';
  const fenTag = pgn.match(/\[FEN\s+"([^"]+)"\]/);
  const fen0 = fenTag ? fenTag[1] : FEN_INICIAL;
  const cuerpo = pgn.replace(/\[[A-Za-z]+\s+"[^"]*"\]/g, ' ');
  const raiz = { hijos: [], padre: null, comentario: '', formas: [] };
  const pila = [];
  let actual = raiz, ultimo = null, i = 0;
  while (i < cuerpo.length) {
    const c = cuerpo[i];
    if (c === '{') {
      const fin = cuerpo.indexOf('}', i);
      const { formas, texto } = leerFormas(cuerpo.slice(i + 1, fin < 0 ? cuerpo.length : fin));
      i = fin < 0 ? cuerpo.length : fin + 1;
      const destino = ultimo || actual;
      destino.comentario = [destino.comentario, texto].filter(Boolean).join(' ');
      destino.formas.push(...formas);
      continue;
    }
    if (c === '(') { pila.push({ actual, ultimo }); if (ultimo) actual = ultimo.padre; ultimo = null; i++; continue; }   // alternativa a la última jugada
    if (c === ')') { const e = pila.pop(); if (e) ({ actual, ultimo } = e); i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    let fin = i;
    while (fin < cuerpo.length && !/[\s{}()]/.test(cuerpo[fin])) fin++;
    const limpio = cuerpo.slice(i, fin).replace(/^\d+\.+/, '').replace(/[!?]+$/, '');
    i = fin;
    if (!limpio || /^\$\d+$/.test(limpio) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(limpio)) continue;
    const nodo = { san: limpio, hijos: [], padre: actual, comentario: '', formas: [] };
    actual.hijos.push(nodo);
    actual = nodo; ultimo = nodo;
  }
  const caminos = [];
  const recorrer = (n, camino) => { if (!n.hijos.length) { if (camino.length) caminos.push(camino); return; } n.hijos.forEach(h => recorrer(h, [...camino, h])); };
  recorrer(raiz, []);
  return caminos.map(camino => {
    const ej = ejemploVacio(fen0);
    ej.comentario0 = raiz.comentario; ej.formas0 = [...raiz.formas];
    const chess = new Chess(fen0);
    for (const n of camino) {
      let m = null;
      try { m = chess.move(n.san); } catch (e) { try { m = chess.move(deEspanol(n.san)); } catch (e2) { m = null; } }
      if (!m) break;
      ej.jugadas.push({ san: m.san, uci: m.from + m.to + (m.promotion || ''), fen: chess.fen(), comentario: n.comentario, formas: [...n.formas] });
    }
    return ej;
  }).filter(ej => ej.jugadas.length);
}

// Junta varias líneas en un PGN con variantes. La primera es la principal.
// lineas: [{ ej, nombre, nota }]; el nombre y la idea de cada línea van al final de su rama.
export function lineasAPgn(lineas, cabeceras = {}) {
  const fen0 = lineas[0]?.ej.fen0 || FEN_INICIAL;
  const raiz = { hijos: [] };
  for (const { ej, nombre, nota } of lineas) {
    let n = raiz;
    for (const j of ej.jugadas) {
      let h = n.hijos.find(x => x.san === j.san);
      if (!h) { h = { san: j.san, comentario: j.comentario || '', formas: j.formas || [], hijos: [], fin: [] }; n.hijos.push(h); }
      else if (!h.comentario && j.comentario) { h.comentario = j.comentario; h.formas = j.formas || []; }
      n = h;
    }
    const etiqueta = [nombre && `«${nombre}»`, nota].filter(Boolean).join(' — ');
    if (etiqueta && n !== raiz) n.fin.push(etiqueta);
  }
  const p = fen0.split(' ');
  const blancasPrimero = (p[1] || 'w') === 'w', num0 = parseInt(p[5] || '1', 10) || 1;
  const esBlanca = ply => (ply % 2 === 0) === blancasPrimero;
  const numero = ply => num0 + Math.floor((ply + (blancasPrimero ? 0 : 1)) / 2);
  const conNota = n => !!(n.comentario || n.fin.length || n.formas.length);
  const jugada = (n, ply, forzar) => (esBlanca(ply) ? ` ${numero(ply)}.` : forzar ? ` ${numero(ply)}...` : '') + ` ${n.san}` + comentarioPgn([n.comentario, ...n.fin].filter(Boolean).join(' '), n.formas);
  const escribir = (n, ply, forzar) => {
    if (!n.hijos.length) return '';
    const [principal, ...otras] = n.hijos;
    let t = jugada(principal, ply, forzar);
    for (const o of otras) t += ` (${(jugada(o, ply, true) + escribir(o, ply + 1, conNota(o))).trim()})`;
    return t + escribir(principal, ply + 1, otras.length > 0 || conNota(principal));
  };
  let cab = Object.entries(cabeceras).filter(([, v]) => v).map(([k, v]) => `[${k} "${String(v).replace(/"/g, "'")}"]`).join('\n');
  if (fen0 !== FEN_INICIAL) cab += `\n[SetUp "1"]\n[FEN "${fen0}"]`;
  return `${cab}\n\n${escribir(raiz, 0, true).trim()} *`;
}

// ---------------------------------------------------------------------
//  VISOR: ver un ejemplo y pasar las jugadas
// ---------------------------------------------------------------------
export function crearVisor(contenedor, ej, { orientacion = 'white', ply: plyInicial = 0, alMover = () => {} } = {}) {
  contenedor.innerHTML = `
    <div class="tablero"></div>
    <div class="nav-jug">
      <button data-ir="ini" aria-label="Inicio">⏮</button>
      <button data-ir="ant" aria-label="Anterior">◀</button>
      <span class="ply-txt"></span>
      <button data-ir="sig" aria-label="Siguiente">▶</button>
      <button data-ir="fin" aria-label="Final">⏭</button>
    </div>
    <div class="comentario-jug"></div>
    <div class="lista-jug"></div>`;
  let ply = Math.max(0, Math.min(plyInicial, ej.jugadas.length));
  const { api, cerrar } = montar(contenedor.querySelector('.tablero'), {
    viewOnly: true, orientation: orientacion, fen: ej.fen0,
  });
  function pintar() {
    const fen = fenDe(ej, ply);
    const j = ply ? ej.jugadas[ply - 1] : null;
    api.set({ fen, lastMove: j ? [j.uci.slice(0, 2), j.uci.slice(2, 4)] : undefined, check: new Chess(fen).inCheck() ? colorDe(fen) : false });
    api.setAutoShapes(formasDe(ej, ply));
    contenedor.querySelector('.ply-txt').textContent = ply ? etiquetaJugada(ej, ply) : (ej.jugadas.length ? 'Posición inicial' : '');
    const com = ply ? j.comentario : ej.comentario0;
    const cc = contenedor.querySelector('.comentario-jug');
    cc.textContent = com || '';
    cc.hidden = !com;
    const lj = contenedor.querySelector('.lista-jug');
    lj.innerHTML = listaJugadas(ej, ply);
    contenedor.querySelector('.nav-jug').hidden = !ej.jugadas.length;
    lj.querySelector('.jug.on')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    alMover(ply);
  }
  contenedor.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.ply) ply = +b.dataset.ply;
    const ir = b.dataset.ir;
    if (ir === 'ini') ply = 0;
    if (ir === 'ant') ply = Math.max(0, ply - 1);
    if (ir === 'sig') ply = Math.min(ej.jugadas.length, ply + 1);
    if (ir === 'fin') ply = ej.jugadas.length;
    pintar();
  });
  pintar();
  return { cerrar, ply: () => ply, ir(n) { ply = Math.max(0, Math.min(n, ej.jugadas.length)); pintar(); } };
}

// ---------------------------------------------------------------------
//  EDITOR: tres modos — Jugar, Dibujar y Posición
// ---------------------------------------------------------------------
const PIEZAS = ['K', 'Q', 'R', 'B', 'N', 'P'];
const ROL = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' };

function fenCompleto(fenTablero, turno) {
  const filas = fenTablero.split('/');
  const en = (fila, col) => {
    let c = 0;
    for (const ch of filas[8 - fila]) {
      if (/\d/.test(ch)) c += +ch; else { if (c === col) return ch; c++; }
    }
    return null;
  };
  let enroque = '';
  if (en(1, 4) === 'K') { if (en(1, 7) === 'R') enroque += 'K'; if (en(1, 0) === 'R') enroque += 'Q'; }
  if (en(8, 4) === 'k') { if (en(8, 7) === 'r') enroque += 'k'; if (en(8, 0) === 'r') enroque += 'q'; }
  return `${fenTablero} ${turno} ${enroque || '-'} - 0 1`;
}

export function validarFen(fen) {
  try { new Chess(fen); return null; } catch (e) { return e.message || 'Posición no válida'; }
}

export function crearEditor(contenedor, ej, { orientacion = 'white', alCambiar = () => {}, alPly = () => {}, pedirPromocion }) {
  contenedor.innerHTML = `
   <div class="ed-rejilla">
    <div class="ed-arriba">
    <div class="modos">
      <button data-modo="jugar" class="on">Jugar</button>
      <button data-modo="dibujar">Dibujar</button>
      <button data-modo="posicion">Posición</button>
    </div>
    <div class="herr herr-dibujar" hidden>
      <span class="pinceles">
        <button data-pincel="green" class="pincel g on" aria-label="Verde"></button>
        <button data-pincel="red" class="pincel r" aria-label="Rojo"></button>
        <button data-pincel="blue" class="pincel b" aria-label="Azul"></button>
        <button data-pincel="yellow" class="pincel y" aria-label="Amarillo"></button>
      </span>
      <button data-acc="deshacer" class="chip" aria-label="Deshacer el último dibujo" title="Deshacer">↶ Deshacer</button>
      <button data-acc="limpiar" class="chip">Borrar todo</button>
      <p class="ayuda">Toca la casilla de salida y la de llegada para una flecha; dos veces la misma casilla, para un círculo. Repetir una flecha o un círculo lo quita; ↶ deshace el último dibujo.</p>
    </div>
    <div class="herr herr-posicion" hidden>
      <div class="paleta cg-wrap"></div>
      <div class="fila-btn">
        <button data-acc="turno" class="chip"></button>
        <button data-acc="inicial" class="chip">Inicial</button>
        <button data-acc="vaciar" class="chip">Vaciar</button>
      </div>
      <p class="ayuda">Elige una pieza y toca casillas para colocarla. Con la goma, quitas. También puedes arrastrar las piezas.</p>
    </div>
    </div>
    <div class="ed-tablero"><div class="ed-tablero-in">
    <div class="tablero"></div>
    <div class="nav-jug">
      <button data-ir="ini" aria-label="Inicio">⏮</button>
      <button data-ir="ant" aria-label="Anterior">◀</button>
      <span class="ply-txt"></span>
      <button data-ir="sig" aria-label="Siguiente">▶</button>
      <button data-ir="fin" aria-label="Final">⏭</button>
      <button data-acc="girar" aria-label="Girar tablero">⟲</button>
    </div>
    </div></div>
    <div class="ed-abajo">
    <label class="campo-com">Comentario <small>(también es la pista en el repaso)</small>
      <textarea rows="2" class="com" placeholder="Idea, plan o explicación de la jugada"></textarea>
    </label>
    <div class="lista-jug"></div>
    <button data-acc="cortar" class="chip peligro" hidden>Borrar desde aquí</button>
    </div>
   </div>`;

  let modo = 'jugar', ply = ej.jugadas.length, pincel = 'green', origen = null;
  let herramienta = 'K', turnoPos = colorDe(ej.fen0) === 'white' ? 'w' : 'b';
  const $ = s => contenedor.querySelector(s);
  const { api, cerrar } = montar($('.tablero'), {
    orientation: orientacion, fen: ej.fen0,
    drawable: { enabled: true, eraseOnClick: false, onChange: formas => { if (formas.length) { formas.forEach(alternarForma); api.setShapes([]); refrescar(); } } },
    events: { select: tocar, change: () => { if (modo === 'posicion') alCambiar(ej); } },
  });

  // El tablero se ajusta para caber entero en la pantalla (móvil, iPad u ordenador)
  const caja = $('.ed-tablero'), interior = $('.ed-tablero-in');
  let pendiente = 0;
  function ajustar() {
    cancelAnimationFrame(pendiente);
    pendiente = requestAnimationFrame(() => {
      const alto = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const enfoque = document.body.classList.contains('enfoque');
      const barra = enfoque ? 0 : (document.querySelector('.barra')?.offsetHeight || 0);
      const arriba = caja.getBoundingClientRect().top + window.scrollY;
      const nav = $('.nav-jug').offsetHeight + 14;
      const lado = Math.floor(Math.max(240, Math.min(caja.clientWidth, alto - arriba - nav - barra - 10)));
      if (interior.style.width !== lado + 'px') interior.style.width = lado + 'px';
    });
  }
  window.addEventListener('resize', ajustar);
  window.visualViewport?.addEventListener('resize', ajustar);

  // Cada cambio de dibujo guarda cómo estaba antes, para poder deshacerlo
  const historial = [];
  const recordar = () => { historial.push({ p: ply, antes: formasDe(ej, ply).map(x => ({ ...x })) }); if (historial.length > 100) historial.shift(); };
  function deshacer() {
    while (historial.length) {
      const h = historial.pop();
      if (h.p > ej.jugadas.length) continue;   // esa jugada ya no existe
      const lista = formasDe(ej, h.p);
      lista.length = 0; lista.push(...h.antes);
      ply = h.p;
      alCambiar(ej);
      return;
    }
  }

  function alternarForma(f) {
    recordar();
    const lista = formasDe(ej, ply);
    const k = lista.findIndex(x => x.orig === f.orig && x.dest === f.dest);
    if (k >= 0 && lista[k].brush === f.brush) lista.splice(k, 1);
    else if (k >= 0) lista[k].brush = f.brush;
    else lista.push({ orig: f.orig, dest: f.dest, brush: f.brush });
    alCambiar(ej);
  }

  function tocar(casilla) {
    if (modo === 'dibujar') {
      if (!origen) { origen = casilla; refrescar(); return; }
      alternarForma(origen === casilla ? { orig: casilla, brush: pincel } : { orig: origen, dest: casilla, brush: pincel });
      origen = null;
      api.selectSquare(null);
      refrescar();
    } else if (modo === 'posicion' && herramienta) {
      const m = new Map();
      if (herramienta === 'X') m.set(casilla, undefined);
      else {
        const blanca = herramienta === herramienta.toUpperCase();
        m.set(casilla, { role: ROL[herramienta.toUpperCase()], color: blanca ? 'white' : 'black' });
      }
      api.setPieces(m);
      api.selectSquare(null);
      alCambiar(ej);
    }
  }

  async function mover(orig, dest) {
    const chess = new Chess(fenDe(ej, ply));
    const pieza = chess.get(orig);
    let promotion;
    if (pieza && pieza.type === 'p' && (dest[1] === '8' || dest[1] === '1')) {
      promotion = pedirPromocion ? await pedirPromocion(pieza.color === 'w' ? 'white' : 'black') : 'q';
      if (!promotion) { refrescar(); return; }
    }
    let m;
    try { m = chess.move({ from: orig, to: dest, promotion }); } catch (e) { refrescar(); return; }
    const sig = ej.jugadas[ply];
    if (sig && sig.san === m.san) { ply++; refrescar(); return; }
    ej.jugadas.splice(ply);
    ej.jugadas.push({ san: m.san, uci: m.from + m.to + (m.promotion || ''), fen: chess.fen(), comentario: '', formas: [] });
    ply++;
    alCambiar(ej);
    refrescar();
  }

  function refrescar() {
    const fen = fenDe(ej, ply);
    const j = ply ? ej.jugadas[ply - 1] : null;
    if (modo === 'posicion') {
      api.set({ movable: { free: true, color: 'both', showDests: false, events: {} }, draggable: { enabled: true, deleteOnDropOff: true }, lastMove: undefined, check: false });
      api.setAutoShapes([]);
    } else {
      const chess = new Chess(fen);
      const turn = colorDe(fen);
      api.set({
        fen, turnColor: turn, lastMove: j ? [j.uci.slice(0, 2), j.uci.slice(2, 4)] : undefined,
        check: chess.inCheck() ? turn : false,
        movable: modo === 'jugar'
          ? { free: false, color: turn, dests: destinos(chess), showDests: true, events: { after: mover } }
          : { free: false, color: undefined, dests: new Map() },
        draggable: { enabled: modo === 'jugar' },
      });
      const formas = formasDe(ej, ply).slice();
      if (origen) formas.push({ orig: origen, brush: 'paleGrey' });
      api.setAutoShapes(formas);
    }
    $('.ply-txt').textContent = ply ? etiquetaJugada(ej, ply) : 'Posición inicial';
    const com = $('.com');
    if (document.activeElement !== com) com.value = (ply ? j.comentario : ej.comentario0) || '';
    $('.campo-com').hidden = modo === 'posicion';
    $('.lista-jug').innerHTML = listaJugadas(ej, ply);
    $('.nav-jug').querySelectorAll('[data-ir]').forEach(b => (b.disabled = modo === 'posicion'));
    $('[data-acc="cortar"]').hidden = modo === 'posicion' || ply >= ej.jugadas.length;
    $('[data-acc="deshacer"]').disabled = !historial.length;
    alPly(ply);
    $('[data-acc="turno"]').textContent = turnoPos === 'w' ? 'Juegan blancas' : 'Juegan negras';
    contenedor.querySelectorAll('.modos button').forEach(b => b.classList.toggle('on', b.dataset.modo === modo));
    contenedor.querySelectorAll('.pincel').forEach(b => b.classList.toggle('on', b.dataset.pincel === pincel));
    $('.herr-dibujar').hidden = modo !== 'dibujar';
    $('.herr-posicion').hidden = modo !== 'posicion';
    pintarPaleta();
    ajustar();
  }

  function pintarPaleta() {
    const pal = $('.paleta');
    const piezas = [...PIEZAS, ...PIEZAS.map(p => p.toLowerCase())];
    pal.innerHTML = piezas.map(p =>
      `<button data-pieza="${p}" class="${herramienta === p ? 'on' : ''}" aria-label="${p}"><piece class="${ROL[p.toUpperCase()]} ${p === p.toUpperCase() ? 'white' : 'black'}"></piece></button>`
    ).join('') + `<button data-pieza="X" class="goma ${herramienta === 'X' ? 'on' : ''}" aria-label="Goma">✕</button>`;
  }

  function salirDePosicion() {
    const fen = fenCompleto(api.getFen(), turnoPos);
    const error = validarFen(fen);
    if (error) return 'La posición no es válida: revisa que haya un rey de cada color y que el bando que no mueve no esté en jaque.';
    ej.fen0 = fen;
    ej.jugadas = [];
    ply = 0;
    alCambiar(ej);
    return null;
  }

  contenedor.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.modo && b.dataset.modo !== modo) {
      if (b.dataset.modo === 'posicion' && ej.jugadas.length &&
          !confirm('Al cambiar la posición inicial se borrarán las jugadas de este ejemplo. ¿Seguir?')) return;
      if (modo === 'posicion') {
        const err = salirDePosicion();
        if (err) { alert(err); return; }
      }
      if (b.dataset.modo === 'posicion') { ply = 0; turnoPos = ej.fen0.split(' ')[1] === 'b' ? 'b' : 'w'; api.set({ fen: ej.fen0 }); }
      modo = b.dataset.modo; origen = null;
    }
    if (b.dataset.pincel) pincel = b.dataset.pincel;
    if (b.dataset.pieza) herramienta = herramienta === b.dataset.pieza ? null : b.dataset.pieza;
    if (b.dataset.ply) ply = +b.dataset.ply;
    const ir = b.dataset.ir;
    if (ir === 'ini') ply = 0;
    if (ir === 'ant') ply = Math.max(0, ply - 1);
    if (ir === 'sig') ply = Math.min(ej.jugadas.length, ply + 1);
    if (ir === 'fin') ply = ej.jugadas.length;
    const acc = b.dataset.acc;
    if (acc === 'girar') { orientacion = orientacion === 'white' ? 'black' : 'white'; api.set({ orientation: orientacion }); alCambiar(ej, orientacion); }
    if (acc === 'limpiar' && formasDe(ej, ply).length) { recordar(); formasDe(ej, ply).length = 0; alCambiar(ej); }
    if (acc === 'deshacer') deshacer();
    if (acc === 'turno') { turnoPos = turnoPos === 'w' ? 'b' : 'w'; }
    if (acc === 'inicial') { api.set({ fen: FEN_INICIAL }); turnoPos = 'w'; }
    if (acc === 'vaciar') { api.set({ fen: '8/8/8/8/8/8/8/8' }); }
    if (acc === 'cortar' && confirm('¿Borrar las jugadas que vienen después de esta posición?')) { ej.jugadas.splice(ply); alCambiar(ej); }
    refrescar();
  });

  $('.com').addEventListener('input', e => {
    if (ply) ej.jugadas[ply - 1].comentario = e.target.value; else ej.comentario0 = e.target.value;
    $('.lista-jug').innerHTML = listaJugadas(ej, ply);
    alCambiar(ej);
  });

  refrescar();
  return {
    cerrar: () => { window.removeEventListener('resize', ajustar); window.visualViewport?.removeEventListener('resize', ajustar); cerrar(); },
    ajustar,
    // Antes de guardar: si estás en «Posición», se valida y se fija.
    confirmar() { return modo === 'posicion' ? salirDePosicion() : null; },
    orientacion: () => orientacion,
    ply: () => ply,
  };
}

// Un ejemplo sirve de ejercicio si tiene al menos una jugada
export const sirveDeEjercicio = ej => ej.jugadas.length > 0;

// ---------------------------------------------------------------------
//  ENTRENAR UNA LÍNEA DEL REPERTORIO
//  La app juega las jugadas del rival; tú, las tuyas, de principio a fin.
//  Dos intentos por jugada: si no sale, se muestra la buena y se sigue.
//  alJugada({ ok, otraVez, perdida, ply })  ·  alTerminar({ errores, perdidas })
//  aprender: la primera vez, cada jugada tuya se enseña con una flecha y tu
//  comentario (alTurno), y solo tienes que repetirla; no cuenta como fallo.
//  fin: se para en esa jugada (para entrenar solo un trozo de la línea).
// ---------------------------------------------------------------------
export function crearEntrenoLinea(contenedor, ej, { color = 'white', inicio = 0, fin = Infinity, aprender = false, pedirPromocion, alJugada = () => {}, alRival = () => {}, alTurno = () => {}, alTerminar = () => {} } = {}) {
  contenedor.innerHTML = `<div class="tablero"></div>`;
  const turnoEn = ply => colorDe(fenDe(ej, ply));
  const ultima = Math.min(fin, ej.jugadas.length);   // hasta dónde se entrena
  let ply = Math.max(0, Math.min(inicio, ultima)), intentos = 0, errores = 0, perdidas = 0, terminado = false, espera = null;
  const { api, cerrar } = montar(contenedor.querySelector('.tablero'), {
    fen: fenDe(ej, ply), orientation: color, turnColor: turnoEn(ply),
    movable: { free: false, color: undefined, dests: new Map(), showDests: true, events: { after: mover } },
    draggable: { enabled: true }, drawable: { enabled: true, eraseOnClick: true },
  });
  const ponerPosicion = (formas = []) => {
    const fen = fenDe(ej, ply), j = ply ? ej.jugadas[ply - 1] : null;
    const chess = new Chess(fen), turno = colorDe(fen);
    const mio = ply < ultima && turno === color && !terminado;
    api.set({ fen, turnColor: turno, lastMove: j ? [j.uci.slice(0, 2), j.uci.slice(2, 4)] : undefined, check: chess.inCheck() ? turno : false,
      movable: { color: mio ? color : undefined, dests: mio ? destinos(chess) : new Map() } });
    api.setAutoShapes(formas);
  };
  const flechaBuena = () => { const s = ej.jugadas[ply]; return { orig: s.uci.slice(0, 2), dest: s.uci.slice(2, 4), brush: 'green' }; };
  function avanzar() {
    if (ply >= ultima) {
      terminado = true; ponerPosicion();
      alTerminar({ errores, perdidas });
      return;
    }
    if (turnoEn(ply) !== color) {        // juega el rival
      ponerPosicion();
      espera = setTimeout(() => { ply++; ponerPosicion(); alRival(etiquetaJugada(ej, ply)); avanzar(); }, 550);
      return;
    }
    intentos = 0;
    if (aprender) { ponerPosicion([flechaBuena()]); alTurno({ ply, comentario: ej.jugadas[ply].comentario || '' }); }
    else ponerPosicion();
  }
  async function mover(orig, dest) {
    if (terminado || ply >= ultima) return;
    const sol = ej.jugadas[ply];
    if (turnoEn(ply) !== color) return;
    const pieza = new Chess(fenDe(ej, ply)).get(orig);
    let promotion;
    if (pieza && pieza.type === 'p' && (dest[1] === '8' || dest[1] === '1'))
      promotion = sol.uci.length > 4 ? sol.uci[4] : (pedirPromocion ? await pedirPromocion(color) : 'q');
    intentos++;
    if (orig + dest + (promotion || '') === sol.uci || (!promotion && orig + dest === sol.uci.slice(0, 4))) {
      ply++;
      alJugada({ ok: true, ply });
      ponerPosicion(sol.formas || []);
      avanzar();
      return;
    }
    if (aprender) {   // aprendiendo no se falla: se vuelve a enseñar la flecha
      ponerPosicion([{ orig: dest, brush: 'red' }, flechaBuena()]);
      alJugada({ ok: false, otraVez: true, ply, aprender: true });
      return;
    }
    errores++;
    if (intentos < 2) {
      ponerPosicion([{ orig: dest, brush: 'red' }]);
      alJugada({ ok: false, otraVez: true, ply });
      return;
    }
    ensenar();
  }
  // Segundo fallo o «No lo sé»: se enseña la jugada buena y se continúa
  function ensenar() {
    const sol = ej.jugadas[ply];
    perdidas++;
    ply++;
    ponerPosicion([{ orig: sol.uci.slice(0, 2), dest: sol.uci.slice(2, 4), brush: 'green' }]);
    alJugada({ ok: false, perdida: true, ply, jugada: etiquetaJugada(ej, ply) });
    espera = setTimeout(avanzar, 1200);
  }
  // La pista es texto: tu comentario de esa jugada o de la anterior del rival; nunca la jugada.
  function pista() {
    if (terminado || ply >= ultima) return null;
    const propio = (ej.jugadas[ply].comentario || '').trim();
    const previo = ply ? (ej.jugadas[ply - 1].comentario || '').trim() : (ej.comentario0 || '').trim();
    return propio || previo || null;
  }
  avanzar();
  return {
    cerrar: () => { clearTimeout(espera); cerrar(); },
    pista,
    ply: () => ply,
    total: () => ultima,
    noLoSe() {
      if (terminado || aprender || ply >= ultima || turnoEn(ply) !== color) return;
      errores++;
      ensenar();
    },
  };
}

// ---------------------------------------------------------------------
//  Diagrama fijo (para imprimir): casillas, piezas de Lichess y flechas
// ---------------------------------------------------------------------
const ROLES = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };
const COLOR_FLECHA = { green: '#15781b', red: '#882020', blue: '#003088', yellow: '#e68f00' };
export function diagrama(ej, { orientacion = 'white', ply = 0 } = {}) {
  const fen = fenDe(ej, ply);
  const filas = fen.split(' ')[0].split('/').map(f => f.replace(/\d/g, n => '.'.repeat(+n)));
  const blancas = orientacion === 'white';
  let celdas = '';
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const ch = filas[blancas ? r : 7 - r][blancas ? c : 7 - c];
    const pieza = ch && ch !== '.' ? `<piece class="${ROLES[ch.toLowerCase()]} ${ch === ch.toUpperCase() ? 'white' : 'black'}"></piece>` : '';
    celdas += `<i class="${(r + c) % 2 ? 'os' : 'cl'}">${pieza}</i>`;
  }
  const centro = k => {
    const f = k.charCodeAt(0) - 97, n = +k[1];
    return [(blancas ? f : 7 - f) + 0.5, (blancas ? 8 - n : n - 1) + 0.5];
  };
  let svg = '';
  for (const f of formasDe(ej, ply)) {
    const color = COLOR_FLECHA[f.brush] || COLOR_FLECHA.green;
    const [x1, y1] = centro(f.orig);
    if (!f.dest) { svg += `<circle cx="${x1}" cy="${y1}" r="0.44" fill="none" stroke="${color}" stroke-width="0.08" opacity=".85"/>`; continue; }
    const [x2, y2] = centro(f.dest);
    const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d;
    const xf = x2 - ux * 0.32, yf = y2 - uy * 0.32;
    svg += `<line x1="${x1}" y1="${y1}" x2="${xf}" y2="${yf}" stroke="${color}" stroke-width="0.16" stroke-linecap="round" opacity=".8"/>` +
      `<polygon points="${x2},${y2} ${xf - uy * 0.22},${yf + ux * 0.22} ${xf + uy * 0.22},${yf - ux * 0.22}" fill="${color}" opacity=".8"/>`;
  }
  return `<div class="diagrama cg-wrap"><div class="dg-casillas">${celdas}</div><svg viewBox="0 0 8 8" class="dg-flechas">${svg}</svg></div>`;
}

// Jugadas en notación, con sus comentarios (para imprimir o exportar)
export function textoJugadas(ej) {
  if (!ej.jugadas.length) return '';
  const p = ej.fen0.split(' ');
  let turno = p[1], num = parseInt(p[5], 10) || 1, html = '';
  ej.jugadas.forEach((j, i) => {
    if (turno === 'w') html += `<b>${num}.</b>`;
    else if (i === 0 || ej.jugadas[i - 1].comentario) html += `<b>${num}…</b>`;
    html += `${esc(verSan(j.san))} `;
    if (j.comentario) html += `<i>${esc(j.comentario)}</i> `;
    if (turno === 'b') num++;
    turno = turno === 'w' ? 'b' : 'w';
  });
  return html.trim();
}

export { esc as escapar };
