// ---------------------------------------------------------------------
//  SUGERIR COMENTARIO
//  Explica con palabras sencillas qué hace una jugada: captura, jaque,
//  clavada, enfilada, doble ataque, amenazas, piezas que quedan colgando,
//  desarrollo, centro, enroque… Sin motor ni conexión: solo mira el tablero
//  antes y después de la jugada. Es un borrador para que tú lo corrijas.
// ---------------------------------------------------------------------

const VALOR = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const NOMBRE = { p: 'peón', n: 'caballo', b: 'alfil', r: 'torre', q: 'dama', k: 'rey' };
const FEM = { r: true, q: true };
const COLS = 'abcdefgh';

const tipo = pz => pz.toLowerCase();
const colorDe = pz => (pz === pz.toUpperCase() ? 'w' : 'b');
const otro = c => (c === 'w' ? 'b' : 'w');
const sq = (f, r) => COLS[f] + (r + 1);
const fc = s => [COLS.indexOf(s[0]), +s[1] - 1];
const art = pz => (FEM[tipo(pz)] ? 'la' : 'el');
const ado = (pz, m, f) => (FEM[tipo(pz)] ? f : m);   // atacado / atacada
// «el caballo de c6», «la dama de d8»
const nombre = (pz, s) => `${art(pz)} ${NOMBRE[tipo(pz)]} de ${s}`;
const lista = xs => (xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs.at(-1));

function leerFen(fen) {
  const b = {};
  fen.split(' ')[0].split('/').forEach((fila, i) => {
    let f = 0;
    for (const ch of fila) {
      if (/\d/.test(ch)) f += +ch;
      else { b[sq(f, 7 - i)] = ch; f++; }
    }
  });
  const p = fen.split(' ');
  return { b, turno: p[1] || 'w', enroques: p[2] || '-', num: +p[5] || 1 };
}

const RAYOS = { b: [[1, 1], [1, -1], [-1, 1], [-1, -1]], r: [[1, 0], [-1, 0], [0, 1], [0, -1]] };
RAYOS.q = [...RAYOS.b, ...RAYOS.r];
const SALTOS = { n: [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]], k: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]] };
const dentro = (f, r) => f >= 0 && f < 8 && r >= 0 && r < 8;

// Casillas que ataca la pieza de «s» (incluye las ocupadas: defender también es atacar)
function ataques(b, s) {
  const pz = b[s]; if (!pz) return [];
  const t = tipo(pz), [f, r] = fc(s), res = [];
  if (t === 'p') {
    const d = colorDe(pz) === 'w' ? 1 : -1;
    for (const df of [-1, 1]) if (dentro(f + df, r + d)) res.push(sq(f + df, r + d));
  } else if (SALTOS[t]) {
    for (const [df, dr] of SALTOS[t]) if (dentro(f + df, r + dr)) res.push(sq(f + df, r + dr));
  } else {
    for (const [df, dr] of RAYOS[t]) {
      let x = f + df, y = r + dr;
      while (dentro(x, y)) { res.push(sq(x, y)); if (b[sq(x, y)]) break; x += df; y += dr; }
    }
  }
  return res;
}
// Piezas de color «c» que atacan la casilla «s»
const atacantes = (b, s, c) => Object.keys(b).filter(o => colorDe(b[o]) === c && ataques(b, o).includes(s));

// Clavadas y enfiladas que hace el bando «c»: por cada pieza de largo alcance,
// mira qué dos piezas rivales hay seguidas en su línea.
function rayosX(b, c) {
  const clavadas = [], enfiladas = [];
  for (const s of Object.keys(b)) {
    const pz = b[s]; if (colorDe(pz) !== c || !RAYOS[tipo(pz)]) continue;
    const [f, r] = fc(s);
    for (const [df, dr] of RAYOS[tipo(pz)]) {
      let x = f + df, y = r + dr, primera = null;
      while (dentro(x, y)) {
        const o = sq(x, y), q = b[o];
        if (q) {
          if (colorDe(q) === c) break;
          if (!primera) primera = o;
          else {
            const v1 = VALOR[tipo(b[primera])], v2 = VALOR[tipo(q)];
            if (v2 > v1) clavadas.push({ desde: s, pieza: primera, detras: o });
            else if (v1 >= 5 && v1 > v2 && tipo(b[primera]) !== tipo(pz) && (v2 >= 3 || !atacantes(b, o, otro(c)).length)) enfiladas.push({ desde: s, pieza: primera, detras: o });
            break;
          }
        }
        x += df; y += dr;
      }
    }
  }
  return { clavadas, enfiladas };
}

// Aplica una jugada (uci: e2e4, e7e8q) con enroque, al paso y coronación
function mover(b0, uci) {
  const b = { ...b0 }, de = uci.slice(0, 2), a = uci.slice(2, 4), pz = b[de];
  const captura = b[a] || null;
  let alPaso = null;
  delete b[de];
  if (tipo(pz) === 'p' && de[0] !== a[0] && !captura) { alPaso = a[0] + de[1]; delete b[alPaso]; }
  b[a] = uci[4] ? (colorDe(pz) === 'w' ? uci[4].toUpperCase() : uci[4]) : pz;
  if (tipo(pz) === 'k' && Math.abs(COLS.indexOf(de[0]) - COLS.indexOf(a[0])) === 2) {
    const corto = a[0] === 'g', fila = a[1];
    const tde = (corto ? 'h' : 'a') + fila, ta = (corto ? 'f' : 'd') + fila;
    b[ta] = b[tde]; delete b[tde];
  }
  return { b, captura: captura || (alPaso ? (colorDe(pz) === 'w' ? 'p' : 'P') : null), alPaso };
}

const clave = x => `${x.desde}${x.pieza}${x.detras}`;
const mayus = t => t.charAt(0).toUpperCase() + t.slice(1);

//  fen: posición antes de la jugada · uci: la jugada · san: su notación
//  previa: la jugada anterior { uci, san } (para reconocer una recaptura)
export function sugerirComentario(fen, uci, san = '', previa = null) {
  const { b: antes, enroques, num } = leerFen(fen);
  const de = uci.slice(0, 2), a = uci.slice(2, 4), pz = antes[de];
  if (!pz) return '';
  const c = colorDe(pz), r = otro(c), t = tipo(pz);
  const { b, captura } = mover(antes, uci);
  const yo = b[a];
  const frases = [];
  const reyR = Object.keys(b).find(s => b[s] === (r === 'w' ? 'K' : 'k'));
  const jaque = reyR && atacantes(b, reyR, c).length > 0;
  const mate = /#/.test(san);

  if (mate) return '¡Jaque mate!';

  // 1. Lo que pasa en la casilla: enroque, captura, coronación
  if (t === 'k' && Math.abs(COLS.indexOf(de[0]) - COLS.indexOf(a[0])) === 2)
    frases.push(`Enroca ${a[0] === 'g' ? 'corto' : 'largo'}: el rey se pone a salvo y la torre entra en juego.`);
  else if (captura) {
    const recaptura = previa && previa.uci?.slice(2, 4) === a && /x/.test(previa.san || '');
    frases.push(recaptura ? `Recaptura en ${a}: recupera el material.` : `Captura ${nombre(captura, a)}.`);
  }
  if (uci[4]) frases.push(`Corona: el peón se convierte en ${uci[4] === 'q' ? 'dama' : NOMBRE[uci[4]]}.`);

  // 2. Jaque (directo o descubierto)
  const directo = jaque && ataques(b, a).includes(reyR);
  if (jaque) frases.push(directo ? 'Da jaque al rey.' : '¡Jaque descubierto! La pieza que se aparta destapa a otra que da jaque.');

  // 3. Clavadas y enfiladas nuevas
  const xa = rayosX(antes, c), xd = rayosX(b, c);
  const nuevas = (l0, l1) => l1.filter(x => !l0.some(y => clave(y) === clave(x)));
  for (const cl of nuevas(xa.clavadas, xd.clavadas).filter(x => tipo(b[x.pieza]) !== 'p').slice(0, 1)) {
    const pin = b[cl.pieza], tras = b[cl.detras];
    frases.push(tipo(tras) === 'k'
      ? `Clava ${nombre(pin, cl.pieza)} contra el rey: es una clavada absoluta, no se puede mover.`
      : `Clava ${nombre(pin, cl.pieza)} contra ${nombre(tras, cl.detras)}: clavada relativa; si se mueve, se pierde ${art(tras)} ${NOMBRE[tipo(tras)]}.`);
  }
  for (const en of nuevas(xa.enfiladas, xd.enfiladas).slice(0, 1))
    frases.push(`Enfilada: ataca ${nombre(b[en.pieza], en.pieza)} y, cuando se aparte, ${nombre(b[en.detras], en.detras)} queda a tiro.`);

  // 4. Amenazas nuevas: piezas rivales sin defensa o que valen más que quien las ataca
  const pinned = new Set(xd.clavadas.map(x => x.pieza));
  const amenazas = [];
  // Una pieza está amenazada si la atacan y no tiene defensa, o si la ataca otra que vale menos
  const amenazada = (tab, s) => {
    const at = atacantes(tab, s, c);
    return at.length && (!atacantes(tab, s, r).length || Math.min(...at.map(x => VALOR[tipo(tab[x])])) < VALOR[tipo(tab[s])]);
  };
  for (const s of Object.keys(b)) {
    if (colorDe(b[s]) !== r || tipo(b[s]) === 'k' || !amenazada(b, s) || (antes[s] === b[s] && amenazada(antes, s))) continue;
    const at = atacantes(b, s, c), at0 = atacantes(antes, s, c);
    amenazas.push({ s, defendida: atacantes(b, s, r).length > 0, desde: at.includes(a) ? a : at.find(x => !at0.includes(x)) || at[0], clavada: pinned.has(s) });
  }
  const ya = new Set(frases.join(' ').match(/de [a-h][1-8]/g) || []);
  const amen = amenazas.filter(x => !ya.has('de ' + x.s));
  const txtA = x => `${nombre(b[x.s], x.s)}${x.clavada ? `, que está ${ado(b[x.s], 'clavado', 'clavada')} y no puede escapar` : !x.defendida ? `, que no tiene defensa` : ''}`;
  if (amen.length >= 2 || (jaque && amen.length && amen.some(x => x.desde === a)))
    frases.push(`Doble ataque: ${jaque ? 'da jaque y ' : ''}amenaza ${lista(amen.slice(0, 2).map(x => nombre(b[x.s], x.s)))}${jaque ? '' : ' a la vez'}.`);
  else if (amen.length) {
    const x = amen[0];
    frases.push(x.desde !== a ? `Ataque descubierto: ${nombre(b[x.desde], x.desde)} ahora ataca ${txtA(x)}.` : `Amenaza ${txtA(x)}.`);
  }

  // 5. Si no hay nada táctico: la idea general de la jugada
  if (!frases.length) {
    const fila = +a[1], filaIni = c === 'w' ? 1 : 8;
    if (t === 'p' && ['d', 'e'].includes(a[0]) && [4, 5].includes(fila)) frases.push('Ocupa el centro con el peón y gana espacio.');
    else if (t === 'p' && ['c', 'f'].includes(a[0]) && [4, 5].includes(fila)) frases.push('Lucha por el centro con el peón de flanco.');
    else if (t === 'p') frases.push('Avanza el peón: cuidado, los peones no pueden volver atrás.');
    else if ((t === 'n' || t === 'b') && +de[1] === filaIni) frases.push(`Desarrolla ${art(pz)} ${NOMBRE[t]}${'cdef'.includes(a[0]) || (t === 'b' && ['b5', 'g5', 'b4', 'g4'].includes(a)) ? ' hacia una buena casilla, mirando al centro' : ''}.`);
    else if (t === 'q' && num <= 6) frases.push('Saca la dama pronto: ojo, el rival puede ganar tiempos atacándola.');
    else if (t === 'r') {
      const peones = Object.keys(b).filter(s => s[0] === a[0] && tipo(b[s]) === 'p');
      frases.push(!peones.length ? 'Coloca la torre en la columna abierta.' : !peones.some(s => colorDe(b[s]) === c) ? 'Coloca la torre en una columna semiabierta.' : 'Mueve la torre buscando actividad.');
    } else if (t === 'k') frases.push(enroques.includes(c === 'w' ? 'K' : 'k') || enroques.includes(c === 'w' ? 'Q' : 'q') ? 'Mueve el rey: pierde el derecho a enrocar.' : 'Mueve el rey.');
    else frases.push(`Mejora la posición ${art(pz) === 'la' ? 'de la' : 'del'} ${NOMBRE[t]}.`);
    // ¿Deja libre el enroque corto?
    const fr = c === 'w' ? '1' : '8', reyEn = b['e' + fr] === (c === 'w' ? 'K' : 'k');
    if ((t === 'n' || t === 'b') && reyEn && enroques.includes(c === 'w' ? 'K' : 'k') && !b['f' + fr] && !b['g' + fr] && ['f' + fr, 'g' + fr].includes(de))
      frases.push('Además, deja libre el camino para enrocar corto.');
  }

  if (t === 'q' && num <= 6 && !captura && frases.length && frases.length < 3) frases.push('Ojo: sacar la dama tan pronto permite al rival ganar tiempos atacándola.');

  // 6. Avisos para el que mueve: su pieza queda colgando o se clava sola
  const atR = atacantes(b, a, r);
  if (t !== 'k' && atR.length && !(captura && VALOR[tipo(captura)] >= VALOR[t])) {
    const def = atacantes(b, a, c).length, menor = atR.find(x => VALOR[tipo(b[x])] < VALOR[t]);
    if (!def) frases.push(`Cuidado: ${art(yo)} ${NOMBRE[t]} queda ${ado(yo, 'atacado', 'atacada')} y sin defensa.`);
    else if (menor) frases.push(`Cuidado: ${nombre(b[menor], menor)} puede capturar ${art(yo) === 'la' ? 'a la' : 'al'} ${NOMBRE[t]}, que vale más.`);
  } else if (captura && atR.length && VALOR[tipo(captura)] === VALOR[t] && !/Recaptura/.test(frases[0] || ''))
    frases.push('Es un cambio: el rival puede recapturar.');
  const ra = rayosX(antes, r).clavadas, rd = rayosX(b, r).clavadas;
  for (const cl of rd.filter(x => !ra.some(y => clave(y) === clave(x)) && tipo(b[x.pieza]) !== 'p').slice(0, 1))
    frases.push(`Ojo: ahora ${nombre(b[cl.pieza], cl.pieza)} queda ${ado(b[cl.pieza], 'clavado', 'clavada')} por ${nombre(b[cl.desde], cl.desde)}${tipo(b[cl.detras]) === 'k' ? ' contra el rey' : ''}.`);

  return frases.slice(0, 3).map(mayus).join(' ');
}
