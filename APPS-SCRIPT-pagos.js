/*******************************************************
 * SOLAR football - Google Apps Script WebApp Backend
 * Version: 2026-09-08_v7 (rangos fijos + grupos + pagos)
 *
 * Players ranges (según tu sheet):
 *  - Habituales: 10..69
 *  - Visitors:   71..74
 *  - Hall:       96..115
 *
 * Endpoints:
 *  GET  /exec                      -> players (array)
 *  GET  /exec?type=players          -> players (array)
 *  GET  /exec?type=attendance       -> { "Nombre": asistencia, ... }
 *  GET  /exec?type=matches          -> matches (array)
 *  GET  /exec?type=payments         -> pagos (array) [{ fecha, pagador }]
 *  GET  /exec?type=debug            -> info (json)
 *
 *  POST /exec  {type:"incAttendance", names:[...]}     -> "Asistencia actualizada"
 *  POST /exec  {type:"saveMatch", match:{...}}         -> "Partido guardado en matches"
 *  POST /exec  {type:"savePayment", payment:{...}}     -> "Pago guardado en Pagos"
 *******************************************************/

const CONFIG = {
  VERSION: "2026-09-08_v7",

  SPREADSHEET_ID: "1yGaw8xyMCeHgM7waTTqM9szPg8AMiHz3DWBDn_RVtpg",
  PLAYERS_SHEET_GID: 2089846182,

  // Rangos fijos:
  HAB_START: 10,
  HAB_END: 69,

  VIS_START: 71,
  VIS_END: 78,

  HALL_START: 96,
  HALL_END: 115,

  // Columnas (1-based)
  COL_NOMBRE: 1,        // A
  COL_ATAQUE: 2,        // B
  COL_DEFENSA: 3,       // C
  COL_TACTICA: 4,       // D
  COL_ESTAMINA: 5,      // E
  COL_PUNTUALIDAD: 8,   // H
  COL_ASISTENCIA: 9,    // I

  MATCHES_SHEET_NAME: "matches",
  PAYMENTS_SHEET_NAME: "Pagos",   // 👈 NUEVO: hoja del historial de pagos
};

/* =========================
   WebApp Handlers
   ========================= */
function doGet(e) {
  const type = String((e && e.parameter && e.parameter.type) ? e.parameter.type : "players");

  switch (type) {
    case "matches":
      return json_(getMatches_());

    case "attendance":
      return json_(getAttendanceMap_());

    case "payments":                      // 👈 NUEVO
      return json_(getPayments_());

    case "debug":
      return json_(getDebug_());

    case "players":
    default:
      return json_(getPlayers_());
  }
}

function doPost(e) {
  let payload = {};
  try {
    payload = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : "{}");
  } catch (err) {
    return text_(`Error: JSON inválido (${err.message})`);
  }

  const type = String(payload.type || "");
  if (!type) return text_("Error: payload sin 'type'");

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    if (type === "incAttendance") {
      const names = Array.isArray(payload.names) ? payload.names : [];
      incAttendance_(names);

      // Orden SOLO de Habituales 10..69
      sortHabitualesByAttendance_();

      return text_("Asistencia actualizada");
    }

    if (type === "saveMatch") {
      saveMatch_(payload.match || {});
      // opcional: orden también al guardar partido
      sortHabitualesByAttendance_();
      return text_("Partido guardado en matches");
    }

    if (type === "savePayment") {          // 👈 NUEVO
      savePayment_(payload.payment || {});
      return text_("Pago guardado en Pagos");
    }

    return text_(`Error: type desconocido "${type}"`);
  } catch (err) {
    return text_(`Error: ${err.message}`);
  } finally {
    lock.releaseLock();
  }
}

/* =========================
   Players (3 rangos fijos)
   ========================= */
function getPlayers_() {
  const sh = getPlayersSheet_();

  const habituales = readPlayersRange_(sh, CONFIG.HAB_START, CONFIG.HAB_END, "habitual");
  const visitors   = readPlayersRange_(sh, CONFIG.VIS_START, CONFIG.VIS_END, "visitor");
  const hall       = readPlayersRange_(sh, CONFIG.HALL_START, CONFIG.HALL_END, "hall");

  return [...habituales, ...visitors, ...hall];
}

function readPlayersRange_(sh, startRow, endRow, grupo) {
  if (endRow < startRow) return [];
  const numRows = endRow - startRow + 1;

  // Leemos A:I
  const values = sh.getRange(startRow, 1, numRows, CONFIG.COL_ASISTENCIA).getValues();
  const out = [];

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const nombre = normName_(row[CONFIG.COL_NOMBRE - 1]);
    if (!nombre) continue;

    // Seguridad extra: si por error cae un separador en el rango
    if (isSectionHeaderName_(nombre)) continue;

    out.push({
      nombre,
      grupo, // 👈 clave para tu jugadores.js

      ataque: toNumber_(row[CONFIG.COL_ATAQUE - 1], 0),
      defensa: toNumber_(row[CONFIG.COL_DEFENSA - 1], 0),
      tactica: toNumber_(row[CONFIG.COL_TACTICA - 1], 0),
      estamina: toNumber_(row[CONFIG.COL_ESTAMINA - 1], 0),

      puntualidad: toNumber_(row[CONFIG.COL_PUNTUALIDAD - 1], 3) || 3,
      asistencia: toNumber_(row[CONFIG.COL_ASISTENCIA - 1], 0),
    });
  }
  return out;
}

function getAttendanceMap_() {
  const sh = getPlayersSheet_();

  const segments = [
    { start: CONFIG.HAB_START,  end: CONFIG.HAB_END },
    { start: CONFIG.VIS_START,  end: CONFIG.VIS_END },
    { start: CONFIG.HALL_START, end: CONFIG.HALL_END },
  ];

  const map = {};
  for (const seg of segments) {
    const numRows = seg.end - seg.start + 1;
    if (numRows <= 0) continue;

    const names = sh.getRange(seg.start, CONFIG.COL_NOMBRE, numRows, 1).getValues();
    const att   = sh.getRange(seg.start, CONFIG.COL_ASISTENCIA, numRows, 1).getValues();

    for (let i = 0; i < numRows; i++) {
      const nombre = normName_(names[i][0]);
      if (!nombre) continue;
      if (isSectionHeaderName_(nombre)) continue;

      map[nombre] = toNumber_(att[i][0], 0);
    }
  }

  return map;
}

/* =========================
   Attendance increment (3 rangos)
   ========================= */
function incAttendance_(names) {
  if (!names || !names.length) return;

  const sh = getPlayersSheet_();

  const segments = [
    { start: CONFIG.HAB_START,  end: CONFIG.HAB_END },
    { start: CONFIG.VIS_START,  end: CONFIG.VIS_END },
    { start: CONFIG.HALL_START, end: CONFIG.HALL_END },
  ];

  // Cargamos nombres + asistencias por segmento
  const segData = segments.map(seg => {
    const numRows = seg.end - seg.start + 1;
    const nameRange = sh.getRange(seg.start, CONFIG.COL_NOMBRE, numRows, 1);
    const attRange  = sh.getRange(seg.start, CONFIG.COL_ASISTENCIA, numRows, 1);

    return {
      seg,
      numRows,
      names: nameRange.getValues(),
      attRange,
      attVals: attRange.getValues(),
    };
  });

  // index global: nombre -> {segIndex, rowIndex}
  // Prioridad: Habituales primero, luego Visitors, luego Hall
  const idx = new Map();
  for (let s = 0; s < segData.length; s++) {
    const { names: nameVals, numRows } = segData[s];
    for (let i = 0; i < numRows; i++) {
      const nombre = normName_(nameVals[i][0]);
      if (!nombre) continue;
      if (isSectionHeaderName_(nombre)) continue;
      if (!idx.has(nombre)) idx.set(nombre, { s, i });
    }
  }

  // incrementos
  for (const raw of names) {
    const nombre = normName_(raw);
    if (!nombre) continue;

    const pos = idx.get(nombre);
    if (!pos) continue;

    const block = segData[pos.s];
    const curr = toNumber_(block.attVals[pos.i][0], 0);
    block.attVals[pos.i][0] = curr + 1;
  }

  // escribir de vuelta cada bloque
  for (const b of segData) {
    b.attRange.setValues(b.attVals);
  }

  SpreadsheetApp.flush();
}

/* =========================
   Sorting (SOLO Habituales 10..69)
   ========================= */
function sortHabitualesByAttendance_() {
  const sh = getPlayersSheet_();

  const numRows = CONFIG.HAB_END - CONFIG.HAB_START + 1;
  if (numRows <= 0) return;

  const filter = sh.getFilter();
  if (filter) filter.remove();

  const lastCol = sh.getLastColumn();
  const range = sh.getRange(CONFIG.HAB_START, 1, numRows, lastCol);

  range.sort([
    { column: CONFIG.COL_ASISTENCIA, ascending: false }, // I desc
    { column: CONFIG.COL_NOMBRE, ascending: true },     // desempate
  ]);

  SpreadsheetApp.flush();
}

/* =========================
   Matches
   ========================= */
function getMatches_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sh = ensureMatchesSheet_(ss);

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return [];

  const values = sh.getRange(2, 1, lastRow - 1, sh.getLastColumn()).getValues();
  const out = [];

  for (const r of values) {
    const fecha = r[1];  // B
    const goles1 = r[2]; // C
    const goles2 = r[3]; // D
    const eq1 = safeParseJsonArray_(r[4]); // E
    const eq2 = safeParseJsonArray_(r[5]); // F
    const resultado = r[6] || `${goles1} - ${goles2}`; // G

    out.push({ fecha, goles1, goles2, equipo1: eq1, equipo2: eq2, resultado });
  }
  return out;
}

function saveMatch_(match) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sh = ensureMatchesSheet_(ss);

  const fecha  = String(match.fecha || "");
  const goles1 = String(match.goles1 || "");
  const goles2 = String(match.goles2 || "");
  const equipo1 = Array.isArray(match.equipo1) ? match.equipo1 : [];
  const equipo2 = Array.isArray(match.equipo2) ? match.equipo2 : [];

  const resultado = `${goles1} - ${goles2}`;

  sh.appendRow([
    new Date(),              // A createdAt
    fecha,                   // B
    goles1,                  // C
    goles2,                  // D
    JSON.stringify(equipo1), // E
    JSON.stringify(equipo2), // F
    resultado,               // G
  ]);
}

/* =========================
   Pagos (¿quién ha pagado?)   👈 BLOQUE NUEVO
   ========================= */
function getPayments_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sh = ensurePagosSheet_(ss);

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return [];

  const values = sh.getRange(2, 1, lastRow - 1, 3).getValues();
  const out = [];

  for (const r of values) {
    const pagador = normName_(r[2]); // C
    if (!pagador) continue;
    out.push({ fecha: formatFechaPago_(r[1]), pagador }); // B, C
  }
  return out;
}

function savePayment_(payment) {
  const pagador = normName_(payment.pagador);
  if (!pagador) throw new Error("Falta el pagador");

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sh = ensurePagosSheet_(ss);

  sh.appendRow([
    new Date(),                        // A createdAt
    String(payment.fecha || ""),       // B fecha del partido (dd/MM/yyyy)
    pagador,                           // C
  ]);
}

function ensurePagosSheet_(ss) {
  let sh = ss.getSheetByName(CONFIG.PAYMENTS_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.PAYMENTS_SHEET_NAME);
    sh.appendRow(["createdAt", "fecha", "pagador"]);
    sh.getRange("A1:C1").setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function formatFechaPago_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "dd/MM/yyyy");
  }
  return normName_(v);
}

/* =========================
   DEBUG
   ========================= */
function getDebug_() {
  const sh = getPlayersSheet_();

  const hab = readPlayersRange_(sh, CONFIG.HAB_START, CONFIG.HAB_END, "habitual");
  const vis = readPlayersRange_(sh, CONFIG.VIS_START, CONFIG.VIS_END, "visitor");
  const hof = readPlayersRange_(sh, CONFIG.HALL_START, CONFIG.HALL_END, "hall");

  return {
    ok: true,
    version: CONFIG.VERSION,
    sheetName: sh.getName(),
    sheetId: sh.getSheetId(),
    ranges: {
      habituales: `${CONFIG.HAB_START}..${CONFIG.HAB_END}`,
      visitors: `${CONFIG.VIS_START}..${CONFIG.VIS_END}`,
      hall: `${CONFIG.HALL_START}..${CONFIG.HALL_END}`,
    },
    counts: {
      habituales: hab.length,
      visitors: vis.length,
      hall: hof.length,
      total: hab.length + vis.length + hof.length,
    },
    payments: getPayments_().length,   // 👈 NUEVO: nº de pagos registrados
    sample: {
      habitual_1: hab[0] || null,
      visitor_1: vis[0] || null,
      hall_1: hof[0] || null,
    },
    now: new Date().toISOString(),
  };
}

/* =========================
   Sheet helpers
   ========================= */
function getPlayersSheet_() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  for (const sh of ss.getSheets()) {
    if (sh.getSheetId() === CONFIG.PLAYERS_SHEET_GID) return sh;
  }
  throw new Error(`No encuentro la sheet con gid=${CONFIG.PLAYERS_SHEET_GID}`);
}

function ensureMatchesSheet_(ss) {
  let sh = ss.getSheetByName(CONFIG.MATCHES_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.MATCHES_SHEET_NAME);
    sh.appendRow(["createdAt", "fecha", "goles1", "goles2", "equipo1", "equipo2", "resultado"]);
  }
  return sh;
}

/* =========================
   Output helpers
   ========================= */
function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function text_(txt) {
  return ContentService
    .createTextOutput(String(txt))
    .setMimeType(ContentService.MimeType.TEXT);
}

/* =========================
   Utils
   ========================= */
function normName_(v) {
  return (v == null) ? "" : String(v).trim();
}

function toNumber_(v, fallback) {
  if (typeof v === "number" && isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.trim().replace(",", ".");
    const n = Number(s);
    return isFinite(n) ? n : (fallback ?? 0);
  }
  const n = Number(v);
  return isFinite(n) ? n : (fallback ?? 0);
}

function safeParseJsonArray_(v) {
  if (Array.isArray(v)) return v;
  if (v == null || v === "") return [];
  try {
    const parsed = JSON.parse(String(v));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return String(v).split(",").map(x => x.trim()).filter(Boolean);
  }
}

function isSectionHeaderName_(nombre) {
  const n = String(nombre || "").trim().toLowerCase();
  if (!n) return false;
  if (n === "visitor" || n === "visitors") return true;
  if (n.startsWith("//")) return true;
  if (n.includes("hall of fame")) return true;
  return false;
}

/* =========================
   Triggers (opcional)
   ========================= */
function sortPlayersDaily() {
  sortHabitualesByAttendance_();
}

function installDailySortTrigger() {
  const existing = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === "sortPlayersDaily");
  existing.forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger("sortPlayersDaily")
    .timeBased()
    .everyDays(1)
    .atHour(3)
    .create();
}
