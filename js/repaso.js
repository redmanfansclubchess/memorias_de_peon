// =====================================================================
//  MdP · repaso.js — repetición espaciada (como Anki o Chessable)
//  Solo lógica, sin pantallas: qué tarjetas tocan hoy, cuándo vuelve
//  cada una según el resultado, la racha de días y la nota de la sesión.
//  Resultados: 'bien' · 'regular' (o se usó una pista) · 'mal'
// =====================================================================

export const SESION_NORMAL = 10;
export const SESION_RAPIDA = 5;
const MAX_INTERVALO = 180;   // días

// Fecha local en formato AAAA-MM-DD
export function hoyISO(d = new Date()) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
export function sumarDias(iso, n) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return hoyISO(d);
}

// Tras responder una tarjeta: cuándo vuelve y cómo cambia su «facilidad».
export function planificar(tarjeta, resultado, hoy = hoyISO()) {
  const t = Object.assign({ facilidad: 2.5, intervalo_dias: 0, repeticiones: 0, aciertos: 0, fallos: 0 }, tarjeta);
  if (resultado === 'bien') {
    t.repeticiones += 1;
    t.intervalo_dias = t.repeticiones === 1 ? 1 : t.repeticiones === 2 ? 3 : Math.round(Math.max(t.intervalo_dias, 1) * t.facilidad);
    t.facilidad = Math.min(3, t.facilidad + 0.1);
    t.aciertos += 1;
  } else if (resultado === 'regular') {
    t.repeticiones = Math.max(1, t.repeticiones);
    t.intervalo_dias = Math.max(1, Math.round(t.intervalo_dias * 1.2));
    t.facilidad = Math.max(1.3, t.facilidad - 0.15);
    t.aciertos += 1;
  } else {
    t.repeticiones = 0;
    t.intervalo_dias = 1;                       // vuelve mañana
    t.facilidad = Math.max(1.3, t.facilidad - 0.2);
    t.fallos += 1;
  }
  t.intervalo_dias = Math.min(t.intervalo_dias, MAX_INTERVALO);
  t.proxima = sumarDias(hoy, t.intervalo_dias);
  t.ultimo_resultado = resultado;
  t.facilidad = Math.round(t.facilidad * 100) / 100;
  return t;
}

// Tarjetas que tocan hoy: primero las ya vistas que vencen (las más
// atrasadas antes), después las nuevas. Dentro de cada grupo, algo de mezcla.
export function pendientes(tarjetas, hoy = hoyISO()) {
  return tarjetas.filter(t => !t.borrado_en && (t.proxima || hoy) <= hoy);
}
export function seleccionar(tarjetas, n, hoy = hoyISO(), azar = Math.random) {
  const toca = pendientes(tarjetas, hoy);
  const vistas = toca.filter(t => t.ultimo_resultado).sort((a, b) => (a.proxima || '').localeCompare(b.proxima || '') || azar() - 0.5);
  const nuevas = toca.filter(t => !t.ultimo_resultado).sort(() => azar() - 0.5);
  return [...vistas, ...nuevas].slice(0, n);
}

// Nota sobre 10: bien = 1, regular = 0,5, mal = 0
export function nota(resultados) {
  if (!resultados.length) return 0;
  const p = resultados.reduce((s, r) => s + (r === 'bien' ? 1 : r === 'regular' ? 0.5 : 0), 0);
  return Math.round((p / resultados.length) * 100) / 10;
}

// Días seguidos repasando (cuenta hoy o, si aún no has repasado hoy, desde ayer)
export function racha(fechas, hoy = hoyISO()) {
  const dias = new Set(fechas);
  let d = dias.has(hoy) ? hoy : sumarDias(hoy, -1);
  let n = 0;
  while (dias.has(d)) { n++; d = sumarDias(d, -1); }
  return n;
}

// Estado de una ficha según sus tarjetas: domino · repasar · fallo · nuevo
export function estadoDe(tarjetas) {
  const vistas = tarjetas.filter(t => !t.borrado_en && t.ultimo_resultado);
  if (!vistas.length) return 'nuevo';
  if (vistas.some(t => t.ultimo_resultado === 'mal')) return 'fallo';
  if (vistas.length === tarjetas.filter(t => !t.borrado_en).length &&
      vistas.every(t => t.ultimo_resultado === 'bien' && t.repeticiones >= 3)) return 'domino';
  return 'repasar';
}

// En la base de datos el «regular» se guarda como 'dudoso'
export const resultadoBD = r => (r === 'regular' ? 'dudoso' : r);
