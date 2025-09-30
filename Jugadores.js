// ======= GOOGLE APPS SCRIPT (Sheets) =======
const GAS_URL = "https://script.google.com/macros/s/AKfycbxW_7dViK9N91M3-6yWamNYGt9j2jJodr_MK54b2CdMuHZFu7JQKa5m8Qe0JavudXEJkg/exec";
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

// POST “text/plain” con timeout + verificación
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
    return text; // devolvemos texto para validar “Asistencia actualizada”, “Partido guardado…”, etc.
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

/* ======================= Asistencias ======================= */
async function cargarAsistencias() {
  try {
    asistenciaMap.clear();
    const data = await getJSON(GAS_URL);
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
    // opcional: console.log(resp);
  } catch (e) {
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
    // opcional: console.log(resp);
  } catch (e) {
    alert("Error al guardar el partido: " + e.message);
    throw e;
  }
}

/* ====================== DATOS JUGADORES ====================== */
let jugadores = [];
let jugadoresOriginal = [];
let jugadoresOrdenados = [];

async function cargarJugadores() {
  try {
    const res = await fetch(GAS_JUGADORES_URL);
    jugadores = await res.json();
    jugadores = jugadores.map(j => ({ ...j, puntualidad: j.puntualidad ?? 3 }));
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

/* ====== util de medias/colores/estrellas ====== */
function calcularMedia(j) { return (j.ataque*0.3 + j.defensa*0.3 + j.tactica*0.2 + j.estamina*0.2); }
function limitar(valor) { return Math.max(0, Math.min(5, valor)); }
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
        return parseFloat(j[col]);
      };
      const valA = valor(a, columna), valB = valor(b, columna);
      return valA < valB ? -1 * dir : valA > valB ? 1 * dir : 0;
    });
  }
  mostrarTabla();
}

/* ========== Mostrar tabla ========== */
function mostrarTabla() {
  const tbody = document.querySelector("#tabla-jugadores tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  jugadoresOrdenados.forEach(j => {
    const mediaVal = limitar(calcularMedia(j));
    const media = mediaVal.toFixed(2);
    const fifa = Math.round(mediaVal * 20);
    const estrellasHTML = generarEstrellasFIFA(fifa);
    const fila = `<tr>
      <td>${j.nombre}</td>
      <td><span class="${colorClase(j.ataque)}">${Number(j.ataque).toFixed(2)}</span></td>
      <td><span class="${colorClase(j.defensa)}">${Number(j.defensa).toFixed(2)}</span></td>
      <td><span class="${colorClase(j.tactica)}">${Number(j.tactica).toFixed(2)}</span></td>
      <td><span class="${colorClase(j.estamina)}">${Number(j.estamina).toFixed(2)}</span></td>
      <td><span class="${colorClase(j.puntualidad)}">${j.puntualidad ?? '-'}</span></td>
      <td><span class="${colorClase(media)}">${media}</span></td>
      <td><span class="${colorFifa(fifa)}">${fifa}</span></td>
      <td class="stars">${estrellasHTML}</td>
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
  if (btn) btn.disabled = !(seleccionados >= 10 && seleccionados <= 12);
}
function actualizarContadorTorneo() {
  const seleccionados = document.querySelectorAll(".jugador-torneo-checkbox:checked").length;
  document.getElementById("contador-torneo").textContent = `Seleccionados: ${seleccionados}`;
  const btn = document.getElementById("generar-torneo");
  if (btn) btn.disabled = !(seleccionados >= 20 && seleccionados <= 24);
}

/* ========== Mostrar equipos (Partido/Torneo/Manual) ========== */
function mostrarEquipos(equipos, contenedorId, modo="torneo") {
  const colores = ["azul-circle", "blanco-circle", "rojo-circle", "verde-circle"];
  const nombresColores = ["Azul", "Blanco", "Rojo", "Verde"];

  const cont = document.getElementById(contenedorId);
  if (!cont) return;
  cont.innerHTML = "";

  equipos.forEach((equipo, idx) => {
    if (!equipo || !equipo.length) return;

    const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
    const atk  = (sum(equipo, j => j.ataque)  / equipo.length).toFixed(2);
    const def  = (sum(equipo, j => j.defensa) / equipo.length).toFixed(2);
    const tact = (sum(equipo, j => j.tactica) / equipo.length).toFixed(2);
    const sta  = (sum(equipo, j => j.estamina) / equipo.length).toFixed(2);
    const fifaAvg = Math.round(sum(equipo, j => calcularFifa(j)) / equipo.length);

    const capitan = equipo.reduce((best, p) => (calcularFifa(p) > calcularFifa(best) ? p : best), equipo[0]);

    let titulo = "";
    if (modo === "torneo") {
      titulo = `<span class="circle ${colores[idx % colores.length]}"></span> Equipo ${nombresColores[idx % nombresColores.length]}`;
    } else {
      if (idx === 0) {
        titulo = `<span class="circle blanco-circle"></span><span class="circle azul-circle"></span> Equipo 1`;
      } else {
        titulo = `<span class="circle rojo-circle"></span><span class="circle naranja-circle"></span> Equipo 2`;
      }
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
  const form1 = document.getElementById("form-manual-1");
  const form2 = document.getElementById("form-manual-2");
  if (!form1 || !form2) return;

  form1.innerHTML = "";
  form2.innerHTML = "";

  function crearBloque(titulo, clase, lista, equipo) {
    if (!lista.length) return "";
    let html = `<div class="player-block ${clase}"><h5>${titulo}</h5><div class="player-grid">`;
    lista.forEach((j, i) => {
      const id = `${equipo}_${i}_${clase}`;
      html += `
        <div class="form-check">
          <input class="form-check-input jugador-manual-${equipo}" type="checkbox" id="${id}" value="${jugadores.indexOf(j)}">
          <label class="form-check-label" for="${id}">${j.nombre}</label>
        </div>`;
    });
    html += "</div></div>";
    return html;
  }

  const habituales = jugadores.filter(j => j.grupo === "habitual");
  const visitors   = jugadores.filter(j => j.grupo === "visitor");
  const hall       = jugadores.filter(j => j.grupo === "hall");

  form1.innerHTML += crearBloque("Habituales", "habituales", habituales, "1");
  form1.innerHTML += crearBloque("Visitors", "visitors", visitors, "1");
  form1.innerHTML += crearBloque("Hall of Fame", "hall", hall, "1");

  form2.innerHTML += crearBloque("Habituales", "habituales", habituales, "2");
  form2.innerHTML += crearBloque("Visitors", "visitors", visitors, "2");
  form2.innerHTML += crearBloque("Hall of Fame", "hall", hall, "2");

  actualizarContadoresManual();
  document.querySelectorAll('.jugador-manual-1, .jugador-manual-2').forEach(cb => {
    cb.addEventListener("change", e => {
      sincronizarCheckboxes(e.target);
      actualizarContadoresManual();
    });
  });
  document.getElementById("generar-manual")?.addEventListener("click", e => {
    e.preventDefault(); 
    const eq1 = Array.from(document.querySelectorAll(".jugador-manual-1:checked")).map(cb => jugadores[cb.value]);
    const eq2 = Array.from(document.querySelectorAll(".jugador-manual-2:checked")).map(cb => jugadores[cb.value]);
    mostrarEquipos([eq1, eq2], "resultado-manual", "partido");
  });
}

function sincronizarCheckboxes(cb) {
  const val = cb.value;
  if (cb.checked) {
    if (cb.classList.contains("jugador-manual-1")) {
      document.querySelectorAll(`.jugador-manual-2[value="${val}"]`).forEach(x => x.checked = false);
    } else {
      document.querySelectorAll(`.jugador-manual-1[value="${val}"]`).forEach(x => x.checked = false);
    }
  }
}

function actualizarContadoresManual() {
  const s1 = document.querySelectorAll(".jugador-manual-1:checked").length;
  const s2 = document.querySelectorAll(".jugador-manual-2:checked").length;
  document.getElementById("contador-manual-1").textContent = `Seleccionados: ${s1}`;
  document.getElementById("contador-manual-2").textContent = `Seleccionados: ${s2}`;
}

function generarEquiposManual() {
  const eq1 = Array.from(document.querySelectorAll(".jugador-manual-1:checked")).map(cb => jugadores[cb.value]);
  const eq2 = Array.from(document.querySelectorAll(".jugador-manual-2:checked")).map(cb => jugadores[cb.value]);
  mostrarEquipos([eq1, eq2], "resultado-manual", "partido");
}

/* ========== Asistencia y Resultado ========== */
function renderAsistenciaRes() {
  const cont = document.getElementById("form-asistencia-res");
  if (!cont) return;

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

  jugadores.forEach((j, i) => {
    const idAzul = `asistencia_azul_${i}`;
    const idRojo = `asistencia_rojo_${i}`;

    formAzul.insertAdjacentHTML("beforeend", `
      <div class="form-check">
        <input class="form-check-input asistencia-checkbox asistencia-azul" type="checkbox" id="${idAzul}" value="${j.nombre}">
        <label class="form-check-label" for="${idAzul}">${j.nombre}</label>
      </div>`);

    formRojo.insertAdjacentHTML("beforeend", `
      <div class="form-check">
        <input class="form-check-input asistencia-checkbox asistencia-rojo" type="checkbox" id="${idRojo}" value="${j.nombre}">
        <label class="form-check-label" for="${idRojo}">${j.nombre}</label>
      </div>`);
  });

  // sincronizar (no puede estar en los dos equipos)
  document.querySelectorAll(".asistencia-azul").forEach(cb => {
    cb.addEventListener("change", e => {
      if (e.target.checked) {
        document.querySelector(`#asistencia_rojo_${e.target.id.split("_")[2]}`).checked = false;
      }
    });
  });
  document.querySelectorAll(".asistencia-rojo").forEach(cb => {
    cb.addEventListener("change", e => {
      if (e.target.checked) {
        document.querySelector(`#asistencia_azul_${e.target.id.split("_")[2]}`).checked = false;
      }
    });
  });

  document.getElementById("publicar-resultado")?.addEventListener("click", async e => {
    e.preventDefault();
    await publicarResultado();
  });
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

  alert("Resultado publicado ✅");
  mostrarHistorial();
}

/* ========== Historial ========== */
async function mostrarHistorial() {
  try {
    const partidos = await getJSON(`${GAS_URL}?type=matches`);
    const cont = document.getElementById("lista-historial");
    if (!cont) return;

    cont.innerHTML = "";
    if (!partidos.length) {
      cont.innerHTML = `<p class="text-muted">No hay partidos guardados.</p>`;
      return;
    }

    partidos.reverse().forEach(p => {
      const html = `
        <div class="col">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${p.fecha}</h5>
              <p class="card-text"><strong>Resultado:</strong> ${p.resultado}</p>
              <div class="row">
                <div class="col-md-6">
                  <h6>Equipo 1</h6>
                  <ul>${p.equipo1.map(n => `<li>${n}</li>`).join("")}</ul>
                </div>
                <div class="col-md-6">
                  <h6>Equipo 2</h6>
                  <ul>${p.equipo2.map(n => `<li>${n}</li>`).join("")}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      cont.insertAdjacentHTML("beforeend", html);
    });
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

function generarEquipos() {
  try {
    const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked"))
      .map(cb => jugadores[Number(cb.value)])
      .map(j => ({ ...j, media: calcularMedia(j), fifa: calcularFifa(j) }));

    if (seleccionados.length < 10 || seleccionados.length > 12) {
      throw new Error("Selecciona entre 10 y 12 jugadores para formar 2 equipos.");
    }

    const intentos = 1500;
    let mejorVar = Infinity;
    let mejor = { eq1: [], eq2: [] };

    const varianzaScore = (a, b) => {
      const sA = teamScore(a);
      const sB = teamScore(b);
      const m = (sA + sB) / 2;
      return ((sA - m) ** 2 + (sB - m) ** 2) / 2;
    };

    for (let i = 0; i < intentos; i++) {
      const mezcla = [...seleccionados].sort(() => Math.random() - 0.5);
      const mitad = Math.floor(seleccionados.length / 2);
      let A = mezcla.slice(0, mitad);
      let B = mezcla.slice(mitad);

      // búsqueda local
      let bestVar = varianzaScore(A, B);
      const itersLocal = 1000;
      for (let k = 0; k < itersLocal; k++) {
        const ia = Math.floor(Math.random() * A.length);
        const ib = Math.floor(Math.random() * B.length);
        const candA = A.slice(), candB = B.slice();
        [candA[ia], candB[ib]] = [candB[ib], candA[ia]];
        const v = varianzaScore(candA, candB);
        if (v < bestVar) { A = candA; B = candB; bestVar = v; }
      }

      // desempates por componentes y fifa promedio
      const avg = (arr, f) => arr.reduce((s, x) => s + f(x), 0) / arr.length;
      const compSpread = scorePonderado(
        { atk: avg(A, j=>j.ataque), def: avg(A, j=>j.defensa), tact: avg(A, j=>j.tactica), sta: avg(A, j=>j.estamina) },
        { atk: avg(B, j=>j.ataque), def: avg(B, j=>j.defensa), tact: avg(B, j=>j.tactica), sta: avg(B, j=>j.estamina) }
      );
      const fifaAvgDiff = Math.abs(
        (A.reduce((s, j) => s + j.fifa, 0) / A.length) -
        (B.reduce((s, j) => s + j.fifa, 0) / B.length)
      );

      const mejorCandidato =
        (bestVar < mejorVar) ||
        (bestVar === mejorVar && compSpread < (mejor.compSpread ?? Infinity)) ||
        (bestVar === mejorVar && compSpread === (mejor.compSpread ?? Infinity) && fifaAvgDiff < (mejor.fifaAvgDiff ?? Infinity));

      if (mejorCandidato) {
        mejorVar = bestVar;
        mejor = { eq1: A, eq2: B, compSpread, fifaAvgDiff };
      }
    }

    const cont = document.getElementById("resultado-equipos");
    if (!mejor.eq1.length || !mejor.eq2.length || !cont) {
      cont.innerHTML = `<div class="alert alert-danger">No se pudieron formar equipos equilibrados.</div>`;
      return;
    }

    // Presentación
    mostrarEquipos([mejor.eq1, mejor.eq2], "resultado-equipos", "partido");
  } catch (error) {
    const cont = document.getElementById("resultado-equipos");
    if (cont) cont.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
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
    return { atk:0, def:0, tact:0, sta:0, fifaAvg:0, score:0, gk:0 };
  }
  const sum = (f)=> team.reduce((s,x)=> s + f(x), 0);
  const atk  = sum(p=>p.ataque)  / team.length;
  const def  = sum(p=>p.defensa) / team.length;
  const tact = sum(p=>p.tactica) / team.length;
  const sta  = sum(p=>p.estamina)/ team.length;
  const fifaAvg = Math.round(sum(p=>calcularFifa(p)) / team.length);
  const score   = teamScore(team) / team.length;
  const gk      = team.some(p => /GK/i.test(p.nombre)) ? 1 : 0;

  return {
    atk:+atk.toFixed(2), def:+def.toFixed(2),
    tact:+tact.toFixed(2), sta:+sta.toFixed(2),
    fifaAvg, score, gk
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
    gkPen = equipos.reduce((acc,t)=> acc + (calcTeamStats(t).gk ? 0 : 1), 0) * 0.5;
  }
  const wVar=1.0, wComp=0.55, wFifa=0.02, wSize=10, wGK=0.35;
  return wVar*varScore + wComp*compStd + wFifa*fifaStd + wSize*sizePen + wGK*gkPen;
}
function optimizeEquipos(seed, targetSizes, iters=4800){
  let teams = seed.map(t=>t.slice());
  const totalGK = seed.flat().filter(p => /GK/i.test(p.nombre)).length;

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
  const seleccionados = Array.from(document.querySelectorAll(".jugador-torneo-checkbox:checked"))
    .map(cb => jugadores[Number(cb.value)]);

  if (!(seleccionados.length >= 20 && seleccionados <= 24)) {
    alert("Selecciona entre 20 y 24 jugadores para generar torneo.");
    return;
  }

  const target = desiredSizes(seleccionados.length, 4);
  const seed = seedSnake(seleccionados, 4, target);
  const equipos = optimizeEquipos(seed, target, 4800);
  mostrarEquipos(equipos, "resultado-torneo", "torneo");
}

/* ========== Arranque ========== */
document.addEventListener("DOMContentLoaded", async () => {
  await cargarAsistencias();
  await cargarJugadores();
  await mostrarHistorial();

  const columnas = ["nombre", "ataque", "defensa", "tactica", "estamina", "puntualidad", "media", "fifa"];
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
});
