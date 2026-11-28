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
