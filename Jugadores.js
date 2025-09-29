// ======= GOOGLE APPS SCRIPT (Sheets) =======
const GAS_URL = "https://script.google.com/macros/s/AKfycbzLe6zSbAf-FP7GBZaDwyRimMjf6Rb6f0gCPWmd8QnF5BCkGIANirYBisEMJHwhe2C5Sw/exec";
const GAS_JUGADORES_URL = "https://script.google.com/macros/s/AKfycbzLe6zSbAf-FP7GBZaDwyRimMjf6Rb6f0gCPWmd8QnF5BCkGIANirYBisEMJHwhe2C5Sw/exec";

const asistenciaMap = new Map();

// ========== Asistencias ==========
async function cargarAsistencias() {
  try {
    asistenciaMap.clear();
    const res = await fetch(GAS_URL, { method: "GET" });
    const data = await res.json();
    Object.keys(data).forEach(n => asistenciaMap.set(n, data[n] || 0));
  } catch (e) {
    console.warn("No se pudo cargar asistencia:", e);
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

  // Partido
  formPartido.innerHTML += crearBloque("Habituales", "habituales", habituales, "jugador");
  formPartido.innerHTML += crearBloque("Visitors", "visitors", visitors, "jugador");
  formPartido.innerHTML += crearBloque("Hall of Fame", "hall", hall, "jugador");

  // Torneo
  formTorneo.innerHTML += crearBloque("Habituales", "habituales", habituales, "jugador-torneo");
  formTorneo.innerHTML += crearBloque("Visitors", "visitors", visitors, "jugador-torneo");
  formTorneo.innerHTML += crearBloque("Hall of Fame", "hall", hall, "jugador-torneo");

  // === Contadores y validación ===
  function actualizarContadorPartido() {
    const seleccionados = document.querySelectorAll(".jugador-checkbox:checked").length;
    document.getElementById("contador-partido").textContent = `Seleccionados: ${seleccionados}`;
    document.getElementById("generar-equipos").disabled = !(seleccionados >= 10 && seleccionados <= 12);
  }
  document.querySelectorAll(".jugador-checkbox").forEach(cb => cb.addEventListener("change", actualizarContadorPartido));
  actualizarContadorPartido();

  function actualizarContadorTorneo() {
    const seleccionados = document.querySelectorAll(".jugador-torneo-checkbox:checked").length;
    document.getElementById("contador-torneo").textContent = `Seleccionados: ${seleccionados}`;
    document.getElementById("generar-torneo").disabled = !(seleccionados >= 20 && seleccionados <= 24);
  }
  document.querySelectorAll(".jugador-torneo-checkbox").forEach(cb => cb.addEventListener("change", actualizarContadorTorneo));
  actualizarContadorTorneo();
}

// ========== Render de checkboxes en Manual ==========
function initManualTab() {
  const form1 = document.getElementById("form-manual-1");
  const form2 = document.getElementById("form-manual-2");
  if (!form1 || !form2 || !jugadores.length) return;

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
    cb.addEventListener("change", () => actualizarContadoresManual());
  });

  const btn = document.getElementById("generar-manual");
  if (btn) btn.addEventListener("click", (e) => { e.preventDefault(); generarEquiposManual(); });
}

// ========== Funciones Manual ==========
function actualizarContadoresManual() {
  const seleccionados1 = document.querySelectorAll(".jugador-manual-1:checked").length;
  const seleccionados2 = document.querySelectorAll(".jugador-manual-2:checked").length;
  document.getElementById("contador-manual-1").textContent = `Seleccionados: ${seleccionados1}`;
  document.getElementById("contador-manual-2").textContent = `Seleccionados: ${seleccionados2}`;
}

function generarEquiposManual() {
  const sel1 = Array.from(document.querySelectorAll(".jugador-manual-1:checked")).map(cb => jugadores[cb.value]);
  const sel2 = Array.from(document.querySelectorAll(".jugador-manual-2:checked")).map(cb => jugadores[cb.value]);

  const cont = document.getElementById("resultado-manual");
  cont.innerHTML = "";

  function equipoHTML(nombre, lista) {
    const total = lista.reduce((acc, j) => acc + calcularMedia(j), 0).toFixed(2);
    let html = `<div class="col-md-6"><div class="card"><div class="card-header">${nombre}</div><ul class="list-group list-group-flush">`;
    lista.forEach(j => {
      html += `<li class="list-group-item">${j.nombre} (${calcularMedia(j).toFixed(2)})</li>`;
    });
    html += `</ul><div class="card-footer">Puntuación total: ${total}</div></div></div>`;
    return html;
  }

  cont.innerHTML = equipoHTML("Equipo 1", sel1) + equipoHTML("Equipo 2", sel2);
}

// ========== Generar equipos desde Partido ==========
function generarEquipos() {
  const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked")).map(cb => jugadores[cb.value]);
  if (seleccionados.length < 10 || seleccionados.length > 12) {
    alert("Debes seleccionar entre 10 y 12 jugadores.");
    return;
  }

  // Dividir equilibradamente (simple: snake draft)
  seleccionados.sort(() => Math.random() - 0.5); // aleatorio
  const equipo1 = [], equipo2 = [];
  seleccionados.forEach((j, i) => (i % 2 === 0 ? equipo1 : equipo2).push(j));

  const cont = document.getElementById("resultado-equipos");
  cont.innerHTML = equipoHTML("Equipo Azul", equipo1) + equipoHTML("Equipo Rojo", equipo2);

  function equipoHTML(nombre, lista) {
    const total = lista.reduce((acc, j) => acc + calcularMedia(j), 0).toFixed(2);
    let html = `<div class="col-md-6"><div class="card"><div class="card-header">${nombre}</div><ul class="list-group list-group-flush">`;
    lista.forEach(j => {
      html += `<li class="list-group-item">${j.nombre} (${calcularMedia(j).toFixed(2)})</li>`;
    });
    html += `</ul><div class="card-footer">Puntuación total: ${total}</div></div></div>`;
    return html;
  }
}

// ========== Generar equipos desde Torneo ==========
function generarEquiposTorneo() {
  const seleccionados = Array.from(document.querySelectorAll(".jugador-torneo-checkbox:checked")).map(cb => jugadores[cb.value]);
  if (seleccionados.length < 20 || seleccionados.length > 24) {
    alert("Debes seleccionar entre 20 y 24 jugadores.");
    return;
  }

  // Mezclar jugadores
  seleccionados.sort(() => Math.random() - 0.5);

  // Dividir en 4 equipos equilibrados
  const equipos = [[], [], [], []];
  seleccionados.forEach((j, i) => equipos[i % 4].push(j));

  const cont = document.getElementById("resultado-torneo");
  cont.innerHTML = "";
  equipos.forEach((eq, idx) => {
    cont.innerHTML += equipoHTML(`Equipo ${idx + 1}`, eq);
  });

  function equipoHTML(nombre, lista) {
    const total = lista.reduce((acc, j) => acc + calcularMedia(j), 0).toFixed(2);
    let html = `<div class="col-md-6 col-lg-3"><div class="card"><div class="card-header">${nombre}</div><ul class="list-group list-group-flush">`;
    lista.forEach(j => {
      html += `<li class="list-group-item">${j.nombre} (${calcularMedia(j).toFixed(2)})</li>`;
    });
    html += `</ul><div class="card-footer">Puntuación total: ${total}</div></div></div>`;
    return html;
  }
}

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
  document.getElementById("generar-torneo")?.addEventListener("click", generarEquiposTorneo);
});
