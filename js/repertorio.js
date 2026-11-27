// =====================================================================
//  MdP · Memorias de Peón · repertorio.js — la guía del repertorio
//  Lógica pura (sin pantallas): qué tiene que tener una apertura bien
//  preparada, qué le falta a la tuya y enlaces para comprobarla en Lichess.
//  La app no propone aperturas: tú eliges las tuyas; esto solo te guía.
//  by Manuel Esteve
// =====================================================================

export const MAX_POR_COLOR = 5;                         // por color: 3 principales y 2 secundarias
export const MAX_ROL = { principal: 3, secundaria: 2 };
// Profundidad recomendada (en jugadas). Es un aviso: si te pasas, se entrena hasta aquí.
export const LIMITE_JUGADAS = { principal: 15, secundaria: 10 };
export const limitePlies = a => (LIMITE_JUGADAS[a.rol] || LIMITE_JUGADAS.principal) * 2;
// Una línea entra en el repaso cuando llega al menos a tu 5.ª jugada
export const MIN_PROPIAS = 5;
export const jugadasPropias = (ej, color) => (ej ? (color === 'white' ? Math.ceil(ej.jugadas.length / 2) : Math.floor(ej.jugadas.length / 2)) : 0);

// Las jugadas se comparan en notación inglesa (SAN), como las guarda el tablero.
const L = 'https://lichess.org';
const fenUrl = fen => fen.replace(/ /g, '_');
export const urlExplorador = (fen, color = 'white') => `${L}/analysis/standard/${fenUrl(fen)}?color=${color}#explorer`;
export function urlAnalisis(ej, color = 'white', ply) {
  const texto = jugadasTexto(ej);
  if (!texto) return urlExplorador(ej.fen0, color);
  return `${L}/analysis/pgn/${encodeURIComponent(texto)}?color=${color}#${ply ?? ej.jugadas.length}`;
}

// «1. e4 c6 2. d4 d5» (desde la posición inicial)
//  «ver» da formato a cada jugada para mostrarla (letras o figuras)
export function jugadasTexto(ej, ver = s => s, hasta = ej.jugadas.length) {
  let t = '';
  ej.jugadas.slice(0, hasta).forEach((j, i) => { t += (i % 2 === 0 ? `${i / 2 + 1}. ` : '') + ver(j.san) + ' '; });
  return t.trim();
}

export const sanes = ej => (ej ? ej.jugadas.map(j => j.san) : []);
export const nComentarios = ej => (ej ? ej.jugadas.filter(j => (j.comentario || '').trim()).length + ((ej.comentario0 || '').trim() ? 1 : 0) : 0);

// ¿Empieza la línea con las jugadas que definen la apertura?
export function empiezaCon(ej, tronco) {
  const a = sanes(ej), b = sanes(tronco);
  return b.every((s, i) => a[i] === s);
}

// Jugada en la que una línea se separa de la principal (índice de medio movimiento)
export function separacion(ej, principal) {
  const a = sanes(ej), b = sanes(principal);
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i < a.length ? i : -1;
}
export const etiquetaPly = (ej, i, ver = s => s) => (i < 0 || !ej.jugadas[i] ? '' : `${Math.floor(i / 2) + 1}.${i % 2 ? '..' : ''} ${ver(ej.jugadas[i].san)}`);

// ---------------------------------------------------------------------
//  Respuestas habituales que todo repertorio debe tener previstas.
//  No son sugerencias de apertura: son las jugadas que el rival hará.
// ---------------------------------------------------------------------
const PRIMERAS = { e4: 'contra 1.e4', d4: 'contra 1.d4' };
export const RESPUESTAS_BLANCAS = {   // si juegas 1.e4, el rival puede responder… [jugada, nombre]
  e4: [['e5', ''], ['c5', 'Siciliana'], ['e6', 'Francesa'], ['c6', 'Caro-Kann'], ['d5', 'Escandinava'], ['Nf6', 'Alekhine'], ['d6', 'Pirc y Moderna']],
  d4: [['d5', ''], ['Nf6', 'indias'], ['f5', 'Holandesa'], ['e6', ''], ['d6', '']],
  c4: [['e5', ''], ['Nf6', ''], ['c5', ''], ['e6', ''], ['d5', '']],
  Nf3: [['d5', ''], ['Nf6', ''], ['c5', '']],
};
const G6_IGUAL = { d6: ['d6', 'g6'] };   // Pirc y Moderna se preparan juntas

// Cobertura del repertorio: qué jugadas del rival no tienen respuesta
export function cobertura(aperturas, leer, ver = s => s) {
  const avisos = { white: [], black: [] };
  const blancas = aperturas.filter(a => a.color === 'white');
  const negras = aperturas.filter(a => a.color === 'black');
  // Con blancas: tus primeras jugadas y las respuestas que faltan
  const tuyas = new Map();   // primera jugada -> respuestas cubiertas
  for (const a of blancas) {
    const lineas = [leer(a.tronco), ...(a.lineas || []).map(l => leer(l.pgn))].filter(Boolean);
    for (const ej of lineas) {
      const s = sanes(ej);
      if (!s[0]) continue;
      if (!tuyas.has(s[0])) tuyas.set(s[0], new Set());
      if (s[1]) tuyas.get(s[0]).add(s[1]);
    }
  }
  if (!blancas.length) avisos.white.push({ tipo: 'falta', texto: 'Aún no tienes ninguna apertura con blancas.' });
  else if (!blancas.some(a => a.rol === 'principal')) avisos.white.push({ tipo: 'medio', texto: 'Marca una de tus aperturas con blancas como principal.' });
  for (const [primera, cubiertas] of tuyas) {
    const lista = RESPUESTAS_BLANCAS[primera];
    if (!lista) continue;
    const faltan = lista.filter(([r]) => !(G6_IGUAL[r] || [r]).some(x => cubiertas.has(x)))
      .map(([r, nombre]) => `1...${ver(r)}${r === 'd6' ? ' / 1...g6' : ''}${nombre ? ` (${nombre})` : ''}`);
    if (faltan.length) avisos.white.push({ tipo: 'medio', texto: `Con 1.${ver(primera)} aún no tienes preparada la respuesta a: ${faltan.join(', ')}.` });
    else avisos.white.push({ tipo: 'hecho', texto: `Con 1.${ver(primera)} tienes respuesta a las defensas habituales.` });
  }
  // Con negras: una defensa contra cada primera jugada importante
  const contra = new Set(negras.map(a => sanes(leer(a.tronco))[0]).filter(Boolean));
  if (!negras.length) avisos.black.push({ tipo: 'falta', texto: 'Aún no tienes ninguna defensa con negras. Necesitarás una contra 1.e4 y otra contra 1.d4.' });
  else {
    for (const p of ['e4', 'd4']) {
      if (!contra.has(p)) avisos.black.push({ tipo: 'medio', texto: `Te falta una defensa ${PRIMERAS[p]}: es de las jugadas que más vas a encontrar.` });
      else avisos.black.push({ tipo: 'hecho', texto: `Tienes defensa ${PRIMERAS[p]}.` });
    }
    if (!contra.has('c4') && !contra.has('Nf3')) avisos.black.push({ tipo: 'medio', texto: `Más adelante, prepara algo contra 1.c4 y 1.${ver('Nf3')} (a menudo basta con un sistema que sirva para las dos).` });
  }
  for (const [c, lista] of [['white', blancas], ['black', negras]]) {
    const n = rol => lista.filter(a => a.rol === rol).length;
    if (lista.length > MAX_POR_COLOR) avisos[c].push({ tipo: 'medio', texto: `Tienes ${lista.length} con ${c === 'white' ? 'blancas' : 'negras'}. Mejor pocas y bien trabajadas: hasta ${MAX_POR_COLOR}.` });
    else if (n('principal') > MAX_ROL.principal) avisos[c].push({ tipo: 'medio', texto: `Tienes ${n('principal')} principales: mejor ${MAX_ROL.principal} principales y el resto como secundarias.` });
    else if (n('secundaria') > MAX_ROL.secundaria) avisos[c].push({ tipo: 'medio', texto: `Tienes ${n('secundaria')} secundarias: mejor no más de ${MAX_ROL.secundaria}.` });
  }
  return avisos;
}

// ---------------------------------------------------------------------
//  LOS PASOS: así debe quedar una apertura bien preparada
// ---------------------------------------------------------------------
//  Cada paso dice qué hacer, cómo hacerlo si no eres experto, y comprueba
//  si está hecho («hecho»), a medias («medio») o sin empezar («falta»).
const largo = t => (t || '').trim().length;
const texto = (t, min) => (largo(t) >= min ? 'hecho' : largo(t) ? 'medio' : 'falta');
const MIN_PRINCIPAL = 20;   // medios movimientos: hasta la jugada 10
const MIN_SECUNDARIA = 12;  // hasta la jugada 6–7

export const PASOS = [
  {
    clave: 'tronco', titulo: 'Las jugadas que la definen',
    ayuda: 'Juega en el tablero las jugadas que tienen que aparecer para que estés en tu apertura. Por ejemplo: 1.e4 c6 es la Caro-Kann; en la Italiana, 1.e4 e5, los dos caballos fuera y el alfil a c4. Desde aquí empezarán todas tus líneas.',
    ir: a => `#/editar-linea/${a.id}?tronco=1`,
  },
  {
    clave: 'ideas', titulo: 'Objetivos de la apertura', campo: 'ideas',
    ayuda: '¿Qué buscas con ella? Escríbelo con tus palabras: ¿juego sólido o posiciones agudas? ¿Luchas por el centro, atacas el flanco de rey o el de dama? ¿Dónde se colocan tus piezas y qué casillas quieres para ellas?',
  },
  {
    clave: 'principal', titulo: 'Línea principal',
    ayuda: 'La que vas a jugar cuando el rival responda lo más habitual. Llega al menos hasta la jugada 10 y escribe en los comentarios el porqué de las jugadas clave. Compruébala en el explorador de Lichess: cada jugada del rival debería ser de las más jugadas.',
    ir: a => `#/editar-linea/${a.id}?l=${(a.lineas || []).find(l => l.tipo === 'principal')?.id || 'nueva'}&tipo=principal`,
  },
  {
    clave: 'secundarias', titulo: 'Respuestas del rival',
    ayuda: 'El rival no siempre jugará tu línea principal. Abre el explorador de Lichess en las primeras jugadas y mira qué otras respuestas son frecuentes: prepara al menos las 2 más jugadas, cada una como una línea (hasta la jugada 6–7, con su idea).',
    ir: a => `#/editar-linea/${a.id}?l=nueva&tipo=secundaria`,
  },
  {
    clave: 'estructura', titulo: 'Estructura de peones', campo: 'estructura',
    ayuda: 'Cuando acaba la apertura, ¿cómo quedan los peones? (centro cerrado, peón aislado, cadena, mayoría en un flanco…). De la estructura salen los planes, por eso va antes. Si tienes la ficha del concepto, enlázala abajo.',
  },
  {
    clave: 'planes', titulo: 'Planes del medio juego', campo: 'planes',
    ayuda: '¿Qué haces cuando se acaba la teoría? Escribe tu plan y también el plan típico del rival, para frenarlo. Ejemplo: «Mi plan: …  /  El plan del rival: …».',
  },
  {
    clave: 'rupturas', titulo: 'Rupturas', campo: 'rupturas',
    ayuda: 'Las jugadas de peón que abren el juego en esta apertura (por ejemplo …c5, …f6, f4 o d5). Escribe cuáles son y cuándo conviene hacerlas, tuyas y del rival.',
  },
  {
    clave: 'trampas', titulo: 'Trampas',
    ayuda: 'Guarda en el tablero al menos dos: una trampa que puedas tender y otra en la que no debes caer. Son de lo que más se recuerda y de lo que más puntos da.',
    ir: a => `#/editar-linea/${a.id}?l=nueva&tipo=trampa`,
  },
  {
    clave: 'tacticas', titulo: 'Tácticas típicas', campo: 'tacticas',
    ayuda: 'Motivos tácticos que se repiten en esta apertura: clavadas en una diagonal, el sacrificio en h7, golpes en f7 o e6, la descubierta de un alfil… Apúntalos para reconocerlos en tus partidas.',
  },
  {
    clave: 'partidas', titulo: 'Partidas modelo', campo: 'partidas',
    ayuda: 'Una o dos partidas de maestros jugadas con tu apertura, para ver los planes en acción. En el explorador de Lichess, pestaña «Maestros», al final de tu línea principal; abre una partida y copia su enlace aquí.',
  },
  {
    clave: 'conceptos', titulo: 'Conceptos de tu cuaderno', campo: 'conceptos',
    ayuda: 'Enlaza las fichas que aparecen en esta apertura (peón aislado, casilla fuerte, alfil malo…). Así la apertura y tu cuaderno de conceptos quedan unidos.',
  },
  {
    clave: 'revisada', titulo: 'Revisada con tu maestro',
    ayuda: 'El último paso: enséñasela a tu maestro y corrige lo que te diga. Si tienes dudas, apúntalas como pregunta para la próxima clase.',
  },
];

// Evalúa una apertura. «leer» convierte un PGN en un ejemplo (dePgn).
export function analizar(a, leer, ver = s => s) {
  const tronco = leer(a.tronco);
  const lineas = (a.lineas || []).map(l => ({ ...l, ej: leer(l.pgn) }));
  const principal = lineas.find(l => l.tipo === 'principal');
  const secundarias = lineas.filter(l => l.tipo === 'secundaria');
  const trampas = lineas.filter(l => l.tipo === 'trampa');
  const r = {};
  const nT = sanes(tronco).length;
  r.tronco = nT >= 2 ? ['hecho', jugadasTexto(tronco, ver)] : nT ? ['medio', 'Añade la respuesta del rival'] : ['falta', 'Sin jugadas'];
  r.ideas = [texto(a.ideas, 80), largo(a.ideas) ? (largo(a.ideas) < 80 ? 'Un poco corto: ¿qué buscas exactamente?' : 'Escritos') : 'Sin escribir'];
  if (!principal) r.principal = ['falta', 'Sin línea principal'];
  else {
    const n = principal.ej ? principal.ej.jugadas.length : 0, c = nComentarios(principal.ej);
    const faltan = [];
    if (n < MIN_PRINCIPAL) faltan.push(`llega hasta la jugada ${Math.ceil(n / 2)}; mejor hasta la 10`);
    if (c < 2) faltan.push(c ? 'solo 1 comentario' : 'sin comentarios: ¿por qué esas jugadas?');
    r.principal = faltan.length ? ['medio', faltan.join(' · ')] : ['hecho', `Hasta la jugada ${Math.ceil(n / 2)}, con ${c} comentarios`];
  }
  const secOk = secundarias.filter(l => l.ej && l.ej.jugadas.length >= MIN_SECUNDARIA);
  r.secundarias = secOk.length >= 2 ? ['hecho', `${secundarias.length} líneas preparadas`]
    : secundarias.length ? ['medio', secundarias.length >= 2 ? 'Alarga alguna: hasta la jugada 6–7' : '1 línea; prepara al menos otra'] : ['falta', 'Ninguna todavía'];
  r.estructura = [texto(a.estructura, 40), largo(a.estructura) ? 'Escrita' : 'Sin escribir'];
  r.planes = [texto(a.planes, 80), largo(a.planes) ? (largo(a.planes) < 80 ? 'Añade también el plan del rival' : 'Escritos') : 'Sin escribir'];
  r.rupturas = [texto(a.rupturas, 30), largo(a.rupturas) ? 'Escritas' : 'Sin escribir'];
  r.trampas = trampas.length >= 2 ? ['hecho', `${trampas.length} trampas`] : trampas.length ? ['medio', '1 trampa; busca otra'] : ['falta', 'Ninguna todavía'];
  r.tacticas = [texto(a.tacticas, 40), largo(a.tacticas) ? 'Escritas' : 'Sin escribir'];
  const np = (a.partidas_modelo || []).length;
  r.partidas = np >= 2 ? ['hecho', `${np} partidas`] : np ? ['medio', '1 partida; con 2 se ven mejor los planes'] : ['falta', 'Ninguna todavía'];
  const nc = (a.conceptos || []).length;
  r.conceptos = nc >= 2 ? ['hecho', `${nc} fichas enlazadas`] : nc ? ['medio', '1 ficha enlazada'] : ['falta', 'Ninguna enlazada'];
  r.revisada = a.revisada ? ['hecho', 'Revisada'] : ['falta', 'Pendiente'];
  const pasos = PASOS.map(p => ({ ...p, estado: r[p.clave][0], detalle: r[p.clave][1] }));
  const puntos = pasos.reduce((s, p) => s + (p.estado === 'hecho' ? 1 : p.estado === 'medio' ? 0.5 : 0), 0);
  // El siguiente paso: el primero sin terminar (el maestro, solo al final)
  const siguiente = pasos.find(p => p.estado !== 'hecho' && p.clave !== 'revisada') || pasos.find(p => p.estado !== 'hecho') || null;
  // Avisos sobre las líneas: que empiecen con tu apertura y que no se repitan
  const avisosLineas = [];
  for (const l of lineas) {
    if (!l.ej || !tronco || !nT) continue;
    if (!empiezaCon(l.ej, tronco)) avisosLineas.push({ id: l.id, texto: `«${l.nombre || 'Sin nombre'}» no empieza con ${jugadasTexto(tronco, ver)}.` });
  }
  const lim = LIMITE_JUGADAS[a.rol] || LIMITE_JUGADAS.principal;
  for (const l of lineas) {
    if (l.ej && l.ej.jugadas.length > lim * 2) avisosLineas.push({ id: l.id, texto: `«${l.nombre || 'Sin nombre'}» llega a la jugada ${Math.ceil(l.ej.jugadas.length / 2)}: en una apertura ${a.rol}, mejor hasta la ${lim}. Se entrena hasta ahí.` });
  }
  return { pasos, pct: Math.round(puntos / pasos.length * 100), siguiente, principal, secundarias, trampas, tronco, avisosLineas };
}

// ---------------------------------------------------------------------
//  EL ÁRBOL: las líneas se juntan donde coinciden y se abren donde se separan
// ---------------------------------------------------------------------
//  lineas: [{ l, ej }] (la principal primero). Cada nodo: { san, ply, hijos, lineas }
//  (lineas = las que terminan en ese nodo).
export function arbol(lineas) {
  const raiz = { san: null, ply: 0, hijos: [], lineas: [] };
  for (const x of lineas) {
    if (!x.ej) continue;
    let n = raiz;
    x.ej.jugadas.forEach((j, i) => {
      let h = n.hijos.find(y => y.san === j.san);
      if (!h) { h = { san: j.san, ply: i + 1, hijos: [], lineas: [] }; n.hijos.push(h); }
      n = h;
    });
    if (n !== raiz) n.lineas.push(x.l);
  }
  return raiz;
}

// ---------------------------------------------------------------------
//  Trampas dentro de un estudio: jugadas que el autor marca como error
//  (? o ??) o comentarios que hablan de trampas. Cada una se corta desde
//  el inicio hasta el error y unas pocas jugadas del castigo.
//  tender: se equivoca el rival (la tiendes tú); si no, es para no caer.
// ---------------------------------------------------------------------
const PALABRAS_TRAMPA = /\b(traps?|trampas?|blunder|falls? into|cae en|cayó en|wins? (a piece|the queen|material)|gana (una pieza|la dama|material))\b/i;
export function buscarTrampas(ramas, color, existentes = [], ver = s => s, { hastaPly = 40, castigo = 3 } = {}) {
  const sanes = e => e.jugadas.map(j => j.san).join(' ');
  const vistas = new Set();
  const res = [];
  for (const r of ramas) {
    const js = r.jugadas;
    // Error marcado (? o ??): la trampa es seguro. Si solo hay un comentario que habla de trampas,
    // es una «posible trampa»: se propone desmarcada y desde esa jugada, para que la revises tú.
    let e = -1, posible = false;
    for (let k = 0; k < Math.min(js.length - 1, hastaPly); k++) {
      const m = js[k].marca || '';
      if (m === '?' || m === '??') { e = k; break; }
      if (e < 0 && PALABRAS_TRAMPA.test(js[k].comentario || '')) { e = k; posible = true; }
    }
    if (e < 0 || !js[e + 1]) continue;
    // Hasta «castigo» jugadas del bando que castiga, acabando siempre en una suya
    let fin = Math.min(js.length, e + 2 * castigo);
    if ((fin - 1 - (e + 1)) % 2) fin--;
    const corta = { ...r, comentario0: '', formas0: [], jugadas: js.slice(0, fin) };
    const clave = sanes(corta);
    if (vistas.has(clave) || existentes.some(x => x === clave || x.startsWith(clave + ' '))) continue;
    vistas.add(clave);
    const bandoError = e % 2 === 0 ? 'white' : 'black';
    const tender = posible || bandoError !== color;
    res.push({
      ej: corta, error: e, tender, posible,
      juega: tender ? color : (color === 'white' ? 'black' : 'white'),
      nombre: posible ? `Posible trampa: ${etiquetaPly(r, e, ver)}${js[e].marca || ''} ${etiquetaPly(r, e + 1, ver)}`
        : `${tender ? 'Trampa' : 'Cuidado'}: ${etiquetaPly(r, e, ver)}${js[e].marca} ${etiquetaPly(r, e + 1, ver)}`,
      nota: [js[e].comentario, js[e + 1].comentario].filter(Boolean).join(' ').trim().slice(0, 400) || null,
      cap: r.cap, capNombre: r.capNombre, partida: !!r.partida,
    });
  }
  return res;
}
