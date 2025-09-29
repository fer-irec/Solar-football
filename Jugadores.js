// ======= GOOGLE APPS SCRIPT (Sheets) =======
const GAS_BASE = "https://script.google.com/macros/s/AKfycbzLe6zSbAf-FP7GBZaDwyRimMjf6Rb6f0gCPWmd8QnF5BCkGIANirYBisEMJHwhe2C5Sw/exec";
const GAS_JUGADORES_URL = GAS_BASE;                // jugadores
const GAS_MATCHES_URL   = GAS_BASE + "?type=matches"; // historial de partidos

// ========== Guardar asistencia y partidos ==========
async function incrementarAsistencia(nombres) {
  try {
    await fetch(GAS_BASE, {
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
    await fetch(GAS_BASE, {
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
    jugadores = jugadores.map(j => ({
      ...j,
      puntualidad: j.puntualidad ?? 3
    }));
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

  // eventos de contador
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
    cb.addEventListener("change", actualizarContadoresManual);
  });
  document.getElementById("generar-manual")?.addEventListener("click", e => {
    e.preventDefault(); generarEquiposManual();
  });
}

// ========== Contadores Manual ==========
function actualizarContadoresManual() {
  const s1 = document.querySelectorAll(".jugador-manual-1:checked").length;
  const s2 = document.querySelectorAll(".jugador-manual-2:checked").length;
  document.getElementById("contador-manual-1").textContent = `Seleccionados: ${s1}`;
  document.getElementById("contador-manual-2").textContent = `Seleccionados: ${s2}`;
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
    const res = await fetch(GAS_MATCHES_URL);
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
