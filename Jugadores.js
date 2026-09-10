// ======= GOOGLE APPS SCRIPT (Sheets) =======
const GAS_URL = "https://script.google.com/macros/s/AKfycbwPZ4Xb9qgjFb-8dE0u0cdb_3KO3dzKbtlDeGuE1YMyF-B2oWAM7o2Nrg2ItUyNs9kl9g/exec";
const GAS_JUGADORES_URL = GAS_URL; // mismo endpoint sirve jugadores + matches

const asistenciaMap = new Map();

/* ===========================================================
   HELPERS DE RED / PUBLICACIÓN ROBUSTA (timeout + reintentos)
   =========================================================== */
const NET_TIMEOUT_MS = 12000;
const NET_RETRIES = 2;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

// GET con timeout
async function getJSON(url){
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort("timeout"), NET_TIMEOUT_MS);
  try{
    const res = await fetch(url, { method:"GET", signal: ctrl.signal });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// POST “text/plain” con timeout + verificación de respuesta
async function postPlain(payload){
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort("timeout"), NET_TIMEOUT_MS);
  try{
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
      signal: ctrl.signal
    });
    const text = await res.text();
    if(!res.ok) throw new Error(`HTTP ${res.status}: ${text || "sin cuerpo"}`);
    return text; // “Asistencia actualizada”, “Partido guardado en matches”, etc.
  } finally {
    clearTimeout(t);
  }
}

// wrapper con reintentos
async function postWithRetry(payload, expectTextIncludes){
  let lastErr;
  for(let i=0;i<=NET_RETRIES;i++){
    try{
      const txt = await postPlain(payload);
      if(expectTextIncludes && !txt.toLowerCase().includes(expectTextIncludes.toLowerCase())){
        throw new Error(`Respuesta inesperada: "${txt}"`);
      }
      return txt;
    }catch(err){
      lastErr = err;
      if(i < NET_RETRIES) await sleep(600);
    }
  }
  throw lastErr;
}

// ========= util fecha (yyyy-mm-dd -> dd/MM/yyyy) =========
function toDMY(dateStr){
  // recibe "", null o "yyyy-mm-dd" del input date
  if(!dateStr) {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth()+1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }
  const [y,m,d] = dateStr.split("-");
  if(!y || !m || !d) return dateStr; // por si ya viene “dd/MM/yyyy”
  return `${d.padStart(2,"0")}/${m.padStart(2,"0")}/${y}`;
}

// ---- formatear fecha del historial (ISO o dd/MM/yyyy -> dd-MM-yyyy) ----
function formatFechaHistorial(fecha) {
  if (!fecha) return "";
  if (fecha instanceof Date) {
    const dd = String(fecha.getDate()).padStart(2, "0");
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const yy = fecha.getFullYear();
    return `${dd}-${mm}-${yy}`;
  }
  if (typeof fecha === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(fecha)) {
      const d = new Date(fecha);
      if (!isNaN(d)) return formatFechaHistorial(d);
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      const [dd, mm, yy] = fecha.split("/");
      return `${dd}-${mm}-${yy}`;
    }
    return fecha;
  }
  return String(fecha);
}

/* ===========================================================
   HELPERS DE LIMPIEZA / NORMALIZACIÓN DE JUGADORES (cliente)
   =========================================================== */
const _num  = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const _trim = v => (v == null ? "" : String(v)).trim();
// Normaliza un nombre para poder emparejar la hoja "Jugadores" con la hoja
// "matches" aunque difieran en mayúsculas/minúsculas, acentos, espacios extra
// o en la etiqueta "(GK)": en el histórico hay partidos guardados como
// "Rolando" y otros como "Rolando (GK)", y ambos son el mismo jugador.
// Solo se usa para comparar/indexar, nunca para mostrar el nombre.
const normNombre = v => _trim(v)
  .toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // fuera acentos
  .replace(/\(\s*gk\s*\)/g, " ")                      // fuera la etiqueta de portero
  .replace(/\s+/g, " ")
  .trim();

/**
 * Normaliza y filtra la lista de jugadores proveniente del GAS:
 *  - Elimina filas sin nombre
 *  - Elimina filas con todas las métricas a 0 (rellenos/guías)
 *  - Asegura números válidos (evita NaN)
 */
function limpiarListaJugadores(rawArr) {
  const arr = Array.isArray(rawArr) ? rawArr : [];
  return arr
    .map(j => ({
      ...j,
      nombre: _trim(j?.nombre),
      ataque: _num(j?.ataque),
      defensa: _num(j?.defensa),
      tactica: _num(j?.tactica),
      estamina: _num(j?.estamina),
      asistencia: _num(j?.asistencia),     // ⟵ nos aseguramos que venga como número
      puntualidad: Number.isFinite(Number(j?.puntualidad)) ? _num(j.puntualidad) : 3,
      grupo: j?.grupo || (/^visitor\b/i.test(_trim(j?.nombre)) ? "visitor" : "habitual")
    }))
    .filter(j => {
      if (j.nombre === "") return false;

      const sinStats = (j.ataque === 0 && j.defensa === 0 && j.tactica === 0 && j.estamina === 0);

      // 👇 No filtres visitors ni hall aunque no tengan stats
      if (j.grupo === "visitor" || j.grupo === "hall") return true;

      // Para habituales sí: quita filas basura sin stats
      return !sinStats;
    });

}

/* ======================= Asistencias ======================= */
async function cargarAsistencias() {
  try {
    asistenciaMap.clear();
    const data = await getJSON(`${GAS_URL}?type=attendance&ts=${Date.now()}`);
    if (data && !Array.isArray(data)) {
      Object.keys(data).forEach(n => asistenciaMap.set(n, data[n] || 0));
    }
  } catch (e) {
    console.warn("No se pudo cargar asistencia:", e);
  }
}

async function incrementarAsistencia(nombres) {
  try {
    const resp = await postWithRetry(
      { type: "incAttendance", names: nombres },
      "asistencia actualizada"
    );
    console.log("[GAS/incAttendance] OK →", resp);
    return resp;
  } catch (e) {
    console.error("[GAS/incAttendance] ERROR →", e);
    alert("Error al guardar asistencia: " + e.message);
    throw e;
  }
}

async function guardarPartido(partido) {
  try {
    const resp = await postWithRetry(
      { type: "saveMatch", match: partido },
      "partido guardado"
    );
    console.log("[GAS/saveMatch] OK →", resp);
    return resp;
  } catch (e) {
    console.error("[GAS/saveMatch] ERROR →", e);
    alert("Error al guardar el partido: " + e.message);
    throw e;
  }
}

/* ====================== DATOS JUGADORES ====================== */
let jugadores = [];
let jugadoresOriginal = [];
let jugadoresOrdenados = [];
let matchesData = [];
let matchesTemporada = [];
let statsPorJugador = new Map();
let pagosData = [];               // filas de la hoja "Pagos": { fecha, pagador }
let pagosPorJugador = new Map();  // nombre normalizado -> nº de veces que ha pagado

// A partir de esta fecha cuentan los partidos para Balance / Curiosidades
// (los partidos anteriores del histórico no se tienen en cuenta en estas estadísticas)
const TEMPORADA_INICIO = new Date(2026, 8, 1); // 01/09/2026 (mes 0-indexado: 8 = septiembre)

/** Convierte fecha del partido ("dd/MM/yyyy", ISO, o Date) a Date. Devuelve null si no se puede. */
function parseFechaPartido(fecha) {
  if (!fecha) return null;
  if (fecha instanceof Date) return isNaN(fecha) ? null : fecha;
  const s = String(fecha).trim();
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

/** Filtra los partidos de la temporada actual (desde TEMPORADA_INICIO en adelante) */
function filtrarPartidosTemporada(matches) {
  return (matches || []).filter(p => {
    const d = parseFechaPartido(p.fecha);
    return d && d >= TEMPORADA_INICIO;
  });
}

async function cargarJugadores() {
  try {
    // Anti-cache para obtener la versión más reciente del GAS
    const res = await fetch(GAS_JUGADORES_URL + "?ts=" + Date.now());
    const data = await res.json();

    // ⛳ Saneamos y descartamos filas vacías/0s
    jugadores = limpiarListaJugadores(data);

    // Puntualidad por defecto
    jugadores = jugadores.map(j => ({ ...j, puntualidad: j.puntualidad ?? 3 }));

    // 📊 Cargamos el historial de partidos y calculamos balance/curiosidades
    await cargarPartidosStats();
    aplicarEstadisticasPartidos();

    // 💰 Historial de pagos (quién ha pagado cada partido)
    await cargarPagos();
    aplicarPagos();

    jugadoresOriginal = [...jugadores];
    jugadoresOrdenados = [...jugadores];

    mostrarTabla();
    renderFormularios();     // Partido + Torneo
    initManualTab();         // Manual
    renderAsistenciaRes();   // Asistencia y Resultado
  } catch (err) {
    console.error("Error cargando jugadores:", err);
  }
}

/* ====== Pagos: quién ha pagado cada partido (hoja "Pagos") ====== */
async function cargarPagos() {
  try {
    const data = await getJSON(`${GAS_URL}?type=payments&ts=${Date.now()}`);
    pagosData = Array.isArray(data) ? data : [];
  } catch (e) {
    // Si el Apps Script todavía no tiene el endpoint de pagos, la web sigue
    // funcionando igual: simplemente todos los contadores se quedan a 0.
    console.warn("No se pudieron cargar los pagos:", e);
    pagosData = [];
  }
}

/** Cuenta cuántas veces ha pagado cada jugador y lo fusiona en cada objeto jugador */
function aplicarPagos() {
  pagosPorJugador = new Map();
  (pagosData || []).forEach(p => {
    const key = normNombre(p && p.pagador);
    if (!key) return;
    pagosPorJugador.set(key, (pagosPorJugador.get(key) || 0) + 1);
  });

  const conPagos = arr => (arr || []).map(j => ({
    ...j,
    pagos: pagosPorJugador.get(normNombre(j.nombre)) || 0
  }));
  jugadores        = conPagos(jugadores);
  jugadoresOriginal = conPagos(jugadoresOriginal);
  jugadoresOrdenados = conPagos(jugadoresOrdenados);
}

async function guardarPago(pago) {
  const resp = await postWithRetry({ type: "savePayment", payment: pago }, "pago");
  console.log("[GAS/savePayment] OK →", resp);
  return resp;
}

/* ====== Estadísticas de partidos (balance / rachas / curiosidades) ====== */
async function cargarPartidosStats() {
  try {
    const data = await getJSON(`${GAS_URL}?type=matches&ts=${Date.now()}`);
    matchesData = Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn("No se pudieron cargar los partidos para estadísticas:", e);
    matchesData = [];
  }
}

/**
 * Recorre los partidos (en orden cronológico, tal cual los devuelve el GAS)
 * y calcula por jugador: partidos jugados, victorias, derrotas, empates,
 * racha máxima de victorias/derrotas y promedio de goles a favor/en contra
 * del equipo en el que jugó.
 */
function calcularEstadisticasPartidos(matches) {
  const stats = new Map();
  const getStat = nombre => {
    if (!stats.has(nombre)) {
      stats.set(nombre, { jugados: 0, v: 0, d: 0, e: 0, curV: 0, curD: 0, maxV: 0, maxD: 0, favorSum: 0, contraSum: 0 });
    }
    return stats.get(nombre);
  };

  const registrar = (nombreRaw, golesFavor, golesContra) => {
    const nombre = normNombre(nombreRaw);
    if (!nombre) return;
    const s = getStat(nombre);
    s.jugados++;
    s.favorSum += golesFavor;
    s.contraSum += golesContra;
    if (golesFavor > golesContra) {
      s.v++; s.curV++; s.curD = 0; s.maxV = Math.max(s.maxV, s.curV);
    } else if (golesFavor < golesContra) {
      s.d++; s.curD++; s.curV = 0; s.maxD = Math.max(s.maxD, s.curD);
    } else {
      s.e++; s.curV = 0; s.curD = 0;
    }
  };

  (matches || []).forEach(p => {
    const g1 = _num(p.goles1), g2 = _num(p.goles2);
    const eq1 = Array.isArray(p.equipo1) ? p.equipo1 : [];
    const eq2 = Array.isArray(p.equipo2) ? p.equipo2 : [];
    eq1.forEach(n => registrar(n, g1, g2));
    eq2.forEach(n => registrar(n, g2, g1));
  });

  return stats;
}

/**
 * Determina las "curiosidades" (récords) del grupo a partir de las
 * estadísticas por jugador. Solo entran en juego jugadores con al
 * menos `minPartidos` partidos jugados. Empates en el récord se
 * reparten entre todos los que lo alcanzan.
 */
function calcularCuriosidades(statsMap, minPartidos = 3) {
  const resultado = new Map();
  const addTag = (nombre, tag) => {
    if (!resultado.has(nombre)) resultado.set(nombre, []);
    resultado.get(nombre).push(tag);
  };

  const elegibles = [...statsMap.entries()].filter(([, s]) => s.jugados >= minPartidos);
  if (!elegibles.length) return resultado;

  const maxV = Math.max(...elegibles.map(([, s]) => s.v));
  if (maxV > 0) elegibles.filter(([, s]) => s.v === maxV).forEach(([n]) => addTag(n, `🏆 Más victorias (${maxV})`));

  const maxD = Math.max(...elegibles.map(([, s]) => s.d));
  if (maxD > 0) elegibles.filter(([, s]) => s.d === maxD).forEach(([n]) => addTag(n, `📉 Más derrotas (${maxD})`));

  const maxStreakV = Math.max(...elegibles.map(([, s]) => s.maxV));
  if (maxStreakV > 0) elegibles.filter(([, s]) => s.maxV === maxStreakV).forEach(([n]) => addTag(n, `🔥 Racha de ${maxStreakV} victorias`));

  const maxStreakD = Math.max(...elegibles.map(([, s]) => s.maxD));
  if (maxStreakD > 0) elegibles.filter(([, s]) => s.maxD === maxStreakD).forEach(([n]) => addTag(n, `❄️ Racha de ${maxStreakD} derrotas`));

  const minContraProm = Math.min(...elegibles.map(([, s]) => s.contraSum / s.jugados));
  elegibles.filter(([, s]) => (s.contraSum / s.jugados) === minContraProm)
    .forEach(([n]) => addTag(n, `🛡️ Equipo menos goleado (${minContraProm.toFixed(2)}/partido)`));

  const maxFavorProm = Math.max(...elegibles.map(([, s]) => s.favorSum / s.jugados));
  elegibles.filter(([, s]) => (s.favorSum / s.jugados) === maxFavorProm)
    .forEach(([n]) => addTag(n, `⚽ Equipo más goleador (${maxFavorProm.toFixed(2)}/partido)`));

  return resultado;
}

/** Refleja en la cabecera cuántos partidos lleva disputados la temporada actual */
function actualizarContadorTemporada() {
  const el = document.getElementById("contador-temporada-num");
  if (el) el.textContent = matchesTemporada.length;
}

/** Fusiona balance/curiosidades calculados dentro de cada objeto jugador */
function aplicarEstadisticasPartidos() {
  // Solo cuentan los partidos de la temporada actual (desde el 01/09/2026)
  matchesTemporada = filtrarPartidosTemporada(matchesData);
  actualizarContadorTemporada();

  statsPorJugador = calcularEstadisticasPartidos(matchesTemporada);
  const curiosidadesPorJugador = calcularCuriosidades(statsPorJugador, 3);

  jugadores = jugadores.map(j => {
    const key = normNombre(j.nombre);
    const s = statsPorJugador.get(key) || { jugados: 0, v: 0, d: 0, e: 0, maxV: 0, maxD: 0, favorSum: 0, contraSum: 0 };
    return {
      ...j,
      partidosJugados: s.jugados,
      victorias: s.v,
      derrotas: s.d,
      empates: s.e,
      balance: s.v - s.d,
      curiosidades: curiosidadesPorJugador.get(key) || [],
    };
  });
}

/** Radar mini (SVG) de Ataque / Defensa / Táctica / Estamina, escala 0-5 */
function generarRadarSVG(j, size = 48) {
  // Ratio de asistencia de la temporada actual: 1 = ha venido a todos los partidos, 0 = a ninguno
  const totalPartidosTemporada = matchesTemporada.length;
  const ratioAsistencia = totalPartidosTemporada > 0
    ? Math.max(0, Math.min(1, _num(j.partidosJugados) / totalPartidosTemporada))
    : 0;

  // Cada eje lleva su propia escala (0-5 para los atributos, 0-1 para la asistencia);
  // "frac" es lo que realmente se dibuja: la posición normalizada de 0 a 1 sobre ese eje.
  const ejes = [
    { label: "ATK", texto: limitar(j.ataque).toFixed(2), frac: limitar(j.ataque) / 5 },
    { label: "DEF", texto: limitar(j.defensa).toFixed(2), frac: limitar(j.defensa) / 5 },
    { label: "TAC", texto: limitar(j.tactica).toFixed(2), frac: limitar(j.tactica) / 5 },
    { label: "STA", texto: limitar(j.estamina).toFixed(2), frac: limitar(j.estamina) / 5 },
    { label: "ASIS", texto: `${Math.round(ratioAsistencia * 100)}%`, frac: ratioAsistencia },
  ];
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 11;
  const n = ejes.length;
  const angleStep = (2 * Math.PI) / n;
  const puntoEn = (frac, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const rad = Math.max(0, Math.min(1, frac)) * r;
    return [cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)];
  };

  let grid = "";
  [0.33, 0.66, 1].forEach(frac => {
    const pts = ejes.map((_, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      return `${(cx + frac * r * Math.cos(angle)).toFixed(1)},${(cy + frac * r * Math.sin(angle)).toFixed(1)}`;
    }).join(" ");
    grid += `<polygon points="${pts}" fill="none" stroke="#e4e9e5" stroke-width="1"/>`;
  });

  let ejesSVG = "";
  ejes.forEach((_, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const x = (cx + r * Math.cos(angle)).toFixed(1);
    const y = (cy + r * Math.sin(angle)).toFixed(1);
    ejesSVG += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e4e9e5" stroke-width="1"/>`;
  });

  const dataPts = ejes.map((e, i) => puntoEn(e.frac, i).map(v => v.toFixed(1)).join(",")).join(" ");
  const tooltip = ejes.map(e => `${e.label} ${e.texto}`).join(" · ");

  return `<span title="${tooltip}"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="radar-mini" role="img" aria-label="Radar de atributos: ${tooltip}">
    ${grid}${ejesSVG}
    <polygon points="${dataPts}" fill="rgba(31,138,76,.35)" stroke="#1f8a4c" stroke-width="1.5"/>
  </svg></span>`;
}

/** Color por porcentaje (0-100), reutilizado en la barra de asistencia */
function colorHexPct(pct) {
  if (pct < 20) return "#d93025";
  if (pct < 40) return "#f57c00";
  if (pct < 60) return "#c9971e";
  if (pct < 80) return "#67a04a";
  return "#1f8a4c";
}

/* ====== util de medias/colores/estrellas ====== */
function calcularMedia(j) { return (_num(j.ataque)*0.3 + _num(j.defensa)*0.3 + _num(j.tactica)*0.2 + _num(j.estamina)*0.2); }
function limitar(valor) { return Math.max(0, Math.min(5, _num(valor))); }
function calcularFifa(j) { return Math.round(limitar(calcularMedia(j)) * 20); }

function colorClase(valor) {
  valor = parseFloat(valor);
  if (valor < 1.5) return "valor-rojo";
  if (valor < 2.5) return "valor-naranja";
  if (valor < 3.5) return "valor-amarillo";
  if (valor < 4.5) return "valor-verde-claro";
  return "valor-verde-oscuro";
}
function colorFifa(valor) {
  valor = parseFloat(valor);
  if (valor < 20) return "valor-rojo";
  if (valor < 40) return "valor-naranja";
  if (valor < 60) return "valor-amarillo";
  if (valor < 80) return "valor-verde-claro";
  return "valor-verde-oscuro";
}
function generarEstrellasFIFA(puntuacion) {
  const estrellasTotales = 5;
  const valorNormalizado = Math.max(0, Math.min(puntuacion, 100)) / 100 * estrellasTotales;
  const llenas = Math.floor(valorNormalizado);
  const decimal = valorNormalizado - llenas;
  let media = 0;
  if (decimal >= 0.75) media = 1;
  else if (decimal >= 0.25) media = 0.5;
  let estrellas = "";
  for (let i = 0; i < llenas; i++) estrellas += '<i class="fas fa-star"></i>';
  if (media === 1) estrellas += '<i class="fas fa-star"></i>';
  else if (media === 0.5) estrellas += '<i class="fas fa-star-half-alt"></i>';
  const vacias = estrellasTotales - llenas - (media > 0 ? 1 : 0);
  for (let i = 0; i < vacias; i++) estrellas += '<i class="far fa-star"></i>';
  return `<span class="fifa-stars">${estrellas}</span>`;
}

/* ========== Ordenación de tabla ========== */
let ordenActual = { columna: null, estado: 0 };
function ordenarPor(columna) {
  if (ordenActual.columna !== columna) { ordenActual = { columna, estado: 1 }; }
  else { ordenActual.estado = (ordenActual.estado + 1) % 3; }
  if (ordenActual.estado === 0) {
    jugadoresOrdenados = [...jugadoresOriginal];
  } else {
    const dir = ordenActual.estado === 1 ? -1 : 1;
    jugadoresOrdenados.sort((a, b) => {
      const valor = (j, col) => {
        if (col === "media") return calcularMedia(j);
        if (col === "nombre") return j[col].toLowerCase();
        return _num(j[col]);
      };
      const valA = valor(a, columna), valB = valor(b, columna);
      return valA < valB ? -1 * dir : valA > valB ? 1 * dir : 0;
    });
  }
  mostrarTabla();
}

/**
 * Ordena desde el <select> de móvil. A diferencia de ordenarPor (que va rotando
 * descendente → ascendente → sin orden a cada clic en la cabecera), aquí cada
 * opción tiene que dar siempre el mismo resultado.
 */
function ordenarDesdeSelect(columna) {
  ordenActual = { columna: null, estado: 0 };
  if (!columna) {
    jugadoresOrdenados = [...jugadoresOriginal];
    mostrarTabla();
    return;
  }
  ordenarPor(columna);                            // 1ª llamada → descendente
  if (columna === "nombre") ordenarPor(columna);  // los nombres, mejor de A a Z
}

/* ========== Mostrar tabla ========== */
function mostrarTabla() {
  const tbody = document.querySelector("#tabla-jugadores tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  // Partidos de la temporada actual (desde el 01/09/2026) — misma base que Balance/Curiosidades
  const totalPartidos = matchesTemporada.length;

  jugadoresOrdenados.forEach(j => {
    const mediaVal = limitar(calcularMedia(j));
    const media = mediaVal.toFixed(2);
    const fifa = Math.round(mediaVal * 20);
    const estrellasHTML = generarEstrellasFIFA(fifa);
    const grupo = (j.grupo === "visitor" || j.grupo === "hall") ? j.grupo : "habitual";

    // % de asistencia sobre los partidos de la temporada (partidos realmente jugados por el jugador, no el contador histórico)
    const asistenciaTemporada = _num(j.partidosJugados);
    const pctAsistencia = totalPartidos > 0 ? Math.min(100, Math.round((asistenciaTemporada / totalPartidos) * 100)) : 0;

    // Balance de partidos (victorias suman, derrotas restan)
    const balance = _num(j.balance);
    const balanceClass = balance > 0 ? "balance-pos" : balance < 0 ? "balance-neg" : "balance-neutro";
    const balanceTxt = balance > 0 ? `+${balance}` : `${balance}`;
    const record = `${_num(j.victorias)}V - ${_num(j.derrotas)}D - ${_num(j.empates)}E en ${_num(j.partidosJugados)} partidos`;

    // Veces que ha pagado (historial de la hoja "Pagos")
    const pagos = _num(j.pagos);
    const pagosTxt = `${pagos} ${pagos === 1 ? "vez" : "veces"}`;
    const pagosHTML = pagos > 0
      ? `<span class="pagos-badge" title="Ha pagado ${pagosTxt}"><i class="fas fa-hand-holding-dollar"></i> ${pagos}</span>`
      : `<span class="pagos-badge pagos-cero" title="Todavía no ha pagado ninguna vez">0</span>`;

    // Curiosidades (récords del grupo)
    const curiosidades = Array.isArray(j.curiosidades) ? j.curiosidades : [];
    const curiosidadesHTML = curiosidades.length
      ? curiosidades.map(c => `<span class="curiosidad-badge">${c}</span>`).join("")
      : `<span class="text-muted">—</span>`;

    const fila = `<tr class="fila-${grupo}">
      <td class="c-jugador"><span class="grupo-dot dot-${grupo}"></span>${j.nombre}</td>
      <td class="radar-cell c-radar">${generarRadarSVG(j)}</td>
      <td class="det c-stat" data-label="Ataque"><span class="${colorClase(j.ataque)}">${_num(j.ataque).toFixed(2)}</span></td>
      <td class="det c-stat" data-label="Defensa"><span class="${colorClase(j.defensa)}">${_num(j.defensa).toFixed(2)}</span></td>
      <td class="det c-stat" data-label="Táctica"><span class="${colorClase(j.tactica)}">${_num(j.tactica).toFixed(2)}</span></td>
      <td class="det c-stat" data-label="Estamina"><span class="${colorClase(j.estamina)}">${_num(j.estamina).toFixed(2)}</span></td>
      <td class="det asistencia-cell c-asis" data-label="Asistencia">
        <span class="fw-semibold">${asistenciaTemporada}/${totalPartidos}</span>
        <div class="progress asistencia-bar" title="${pctAsistencia}% de los partidos de la temporada (desde 01/09/2026)">
          <div class="progress-bar" style="width:${pctAsistencia}%;background:${colorHexPct(pctAsistencia)};"></div>
        </div>
      </td>
      <td class="det c-punt" data-label="Puntualidad"><span class="${colorClase(j.puntualidad)}">${_num(j.puntualidad)}</span></td>
      <td class="det c-bal" data-label="Balance"><span class="balance-badge ${balanceClass}" title="${record}">${balanceTxt}</span></td>
      <td class="det c-pagos" data-label="Pagos">${pagosHTML}</td>
      <td class="c-media"><span class="${colorClase(media)}">${media}</span></td>
      <td class="c-fifa"><span class="${colorFifa(fifa)}">${fifa}</span></td>
      <td class="stars c-stars">${estrellasHTML}</td>
      <td class="det curiosidades-cell c-curi" data-label="Curiosidades">${curiosidadesHTML}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });
}

/* ========== Render de checkboxes en Partido y Torneo ========== */
function renderFormularios() {
  const formPartido = document.getElementById("form-asistencia");
  const formTorneo  = document.getElementById("form-torneo");
  if (!formPartido || !formTorneo) return;

  formPartido.innerHTML = "";
  formTorneo.innerHTML  = "";

  function crearBloque(titulo, clase, lista, tipo) {
    if (!lista.length) return "";
    let html = `<div class="player-block ${clase}"><h5>${titulo}</h5><div class="player-grid">`;
    lista.forEach((j, i) => {
      const id = `${tipo}_${i}_${clase}`;
      html += `
        <div class="form-check">
          <input class="form-check-input ${tipo}-checkbox" type="checkbox" id="${id}" value="${jugadores.indexOf(j)}">
          <label class="form-check-label" for="${id}">${j.nombre}</label>
        </div>`;
    });
    html += "</div></div>";
    return html;
  }

  const habituales = jugadores.filter(j => j.grupo === "habitual");
  const visitors   = jugadores.filter(j => j.grupo === "visitor");
  const hall       = jugadores.filter(j => j.grupo === "hall");

  formPartido.innerHTML += crearBloque("Habituales", "habituales", habituales, "jugador");
  formPartido.innerHTML += crearBloque("Visitors", "visitors", visitors, "jugador");
  formPartido.innerHTML += crearBloque("Hall of Fame", "hall", hall, "jugador");

  formTorneo.innerHTML  += crearBloque("Habituales", "habituales", habituales, "jugador-torneo");
  formTorneo.innerHTML  += crearBloque("Visitors", "visitors", visitors, "jugador-torneo");
  formTorneo.innerHTML  += crearBloque("Hall of Fame", "hall", hall, "jugador-torneo");

  document.querySelectorAll(".jugador-checkbox").forEach(cb => {
    cb.addEventListener("change", actualizarContadorPartido);
  });
  document.querySelectorAll(".jugador-torneo-checkbox").forEach(cb => {
    cb.addEventListener("change", actualizarContadorTorneo);
  });
}

/* ========== Contadores ========== */
function actualizarContadorPartido() {
  const seleccionados = document.querySelectorAll(".jugador-checkbox:checked").length;
  document.getElementById("contador-partido").textContent = `Seleccionados: ${seleccionados}`;
  const btn = document.getElementById("generar-equipos");
  if (btn) btn.disabled = !(seleccionados >= 8 && seleccionados <= 14);
}
function actualizarContadorTorneo() {
  const k = parseInt(document.getElementById("num-equipos-torneo")?.value || "4", 10);
  const min = 5 * k;
  const max = 6 * k;

  const seleccionados = document.querySelectorAll(".jugador-torneo-checkbox:checked").length;
  const cont = document.getElementById("contador-torneo");
  if (cont) cont.textContent = `Seleccionados: ${seleccionados} (mín ${min} / máx ${max})`;

  const btn = document.getElementById("generar-torneo");
  if (btn) btn.disabled = !(seleccionados >= min && seleccionados <= max);
}

/* ========== Mostrar equipos (Partido/Torneo/Manual) ========== */
function mostrarEquipos(equipos, contenedorId, modo="torneo") {
  const colores = ["azul-circle", "rojo-circle", "verde-circle", "blanco-circle", "naranja-circle"];
  const nombresColores = ["Azul", "Rojo", "Verde", "Blanco", "Naranja"];

  const cont = document.getElementById(contenedorId);
  if (!cont) return;
  cont.innerHTML = "";

  equipos.forEach((equipo, idx) => {
    if (!equipo || !equipo.length) return;

    const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
    const atk  = (sum(equipo, j => _num(j.ataque))  / equipo.length).toFixed(2);
    const def  = (sum(equipo, j => _num(j.defensa)) / equipo.length).toFixed(2);
    const tact = (sum(equipo, j => _num(j.tactica)) / equipo.length).toFixed(2);
    const sta  = (sum(equipo, j => _num(j.estamina)) / equipo.length).toFixed(2);
    const fifaAvg = Math.round(sum(equipo, j => calcularFifa(j)) / equipo.length);

    const capitan = equipo.reduce((best, p) => (calcularFifa(p) > calcularFifa(best) ? p : best), equipo[0]);

    let titulo = "";
    if (modo === "torneo") {
      titulo = `<span class="circle ${colores[idx % colores.length]}"></span> Equipo ${nombresColores[idx % nombresColores.length]}`;
    } else if (modo === "manual") {
      // Manual: Equipo 1 (Azul), 2 (Rojo), 3 (Verde), 4 (Blanco), 5 (Naranja)
      titulo = `<span class="circle ${colores[idx % colores.length]}"></span> Equipo ${idx + 1}`;
    } else {
      // Partido (histórico): mantiene el estilo anterior de 2 equipos
      titulo = (idx === 0)
        ? `<span class="circle blanco-circle"></span><span class="circle azul-circle"></span> Equipo 1`
        : `<span class="circle rojo-circle"></span><span class="circle naranja-circle"></span> Equipo 2`;
    }

    const lista = equipo.map(j =>
      `<li class="list-group-item d-flex justify-content-between align-items-center">
         <span>${j.nombre} ${j === capitan ? "<strong>(C)</strong>" : ""}</span>
         ${generarEstrellasFIFA(calcularFifa(j))}
       </li>`).join("");

    const card = `
      <div class="col-md-6 mb-3">
        <div class="equipo-box">
          <h4>${titulo}</h4>
          <p>ATK: ${atk} | DEF: ${def} | TACT: ${tact} | STA: ${sta} | FIFA: ${fifaAvg}</p>
          <ul class="list-group">${lista}</ul>
        </div>
      </div>`;
    cont.insertAdjacentHTML("beforeend", card);
  });
}

/* ========================= MANUAL ========================= */
function initManualTab() {
  const sel = document.getElementById("num-equipos-manual");
  const columns = document.getElementById("manual-columns");
  const btn = document.getElementById("generar-manual");
  const out = document.getElementById("resultado-manual");
  if (!sel || !columns || !btn) return;

  // Colores/estilos por equipo (1..5)
  const estilos = [
    { bg:"#eef5ff", border:"#cfe2ff", circle:"azul-circle",  label:"Equipo 1" },
    { bg:"#ffe2e6", border:"#f5a6a6", circle:"rojo-circle",  label:"Equipo 2" },
    { bg:"#e8f7ec", border:"#bfe7c9", circle:"verde-circle", label:"Equipo 3" },
    { bg:"#f8f9fa", border:"#d6d8db", circle:"blanco-circle",label:"Equipo 4" },
    { bg:"#fff0e6", border:"#ffd2b3", circle:"naranja-circle",label:"Equipo 5" },
  ];

  const habituales = jugadores.filter(j => j.grupo === "habitual");
  const visitors   = jugadores.filter(j => j.grupo === "visitor");
  const hall       = jugadores.filter(j => j.grupo === "hall");

  function crearBloque(titulo, clase, lista, equipoN) {
    if (!lista.length) return "";
    let html = `<div class="player-block ${clase}"><h5>${titulo}</h5><div class="player-grid">`;
    lista.forEach((j, i) => {
      const idxGlobal = jugadores.indexOf(j);
      const id = `manual_${equipoN}_${i}_${clase}`;
      html += `
        <div class="form-check">
          <input class="form-check-input jugador-manual-${equipoN}" data-team="${equipoN}" type="checkbox" id="${id}" value="${idxGlobal}">
          <label class="form-check-label" for="${id}">${j.nombre}</label>
        </div>`;
    });
    html += "</div></div>";
    return html;
  }

  function sincronizar(cb, k) {
    if (!cb.checked) return;
    const val = cb.value;
    const team = Number(cb.dataset.team || "0");
    for (let t = 1; t <= k; t++) {
      if (t === team) continue;
      document.querySelectorAll(`.jugador-manual-${t}[value="${val}"]`).forEach(x => x.checked = false);
    }
  }

  function actualizarContadores(k) {
    for (let t = 1; t <= k; t++) {
      const n = document.querySelectorAll(`.jugador-manual-${t}:checked`).length;
      const el = document.getElementById(`contador-manual-${t}`);
      if (el) el.textContent = `Seleccionados: ${n}`;
    }
  }

  function render(k) {
    // Columnas (una por equipo)
    columns.innerHTML = "";
    for (let t = 1; t <= k; t++) {
      const st = estilos[t - 1];
      // 2 equipos -> 2 columnas en md; 3 equipos -> 3 columnas en md; 4-5 equipos -> 2 en md y 4 en lg (se envuelve)
      const colClass = (k === 2)
        ? "col-12 col-md-6"
        : (k === 3)
          ? "col-12 col-md-4"
          : "col-12 col-md-6 col-lg-3";
      columns.insertAdjacentHTML("beforeend", `
        <div class="${colClass}">
          <div class="equipo-box" style="background:${st.bg};border:2px solid ${st.border};">
            <h5><span class="circle ${st.circle}"></span> ${st.label}</h5>
            <p class="text-muted" id="contador-manual-${t}">Seleccionados: 0</p>
            <form id="form-manual-${t}" class="mb-3"></form>
          </div>
        </div>
      `);
    }

    // Pintar lista de jugadores completa en CADA columna/equipo
    for (let t = 1; t <= k; t++) {
      const form = document.getElementById(`form-manual-${t}`);
      if (!form) continue;
      form.innerHTML = "";
      form.innerHTML += crearBloque("Habituales", "habituales", habituales, t);
      form.innerHTML += crearBloque("Visitors", "visitors", visitors, t);
      form.innerHTML += crearBloque("Hall of Fame", "hall", hall, t);
    }

    // Listeners + sincronización (un jugador solo puede estar en 1 equipo)
    columns.querySelectorAll('input[type="checkbox"][data-team]').forEach(cb => {
      cb.addEventListener("change", e => {
        sincronizar(e.target, k);
        actualizarContadores(k);
      });
    });

    actualizarContadores(k);
    if (out) out.innerHTML = "";
  }

  // Render inicial
  let k = parseInt(sel.value || "4", 10);
  k = Math.max(2, Math.min(5, k));
  render(k);

  // Cambiar nº equipos
  sel.addEventListener("change", () => {
    let kk = parseInt(sel.value || "4", 10);
    kk = Math.max(2, Math.min(5, kk));
    render(kk);
  });

  // Generar tabla/puntuaciones
  btn.addEventListener("click", e => {
    e.preventDefault();
    const kk = Math.max(2, Math.min(5, parseInt(sel.value || "4", 10)));
    const equipos = [];
    for (let t = 1; t <= kk; t++) {
      const eq = Array.from(document.querySelectorAll(`.jugador-manual-${t}:checked`)).map(cb => jugadores[cb.value]);
      equipos.push(eq);
    }
    mostrarEquipos(equipos, "resultado-manual", "manual");
  });
}

/* ========== Asistencia y Resultado ========== */

// Últimos equipos generados en la pestaña "Partido": se usan para precargar
// automáticamente esta pestaña y agilizar la publicación del resultado.
const LS_KEY_ULTIMO_PARTIDO = "sf_ultimo_partido_generado";
let ultimoPartidoGenerado = null;

function guardarUltimoPartidoGenerado(equipoAzul, equipoRojo) {
  ultimoPartidoGenerado = { azul: equipoAzul, rojo: equipoRojo };
  try { localStorage.setItem(LS_KEY_ULTIMO_PARTIDO, JSON.stringify(ultimoPartidoGenerado)); } catch (e) { /* almacenamiento no disponible */ }
}

function cargarUltimoPartidoGenerado() {
  try {
    const raw = localStorage.getItem(LS_KEY_ULTIMO_PARTIDO);
    if (raw) ultimoPartidoGenerado = JSON.parse(raw);
  } catch (e) {
    ultimoPartidoGenerado = null;
  }
}

function fechaHoyISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Refleja en los recuadros de resumen quién está marcado ahora mismo en cada equipo */
function actualizarResumenEquiposAsistencia() {
  const azulNames = Array.from(document.querySelectorAll(".asistencia-azul:checked")).map(cb => cb.value);
  const rojoNames = Array.from(document.querySelectorAll(".asistencia-rojo:checked")).map(cb => cb.value);
  const elAzul = document.getElementById("resumen-azul");
  const elRojo = document.getElementById("resumen-rojo");
  if (elAzul) elAzul.textContent = azulNames.length ? azulNames.join(", ") : "Sin jugadores seleccionados.";
  if (elRojo) elRojo.textContent = rojoNames.length ? rojoNames.join(", ") : "Sin jugadores seleccionados.";
  // El desplegable de "¿Quién ha pagado?" solo ofrece a los que juegan hoy
  actualizarSelectPagador();
}

/** Rellena el desplegable "¿Quién ha pagado?" con los jugadores de ESTE partido */
function actualizarSelectPagador() {
  const sel = document.getElementById("pagador");
  if (!sel) return;

  const nombres = [
    ...Array.from(document.querySelectorAll(".asistencia-azul:checked")).map(cb => cb.value),
    ...Array.from(document.querySelectorAll(".asistencia-rojo:checked")).map(cb => cb.value),
  ].sort((a, b) => a.localeCompare(b, "es"));

  const previo = sel.value;
  sel.innerHTML = `<option value="">— Sin registrar —</option>` +
    nombres.map(n => {
      const veces = pagosPorJugador.get(normNombre(n)) || 0;
      return `<option value="${n}">${n} (ha pagado ${veces})</option>`;
    }).join("");

  // Conservamos la selección previa si ese jugador sigue en el partido
  if (previo && nombres.includes(previo)) sel.value = previo;
  if (!nombres.length) {
    sel.innerHTML = `<option value="">— Marca primero los equipos —</option>`;
  }
  actualizarContadorPagador();
}

/** Aviso con las veces que ya ha pagado el jugador seleccionado */
function actualizarContadorPagador() {
  const sel = document.getElementById("pagador");
  const out = document.getElementById("pagador-contador");
  if (!sel || !out) return;
  const nombre = sel.value;
  if (!nombre) {
    out.innerHTML = `<span class="text-muted">Selecciona un jugador para ver su historial.</span>`;
    return;
  }
  const veces = pagosPorJugador.get(normNombre(nombre)) || 0;
  out.innerHTML = veces === 0
    ? `<strong>${nombre}</strong> todavía no ha pagado ninguna vez.`
    : `<strong>${nombre}</strong> ha pagado <strong>${veces}</strong> ${veces === 1 ? "vez" : "veces"}.`;
}

function renderAsistenciaRes() {
  const cont = document.getElementById("form-asistencia-res");
  if (!cont) return;

  // Fecha por defecto: hoy (solo si el campo está vacío, para no pisar lo que el usuario ya haya tocado)
  const fechaInput = document.getElementById("match-date");
  if (fechaInput && !fechaInput.value) fechaInput.value = fechaHoyISO();

  cont.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <div class="equipo-box" style="background:#eef5ff;border:2px solid #cfe2ff;">
          <h5><span class="circle azul-circle"></span> Equipo Azul</h5>
          <form id="form-asistencia-azul" class="mb-3"></form>
        </div>
      </div>
      <div class="col-md-6">
        <div class="equipo-box" style="background:#ffe2e6;border:2px solid #f5a6a6;">
          <h5><span class="circle rojo-circle"></span> Equipo Rojo</h5>
          <form id="form-asistencia-rojo" class="mb-3"></form>
        </div>
      </div>
    </div>`;

  const formAzul = document.getElementById("form-asistencia-azul");
  const formRojo = document.getElementById("form-asistencia-rojo");

  // Precarga: los últimos equipos generados en "Partido" (si los hay) quedan
  // marcados de entrada, para no tener que volver a seleccionarlos a mano.
  const azulSet = new Set((ultimoPartidoGenerado && ultimoPartidoGenerado.azul) || []);
  const rojoSet = new Set((ultimoPartidoGenerado && ultimoPartidoGenerado.rojo) || []);

  jugadores.forEach((j, i) => {
    const idAzul = `asistencia_azul_${i}`;
    const idRojo = `asistencia_rojo_${i}`;
    const marcadoAzul = azulSet.has(j.nombre) ? " checked" : "";
    const marcadoRojo = rojoSet.has(j.nombre) ? " checked" : "";

    formAzul.insertAdjacentHTML("beforeend", `
      <div class="form-check">
        <input class="form-check-input asistencia-checkbox asistencia-azul" type="checkbox" id="${idAzul}" value="${j.nombre}"${marcadoAzul}>
        <label class="form-check-label" for="${idAzul}">${j.nombre}</label>
      </div>`);

    formRojo.insertAdjacentHTML("beforeend", `
      <div class="form-check">
        <input class="form-check-input asistencia-checkbox asistencia-rojo" type="checkbox" id="${idRojo}" value="${j.nombre}"${marcadoRojo}>
        <label class="form-check-label" for="${idRojo}">${j.nombre}</label>
      </div>`);
  });

  // sincronizar (no puede estar en los dos equipos) + mantener el resumen en vivo
  document.querySelectorAll(".asistencia-azul").forEach(cb => {
    cb.addEventListener("change", e => {
      if (e.target.checked) {
        document.querySelector(`#asistencia_rojo_${e.target.id.split("_")[2]}`).checked = false;
      }
      actualizarResumenEquiposAsistencia();
    });
  });
  document.querySelectorAll(".asistencia-rojo").forEach(cb => {
    cb.addEventListener("change", e => {
      if (e.target.checked) {
        document.querySelector(`#asistencia_azul_${e.target.id.split("_")[2]}`).checked = false;
      }
      actualizarResumenEquiposAsistencia();
    });
  });

  // onclick/onchange (y no addEventListener) porque renderAsistenciaRes se
  // llama varias veces: con addEventListener se acumulaban handlers y el
  // partido se podía llegar a publicar dos veces de un solo clic.
  const btnPublicar = document.getElementById("publicar-resultado");
  if (btnPublicar) btnPublicar.onclick = async e => { e.preventDefault(); await publicarResultado(); };

  const selPagador = document.getElementById("pagador");
  if (selPagador) selPagador.onchange = actualizarContadorPagador;

  actualizarResumenEquiposAsistencia();
}

async function publicarResultado() {
  const fechaInput = document.getElementById("match-date").value;
  const fecha = toDMY(fechaInput); // GAS guarda dd/MM/yyyy
  const goles1 = document.getElementById("goles1").value;
  const goles2 = document.getElementById("goles2").value;
  const equipo1 = Array.from(document.querySelectorAll(".asistencia-azul:checked")).map(cb => cb.value);
  const equipo2 = Array.from(document.querySelectorAll(".asistencia-rojo:checked")).map(cb => cb.value);

  if (!equipo1.length || !equipo2.length) {
    alert("Debes asignar jugadores a ambos equipos antes de publicar.");
    return;
  }

  // 1) Guardar partido (si falla, detener)
  await guardarPartido({ fecha, goles1, goles2, equipo1, equipo2 });

  // 2) Incrementar asistencia (si falla, avisamos)
  await incrementarAsistencia([...equipo1, ...equipo2]);

  // 3) Registrar quién ha pagado (opcional: si falla, el resultado ya está guardado)
  const pagador = document.getElementById("pagador")?.value || "";
  let avisoPago = "";
  if (pagador) {
    try {
      await guardarPago({ fecha, pagador });
      await cargarPagos();
      aplicarPagos();
      mostrarTabla();
      actualizarSelectPagador();
      avisoPago = `\n💰 Pago registrado: ${pagador}.`;
    } catch (e) {
      console.error("[GAS/savePayment] ERROR →", e);
      avisoPago = `\n\n⚠️ El resultado sí se guardó, pero no se pudo registrar el pago de ${pagador}.`;
    }
  }

  alert("Resultado publicado ✅" + avisoPago);
  mostrarHistorial();
}

/* ========== Historial ========== */

/** Tarjeta de un partido: marcador grande estilo "resultado de liga" + chips de jugadores por equipo */
function tarjetaPartidoHTML(p) {
  const fechaBonita = formatFechaHistorial(p.fecha);
  const golesAzul = _num(p.goles1);
  const golesRojo = _num(p.goles2);
  const ganaAzul = golesAzul > golesRojo;
  const ganaRojo = golesRojo > golesAzul;
  const empate = !ganaAzul && !ganaRojo;
  const trofeo = ' <i class="fas fa-trophy"></i>';

  const chips = (lista, clase) => (lista || []).map(n => `<span class="chip-jugador ${clase}">${n}</span>`).join("");

  return `
    <div class="col">
      <div class="partido-card">
        <div class="partido-card-fecha"><i class="fas fa-calendar-day"></i> ${fechaBonita}</div>
        <div class="marcador">
          <div class="marcador-equipo ${ganaAzul ? "marcador-ganador" : ""}">
            <span class="circle azul-circle"></span>
            <span class="marcador-nombre">Azul${ganaAzul ? trofeo : ""}</span>
          </div>
          <div class="marcador-goles">
            <span class="goles-num ${ganaAzul ? "goles-ganador" : ""}">${golesAzul}</span>
            <span class="marcador-sep">–</span>
            <span class="goles-num ${ganaRojo ? "goles-ganador" : ""}">${golesRojo}</span>
          </div>
          <div class="marcador-equipo marcador-equipo-derecha ${ganaRojo ? "marcador-ganador" : ""}">
            <span class="marcador-nombre">${ganaRojo ? trofeo : ""}Rojo</span>
            <span class="circle rojo-circle"></span>
          </div>
        </div>
        ${empate ? '<div class="marcador-empate">Empate</div>' : ""}
        <div class="partido-card-jugadores">
          <div class="jugadores-fila">${chips(p.equipo1, "chip-azul")}</div>
          <div class="jugadores-fila">${chips(p.equipo2, "chip-rojo")}</div>
        </div>
      </div>
    </div>`;
}

async function mostrarHistorial() {
  try {
    // anti-cache
    const partidos = await getJSON(`${GAS_URL}?type=matches&ts=${Date.now()}`);
    const cont = document.getElementById("lista-historial");
    if (!cont) return;

    cont.innerHTML = "";
    if (!partidos.length) {
      cont.innerHTML = `<p class="text-muted">No hay partidos guardados.</p>`;
      return;
    }

    // Temporada actual (desde el 01/09/2026) visible; el resto queda plegado bajo "Temporada 25-26"
    const actuales = [];
    const anteriores = [];
    partidos.forEach(p => {
      const d = parseFechaPartido(p.fecha);
      (d && d >= TEMPORADA_INICIO ? actuales : anteriores).push(p);
    });
    actuales.reverse();   // más recientes primero
    anteriores.reverse();

    if (actuales.length) {
      cont.insertAdjacentHTML("beforeend", `<div class="row row-cols-1 row-cols-md-2 g-4" id="historial-actual"></div>`);
      const contActual = document.getElementById("historial-actual");
      actuales.forEach(p => contActual.insertAdjacentHTML("beforeend", tarjetaPartidoHTML(p)));
    } else {
      cont.insertAdjacentHTML("beforeend", `<p class="text-muted">Todavía no se ha disputado ningún partido esta temporada.</p>`);
    }

    if (anteriores.length) {
      cont.insertAdjacentHTML("beforeend", `
        <div class="temporada-anterior mt-4">
          <button class="btn btn-outline-secondary btn-sm temporada-anterior-toggle" type="button"
                  data-bs-toggle="collapse" data-bs-target="#temporada-25-26"
                  aria-expanded="false" aria-controls="temporada-25-26">
            <i class="fas fa-chevron-right"></i> Temporada 25-26
            <span class="badge-count">${anteriores.length}</span>
          </button>
          <div class="collapse mt-3" id="temporada-25-26">
            <div class="row row-cols-1 row-cols-md-2 g-4"></div>
          </div>
        </div>`);
      const contAnterior = cont.querySelector("#temporada-25-26 .row");
      anteriores.forEach(p => contAnterior.insertAdjacentHTML("beforeend", tarjetaPartidoHTML(p)));

      const toggleBtn = cont.querySelector(".temporada-anterior-toggle");
      const collapseEl = document.getElementById("temporada-25-26");
      collapseEl?.addEventListener("show.bs.collapse", () => toggleBtn.classList.add("abierto"));
      collapseEl?.addEventListener("hide.bs.collapse", () => toggleBtn.classList.remove("abierto"));
    }
  } catch (err) {
    console.error("Error cargando historial:", err);
  }
}

/* ===========================================================
   ALGORTIMO EQUILIBRADO PARA PARTIDO (2 EQUIPOS)
   Pesos: ATK 30%, DEF 30%, TACT 20%, STA 20%
   =========================================================== */
const ALPHA = 3.0;      // bono de arrastre de estrella
const GAMMA = 0.75;     // castigo por flojos sin estrella
const DELTA = 0.5;      // penalización por demasiadas estrellas
const STAR_CUTOFF = 3.75; // >= 3.75 (en escala 0-5) es estrella
const LOW_CUTOFF  = 2.00; // <= 2.0 (en escala 0-5) es flojo

// Los jugadores marcados "(GK)" en el nombre son porteros: especialistas defensivos.
// Cuando un equipo cuenta con portero, se le suma este plus a su "defensa" SOLO de
// cara al cálculo de equilibrio entre equipos (no altera las medias que se muestran),
// para que el algoritmo compense de forma natural al equipo que se queda sin portero.
const GK_DEF_BONUS = 0.6; // sobre una escala de defensa 0-5
const esPortero = nombre => /\(GK\)/i.test(nombre || "");

function teamScore(team) {
  const ratings = team.map(p => calcularMedia(p)); // 0–5
  const base = ratings.reduce((a,b)=>a+b, 0);

  const stars = team.filter(p => calcularMedia(p) >= STAR_CUTOFF);
  const lows  = team.filter(p => calcularMedia(p) <= LOW_CUTOFF);
  const nStar = stars.length, nLow = lows.length;

  const lowDepth = lows.length
    ? lows.reduce((a,p)=> a + Math.max(0, LOW_CUTOFF - calcularMedia(p)), 0) / lows.length
    : 0;

  const pLow = team.length > 1 ? (nLow / (team.length - 1)) : 0;

  const carryBonus = stars.reduce((sum, s) => {
    const starExcess = Math.max(0, calcularMedia(s) - STAR_CUTOFF);
    return sum + ALPHA * starExcess * pLow * lowDepth;
  }, 0);

  const orphanPenalty = GAMMA * Math.max(0, nLow - 2*nStar); // máx 2 flojos por estrella
  const starPenalty   = DELTA * Math.max(0, nStar - 2);      // >2 estrellas penaliza

  return base + carryBonus - orphanPenalty - starPenalty;
}

function scorePonderado(a, b) {
  const dAtk  = Math.abs(a.atk  - b.atk);
  const dDef  = Math.abs(a.def  - b.def);
  const dTact = Math.abs(a.tact - b.tact);
  const dSta  = Math.abs(a.sta  - b.sta);
  return 0.3*dAtk + 0.3*dDef + 0.2*dTact + 0.2*dSta;
}

function popcount(x){
  let c = 0;
  while (x) { x &= (x - 1); c++; }
  return c;
}

function avg(arr, f){
  return arr.reduce((s,x)=> s + f(x), 0) / (arr.length || 1);
}

function topKAvgMedia(team, k=5){
  const sorted = [...team].sort((a,b)=> (b.media ?? calcularMedia(b)) - (a.media ?? calcularMedia(a)));
  const take = sorted.slice(0, Math.min(k, sorted.length));
  return avg(take, p => p.media ?? calcularMedia(p));
}

function countAbsStars(team){
  return team.reduce((c,p)=> c + ((p.media ?? calcularMedia(p)) >= STAR_CUTOFF ? 1 : 0), 0);
}
function countAbsLows(team){
  return team.reduce((c,p)=> c + ((p.media ?? calcularMedia(p)) <= LOW_CUTOFF ? 1 : 0), 0);
}

function buildTierMap(players){
  // tiers relativos: tercio superior / tercio medio / tercio inferior
  const n = players.length;
  const topCount = Math.floor(n / 3);
  const bottomCount = Math.floor(n / 3);
  const sorted = [...players].sort((a,b)=> b.media - a.media);
  const tierByName = new Map();
  sorted.forEach((p, idx) => {
    const tier = (idx < topCount) ? "bueno" : (idx < n - bottomCount) ? "medio" : "malo";
    tierByName.set(p.nombre, tier);
  });
  return tierByName;
}

function countTier(team, tierByName, tier){
  return team.reduce((c,p)=> c + (tierByName.get(p.nombre) === tier ? 1 : 0), 0);
}

function teamCompStats(team){
  const tieneGK = team.some(p => esPortero(p.nombre));
  return {
    atk:  avg(team, p => _num(p.ataque)),
    // Plus defensivo del portero SOLO para equilibrar (ver GK_DEF_BONUS más arriba)
    def:  avg(team, p => _num(p.defensa)) + (tieneGK ? GK_DEF_BONUS : 0),
    tact: avg(team, p => _num(p.tactica)),
    sta:  avg(team, p => _num(p.estamina)),
    media: avg(team, p => p.media),
    top5: topKAvgMedia(team, 5),
    gk: tieneGK ? 1 : 0
  };
}

function generarEquipos() {
  try {
    const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked"))
      .map(cb => jugadores[Number(cb.value)])
      .map(j => ({ ...j, media: calcularMedia(j), fifa: calcularFifa(j) }));

    const n = seleccionados.length;

    // Se permiten entre 8 y 14 jugadores
    if (n < 8 || n > 14) {
      throw new Error("Selecciona entre 8 y 14 jugadores para generar los equipos.");
    }

    // Tamaños de equipo (ceil/2 vs floor/2):
    // 8->4v4, 9->5v4, 10->5v5, 11->6v5, 12->6v6, 13->7v6, 14->7v7
    const kA = Math.ceil(n / 2);
    const kB = n - kA;

    const tierByName = buildTierMap(seleccionados);

    const totalStarsAbs = countAbsStars(seleccionados);
    const totalLowsAbs = countAbsLows(seleccionados);
    const allowStarDiff = totalStarsAbs % 2; // 0 si par, 1 si impar
    const allowLowDiff = totalLowsAbs % 2;

    const totalGK = seleccionados.filter(p => esPortero(p.nombre)).length;

    let bestCost = Infinity;
    let bestA = null, bestB = null;

    const sq = x => x * x;

    for (let mask = 0; mask < (1 << n); mask++) {
      // evita duplicado espejo: fuerza que el jugador 0 esté en A
      if ((mask & 1) === 0) continue;
      if (popcount(mask) !== kA) continue;

      const A = [], B = [];
      for (let i = 0; i < n; i++) {
        if ((mask >> i) & 1) A.push(seleccionados[i]);
        else B.push(seleccionados[i]);
      }

      // ===== Balance flexible por tiers =====
      // En lugar de exigir 2-2-2, imponemos que la diferencia por tier
      // entre equipos no sea mayor de 1. Así funciona para 10, 11 y 12.
      const buenosA = countTier(A, tierByName, "bueno");
      const buenosB = countTier(B, tierByName, "bueno");
      const mediosA = countTier(A, tierByName, "medio");
      const mediosB = countTier(B, tierByName, "medio");
      const malosA = countTier(A, tierByName, "malo");
      const malosB = countTier(B, tierByName, "malo");

      if (Math.abs(buenosA - buenosB) > 1) continue;
      if (Math.abs(mediosA - mediosB) > 1) continue;
      if (Math.abs(malosA - malosB) > 1) continue;

      // ===== Balance de estrellas/flojos ABSOLUTOS =====
      const starDiff = Math.abs(countAbsStars(A) - countAbsStars(B));
      const lowDiff = Math.abs(countAbsLows(A) - countAbsLows(B));
      if (starDiff > allowStarDiff) continue;
      if (lowDiff > allowLowDiff) continue;

      // ===== GK (si hay 2+ GK, uno por equipo) =====
      if (totalGK >= 2) {
        const gkA = A.some(p => esPortero(p.nombre));
        const gkB = B.some(p => esPortero(p.nombre));
        if (!(gkA && gkB)) continue;
      }

      // ===== Coste =====
      const a = teamCompStats(A);
      const b = teamCompStats(B);

      const topA = topKAvgMedia(A, Math.min(5, A.length));
      const topB = topKAvgMedia(B, Math.min(5, B.length));

      const cost =
        8.0 * sq(topA - topB) +
        4.0 * sq(a.media - b.media) +
        1.4 * sq(a.atk - b.atk) +
        1.4 * sq(a.def - b.def) +
        1.0 * sq(a.tact - b.tact) +
        1.0 * sq(a.sta - b.sta) +
        6.0 * sq(starDiff) +
        6.0 * sq(lowDiff);

      if (cost < bestCost) {
        bestCost = cost;
        bestA = A;
        bestB = B;
      }
    }

    if (!bestA || !bestB) {
      throw new Error("No encontré un reparto válido. Revisa los tiers, cutoffs o nombres GK.");
    }

    console.log("Best cost:", bestCost);
    console.log("Team A:", {
      size: bestA.length,
      buenos: countTier(bestA, tierByName, "bueno"),
      medios: countTier(bestA, tierByName, "medio"),
      malos: countTier(bestA, tierByName, "malo"),
      starsAbs: countAbsStars(bestA),
      lowsAbs: countAbsLows(bestA),
      top5: topKAvgMedia(bestA, Math.min(5, bestA.length)).toFixed(2),
    });
    console.log("Team B:", {
      size: bestB.length,
      buenos: countTier(bestB, tierByName, "bueno"),
      medios: countTier(bestB, tierByName, "medio"),
      malos: countTier(bestB, tierByName, "malo"),
      starsAbs: countAbsStars(bestB),
      lowsAbs: countAbsLows(bestB),
      top5: topKAvgMedia(bestB, Math.min(5, bestB.length)).toFixed(2),
    });

    mostrarEquipos([bestA, bestB], "resultado-equipos", "partido");

    // Guardamos estos equipos como los últimos generados, para precargarlos
    // automáticamente en la pestaña "Asistencia y Resultado"
    guardarUltimoPartidoGenerado(bestA.map(p => p.nombre), bestB.map(p => p.nombre));
    renderAsistenciaRes();

  } catch (error) {
    const cont = document.getElementById("resultado-equipos");
    if (cont) {
      cont.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
  }
}


/* ===========================================================
   TORNEO (4 EQUIPOS) – semilla snake + optimización
   =========================================================== */
function std(arr) {
  if (!arr.length) return 0;
  const m = arr.reduce((s,x)=>s+x,0)/arr.length;
  const v = arr.reduce((s,x)=> s + (x-m)*(x-m), 0) / arr.length;
  return Math.sqrt(v);
}
function calcTeamStats(team){
  if (!team.length) {
    return { atk:0, def:0, tact:0, sta:0, fifaAvg:0, score:0, gk:0, numGK:0 };
  }
  const sum = (f)=> team.reduce((s,x)=> s + f(x), 0);
  const numGK = team.filter(p => esPortero(p.nombre)).length;
  const atk  = sum(p=>_num(p.ataque))  / team.length;
  // Plus defensivo del portero SOLO para equilibrar (ver GK_DEF_BONUS más arriba)
  const def  = (sum(p=>_num(p.defensa)) / team.length) + (numGK > 0 ? GK_DEF_BONUS : 0);
  const tact = sum(p=>_num(p.tactica)) / team.length;
  const sta  = sum(p=>_num(p.estamina))/ team.length;
  const fifaAvg = Math.round(sum(p=>calcularFifa(p)) / team.length);
  const score   = teamScore(team) / team.length;
  const gk      = numGK > 0 ? 1 : 0;

  return {
    atk:+atk.toFixed(2), def:+def.toFixed(2),
    tact:+tact.toFixed(2), sta:+sta.toFixed(2),
    fifaAvg, score, gk, numGK
  };
}
function desiredSizes(total, k=4){
  const base = Math.floor(total / k);
  const extra = total % k;
  return Array.from({length:k}, (_,i)=> base + (i < extra ? 1 : 0));
}
function seedSnake(players, k, targetSizes){
  const sorted = [...players].sort((a,b)=> calcularMedia(b) - calcularMedia(a));
  const teams = Array.from({length:k}, ()=>[]);
  let dir = 1, i = 0;

  for (const p of sorted){
    let guard = 0;
    while (teams[i].length >= targetSizes[i] && guard < 2*k) {
      i += dir;
      if (i === k) { i = k-1; dir = -1; }
      if (i < 0)   { i = 0;   dir =  1; }
      guard++;
    }
    teams[i].push(p);
    i += dir;
    if (i === k) { i = k-1; dir = -1; }
    if (i < 0)   { i = 0;   dir =  1; }
  }
  return teams;
}
function costeEquipos(equipos, targetSizes, totalGK){
  let sizePen = 0;
  for (let i=0;i<equipos.length;i++){
    const diff = Math.abs(equipos[i].length - targetSizes[i]);
    sizePen += diff * diff * 3;
  }
  const stats = equipos.map(calcTeamStats);
  const varScore = std(stats.map(s=>s.score));
  const compStd  = 0.3*std(stats.map(s=>s.atk))
                 + 0.3*std(stats.map(s=>s.def))
                 + 0.2*std(stats.map(s=>s.tact))
                 + 0.2*std(stats.map(s=>s.sta));
  const fifaStd  = std(stats.map(s=>s.fifaAvg));

  let gkPen = 0;
  if (totalGK >= equipos.length) {
    gkPen = stats.reduce((acc,s)=> acc + (s.gk ? 0 : 1), 0) * 0.5;
  }
  // Si dos o más porteros caen en el mismo equipo, deberían repartirse: penaliza
  // cada portero "de más" que se acumule en un equipo que ya tiene uno.
  const gkStackPen = stats.reduce((acc,s)=> acc + Math.max(0, (s.numGK || 0) - 1), 0);

  const wVar=1.0, wComp=0.55, wFifa=0.02, wSize=10, wGK=0.35, wGKStack=2.0;
  return wVar*varScore + wComp*compStd + wFifa*fifaStd + wSize*sizePen + wGK*gkPen + wGKStack*gkStackPen;
}
function optimizeEquipos(seed, targetSizes, iters=4800){
  let teams = seed.map(t=>t.slice());
  const totalGK = seed.flat().filter(p => esPortero(p.nombre)).length;

  let best = teams.map(t=>t.slice());
  let bestCost = costeEquipos(teams, targetSizes, totalGK);
  let currCost = bestCost;

  const startT = 0.9, endT = 0.02;

  for (let step=0; step<iters; step++){
    const temp = startT + (endT - startT) * (step/iters);

    let i = Math.floor(Math.random()*teams.length);
    let j = Math.floor(Math.random()*teams.length);
    if (i === j) j = (j+1) % teams.length;

    const moveIJ = (teams[i].length > targetSizes[i]) && (teams[j].length < targetSizes[j]);
    const moveJI = (teams[j].length > targetSizes[j]) && (teams[i].length < targetSizes[i]);

    const cand = teams.map(t=>t.slice());

    if (moveIJ || moveJI) {
      const from = moveIJ ? i : j;
      const to   = moveIJ ? j : i;
      const pick = Math.floor(Math.random()*cand[from].length);
      const p = cand[from].splice(pick,1)[0];
      cand[to].push(p);
    } else {
      const ia = Math.floor(Math.random()*cand[i].length);
      const ib = Math.floor(Math.random()*cand[j].length);
      const tmp = cand[i][ia];
      cand[i][ia] = cand[j][ib];
      cand[j][ib] = tmp;
    }

    const newCost = costeEquipos(cand, targetSizes, totalGK);
    const delta = newCost - currCost;

    if (delta < 0 || Math.random() < Math.exp(-delta / Math.max(1e-6, temp))) {
      teams = cand;
      currCost = newCost;
      if (newCost < bestCost) {
        bestCost = newCost;
        best = teams.map(t=>t.slice());
      }
    }
  }
  return best;
}
function generarEquiposTorneo() {
  const k = parseInt(document.getElementById("num-equipos-torneo")?.value || "4", 10);
  const min = 5 * k;
  const max = 6 * k;

  const seleccionados = Array.from(document.querySelectorAll(".jugador-torneo-checkbox:checked"))
    .map(cb => jugadores[Number(cb.value)]);

  if (!(seleccionados.length >= min && seleccionados.length <= max)) {
    alert(`Selecciona entre ${min} y ${max} jugadores para generar ${k} equipos (5–6 por equipo).`);
    return;
  }

  const target = desiredSizes(seleccionados.length, k);
  const seed = seedSnake(seleccionados, k, target);
  const equipos = optimizeEquipos(seed, target, 4800);
  mostrarEquipos(equipos, "resultado-torneo", "torneo");
}

/* ========== Arranque ========== */
document.addEventListener("DOMContentLoaded", async () => {
  cargarUltimoPartidoGenerado(); // últimos equipos generados en "Partido" (si los hubiera de una sesión anterior)

  await cargarAsistencias();
  await cargarJugadores();
  await mostrarHistorial();

  // "Editar equipos" en Asistencia y Resultado: muestra/oculta las listas de jugadores
  const btnEditarEquipos = document.getElementById("editar-equipos-asistencia");
  const contEdicionEquipos = document.getElementById("form-asistencia-res");
  btnEditarEquipos?.addEventListener("click", () => {
    if (!contEdicionEquipos) return;
    const estabaOculto = contEdicionEquipos.hasAttribute("hidden");
    if (estabaOculto) {
      contEdicionEquipos.removeAttribute("hidden");
      btnEditarEquipos.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar edición';
    } else {
      contEdicionEquipos.setAttribute("hidden", "");
      btnEditarEquipos.innerHTML = '<i class="fas fa-pen"></i> Editar equipos';
      actualizarResumenEquiposAsistencia();
    }
  });

  // --- Móvil: cada fila es una tarjeta y se despliega al tocarla ---
  // Delegado en el tbody para que siga funcionando después de cada mostrarTabla().
  const tbodyJug = document.querySelector("#tabla-jugadores tbody");
  if (tbodyJug) {
    tbodyJug.addEventListener("click", e => {
      // Solo en la vista de tarjetas; en escritorio la tabla se queda como está
      if (!window.matchMedia("(max-width: 767.98px)").matches) return;
      const fila = e.target.closest("tr");
      if (fila) fila.classList.toggle("abierta");
    });
  }

  // --- Móvil: la tira de pestañas se desliza; dejamos la pestaña activa a la vista ---
  const tabsNav = document.getElementById("tabs");
  const centrarPestanaActiva = () => {
    if (!tabsNav) return;
    const activa = tabsNav.querySelector(".nav-link.active");
    if (activa && tabsNav.scrollWidth > tabsNav.clientWidth) {
      const offset = activa.offsetLeft - (tabsNav.clientWidth - activa.offsetWidth) / 2;
      tabsNav.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  };
  centrarPestanaActiva();
  tabsNav?.addEventListener("shown.bs.tab", centrarPestanaActiva);

  // --- Móvil: selector de orden (la cabecera de la tabla queda oculta) ---
  const selOrden = document.getElementById("orden-movil");
  if (selOrden) selOrden.addEventListener("change", () => ordenarDesdeSelect(selOrden.value));

  // ⟵ Mapeo de columnas ordenables (alineado con las <th> de la tabla; null = no ordenable)
  const columnas = ["nombre", null, "ataque", "defensa", "tactica", "estamina", "partidosJugados", "puntualidad", "balance", "pagos", "media", "fifa", null, null];
  document.querySelectorAll("#tabla-jugadores thead th").forEach((th, index) => {
    const columna = columnas[index];
    if (columna) {
      th.classList.add("sortable");
      th.style.cursor = "pointer";
      th.addEventListener("click", () => {
        ordenarPor(columna);
        document.querySelectorAll("#tabla-jugadores thead th").forEach(th => th.classList.remove("orden-asc", "orden-desc"));
        if (ordenActual.estado === 1) th.classList.add("orden-desc");
        else if (ordenActual.estado === 2) th.classList.add("orden-asc");
      });
    }
  });

  document.getElementById("generar-equipos")?.addEventListener("click", generarEquipos);
  document.getElementById("generar-torneo")?.addEventListener("click", generarEquiposTorneo);

  document.getElementById("num-equipos-torneo")?.addEventListener("change", () => {
    actualizarContadorTorneo();
    const cont = document.getElementById("resultado-torneo");
    if (cont) cont.innerHTML = "";
  });
});
