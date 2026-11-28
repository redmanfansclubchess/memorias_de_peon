// =====================================================================
//  MdP · Memorias de Peón · partidas.js — mis partidas (fase 4)
//  Lógica pura, sin pantallas: leer PGN y partidas de Lichess, detectar
//  dónde te saliste de tu repertorio, la guía de revisión y el resumen.
//  by Manuel Esteve
// =====================================================================

// ---------------------------------------------------------------------
//  Leer PGN (una o varias partidas)
// ---------------------------------------------------------------------
export function separarPgn(texto) {
  // Empieza una partida nueva cuando aparece una cabecera «[…]» después de jugadas
  const partidas = [];
  let actual = null, enCuerpo = false;
  for (const l of String(texto || '').replace(/\r/g, '').split('\n')) {
    const esCab = /^\s*\[\w+\s+"/.test(l);
    if (!actual || (esCab && enCuerpo)) { actual = []; partidas.push(actual); enCuerpo = false; }
    if (!esCab && l.trim()) enCuerpo = true;
    actual.push(l);
  }
  return partidas.map(x => leerUna(x.join('\n'))).filter(p => p.cuerpo && p.cuerpo !== '*');
}

function leerUna(texto) {
  const cab = {};
  for (const m of texto.matchAll(/\[(\w+)\s+"([^"]*)"\]/g)) cab[m[1]] = m[2];
  const cuerpo = limpiarCuerpo(texto.replace(/\[(\w+)\s+"[^"]*"\]/g, ''));
  return { cab, cuerpo };
}

// Quita relojes, evaluaciones y comentarios que quedan vacíos
export function limpiarCuerpo(t) {
  return String(t || '')
    .replace(/\[%(clk|eval|emt)[^\]]*\]/g, '')
    .replace(/\{\s*\}/g, '')
    .replace(/([^\s{}()])\s*\$([1-6])(?!\d)/g, (m, c, n) => c + ['', '!', '?', '!!', '??', '!?', '?!'][n])   // valoraciones $1–$6 → !, ?, !!, ??…
    .replace(/\$\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const idDeLichess = texto => {
  const m = String(texto || '').match(/lichess\.org\/([A-Za-z0-9]{8})(?:[A-Za-z0-9]{4})?\b/);
  return m ? m[1] : null;
};

// Ritmo según el control de tiempo (mismos cortes que Lichess)
export function ritmoDe(tc) {
  if (!tc || tc === '-') return 'correspondencia';
  const [base, inc] = tc.split('+').map(Number);
  const t = (base || 0) + 40 * (inc || 0);
  return t < 180 ? 'bala' : t < 480 ? 'blitz' : t < 1500 ? 'rápida' : 'clásica';
}
const RITMO_LICHESS = { ultraBullet: 'bala', bullet: 'bala', blitz: 'blitz', rapid: 'rápida', classical: 'clásica', correspondence: 'correspondencia' };

// De cabeceras PGN a fila de «partidas». «yo» = tu usuario de Lichess.
export function filaDePgn({ cab, cuerpo }, yo) {
  const w = cab.White || '', b = cab.Black || '';
  const n = (yo || '').toLowerCase();
  const color = n && w.toLowerCase() === n ? 'white' : n && b.toLowerCase() === n ? 'black' : null;
  const fecha = (cab.UTCDate || cab.Date || '').replace(/\./g, '-');
  return {
    origen: idDeLichess(cab.Site) ? 'lichess' : 'otro',
    lichess_id: idDeLichess(cab.Site),
    pgn: cuerpo,
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : null,
    color,
    rival: color === 'white' ? b : color === 'black' ? w : null,
    blancas: w, negras: b,
    resultado: ['1-0', '0-1', '1/2-1/2'].includes(cab.Result) ? cab.Result : null,
    apertura: cab.Opening || null,
    ritmo: ritmoDe(cab.TimeControl),
    elo_propio: color === 'white' ? +cab.WhiteElo || null : color === 'black' ? +cab.BlackElo || null : null,
    elo_rival: color === 'white' ? +cab.BlackElo || null : color === 'black' ? +cab.WhiteElo || null : null,
  };
}

// De una partida de la API de Lichess (ndjson) a fila de «partidas»
export function filaDeLichess(g, yo) {
  const n = (yo || '').toLowerCase();
  const nombre = c => g.players?.[c]?.user?.name || (g.players?.[c]?.aiLevel ? `Stockfish nivel ${g.players[c].aiLevel}` : 'Anónimo');
  const color = nombre('white').toLowerCase() === n ? 'white' : nombre('black').toLowerCase() === n ? 'black' : null;
  const rival = color ? nombre(color === 'white' ? 'black' : 'white') : null;
  const pgn = g.pgn ? leerUna(g.pgn).cuerpo : jugadasAPgn(g.moves);
  return {
    origen: 'lichess', lichess_id: g.id, pgn,
    fecha: g.createdAt ? new Date(g.createdAt).toISOString().slice(0, 10) : null,
    color, rival,
    resultado: g.winner === 'white' ? '1-0' : g.winner === 'black' ? '0-1' : ['draw', 'stalemate'].includes(g.status) ? '1/2-1/2' : null,
    apertura: g.opening?.name || null,
    ritmo: RITMO_LICHESS[g.speed] || null,
    elo_propio: color ? g.players[color]?.rating || null : null,
    elo_rival: color ? g.players[color === 'white' ? 'black' : 'white']?.rating || null : null,
    rated: !!g.rated,
    jugadas: (g.moves || '').split(' ').filter(Boolean).length,
  };
}
const jugadasAPgn = moves => (moves || '').split(' ').filter(Boolean).map((m, i) => (i % 2 ? m : `${i / 2 + 1}. ${m}`)).join(' ') + ' *';

// Resultado desde tu lado
export function miResultado(p) {
  if (!p.resultado || !p.color) return null;
  if (p.resultado === '1/2-1/2') return 'tablas';
  return (p.resultado === '1-0') === (p.color === 'white') ? 'victoria' : 'derrota';
}
export const TEXTO_RESULTADO = { victoria: 'Victoria', derrota: 'Derrota', tablas: 'Tablas' };

// ---------------------------------------------------------------------
//  Tu repertorio en esta partida: ¿quién se salió y dónde?
// ---------------------------------------------------------------------
const etiqueta = (sanes, i, ver) => `${Math.floor(i / 2) + 1}.${i % 2 ? '..' : ''} ${ver(sanes[i])}`;
function prefijo(a, b) { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; }

//  aperturas: tus aperturas; leer: PGN → ejemplo; ver: formato de jugada
export function enRepertorio(sanes, color, aperturas, leer, ver = s => s) {
  if (!color) return { estado: 'sin-color', texto: 'Indica con qué color jugaste para compararla con tu repertorio.' };
  const mias = aperturas.filter(a => a.color === color).map(a => {
    const tronco = (leer(a.tronco)?.jugadas || []).map(j => j.san);
    const lineas = (a.lineas || []).map(l => ({ l, s: (leer(l.pgn)?.jugadas || []).map(j => j.san) })).filter(x => x.s.length);
    return { a, tronco, lineas };
  });
  if (!mias.length) return { estado: 'sin-repertorio', texto: `Aún no tienes aperturas con ${color === 'white' ? 'blancas' : 'negras'} en tu repertorio.` };
  // La apertura cuyo tronco coincide (la más concreta) o, si no, la que más se parece
  const conTronco = mias.filter(m => m.tronco.length && prefijo(sanes, m.tronco) === m.tronco.length).sort((x, y) => y.tronco.length - x.tronco.length);
  const m = conTronco[0];
  if (!m) {
    // ¿Se salió alguien antes de llegar a tu apertura?
    let mejor = null;
    for (const x of mias) { const k = prefijo(sanes, x.tronco); if (x.tronco.length && (!mejor || k > mejor.k)) mejor = { x, k }; }
    if (mejor && mejor.k > 0 && mejor.k < sanes.length) {
      const de = mejor.k % 2 === 0 ? 'white' : 'black';
      return de === color
        ? { estado: 'yo', apertura: mejor.x.a, ply: mejor.k, texto: `Te saliste antes de llegar a «${mejor.x.a.nombre}»: en ${etiqueta(sanes, mejor.k, ver)}; tu apertura pedía ${etiqueta(mejor.x.tronco, mejor.k, ver)}.` }
        : { estado: 'rival', apertura: mejor.x.a, ply: mejor.k, texto: `El rival evitó tu «${mejor.x.a.nombre}» con ${etiqueta(sanes, mejor.k, ver)}. No lo tenías preparado.` };
    }
    return { estado: 'fuera', texto: 'Esta partida no sigue ninguna apertura de tu repertorio.' };
  }
  if (!m.lineas.length) return { estado: 'sin-lineas', apertura: m.a, texto: `Es tu «${m.a.nombre}», pero aún no tiene líneas para comparar.` };
  let mejor = null;
  for (const x of m.lineas) { const k = prefijo(sanes, x.s); if (!mejor || k > mejor.k || (k === mejor.k && x.l.tipo === 'principal')) mejor = { ...x, k }; }
  const nombre = mejor.l.nombre || (mejor.l.tipo === 'principal' ? 'línea principal' : 'tu línea');
  if (mejor.k >= mejor.s.length) return { estado: 'completa', apertura: m.a, linea: mejor.l, ply: mejor.k, texto: `Seguiste tu «${m.a.nombre}» (${nombre}) hasta el final de lo preparado, la jugada ${Math.ceil(mejor.k / 2)}.` };
  if (mejor.k >= sanes.length) return { estado: 'completa', apertura: m.a, linea: mejor.l, ply: mejor.k, texto: `La partida terminó dentro de tu «${m.a.nombre}» (${nombre}).` };
  const de = mejor.k % 2 === 0 ? 'white' : 'black';
  return de === color
    ? { estado: 'yo', apertura: m.a, linea: mejor.l, ply: mejor.k, texto: `Te saliste de tu «${m.a.nombre}» en ${etiqueta(sanes, mejor.k, ver)}: en «${nombre}» jugabas ${etiqueta(mejor.s, mejor.k, ver)}.` }
    : { estado: 'rival', apertura: m.a, linea: mejor.l, ply: mejor.k, texto: `El rival se salió de tu «${m.a.nombre}» en ${etiqueta(sanes, mejor.k, ver)}. No tenías esa respuesta preparada.` };
}

// ---------------------------------------------------------------------
//  LA GUÍA DE REVISIÓN de una partida
// ---------------------------------------------------------------------
export const PASOS = [
  { clave: 'datos', titulo: 'Los datos', ayuda: 'Comprueba rival, color y resultado. Si quieres, escribe el contexto de la partida: torneo, ritmo, Elo del rival, cómo llegabas.' },
  { clave: 'apertura', titulo: 'Tu apertura', ayuda: 'Mira dónde se salió alguien de tu repertorio. Si fue el rival, añade su jugada como línea nueva; si fuiste tú, repasa la línea.' },
  { clave: 'comentarios', titulo: 'Tus ideas, antes del motor', ayuda: 'Recorre la partida y comenta lo que pensabas en los momentos importantes: qué plan tenías, qué temías, por qué elegiste esa jugada. Hazlo antes de mirar el motor: así aprendes de tu forma de pensar, no solo de tus errores.' },
  { clave: 'momentos', titulo: 'Momentos clave', ayuda: 'Marca las posiciones que decidieron la partida: tus errores, tus buenas jugadas y aquellas en las que dudaste. Ve a la posición en el tablero y pulsa «Marcar momento».' },
  { clave: 'motor', titulo: 'Comprobar con el motor', ayuda: 'Ahora sí: analiza la partida en Lichess. Compara lo que pensabas con lo que dice el motor y marca como momento cada error importante que no viste.' },
  { clave: 'ejercicios', titulo: 'Errores convertidos en ejercicios', ayuda: 'En cada error, juega en el tablero la jugada buena y marca «Usar como ejercicio de repaso». Volverá en tu repaso diario hasta que la veas sola.' },
  { clave: 'conceptos', titulo: 'Conceptos y tipo de error', ayuda: '¿Qué concepto aparecía en cada momento (peón aislado, clavada, casilla débil…)? Enlázalo con su ficha; si no la tienes, créala. En cada error, elige también de qué tipo fue: la app te sugiere uno.' },
  { clave: 'leccion', titulo: 'La lección', ayuda: 'En una o dos frases: ¿qué te llevas de esta partida? Es lo que releerás antes de tu próxima partida.' },
];

// ---------------------------------------------------------------------
//  TIPOS DE ERROR: la app sugiere uno y tú eliges
// ---------------------------------------------------------------------
export const TIPOS_ERROR = {
  tactico:  { nombre: 'Táctica',          ayuda: 'No vi un golpe: clavada, doble, descubierta…' },
  calculo:  { nombre: 'Cálculo',          ayuda: 'Vi la idea, pero calculé mal la variante' },
  plan:     { nombre: 'Plan / estrategia', ayuda: 'Plan equivocado, mala estructura, pieza mal colocada' },
  apertura: { nombre: 'Apertura',         ayuda: 'Me salí de la teoría o no sabía la línea' },
  final:    { nombre: 'Final / técnica',  ayuda: 'No supe ganar o defender el final' },
  descuido: { nombre: 'Descuido',         ayuda: 'Pieza colgada, prisa, no miré lo que amenazaba el rival' },
};
// Bloque del cuaderno → tipo de error
const POR_BLOQUE = [
  [/cálculo|calculo|visualiza/i, 'calculo'], [/táctica|tactica|ataque|defensa del rey/i, 'tactico'],
  [/apertura/i, 'apertura'], [/final|técnica|tecnica/i, 'final'], [/estrategia|estructura|peones/i, 'plan'], [/práctico|practico/i, 'descuido'],
];
//  bloque: nombre del bloque de la ficha enlazada · titulo: el de la ficha
//  ply: jugada del momento · fen: la posición · enRepertorio: si la partida seguía tu repertorio
//  Devuelve { tipo, porque } o null si no hay pistas
export function sugerirTipoError({ bloque, titulo, ply, fen, enRepertorio }) {
  if (/colgad|desprotegid/i.test(titulo || '')) return { tipo: 'descuido', porque: `la ficha «${titulo}»` };
  if (bloque) for (const [re, t] of POR_BLOQUE) if (re.test(bloque)) return { tipo: t, porque: `la ficha es de ${bloque}` };
  if (fen) {
    const piezas = fen.split(' ')[0].replace(/[^nbrqNBRQ]/g, '').length;   // sin reyes ni peones
    if (piezas <= 4) return { tipo: 'final', porque: 'quedan pocas piezas' };
  }
  if (ply != null && ply < 20 && enRepertorio !== false) return { tipo: 'apertura', porque: 'fue en las primeras 10 jugadas' };
  return null;
}

//  p: partida · ms: sus momentos · ej: partida leída · rep: resultado de enRepertorio
export function analizar(p, ms, ej, rep) {
  const r = {};
  const datos = [p.rival, p.color, p.resultado].filter(Boolean).length;
  r.datos = datos === 3 ? ['hecho', `${p.rival} · ${p.resultado}${p.ritmo ? ' · ' + p.ritmo : ''}`] : ['medio', 'Faltan datos: ' + [!p.rival && 'rival', !p.color && 'color', !p.resultado && 'resultado'].filter(Boolean).join(', ')];
  r.apertura = p.apertura_vista ? ['hecho', rep?.texto || 'Revisada'] : [rep && ['yo', 'rival'].includes(rep.estado) ? 'falta' : 'medio', rep?.texto || 'Por revisar'];
  const propias = ej ? ej.jugadas.filter((j, i) => (i % 2 === 0) === (p.color !== 'black') && (j.comentario || '').trim()).length : 0;
  const todas = ej ? ej.jugadas.filter(j => (j.comentario || '').trim()).length + ((ej.comentario0 || '').trim() ? 1 : 0) : 0;
  r.comentarios = todas >= 3 ? ['hecho', `${todas} comentarios`] : todas ? ['medio', `${todas} ${todas === 1 ? 'comentario' : 'comentarios'}; mejor 3 o más`] : ['falta', 'Sin comentar'];
  r.comentarios[2] = propias;
  r.momentos = ms.length >= 2 ? ['hecho', `${ms.length} momentos`] : ms.length ? ['medio', '1 momento; ¿hubo alguno más?'] : ['falta', 'Ninguno marcado'];
  r.motor = p.analizada ? ['hecho', 'Analizada'] : ['falta', 'Sin analizar'];
  const errores = ms.filter(m => m.tipo === 'error');
  const conEj = errores.filter(m => m.es_ejercicio).length;
  r.ejercicios = !ms.length ? ['falta', 'Primero marca los momentos'] : !errores.length ? ['hecho', 'Sin errores marcados']
    : conEj === errores.length ? ['hecho', `${conEj} ${conEj === 1 ? 'ejercicio' : 'ejercicios'}`] : [conEj ? 'medio' : 'falta', `${conEj} de ${errores.length} errores`];
  const conC = ms.filter(m => m.concepto_id).length, sinTipo = errores.filter(m => !m.tipo_error).length;
  const enlazados = `${conC} ${conC === 1 ? 'momento enlazado' : 'momentos enlazados'}`;
  r.conceptos = !conC && !ms.length ? ['falta', 'Ningún momento enlazado']
    : sinTipo ? [conC ? 'medio' : 'falta', `${conC ? enlazados + ' · ' : ''}${sinTipo} ${sinTipo === 1 ? 'error sin tipo' : 'errores sin tipo'}`]
    : conC ? ['hecho', enlazados] : ['falta', 'Ningún momento enlazado'];
  const ll = (p.leccion || '').trim().length;
  r.leccion = ll >= 30 ? ['hecho', 'Escrita'] : ll ? ['medio', 'Un poco corta'] : ['falta', 'Sin escribir'];
  const pasos = PASOS.map(x => ({ ...x, estado: r[x.clave][0], detalle: r[x.clave][1] }));
  const puntos = pasos.reduce((s, x) => s + (x.estado === 'hecho' ? 1 : x.estado === 'medio' ? 0.5 : 0), 0);
  return { pasos, pct: Math.round(puntos / pasos.length * 100), siguiente: pasos.find(x => x.estado !== 'hecho') || null };
}

// ---------------------------------------------------------------------
//  RESUMEN: resultados y errores que más se repiten
// ---------------------------------------------------------------------
export function resumen(partidas, momentos, nombreApertura) {
  const cuenta = l => ({ n: l.length, v: l.filter(p => miResultado(p) === 'victoria').length, t: l.filter(p => miResultado(p) === 'tablas').length, d: l.filter(p => miResultado(p) === 'derrota').length });
  const porColor = { white: cuenta(partidas.filter(p => p.color === 'white')), black: cuenta(partidas.filter(p => p.color === 'black')) };
  const grupos = new Map();
  for (const p of partidas) { const k = nombreApertura(p) || 'Sin apertura'; if (!grupos.has(k)) grupos.set(k, []); grupos.get(k).push(p); }
  const porApertura = [...grupos].map(([k, l]) => ({ nombre: k, ...cuenta(l) })).sort((a, b) => b.n - a.n);
  const errores = new Map();
  for (const m of momentos.filter(m => m.tipo === 'error' && m.concepto_id)) errores.set(m.concepto_id, (errores.get(m.concepto_id) || 0) + 1);
  const repetidos = [...errores].map(([id, n]) => ({ id, n })).sort((a, b) => b.n - a.n).slice(0, 6);
  // Porcentaje de cada tipo de error (sobre los errores con tipo elegido)
  const conTipo = momentos.filter(m => m.tipo === 'error' && TIPOS_ERROR[m.tipo_error]);
  const porTipo = Object.keys(TIPOS_ERROR).map(k => { const n = conTipo.filter(m => m.tipo_error === k).length; return { tipo: k, n, pct: conTipo.length ? Math.round(n / conTipo.length * 100) : 0 }; })
    .filter(x => x.n).sort((a, b) => b.n - a.n);
  const errTotal = momentos.filter(m => m.tipo === 'error').length;
  return { total: cuenta(partidas), porColor, porApertura, repetidos, porTipo, conTipo: conTipo.length, sinTipo: errTotal - conTipo.length,
    sinConcepto: momentos.filter(m => m.tipo === 'error' && !m.concepto_id).length };
}
