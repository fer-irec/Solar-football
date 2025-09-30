// ======= GOOGLE APPS SCRIPT (Sheets) =======
const GAS_URL = "https://script.google.com/macros/s/AKfycbzLe6zSbAf-FP7GBZaDwyRimMjf6Rb6f0gCPWmd8QnF5BCkGIANirYBisEMJHwhe2C5Sw/exec";
const GAS_JUGADORES_URL = GAS_URL; // mismo endpoint sirve jugadores + matches

const asistenciaMap = new Map();

// ========== Asistencias ==========
async function cargarAsistencias() {
  try {
    asistenciaMap.clear();
    const res = await fetch(GAS_URL, { method: "GET" });
    const data = await res.json();
    if (data && !Array.isArray(data)) {
      Object.keys(data).forEach(n => asistenciaMap.set(n, data[n] || 0));
    }
  } catch (e) {
    console.warn("No se pudo cargar asistencia:", e);
  }
}

async function incrementarAsistencia(nombres) {
  try {
    await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ type: "incAttendance", names: nombres })
    });
  } catch (e) {
    alert("Error al guardar asistencia: " + e.message);
  }
}

async function guardarPartido(partido) {
  try {
    await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ type: "saveMatch", match: partido })
    });
  } catch (e) {
    alert("Error al guardar el partido: " + e.message);
  }
}

// ====================== DATOS JUGADORES ======================
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

// ====== util de medias/colores/estrellas ======
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

// ====== Algoritmo "estrella + flojos" (equilibrio equipos) ======
const ALPHA = 3.0;
const GAMMA = 0.75;
const DELTA = 0.5;
const STAR_CUTOFF = 3.75;
const LOW_CUTOFF  = 2.00;

function teamScore(team) {
  const ratings = team.map(p => calcularMedia(p));
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

  const orphanPenalty = GAMMA * Math.max(0, nLow - 2*nStar);
  const starPenalty   = DELTA * Math.max(0, nStar - 2);

  return base + carryBonus - orphanPenalty - starPenalty;
}

function scorePonderado(a, b) {
  const dAtk  = Math.abs(a.atk  - b.atk);
  const dDef  = Math.abs(a.def  - b.def);
  const dTact = Math.abs(a.tact - b.tact);
  const dSta  = Math.abs(a.sta  - b.sta);
  return 0.3*dAtk + 0.3*dDef + 0.2*dTact + 0.2*dSta;
}

// ========== Ordenación de tabla ==========
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

// ========== Mostrar tabla ==========
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
      <td><span class="${colorClase(j.ataque)}">${j.ataque.toFixed(2)}</span></td>
      <td><span class="${colorClase(j.defensa)}">${j.defensa.toFixed(2)}</span></td>
      <td><span class="${colorClase(j.tactica)}">${j.tactica.toFixed(2)}</span></td>
      <td><span class="${colorClase(j.estamina)}">${j.estamina.toFixed(2)}</span></td>
      <td><span class="${colorClase(j.puntualidad)}">${j.puntualidad ?? '-'}</span></td>
      <td><span class="${colorClase(media)}">${media}</span></td>
      <td><span class="${colorFifa(fifa)}">${fifa}</span></td>
      <td class="stars">${estrellasHTML}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });
}

// ========== Render de checkboxes en Partido y Torneo ==========
function renderFormularios() {
  const formPartido = document.getElementById("form-asistencia");
  const formTorneo = document.getElementById("form-torneo");
  if (!formPartido || !formTorneo) return;

  formPartido.innerHTML = "";
  formTorneo.innerHTML = "";

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

  formTorneo.innerHTML += crearBloque("Habituales", "habituales", habituales, "jugador-torneo");
  formTorneo.innerHTML += crearBloque("Visitors", "visitors", visitors, "jugador-torneo");
  formTorneo.innerHTML += crearBloque("Hall of Fame", "hall", hall, "jugador-torneo");

  document.querySelectorAll(".jugador-checkbox").forEach(cb => {
    cb.addEventListener("change", actualizarContadorPartido);
  });
  document.querySelectorAll(".jugador-torneo-checkbox").forEach(cb => {
    cb.addEventListener("change", actualizarContadorTorneo);
  });
}

// ========== Contadores ==========
function actualizarContadorPartido() {
  const seleccionados = document.querySelectorAll(".jugador-checkbox:checked").length;
  document.getElementById("contador-partido").textContent = `Seleccionados: ${seleccionados}`;
  document.getElementById("generar-equipos").disabled = !(seleccionados >= 10 && seleccionados <= 12);
}
function actualizarContadorTorneo() {
  const seleccionados = document.querySelectorAll(".jugador-torneo-checkbox:checked").length;
  document.getElementById("contador-torneo").textContent = `Seleccionados: ${seleccionados}`;
  document.getElementById("generar-torneo").disabled = !(seleccionados >= 20 && seleccionados <= 24);
}

// ========== Algoritmo de equipos ==========
function generarEquipos() {
  try {
    const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked"))
      .map(cb => jugadores[parseInt(cb.value)])
      .map(j => ({
        ...j,
        media: calcularMedia(j),
        fifa: calcularFifa(j)
      }));

    if (seleccionados.length < 10 || seleccionados.length > 12) {
      throw new Error("Selecciona entre 10 y 12 jugadores para formar 2 equipos.");
    }

    const intentos = 1500;
    let mejorVar = Infinity;
    let mejor = { eq1: [], eq2: [] };

    for (let i = 0; i < intentos; i++) {
      const mezcla = [...seleccionados].sort(() => Math.random() - 0.5);
      const mitad = Math.floor(seleccionados.length / 2);
      let A = mezcla.slice(0, mitad);
      let B = mezcla.slice(mitad);

      const itersLocal = 1000;
      const varianzaScore = (a, b) => {
        const sA = teamScore(a);
        const sB = teamScore(b);
        const m = (sA + sB) / 2;
        return ((sA - m) ** 2 + (sB - m) ** 2) / 2;
      };

      let bestVar = varianzaScore(A, B);
      for (let k = 0; k < itersLocal; k++) {
        const ia = Math.floor(Math.random() * A.length);
        const ib = Math.floor(Math.random() * B.length);
        const candA = A.slice(), candB = B.slice();
        [candA[ia], candB[ib]] = [candB[ib], candA[ia]];
        const v = varianzaScore(candA, candB);
        if (v < bestVar) {
          A = candA; B = candB; bestVar = v;
        }
      }

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

    const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
    const s1 = {
      atk: (sum(mejor.eq1, j => j.ataque) / mejor.eq1.length).toFixed(2),
      def: (sum(mejor.eq1, j => j.defensa) / mejor.eq1.length).toFixed(2),
      tact: (sum(mejor.eq1, j => j.tactica) / mejor.eq1.length).toFixed(2),
      sta: (sum(mejor.eq1, j => j.estamina) / mejor.eq1.length).toFixed(2),
      fifaAvg: Math.round(sum(mejor.eq1, j => j.fifa) / mejor.eq1.length)
    };
    const s2 = {
      atk: (sum(mejor.eq2, j => j.ataque) / mejor.eq2.length).toFixed(2),
      def: (sum(mejor.eq2, j => j.defensa) / mejor.eq2.length).toFixed(2),
      tact: (sum(mejor.eq2, j => j.tactica) / mejor.eq2.length).toFixed(2),
      sta: (sum(mejor.eq2, j => j.estamina) / mejor.eq2.length).toFixed(2),
      fifaAvg: Math.round(sum(mejor.eq2, j => j.fifa) / mejor.eq2.length)
    };

    cont.innerHTML = `
      <div class="col-md-6">
        <h5><span class="circle blanco-circle"></span><span class="circle azul-circle"></span> Equipo 1</h5>
        <p>ATK: ${s1.atk} | DEF: ${s1.def} | TACT: ${s1.tact} | STA: ${s1.sta} | FIFA: ${s1.fifaAvg}</p>
        <ul class="list-group">
          ${mejor.eq1.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${calcularMedia(j) > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
        </ul>
      </div>
      <div class="col-md-6">
        <h5><span class="circle rojo-circle"></span><span class="circle naranja-circle"></span> Equipo 2</h5>
        <p>ATK: ${s2.atk} | DEF: ${s2.def} | TACT: ${s2.tact} | STA: ${s2.sta} | FIFA: ${s2.fifaAvg}</p>
        <ul class="list-group">
          ${mejor.eq2.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${calcularMedia(j) > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
        </ul>
      </div>`;
  } catch (error) {
    const cont = document.getElementById("resultado-equipos");
    cont.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  }
}

// ========== Torneo (se mantiene igual, pero podemos mejorar luego) ==========
function generarEquiposTorneo() {
  const seleccionados = Array.from(document.querySelectorAll(".jugador-torneo-checkbox:checked"))
    .map(cb => jugadores[cb.value]);

  if (!(seleccionados.length >= 20 && seleccionados <= 24)) {
    alert("Selecciona entre 20 y 24 jugadores para generar torneo.");
    return;
  }

  const equipos = [];
  const tam = Math.ceil(seleccionados.length / 4);
  for (let i = 0; i < 4; i++) {
    equipos.push(seleccionados.slice(i*tam, (i+1)*tam));
  }

  mostrarEquipos(equipos, "resultado-torneo", "torneo");
}

// ========== Mostrar equipos con estilos ==========
function mostrarEquipos(equipos, contenedorId, modo="torneo") {
  const colores = ["azul-circle", "blanco-circle", "rojo-circle", "verde-circle"];
  const nombresColores = ["Azul", "Blanco", "Rojo", "Verde"];
  const cont = document.getElementById(contenedorId);
  if (!cont) return;
  cont.innerHTML = "";

  equipos.forEach((equipo, idx) => {
    let totalAtk=0, totalDef=0, totalTac=0, totalSta=0;
    equipo.forEach(j => {
      totalAtk += j.ataque;
      totalDef += j.defensa;
      totalTac += j.tactica;
      totalSta += j.estamina;
    });
    const mediaAtk = (totalAtk / equipo.length).toFixed(2);
    const mediaDef = (totalDef / equipo.length).toFixed(2);
    const mediaTac = (totalTac / equipo.length).toFixed(2);
    const mediaSta = (totalSta / equipo.length).toFixed(2);
    const fifa = Math.round(((+mediaAtk*0.3 + +mediaDef*0.3 + +mediaTac*0.2 + +mediaSta*0.2)) * 20);

    const capitan = equipo.reduce((max, j) =>
      calcularFifa(j) > calcularFifa(max) ? j : max, equipo[0]);

    let titulo = "";
    if (modo === "torneo") {
      titulo = `<span class="circle ${colores[idx]}"></span> Equipo ${nombresColores[idx]}`;
    } else { // partido
      if (idx === 0) titulo = `<span class="circle blanco-circle"></span><span class="circle azul-circle"></span> Equipo 1`;
      else titulo = `<span class="circle rojo-circle"></span><span class="circle naranja-circle"></span> Equipo 2`;
    }

    let html = `
      <div class="col-md-6 mb-3">
        <div class="equipo-box" style="background:#f9f9f9;border:2px solid #ddd;">
          <h4>${titulo}</h4>
          <p>ATK: ${mediaAtk} | DEF: ${mediaDef} | TACT: ${mediaTac} | STA: ${mediaSta} | FIFA: ${fifa}</p>
          <ul>
            ${equipo.map(j =>
              `<li>${j.nombre} ${generarEstrellasFIFA(calcularFifa(j))} ${j === capitan ? "<strong>(C)</strong>" : ""}</li>`
            ).join("")}
          </ul>
        </div>
      </div>`;
    cont.insertAdjacentHTML("beforeend", html);
  });
}

// ========== Render Manual ==========
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
    e.preventDefault(); generarEquiposManual();
  });
}

// sincronizar manual
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

// contadores manual
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

// ========== Asistencia y Resultado ==========
function renderAsistenciaRes() {
  const formRes = document.getElementById("form-asistencia-res");
  if (!formRes) return;

  function crearBloque(titulo, clase, lista) {
    if (!lista.length) return "";
    let html = `<div class="player-block ${clase}"><h5>${titulo}</h5><div class="player-grid">`;
    lista.forEach((j, i) => {
      const id = `asistencia_${i}_${clase}`;
      html += `
        <div class="form-check">
          <input class="form-check-input asistencia-checkbox" type="checkbox" id="${id}" value="${j.nombre}">
          <label class="form-check-label" for="${id}">${j.nombre}</label>
        </div>`;
    });
    html += "</div></div>";
    return html;
  }

  const habituales = jugadores.filter(j => j.grupo === "habitual");
  const visitors   = jugadores.filter(j => j.grupo === "visitor");
  const hall       = jugadores.filter(j => j.grupo === "hall");

  formRes.innerHTML = "";
  formRes.innerHTML += crearBloque("Habituales", "habituales", habituales);
  formRes.innerHTML += crearBloque("Visitors", "visitors", visitors);
  formRes.innerHTML += crearBloque("Hall of Fame", "hall", hall);

  document.getElementById("publicar-resultado")?.addEventListener("click", e => {
    e.preventDefault(); publicarResultado();
  });
}

async function publicarResultado() {
  const fecha = document.getElementById("match-date").value || new Date().toISOString().slice(0,10);
  const goles1 = document.getElementById("goles1").value;
  const goles2 = document.getElementById("goles2").value;
  const seleccionados = Array.from(document.querySelectorAll(".asistencia-checkbox:checked")).map(cb => cb.value);

  if (!seleccionados.length) {
    alert("Selecciona jugadores antes de publicar.");
    return;
  }

  const mitad = Math.ceil(seleccionados.length/2);
  const equipo1 = seleccionados.slice(0, mitad);
  const equipo2 = seleccionados.slice(mitad);

  await guardarPartido({ fecha, goles1, goles2, equipo1, equipo2 });
  await incrementarAsistencia(seleccionados);

  alert("Resultado publicado ✅");
  mostrarHistorial();
}

// ========== Historial ==========
async function mostrarHistorial() {
  try {
    const res = await fetch(`${GAS_URL}?type=matches`);
    const partidos = await res.json();
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

// ========== Arranque ==========
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
