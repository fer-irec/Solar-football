// ======= GOOGLE APPS SCRIPT (Sheets) =======
const GAS_URL = "https://script.google.com/macros/s/AKfycbzLe6zSbAf-FP7GBZaDwyRimMjf6Rb6f0gCPWmd8QnF5BCkGIANirYBisEMJHwhe2C5Sw/exec";
const GAS_JUGADORES_URL = GAS_URL; // mismo endpoint para jugadores y acciones

const asistenciaMap = new Map();

// ========== Asistencias ==========
async function cargarAsistencias() {
  try {
    asistenciaMap.clear();
    const res = await fetch(GAS_URL, { method: "GET" });
    const data = await res.json();
    data.forEach(j => asistenciaMap.set(j.nombre, j.asistencia || 0));
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

// ====================== DATOS JUGADORES (dinámico desde Sheets) ======================
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
    renderFormularios(); // Partido + Torneo
    initManualTab();     // Manual
    initAsistenciaResultado(); // Asistencia y Resultado
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

// ========== Render de checkboxes en Partido, Torneo, Manual, Asistencia ==========
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

  // Partido
  formPartido.innerHTML += crearBloque("Habituales", "habituales", habituales, "jugador");
  formPartido.innerHTML += crearBloque("Visitors", "visitors", visitors, "jugador");
  formPartido.innerHTML += crearBloque("Hall of Fame", "hall", hall, "jugador");

  // Torneo
  formTorneo.innerHTML += crearBloque("Habituales", "habituales", habituales, "jugador-torneo");
  formTorneo.innerHTML += crearBloque("Visitors", "visitors", visitors, "jugador-torneo");
  formTorneo.innerHTML += crearBloque("Hall of Fame", "hall", hall, "jugador-torneo");
}

// (initManualTab y demás funciones de generar equipos se mantienen sin cambios)

// ========== Nueva pestaña Asistencia y Resultado ==========
function initAsistenciaResultado() {
  const formAR1 = document.getElementById("form-ar-1");
  const formAR2 = document.getElementById("form-ar-2");
  if (!formAR1 || !formAR2) return;

  formAR1.innerHTML = "";
  formAR2.innerHTML = "";

  jugadores.forEach((j, i) => {
    const id1 = `ar1_${i}`, id2 = `ar2_${i}`;
    formAR1.insertAdjacentHTML("beforeend", `
      <div class="form-check col-md-6">
        <input class="form-check-input jugador-ar-1" type="checkbox" id="${id1}" data-peer="${id2}" value="${i}">
        <label class="form-check-label" for="${id1}">${j.nombre}</label>
      </div>`);
    formAR2.insertAdjacentHTML("beforeend", `
      <div class="form-check col-md-6">
        <input class="form-check-input jugador-ar-2" type="checkbox" id="${id2}" data-peer="${id1}" value="${i}">
        <label class="form-check-label" for="${id2}">${j.nombre}</label>
      </div>`);
  });

  document.getElementById("btn-publicar")?.addEventListener("click", async () => {
    const eq1 = Array.from(document.querySelectorAll(".jugador-ar-1:checked"))
      .map(cb => jugadores[parseInt(cb.value)].nombre);
    const eq2 = Array.from(document.querySelectorAll(".jugador-ar-2:checked"))
      .map(cb => jugadores[parseInt(cb.value)].nombre);
    const goles1 = document.getElementById("goles1").value || "0";
    const goles2 = document.getElementById("goles2").value || "0";

    if (!eq1.length || !eq2.length) {
      alert("Debes seleccionar jugadores en ambos equipos");
      return;
    }

    await guardarPartido({ equipo1: eq1, equipo2: eq2, goles1, goles2 });
    await incrementarAsistencia([...eq1, ...eq2]);

    alert("Partido publicado ✅");
  });
}

// ====================================================
// Aquí se mantienen TODAS LAS DEMÁS FUNCIONES EXISTENTES
// - mostrarHistorial()
// - Algoritmos de equipos (teamScore, costeEquipos, seedSnake, generarEquipos…)
// - generarEquiposTorneo()
// - initManualTab(), generarEquiposManual()
// ====================================================

// ========== Arranque ==========
document.addEventListener("DOMContentLoaded", async () => {
  await cargarAsistencias();
  await cargarJugadores();

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
  document.getElementById("generar-torneo")?.addEventListener("click", () => {
    try { generarEquiposTorneo(); }
    catch (err) {
      const cont = document.getElementById("resultado-torneo");
      if (cont) cont.innerHTML = `<div class="alert alert-danger">Error inesperado: ${err.message}</div>`;
    }
  });
});
