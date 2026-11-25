// =====================================================================
//  MdP · datos.js
//  Primero se guarda en el dispositivo (IndexedDB) y después se sube a
//  Supabase. Funciona sin conexión; al volver la cobertura, sincroniza.
//  Regla: si dos dispositivos editan lo mismo, gana la edición más reciente.
// =====================================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://clndogohdtigsvsxguuq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_g3vpBbSnCs68v56UOQvHTQ_CH4n7ysM';
export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'mdp-sesion' },
});

export const TABLAS = [
  'ajustes', 'bloques', 'clases', 'conceptos', 'enlaces_conceptos', 'ejemplos',
  'notas_rapidas', 'glosario', 'tecnicas', 'tarjetas', 'registro_repaso',
  'preguntas_maestro', 'repertorio', 'partidas', 'momentos',
];
const clave = t => (t === 'ajustes' ? 'user_id' : 'id');

// ---------------------------------------------------------------------
//  IndexedDB mínimo
// ---------------------------------------------------------------------
let dbp;
function abrir() {
  if (!dbp) dbp = new Promise((ok, mal) => {
    const r = indexedDB.open('mdp', 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      for (const t of TABLAS) if (!d.objectStoreNames.contains(t)) d.createObjectStore(t, { keyPath: clave(t) });
      if (!d.objectStoreNames.contains('_meta')) d.createObjectStore('_meta');
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => mal(r.error);
  });
  return dbp;
}
async function idb(tienda, modo, fn) {
  const d = await abrir();
  return new Promise((ok, mal) => {
    const tx = d.transaction(tienda, modo);
    const res = fn(tx.objectStore(tienda));
    tx.oncomplete = () => ok(res && 'result' in res ? res.result : undefined);
    tx.onerror = () => mal(tx.error);
  });
}
const metaLeer = k => idb('_meta', 'readonly', s => s.get(k));
const metaPoner = (k, v) => idb('_meta', 'readwrite', s => s.put(v, k));

// ---------------------------------------------------------------------
//  Memoria: todo se carga al abrir la app (son textos, ocupan poco)
// ---------------------------------------------------------------------
const mem = Object.fromEntries(TABLAS.map(t => [t, new Map()]));
const oyentes = new Set();
export const alCambiar = fn => { oyentes.add(fn); return () => oyentes.delete(fn); };
const avisar = motivo => oyentes.forEach(fn => { try { fn(motivo); } catch (e) { console.error(e); } });

export async function cargarLocal() {
  for (const t of TABLAS) {
    const filas = await idb(t, 'readonly', s => s.getAll());
    mem[t] = new Map((filas || []).map(f => [f[clave(t)], f]));
  }
}

export async function borrarTodoLocal() {
  for (const t of [...TABLAS, '_meta']) await idb(t, 'readwrite', s => s.clear());
  for (const t of TABLAS) mem[t].clear();
}

export const lista = t => [...mem[t].values()].filter(f => !f.borrado_en);
export const obtener = (t, id) => { const f = mem[t].get(id); return f && !f.borrado_en ? f : null; };
export const obtenerAunBorrado = (t, id) => mem[t].get(id) || null;
export const buscarFila = (t, fn) => [...mem[t].values()].find(fn) || null;

export const nuevoId = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 3) | 8).toString(16);
    }));

let usuarioId = null;
export const ponerUsuario = id => { usuarioId = id; };

export async function guardar(t, fila) {
  const k = clave(t);
  if (!fila[k]) fila[k] = t === 'ajustes' ? usuarioId : nuevoId();
  if (usuarioId) fila.user_id = usuarioId;
  fila.editado_en = new Date().toISOString();
  fila._pendiente = 1;
  mem[t].set(fila[k], fila);
  await idb(t, 'readwrite', s => s.put(fila));
  avisar('local');
  programarSubida();
  return fila;
}

export async function borrar(t, id) {
  const f = mem[t].get(id);
  if (!f) return;
  f.borrado_en = new Date().toISOString();
  await guardar(t, f);
}

export const pendientes = () => TABLAS.reduce((n, t) => n + [...mem[t].values()].filter(f => f._pendiente).length, 0);

// ---------------------------------------------------------------------
//  Sincronización con Supabase
// ---------------------------------------------------------------------
export const estadoSync = { enCurso: false, ultima: null, error: null, detalle: null };
let temporizador = null;
let subidaAutomatica = true;
export const ponerSubidaAutomatica = si => { subidaAutomatica = !!si; };

function programarSubida() {
  if (!subidaAutomatica) return;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => sincronizar().catch(() => {}), 4000);
}

const limpiar = f => Object.fromEntries(Object.entries(f).filter(([k]) => !k.startsWith('_')));

export async function sincronizar() {
  if (estadoSync.enCurso || reiniciando || !navigator.onLine) return false;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { estadoSync.error = 'Entra de nuevo para sincronizar'; avisar('sync'); return false; }
  estadoSync.enCurso = true; estadoSync.error = null; estadoSync.detalle = null; avisar('sync');
  try {
    // 0) Si empezaste de cero en otro dispositivo, este se vacía antes de subir nada
    const vaciado = await comprobarReinicio();
    // 1) Subir lo pendiente (en orden: primero los padres, por las referencias)
    for (const t of TABLAS) {
      const filas = [...mem[t].values()].filter(f => f._pendiente);
      if (t === 'bloques') filas.sort((a, b) => (a.padre_id ? 1 : 0) - (b.padre_id ? 1 : 0));
      for (let i = 0; i < filas.length; i += 200) {
        const lote = filas.slice(i, i + 200);
        const { error } = await sb.from(t).upsert(lote.map(limpiar), { onConflict: clave(t) });
        if (error) throw new Error(`${t}: ${error.message}`);
        for (const f of lote) {
          const actual = mem[t].get(f[clave(t)]);
          if (actual && actual.editado_en === f.editado_en) {
            delete actual._pendiente;
            await idb(t, 'readwrite', s => s.put(actual));
          }
        }
      }
    }
    // 2) Bajar lo nuevo de otros dispositivos
    let nuevos = 0;
    for (const t of TABLAS) {
      const cursor = (await metaLeer('cursor_' + t)) || '1970-01-01T00:00:00Z';
      const desde = new Date(new Date(cursor).getTime() - 5000).toISOString();
      let maximo = cursor, inicio = 0;
      for (;;) {
        const { data, error } = await sb.from(t).select('*').gt('actualizado_en', desde)
          .order('actualizado_en').range(inicio, inicio + 999);
        if (error) throw new Error(`${t}: ${error.message}`);
        for (const r of data) {
          const local = mem[t].get(r[clave(t)]);
          if (local && local._pendiente && new Date(local.editado_en) > new Date(r.editado_en)) continue;
          const mismaVersion = local && new Date(local.editado_en).getTime() === new Date(r.editado_en).getTime();
          if (!mismaVersion) nuevos++;
          mem[t].set(r[clave(t)], r);
          await idb(t, 'readwrite', s => s.put(r));
          if (r.actualizado_en > maximo) maximo = r.actualizado_en;
        }
        if (data.length < 1000) break;
        inicio += 1000;
      }
      await metaPoner('cursor_' + t, maximo);
    }
    estadoSync.ultima = new Date();
    await metaPoner('ultima_sync', estadoSync.ultima.toISOString());
    if (nuevos || vaciado) avisar('datos');
    return true;
  } catch (e) {
    console.error(e);
    estadoSync.detalle = String(e.message || e);
    estadoSync.error = navigator.onLine ? 'No se pudo sincronizar: ' + traducirError(estadoSync.detalle) : 'Sin conexión';
    return false;
  } finally {
    estadoSync.enCurso = false;
    avisar('sync');
  }
}

export async function leerUltimaSync() {
  const u = await metaLeer('ultima_sync');
  if (u) estadoSync.ultima = new Date(u);
}

function traducirError(m) {
  if (/permission denied/i.test(m)) return 'Supabase no da permiso a la app (falta ejecutar el SQL de permisos).';
  if (/schema must be one of|PGRST106/i.test(m)) return 'La Data API de Supabase no tiene expuesto el esquema «public».';
  if (/does not exist|PGRST20[45]|Could not find/i.test(m)) return 'Falta alguna tabla o columna en Supabase (revisa el SQL).';
  if (/JWT|token|401/i.test(m)) return 'La sesión ha caducado: entra de nuevo.';
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'No hay conexión con Supabase.';
  return m;
}

// Catálogo: añade lo que falte (por nombre), sin duplicar. de bloques y temas en Supabase.
export async function sembrarCatalogo() {
  const { data, error } = await sb.rpc('sembrar_catalogo');
  if (error) throw new Error(traducirError(error.message));
  return data || 0;
}

// ---------------------------------------------------------------------
//  Empezar de cero: borra TODOS tus datos en Supabase y en el dispositivo
//  (necesita conexión). Los ajustes se conservan.
//  Además deja una «marca de reinicio» en tus ajustes: los demás dispositivos
//  (el móvil, el Mac…) la ven al sincronizar y se vacían también, en vez de
//  seguir enseñando lo que tenían guardado.
// ---------------------------------------------------------------------
const DATOS = TABLAS.filter(t => t !== 'ajustes');
const ORDEN_BORRADO = ['registro_repaso', 'tarjetas', 'momentos', 'partidas', 'repertorio', 'preguntas_maestro',
  'tecnicas', 'glosario', 'notas_rapidas', 'ejemplos', 'enlaces_conceptos', 'conceptos', 'clases', 'bloques'];

// Vacía los datos de este dispositivo. Se conserva lo que hayas creado después
// de la marca y aún no se haya subido (por ejemplo, sin conexión).
async function vaciarLocal(salvoDesde = null) {
  for (const t of DATOS) {
    const guardar = salvoDesde ? [...mem[t].values()].filter(f => f._pendiente && f.editado_en > salvoDesde) : [];
    await idb(t, 'readwrite', s => { s.clear(); for (const f of guardar) s.put(f); });
    mem[t] = new Map(guardar.map(f => [f[clave(t)], f]));
  }
  for (const t of TABLAS) await metaPoner('cursor_' + t, null);
}

let reiniciando = false;
export async function borrarTodo() {
  if (!navigator.onLine) throw new Error('Necesitas conexión para empezar de cero.');
  const { data: { session } } = await sb.auth.getSession();
  if (!session) throw new Error('Entra de nuevo en la app antes de empezar de cero.');
  reiniciando = true;
  try {
    for (let i = 0; estadoSync.enCurso && i < 100; i++) await new Promise(r => setTimeout(r, 100));   // que acabe la sincronización en curso
    for (const t of ORDEN_BORRADO) {
      const { error } = await sb.from(t).delete().eq('user_id', usuarioId);
      if (error) throw new Error(`${t}: ${error.message}`);
    }
    const marca = new Date().toISOString();
    const aj = mem.ajustes.get(usuarioId) || { user_id: usuarioId, datos: {} };
    Object.assign(aj, { user_id: usuarioId, datos: { ...(aj.datos || {}), reinicio: marca }, editado_en: marca });
    const { error } = await sb.from('ajustes').upsert([limpiar(aj)], { onConflict: 'user_id' });
    if (error) throw new Error(`ajustes: ${error.message}`);
    delete aj._pendiente;
    mem.ajustes.set(usuarioId, aj);
    await idb('ajustes', 'readwrite', s => s.put(aj));
    await metaPoner('reinicio', marca);
    await vaciarLocal();
  } finally { reiniciando = false; }
  avisar('datos');
}

// Antes de sincronizar: ¿empezaste de cero en otro dispositivo?
async function comprobarReinicio() {
  const { data, error } = await sb.from('ajustes').select('datos').eq('user_id', usuarioId);
  if (error) throw new Error(`ajustes: ${error.message}`);
  const marca = data && data[0] && data[0].datos && data[0].datos.reinicio;
  if (!marca || marca <= ((await metaLeer('reinicio')) || '')) return false;
  await vaciarLocal(marca);
  await metaPoner('reinicio', marca);
  return true;
}

// ---------------------------------------------------------------------
//  Restaurar una copia (archivo .json descargado desde Ajustes).
//  Recupera todo lo que había en la copia; lo creado después se conserva.
// ---------------------------------------------------------------------
export async function restaurarCopia(copia) {
  const datos = copia && copia.datos;
  if (!datos || typeof datos !== 'object') throw new Error('El archivo no es una copia de Memorias de Peón.');
  const ahora = new Date().toISOString();
  let n = 0;
  for (const t of TABLAS) {
    const filas = Array.isArray(datos[t]) ? datos[t] : [];
    for (const f of filas) {
      const fila = Object.fromEntries(Object.entries(f).filter(([k]) => !k.startsWith('_') && k !== 'actualizado_en'));
      if (!fila[clave(t)] && t !== 'ajustes') continue;
      fila.user_id = usuarioId;
      if (t === 'ajustes') fila.user_id = usuarioId;
      fila.editado_en = ahora;           // la copia manda sobre lo que haya ahora
      fila._pendiente = 1;
      mem[t].set(fila[clave(t)], fila);
      await idb(t, 'readwrite', s => s.put(fila));
      n++;
    }
  }
  avisar('datos');
  sincronizar().catch(() => {});
  return n;
}

window.addEventListener('online', () => { avisar('red'); sincronizar(); });
window.addEventListener('offline', () => avisar('red'));
