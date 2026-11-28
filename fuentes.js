// =====================================================================
//  MdP · fuentes.js — de dónde sale cada comentario
//  En los comentarios de las líneas se pueden poner tres etiquetas:
//    [Basado en C21, cap. 1]   → idea sacada de un libro de tu bibliografía
//    [Síntesis] o [Síntesis: C21, S21] → idea que reúne varios libros
//    [Recreado]                → explicación propia, sin un libro concreto
//  La app las enseña como pastillas; al tocarlas se abre la ficha del libro.
//  El código (C21) es el que pones a cada libro en «Libros».
// =====================================================================
import * as D from './datos.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Lee una etiqueta «[…]» y dice qué es; null si no es de fuentes
export function leerEtiqueta(dentro) {
  const t = String(dentro || '').trim();
  let m = t.match(/^basad[oa] en\s+([^\s,;]+)\s*(?:[,;]\s*(.+))?$/i);
  if (m) return { tipo: 'libro', codigo: m[1], detalle: (m[2] || '').trim() };
  m = t.match(/^s[íi]ntesis(?:\s*(?:[:\-–(]|de)\s*(.*?)\)?)?$/i);
  if (m) return { tipo: 'sintesis', codigos: (m[1] || '').split(/\s*(?:,|;|\by\b)\s*/).map(x => x.trim()).filter(Boolean) };
  if (/^recread[oa]$/i.test(t)) return { tipo: 'recreado' };
  return null;
}
const RE = /\[([^[\]]{1,120})\]/g;

export const libros = () => D.lista('libros').sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), 'es'));
export const libroPorCodigo = c => D.lista('libros').find(l => norm(l.codigo) === norm(c)) || null;
// «Fabiano Caruana» → Caruana · «Caruana, Fabiano» → Caruana
export function apellido(l) {
  const a = String(l?.autor || '').split(/\s*(?:;|\by\b|&)\s*/)[0].trim();
  if (!a) return l?.codigo || '';
  return a.includes(',') ? a.split(',')[0].trim() : a.split(/\s+/).pop();
}
export const refLibro = l => [l.autor, l.titulo && `«${l.titulo}»`, l.editorial, l.anio].filter(Boolean).join(', ');

function pastilla(e) {
  if (e.tipo === 'libro') {
    const l = libroPorCodigo(e.codigo);
    const nombre = l ? apellido(l) : e.codigo;
    return `<button type="button" class="fuente libro${l ? '' : ' sin'}" data-fuente="libro" data-codigo="${esc(e.codigo)}" data-detalle="${esc(e.detalle)}">📖 ${esc(nombre)}${e.detalle ? ' · ' + esc(e.detalle) : ''}</button>`;
  }
  if (e.tipo === 'sintesis') {
    const nombres = e.codigos.map(c => { const l = libroPorCodigo(c); return l ? apellido(l) : c; });
    return `<button type="button" class="fuente sintesis" data-fuente="sintesis" data-codigos="${esc(e.codigos.join(','))}">📚 Síntesis${nombres.length ? ' · ' + esc(nombres.join(', ')) : ' de varios libros'}</button>`;
  }
  return `<button type="button" class="fuente recreado" data-fuente="recreado">✎ Recreado</button>`;
}

// Texto de un comentario, ya escapado, con las etiquetas convertidas en pastillas
export function conFuentes(texto) {
  const s = String(texto || '');
  let html = '', desde = 0;
  for (const m of s.matchAll(RE)) {
    const e = leerEtiqueta(m[1]);
    if (!e) continue;
    html += esc(s.slice(desde, m.index)) + pastilla(e);
    desde = m.index + m[0].length;
  }
  return html + esc(s.slice(desde));
}

// Todas las citas de un texto: [{ tipo, codigo, detalle } | { tipo:'sintesis', codigos }]
export function citas(texto) {
  return [...String(texto || '').matchAll(RE)].map(m => leerEtiqueta(m[1])).filter(Boolean);
}
// ¿Este texto cita este libro (directamente o dentro de una síntesis)?
export function cita(texto, codigo) {
  return citas(texto).some(e => (e.tipo === 'libro' && norm(e.codigo) === norm(codigo)) || (e.tipo === 'sintesis' && e.codigos.some(c => norm(c) === norm(codigo))));
}

// Lo mismo sobre un texto que ya es HTML escapado (las fichas con negrita, listas…)
const desesc = s => s.replace(/&(amp|lt|gt|quot|#39);/g, (m, k) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[k]));
export const pastillasEn = html => String(html || '').replace(RE, (m, dentro) => { const e = leerEtiqueta(desesc(dentro)); return e ? pastilla(e) : m; });

// ---------------------------------------------------------------------
//  Índice de un libro a partir de su texto
//  Busca encabezados al principio de línea: Chapter / Capítulo / Part / Parte /
//  Game / Partida + número (1, 2… o I, II…). Si el libro trae su propio índice
//  al principio («Chapter 1 … 11», con la página), de ahí saca los títulos
//  y el sitio de verdad es la primera vez que el encabezado aparece después.
//  Devuelve [{ t: título, n: número, k: tipo, i: dónde empieza (carácter) }].
// ---------------------------------------------------------------------
const TIPOS_CAP = { chapter: 'cap', capitulo: 'cap', 'capítulo': 'cap', part: 'parte', parte: 'parte', game: 'partida', partida: 'partida' };
const RE_CAB = /^[ \t]*(chapter|cap[ií]tulo|part|parte|game|partida)[ \t]+(\d{1,3}|[IVXLC]{1,6})\b[ \t]*[.:–—-]?[ \t]*(.*)$/gim;
export function detectarIndice(texto) {
  const s = String(texto || '');
  const cands = [];
  for (const m of s.matchAll(RE_CAB)) {
    const resto = m[3].trim();
    if (resto.length > 140 || /^[a-záéíóú(]/.test(resto) && !/^[ivxlc]+\b/i.test(resto) && resto.split(' ').length > 3 && !/[–—:]/.test(resto)) continue;   // frase del texto, no un título
    const k = TIPOS_CAP[m[1].toLowerCase()] || 'cap';
    cands.push({ k, n: m[2].toUpperCase(), i: m.index, resto, pagina: /\s\d{1,3}$/.test(resto) });
  }
  // índice del propio libro: entradas con número de página al principio, o encabezados
  // muy seguidos (4 o más con menos de 300 caracteres entre uno y otro)
  const enRacha = new Set();
  for (let a = 0; a < cands.length;) {
    let z = a;
    while (z + 1 < cands.length && cands[z + 1].i - cands[z].i < 300) z++;
    if (z - a + 1 >= 4) for (let k = a; k <= z; k++) enRacha.add(cands[k]);
    a = z + 1;
  }
  const enIndice = c => enRacha.has(c) || (c.pagina && c.i < s.length * 0.1);
  const titulos = new Map();
  for (const c of cands) if (enIndice(c)) titulos.set(c.k + c.n, c.resto.replace(/\s+\d{1,3}$/, ''));
  const vistos = new Set(), r = [];
  for (const c of cands) {
    if (enIndice(c) || vistos.has(c.k + c.n)) continue;
    vistos.add(c.k + c.n);
    let titulo = titulos.get(c.k + c.n) || c.resto;
    if (!titulo) {   // «Game 1» solo: el título va en la línea siguiente (los jugadores)
      const sig = s.slice(c.i).split('\n').slice(1).find(l => l.trim());
      titulo = (sig || '').trim().slice(0, 100);
    }
    const nombre = { cap: 'Capítulo', parte: 'Parte', partida: 'Partida' }[c.k];
    r.push({ t: `${nombre} ${c.n}${titulo ? ' · ' + titulo : ''}`, n: c.n, k: c.k, i: c.i });
  }
  r.sort((a, b) => a.i - b.i);
  if (r.length && r[0].i > 3000) r.unshift({ t: 'Presentación', n: '', k: 'intro', i: 0 });
  return r.length >= 2 ? r : [];
}
// Trozo de texto de la entrada k del índice (hasta la siguiente del mismo nivel o más alta)
export function textoCapitulo(texto, indice, k) {
  const e = indice[k];
  if (!e) return '';
  const nivel = x => (x.k === 'parte' ? 0 : 1);
  const fin = indice.slice(k + 1).find(x => nivel(x) <= nivel(e));
  return String(texto).slice(e.i, fin ? fin.i : undefined).trim();
}
// ¿Qué entrada del índice corresponde a «cap. 7», «capítulo 7», «game 12»…?
export function entradaCitada(indice, detalle) {
  const m = String(detalle || '').match(/(cap[íi]?t?u?l?o?\.?|ch(?:apter)?\.?|parte?|part|game|partida)\s*(\d{1,3}|[IVXLC]{1,6})/i);
  if (!m || !indice?.length) return -1;
  const k = /^(cap|ch)/i.test(m[1]) ? 'cap' : /^part/i.test(m[1]) && !/partida/i.test(m[1]) ? 'parte' : 'partida';
  return indice.findIndex(e => e.k === k && e.n === m[2].toUpperCase());
}
