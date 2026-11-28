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

// Para entrenar una apertura entera: primero lo que peor llevas
// (fallado, regular, sin estrenar y, al final, lo que sale bien), y dentro, lo que antes toca.
const PRIORIDAD = { mal: 0, regular: 1, undefined: 2, null: 2, bien: 3 };
export function ordenarParaEntrenar(tarjetas) {
  return [...tarjetas].sort((a, b) => (PRIORIDAD[a.ultimo_resultado] ?? 2) - (PRIORIDAD[b.ultimo_resultado] ?? 2)
    || String(a.proxima || '').localeCompare(String(b.proxima || '')));
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

// =====================================================================
//  TANDAS (v5.6): Repasar 10 = 2 nuevas + 4 falladas + 4 de consolidación
//                 Repasar 5  = 1 nueva  + 2 falladas + 2 de consolidación
//                 Explorar   = 3 inéditas
//  · Nueva = nunca se te ha presentado. Deja de serlo al mostrarse
//    (datos.descubiertaEn), aciertes, falles o salgas a medias.
//  · Falladas: su último resultado fue «mal». Vuelven pronto, en la tanda
//    siguiente, aunque aún no «toquen» (nunca dentro de la misma tanda).
//  · Consolidación: las que tocan hoy (las más atrasadas antes). Si faltan,
//    se adelantan las que antes tocarían. Si aun así faltan, la tanda es
//    más corta (y la app lo dice); nunca se repite una tarjeta.
//  · Variedad: se reparte entre aperturas y fichas, y no se repite lo de
//    la tanda anterior salvo lo fallado.
// =====================================================================
export const esNueva = t => !t.ultimo_resultado && !t.datos?.descubiertaEn && !t.datos?.aprendida;

// Estado de aprendizaje de una tarjeta (historial = sus resultados, del más antiguo al más reciente)
//   nueva · descubierta · aprendiendo · consolidada
// Consolidada: 3 aciertos seguidos (un «regular» por pista cuenta) e intervalo de 21 días o más
export const DIAS_CONSOLIDADA = 21;
export function estadoTarjeta(t, historial = []) {
  if (esNueva(t)) return 'nueva';
  if (!t.ultimo_resultado) return 'descubierta';
  let seguidos = 0;
  for (let i = historial.length - 1; i >= 0 && historial[i] !== 'mal'; i--) seguidos++;
  return seguidos >= 3 && (t.intervalo_dias || 0) >= DIAS_CONSOLIDADA ? 'consolidada' : 'aprendiendo';
}

const barajar = (l, azar) => l.map(x => [azar(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
// Toma m de la lista respetando su orden de prioridad pero repartiendo entre grupos
function repartir(lista, m, grupo) {
  const porGrupo = new Map();
  for (const t of lista) { const g = grupo(t); if (!porGrupo.has(g)) porGrupo.set(g, []); porGrupo.get(g).push(t); }
  const colas = [...porGrupo.values()], r = [];
  while (r.length < m && colas.some(c => c.length)) for (const c of colas) { if (c.length && r.length < m) r.push(c.shift()); }
  return r;
}
// Intercala dos listas y coloca las nuevas repartidas (nunca la primera)
function intercalar(a, b, nuevas, grupo) {
  const r = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i]) r.push(a[i]); if (b[i]) r.push(b[i]); }
  const total = r.length + nuevas.length;
  nuevas.forEach((t, k) => r.splice(Math.min(r.length, Math.max(1, Math.round((k + 1) * total / (nuevas.length + 1)) - 1)), 0, t));
  for (let i = 1; i < r.length; i++) {   // evita dos seguidas del mismo tema si se puede
    if (grupo(r[i]) !== grupo(r[i - 1])) continue;
    const j = r.findIndex((x, k) => k > i && grupo(x) !== grupo(r[i - 1]));
    if (j > 0) [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function seleccionarTanda(tarjetas, n, { hoy = hoyISO(), azar = Math.random, grupo = t => t.tipo, recientes = new Set() } = {}) {
  const vivas = tarjetas.filter(t => !t.borrado_en);
  const kNuevas = Math.max(1, Math.round(n / 5));          // 10 → 2 · 5 → 1
  const nKFall = Math.floor((n - kNuevas) / 2);            // 10 → 4 · 5 → 2
  const nuevasDisp = barajar(vivas.filter(esNueva), azar);
  const vistas = vivas.filter(t => !esNueva(t));
  const porFecha = (a, b) => String(a.proxima || hoy).localeCompare(String(b.proxima || hoy)) || azar() - 0.5;
  const falladas = barajar(vistas.filter(t => t.ultimo_resultado === 'mal'), azar).sort(porFecha);
  const tocan = vistas.filter(t => t.ultimo_resultado !== 'mal' && (t.proxima || hoy) <= hoy);
  const consolidar = [...barajar(tocan.filter(t => !recientes.has(t.id)), azar).sort(porFecha), ...tocan.filter(t => recientes.has(t.id))];
  const nuevas = repartir(nuevasDisp, kNuevas, grupo);
  const resto = n - nuevas.length;
  let F = repartir(falladas, Math.min(nKFall, resto), grupo);
  let C = repartir(consolidar, resto - F.length, grupo);
  if (F.length + C.length < resto) F = F.concat(repartir(falladas.filter(t => !F.includes(t)), resto - F.length - C.length, grupo));
  if (F.length + C.length < resto) {   // adelantar: las que antes tocarían
    const usadas = new Set([...F, ...C]);
    const adelantar = vistas.filter(t => !usadas.has(t)).sort((a, b) => (recientes.has(a.id) - recientes.has(b.id)) || porFecha(a, b));
    C = C.concat(repartir(adelantar, resto - F.length - C.length, grupo));
  }
  return { sesion: intercalar(F, C, nuevas, grupo), nuevas: nuevas.length, faltanNuevas: kNuevas - nuevas.length };
}

export function seleccionarExplorar(tarjetas, n = 3, { azar = Math.random, grupo = t => t.tipo } = {}) {
  const nuevas = barajar(tarjetas.filter(t => !t.borrado_en && esNueva(t)), azar);
  // primero variedad de áreas (líneas, fichas y ejemplos, partidas) y, dentro, de temas
  const porArea = repartir(nuevas, nuevas.length, t => t.tipo === 'linea' ? 'linea' : t.tipo === 'momento' ? 'momento' : 'concepto');
  const elegidas = [], temas = new Set();
  for (const t of porArea) if (elegidas.length < n && !temas.has(grupo(t))) { elegidas.push(t); temas.add(grupo(t)); }
  for (const t of porArea) if (elegidas.length < n && !elegidas.includes(t)) elegidas.push(t);
  return { sesion: elegidas, quedan: nuevas.length };
}
