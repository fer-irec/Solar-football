// Lista de jugadores (valores actualizados según tabla ATK/DEF/TACT/STA/Media/FIFA)

const jugadores = [
  { nombre: "Ale", ataque: 2.61, defensa: 2.54, tactica: 1.97, estamina: 2.10, puntualidad: 3 },
  { nombre: "Fer", ataque: 3.33, defensa: 2.90, tactica: 3.00, estamina: 2.00, puntualidad: 3 },
  { nombre: "Jacob", ataque: 4.08, defensa: 3.63, tactica: 3.33, estamina: 3.60, puntualidad: 3 },
  { nombre: "Min", ataque: 1.89, defensa: 1.94, tactica: 1.73, estamina: 1.00, puntualidad: 3 },
  { nombre: "Damian", ataque: 4.65, defensa: 4.11, tactica: 4.37, estamina: 4.15, puntualidad: 3 },
  { nombre: "Mario", ataque: 1.78, defensa: 2.36, tactica: 1.77, estamina: 1.50, puntualidad: 3 },
  { nombre: "Mirko", ataque: 3.71, defensa: 4.09, tactica: 3.60, estamina: 3.50, puntualidad: 3 },
  { nombre: "Queco (GK)", ataque: 1.55, defensa: 4.39, tactica: 4.00, estamina: 4.00, puntualidad: 3 },
  { nombre: "Oriol (GK)", ataque: 1.34, defensa: 4.23, tactica: 3.90, estamina: 4.00, puntualidad: 3 },
  { nombre: "Abel", ataque: 3.05, defensa: 2.95, tactica: 3.10, estamina: 2.25, puntualidad: 3 },
  { nombre: "Arnau", ataque: 4.36, defensa: 3.81, tactica: 4.00, estamina: 3.75, puntualidad: 3 },
  { nombre: "Niccolo", ataque: 3.39, defensa: 3.57, tactica: 3.00, estamina: 2.75, puntualidad: 3 },
  { nombre: "Merino", ataque: 2.90, defensa: 3.63, tactica: 2.40, estamina: 3.25, puntualidad: 3 },
  { nombre: "Liya", ataque: 3.53, defensa: 3.23, tactica: 2.90, estamina: 3.25, puntualidad: 3 },
  { nombre: "Yuancai", ataque: 1.59, defensa: 1.33, tactica: 1.35, estamina: 1.10, puntualidad: 3 },
  { nombre: "Jon", ataque: 2.67, defensa: 2.47, tactica: 2.00, estamina: 2.75, puntualidad: 3 },
  { nombre: "Peña", ataque: 2.79, defensa: 2.69, tactica: 2.05, estamina: 4.40, puntualidad: 3 },
  { nombre: "Manu", ataque: 4.46, defensa: 4.18, tactica: 4.30, estamina: 4.45, puntualidad: 3 },
  { nombre: "Vito", ataque: 3.64, defensa: 4.43, tactica: 3.75, estamina: 3.75, puntualidad: 3 },
  { nombre: "Alex Jimenez", ataque: 4.62, defensa: 4.50, tactica: 4.25, estamina: 4.25, puntualidad: 3 },
  { nombre: "Andrea Maioli", ataque: 4.59, defensa: 4.58, tactica: 4.50, estamina: 4.50, puntualidad: 3 },
  { nombre: "Outman", ataque: 4.46, defensa: 4.90, tactica: 4.00, estamina: 4.75, puntualidad: 3 },
  { nombre: "Harris", ataque: 2.38, defensa: 2.08, tactica: 2.25, estamina: 2.00, puntualidad: 2 },
  { nombre: "Sergio Ramos", ataque: 4.23, defensa: 3.60, tactica: 4.25, estamina: 4.00, puntualidad: 3 },
  { nombre: "Tolga", ataque: 3.44, defensa: 2.87, tactica: 3.55, estamina: 3.30, puntualidad: 3 },
  { nombre: "Amadou", ataque: 3.50, defensa: 3.30, tactica: 3.40, estamina: 3.85, puntualidad: 3 },
  { nombre: "Steven", ataque: 3.04, defensa: 3.08, tactica: 2.50, estamina: 2.50, puntualidad: 3 },
  { nombre: "Ricard", ataque: 2.26, defensa: 2.38, tactica: 1.75, estamina: 2.00, puntualidad: 3 },
  { nombre: "David Rovira", ataque: 2.98, defensa: 2.96, tactica: 2.00, estamina: 2.50, puntualidad: 3 },
  { nombre: "Gustavo Madrigal", ataque: 2.91, defensa: 2.88, tactica: 2.00, estamina: 3.10, puntualidad: 3 },
  { nombre: "Diego", ataque: 1.98, defensa: 2.35, tactica: 1.75, estamina: 1.75, puntualidad: 3 },
  { nombre: "Andrea Aroldi", ataque: 2.17, defensa: 2.01, tactica: 1.40, estamina: 2.30, puntualidad: 3 },
  { nombre: "Vitor", ataque: 2.77, defensa: 2.72, tactica: 2.35, estamina: 2.25, puntualidad: 3 },
  { nombre: "Mario Lecce", ataque: 3.28, defensa: 3.35, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Jeff", ataque: 3.83, defensa: 3.20, tactica: 3.00, estamina: 3.25, puntualidad: 3 },
  { nombre: "Payno", ataque: 3.04, defensa: 2.74, tactica: 2.10, estamina: 2.25, puntualidad: 3 },
  { nombre: "Kevin", ataque: 4.61, defensa: 4.23, tactica: 4.35, estamina: 4.30, puntualidad: 3 },
  { nombre: "Fabien", ataque: 2.98, defensa: 2.85, tactica: 2.00, estamina: 2.90, puntualidad: 3 },
  { nombre: "Romain", ataque: 4.50, defensa: 4.48, tactica: 4.60, estamina: 4.15, puntualidad: 3 },
  { nombre: "Maykel", ataque: 3.01, defensa: 2.84, tactica: 2.25, estamina: 3.00, puntualidad: 3 },
  { nombre: "Alex Lopez", ataque: 3.58, defensa: 3.17, tactica: 2.75, estamina: 2.00, puntualidad: 3 },
  { nombre: "Buda", ataque: 3.59, defensa: 3.82, tactica: 3.25, estamina: 3.85, puntualidad: 3 },
  { nombre: "Massi", ataque: 4.70, defensa: 3.85, tactica: 4.60, estamina: 4.00, puntualidad: 3 },
  { nombre: "Trompia", ataque: 4.60, defensa: 4.53, tactica: 4.80, estamina: 4.40, puntualidad: 3 },
  { nombre: "Treppo", ataque: 3.90, defensa: 3.88, tactica: 3.55, estamina: 3.55, puntualidad: 3 },
  { nombre: "Lori", ataque: 3.55, defensa: 2.95, tactica: 3.30, estamina: 3.20, puntualidad: 3 },
  { nombre: "Tobi (GK)", ataque: 2.26, defensa: 4.05, tactica: 4.15, estamina: 4.15, puntualidad: 3 },
  { nombre: "Dominic", ataque: 3.30, defensa: 3.00, tactica: 2.75, estamina: 2.75, puntualidad: 3 },
  { nombre: "Rolando", ataque: 1.50, defensa: 3.00, tactica: 2.40, estamina: 2.65, puntualidad: 3 },
  { nombre: "Tomas", ataque: 2.85, defensa: 3.10, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Visitor 1 (2)", ataque: 2.00, defensa: 2.00, tactica: 2.00, estamina: 2.00, puntualidad: 2 },
  { nombre: "Visitor 2 (2.5)", ataque: 2.50, defensa: 2.50, tactica: 2.50, estamina: 2.50, puntualidad: 3 },
  { nombre: "Visitor 3 (3)", ataque: 3.50, defensa: 3.50, tactica: 3.50, estamina: 3.50, puntualidad: 3 },
  { nombre: "Elias", ataque: 1.17, defensa: 1.25, tactica: 1.25, estamina: 2.25, puntualidad: 3 },
  { nombre: "Marcelo (GK)", ataque: 0.75, defensa: 4.10, tactica: 3.65, estamina: 3.50, puntualidad: 3 },
  { nombre: "Jorge", ataque: 2.75, defensa: 3.10, tactica: 2.75, estamina: 3.00, puntualidad: 3 },
  { nombre: "Enric Ll.", ataque: 1.50, defensa: 1.50, tactica: 1.35, estamina: 1.75, puntualidad: 3 },
  { nombre: "Codony", ataque: 4.30, defensa: 4.00, tactica: 4.20, estamina: 4.00, puntualidad: 3 },
  { nombre: "Magnus", ataque: 3.00, defensa: 3.00, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Jeremy", ataque: 2.75, defensa: 2.25, tactica: 2.75, estamina: 2.50, puntualidad: 3 },
  { nombre: "Oriol", ataque: 3.80, defensa: 3.80, tactica: 3.80, estamina: 3.80, puntualidad: 3 }
];



function calcularMedia(j) {
  return (j.ataque*0.3 + j.defensa*0.3 + j.tactica*0.2 + j.estamina*0.2 );
}

function calcularFifa(j) {
  return Math.round(calcularMedia(j) * 20);
}

function limitar(valor) {
  return Math.max(0, Math.min(5, valor));
}

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

// ===============================
// Ordenamiento de tabla
// ===============================

let jugadoresOriginal = [...jugadores];
let jugadoresOrdenados = [...jugadores];
let ordenActual = { columna: null, estado: 0 }; // 0: original, 1: desc, 2: asc

function ordenarPor(columna) {
  if (ordenActual.columna !== columna) {
    ordenActual = { columna, estado: 1 };
  } else {
    ordenActual.estado = (ordenActual.estado + 1) % 3;
  }

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
      const valA = valor(a, columna);
      const valB = valor(b, columna);
      return valA < valB ? -1 * dir : valA > valB ? 1 * dir : 0;
    });
  }

  mostrarTabla();
}

// ===============================
// Mostrar tabla
// ===============================

function mostrarTabla() {
  const tbody = document.querySelector("#tabla-jugadores tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const theadRow = document.querySelector("#tabla-jugadores thead tr");
  if (!theadRow) return;

  // Asegura columnas sin duplicados
  //theadRow.querySelectorAll("th.fifa, th.stars").forEach(th => th.remove());
  //if (!theadRow.querySelector("th.fifa")) theadRow.insertAdjacentHTML("beforeend", "<th class='fifa'>FIFA</th>");
  //if (!theadRow.querySelector("th.stars")) theadRow.insertAdjacentHTML("beforeend", "<th class='stars'>Stars</th>");

  jugadoresOrdenados.forEach(j => {
    const mediaVal = limitar(calcularMedia(j));
    const media = mediaVal.toFixed(2);
    const fifa = Math.round(mediaVal * 20);
    const estrellasHTML = generarEstrellasFIFA(fifa);
    const fila = `<tr>
      <td>${j.nombre}</td>
      <td><span class="${colorClase(j.ataque)}">${j.ataque}</span></td>
      <td><span class="${colorClase(j.defensa)}">${j.defensa}</span></td>
      <td><span class="${colorClase(j.tactica)}">${j.tactica}</span></td>
      <td><span class="${colorClase(j.estamina)}">${j.estamina}</span></td>
      <td><span class="${colorClase(j.puntualidad)}">${j.puntualidad ?? '-'}</span></td>
      <td><span class="${colorClase(media)}">${media}</span></td>
      <td><span class="${colorFifa(fifa)}">${fifa}</span></td>
      <td class="stars">${estrellasHTML}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });
}

function fmt2(x) {
  if (x === undefined || x === null || Number.isNaN(x)) return "—";
  return (typeof x === "number" ? x : parseFloat(x)).toFixed(2);
}

function mostrarHistorial() {
  fetch("historial.json")
    .then(res => res.json())
    .then(data => {
      const cont = document.getElementById("lista-historial");
      cont.innerHTML = "";

      data.forEach(partido => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "col";

        const equipoHTML = (eq, color) => `
          <h5><span class="circle ${color}-circle"></span> ${eq.nombre}</h5>
          <p>ATK: ${fmt2(eq.atk)} | DEF: ${fmt2(eq.def)} | TACT: ${fmt2(eq.tact)} | STA: ${fmt2(eq.sta)} | FIFA: ${eq.fifa ?? '—'} | Goles: ${eq.goles ?? '—'}</p>
          <ul class="list-group mb-2">
            ${eq.jugadores.map(j => `<li class="list-group-item">${j}</li>`).join("")}
          </ul>`;

        tarjeta.innerHTML = `
          <div class="card shadow-sm">
            <div class="card-header text-center">
              <div class="fw-bold mb-1">${new Date(partido.fecha).toLocaleDateString("es-ES")}</div>
              <div class="fs-4 fw-bold text-dark">${partido.marcador ?? ''}</div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">${equipoHTML(partido.equipo1, "azul")}</div>
                <div class="col-md-6">${equipoHTML(partido.equipo2, "rojo")}</div>
              </div>
            </div>
          </div>`;
        cont.appendChild(tarjeta);
      });
    })
    .catch(err => {
      document.getElementById("lista-historial").innerHTML = `
        <div class="alert alert-danger">Error al cargar historial: ${err.message}</div>`;
    });
}

document.querySelector('a[href="#historial"]').addEventListener("click", mostrarHistorial);

// ====== NUEVO: util para score ponderado ======
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
      .map(cb => jugadores[parseInt(cb.value)])
      .map(j => ({
        ...j,
        media: calcularMedia(j),
        fifa: calcularFifa(j) // ← Aquí se añade correctamente la propiedad fifa
      }));

    if (seleccionados.length < 10 || seleccionados.length > 12) {
      throw new Error("Selecciona entre 10 y 12 jugadores para formar 2 equipos.");
    }

    let mejorScore = Infinity;
    let mejorTopDiff = Infinity;
    let mejorFifaDiff = Infinity;
    let mejorEq1 = [], mejorEq2 = [];

    for (let i = 0; i < 1000; i++) {
      const mezcla = [...seleccionados].sort(() => Math.random() - 0.5);
      const eq1 = mezcla.slice(0, Math.floor(seleccionados.length / 2));
      const eq2 = mezcla.slice(Math.floor(seleccionados.length / 2));

      const stat = team => ({
        atk: team.reduce((s, x) => s + x.ataque, 0) / team.length,
        def: team.reduce((s, x) => s + x.defensa, 0) / team.length,
        tact: team.reduce((s, x) => s + x.tactica, 0) / team.length,
        sta: team.reduce((s, x) => s + x.estamina, 0) / team.length,
        rating: team.reduce((s, x) => s + calcularMedia(x), 0) / team.length,
        fifa: team.reduce((s, x) => s + x.fifa, 0),
        top: team.filter(x => x.media > 4).length
      });

      const s1 = stat(eq1);
      const s2 = stat(eq2);

      // Score principal ponderado 30/30/20/20
      const diffWeighted = scorePonderado(s1, s2);
      const topDiff = Math.abs(s1.top - s2.top);
      const fifaDiff = Math.abs(s1.fifa - s2.fifa);

      // Elegimos el mejor por: score ponderado -> top players -> fifaDiff
      const mejor = (diffWeighted < mejorScore) ||
                    (diffWeighted === mejorScore && topDiff < mejorTopDiff) ||
                    (diffWeighted === mejorScore && topDiff === mejorTopDiff && fifaDiff < mejorFifaDiff);

      if (mejor) {
        mejorScore = diffWeighted;
        mejorTopDiff = topDiff;
        mejorFifaDiff = fifaDiff;
        mejorEq1 = eq1;
        mejorEq2 = eq2;
      }
    }

    const cont = document.getElementById("resultado-equipos");
    if (!mejorEq1.length || !mejorEq2.length || !cont) {
      cont.innerHTML = `<div class="alert alert-danger">No se pudieron formar equipos equilibrados.</div>`;
      return;
    }

    const s1 = {
      atk: (mejorEq1.reduce((s, j) => s + j.ataque, 0) / mejorEq1.length).toFixed(2),
      def: (mejorEq1.reduce((s, j) => s + j.defensa, 0) / mejorEq1.length).toFixed(2),
      tact: (mejorEq1.reduce((s, j) => s + j.tactica, 0) / mejorEq1.length).toFixed(2),
      sta: (mejorEq1.reduce((s, j) => s + j.estamina, 0) / mejorEq1.length).toFixed(2),
      fifa: mejorEq1.reduce((s, j) => s + j.fifa, 0)
    };
    const s2 = {
      atk: (mejorEq2.reduce((s, j) => s + j.ataque, 0) / mejorEq2.length).toFixed(2),
      def: (mejorEq2.reduce((s, j) => s + j.defensa, 0) / mejorEq2.length).toFixed(2),
      tact: (mejorEq2.reduce((s, j) => s + j.tactica, 0) / mejorEq2.length).toFixed(2),
      sta: (mejorEq2.reduce((s, j) => s + j.estamina, 0) / mejorEq2.length).toFixed(2),
      fifa: mejorEq2.reduce((s, j) => s + j.fifa, 0)
    };

    cont.innerHTML = `
      <div class="col-md-6">
        <h5><span class="circle white-circle"></span><span class="circle blue-circle"></span> Equipo 1</h5>
        <p>ATK: ${s1.atk} | DEF: ${s1.def} | TACT: ${s1.tact} | STA: ${s1.sta} | FIFA: ${s1.fifa}</p>
        <ul class="list-group">
          ${mejorEq1.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${j.media > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
        </ul>
      </div>
      <div class="col-md-6">
        <h5><span class="circle red-circle"></span><span class="circle orange-circle"></span> Equipo 2</h5>
        <p>ATK: ${s2.atk} | DEF: ${s2.def} | TACT: ${s2.tact} | STA: ${s2.sta} | FIFA: ${s2.fifa}</p>
        <ul class="list-group">
          ${mejorEq2.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${j.media > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
        </ul>
      </div>`;
  } catch (error) {
    const cont = document.getElementById("resultado-equipos");
    cont.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  }
}



// Lista de jugadores (asegúrate de incluir esta línea en el archivo o importar desde otro script)
// const jugadores = [...]; // Tu lista completa de jugadores con ataque, defensa, fifa

// ... (resto del código intacto) ...

function generarEquiposTorneo() {
  const seleccionados = Array.from(document.querySelectorAll(".jugador-torneo-checkbox:checked"))
    .map(cb => jugadores[parseInt(cb.value)])
    .map(j => ({
      ...j,
      media: calcularMedia(j),
      fifa: calcularFifa(j) // ← Añadido cálculo de FIFA individual
    }));

  if (seleccionados.length < 20 || seleccionados.length > 24) {
    throw new Error("Selecciona entre 20 y 24 jugadores para el torneo.");
  }

  const intentos = 2000;
  let mejorScore = Infinity;
  let mejorTopDiff = Infinity;
  let mejorCompSpread = Infinity;
  let mejores = null;

  for (let i = 0; i < intentos; i++) {
    const mezcla = [...seleccionados].sort(() => Math.random() - 0.5);
    const eqs = [[], [], [], []];
    mezcla.forEach((j, idx) => eqs[idx % 4].push(j));

    const stats = eqs.map(eq => ({
      atk: eq.reduce((s, j) => s + j.ataque, 0) / eq.length,
      def: eq.reduce((s, j) => s + j.defensa, 0) / eq.length,
      tact: eq.reduce((s, j) => s + j.tactica, 0) / eq.length,
      sta: eq.reduce((s, j) => s + j.estamina, 0) / eq.length,
      rating: eq.reduce((s, j) => s + calcularMedia(j), 0) / eq.length,
      fifa: eq.reduce((s, j) => s + j.fifa, 0),
      top: eq.filter(j => j.media > 4).length
    }));

    // Score principal: rango (max-min) del rating ponderado entre los 4 equipos
    const ratings = stats.map(s => s.rating);
    const score = Math.max(...ratings) - Math.min(...ratings);

    // Desempate 1: rango ponderado por componentes (reduce diferencias extremas en ATK/DEF/TACT/STA)
    const spreadAtk  = Math.max(...stats.map(s => s.atk))  - Math.min(...stats.map(s => s.atk));
    const spreadDef  = Math.max(...stats.map(s => s.def))  - Math.min(...stats.map(s => s.def));
    const spreadTact = Math.max(...stats.map(s => s.tact)) - Math.min(...stats.map(s => s.tact));
    const spreadSta  = Math.max(...stats.map(s => s.sta))  - Math.min(...stats.map(s => s.sta));
    const compSpread = 0.3*spreadAtk + 0.3*spreadDef + 0.2*spreadTact + 0.2*spreadSta;

    // Desempate 2: reparto de top players
    const topCounts = stats.map(s => s.top);
    const topDiff = Math.max(...topCounts) - Math.min(...topCounts);

    const mejor =
      (score < mejorScore) ||
      (score === mejorScore && compSpread < mejorCompSpread) ||
      (score === mejorScore && compSpread === mejorCompSpread && topDiff < mejorTopDiff);

    if (mejor) {
      mejorScore = score;
      mejorCompSpread = compSpread;
      mejorTopDiff = topDiff;
      mejores = { eqs, stats };
    }
  }

  const cont = document.getElementById("resultado-torneo");
  if (!mejores || !cont) {
    cont.innerHTML = `<div class="alert alert-danger">No se pudieron formar equipos equilibrados.</div>`;
    return;
  }

  const colores = ["azul", "blanco", "rojo", "verde"];
  cont.innerHTML = "";
  mejores.eqs.forEach((eq, i) => {
    const s = mejores.stats[i];
    cont.innerHTML += `
      <div class="col-md-6 col-lg-3">
        <h5><span class="circle ${colores[i]}-circle"></span> Equipo ${colores[i].charAt(0).toUpperCase() + colores[i].slice(1)}</h5>
        <p>ATK: ${s.atk.toFixed(2)} | DEF: ${s.def.toFixed(2)} | TACT: ${s.tact.toFixed(2)} | STA: ${s.sta.toFixed(2)} | FIFA: ${s.fifa}</p>
        <ul class="list-group">
          ${eq.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${j.media > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
        </ul>
      </div>`;
  });
}


document.addEventListener("DOMContentLoaded", () => {
  mostrarTabla();

  // Ordenamiento de columnas de la tabla de jugadores
  //const columnas = ["nombre", "ataque", "defensa", "media", "fifa"];
  const columnas = ["nombre", "ataque", "defensa", "tactica", "estamina", "puntualidad", "media", "fifa"];

  document.querySelectorAll("#tabla-jugadores thead th").forEach((th, index) => {
    const columna = columnas[index];
    if (columna) {
      th.classList.add("sortable");
      th.style.cursor = "pointer";
      th.addEventListener("click", () => {
        ordenarPor(columna);

        // Actualizar indicadores visuales de orden
        document.querySelectorAll("#tabla-jugadores thead th").forEach(th =>
          th.classList.remove("orden-asc", "orden-desc")
        );
        if (ordenActual.estado === 1) th.classList.add("orden-desc");
        else if (ordenActual.estado === 2) th.classList.add("orden-asc");
      });
    }
  });

  document.getElementById("generar-equipos")?.addEventListener("click", generarEquipos);
  document.getElementById("generar-torneo")?.addEventListener("click", () => {
    try {
      generarEquiposTorneo();
    } catch (err) {
      const cont = document.getElementById("resultado-torneo");
      if (cont) cont.innerHTML = `<div class="alert alert-danger">Error inesperado: ${err.message}</div>`;
    }
  });

  const checkboxesTorneo = document.querySelectorAll(".jugador-torneo-checkbox");
  const botonTorneo = document.getElementById("generar-torneo");
  checkboxesTorneo.forEach(cb => {
    cb.addEventListener("change", () => {
      const seleccionados = document.querySelectorAll(".jugador-torneo-checkbox:checked").length;
      const aviso = document.getElementById("aviso-torneo") || (() => {
        const div = document.createElement("div");
        div.id = "aviso-torneo";
        div.className = "text-center text-danger mb-2";
        document.getElementById("form-torneo").before(div);
        return div;
      })();

      if (seleccionados < 20 || seleccionados > 24) {
        botonTorneo.disabled = true;
        aviso.textContent = "Selecciona entre 20 y 24 jugadores para poder generar 4 equipos.";
      } else {
        botonTorneo.disabled = false;
        aviso.textContent = "";
      }
    });
  });

  const checkboxes = document.querySelectorAll(".jugador-checkbox");
  const botonGenerar = document.getElementById("generar-equipos");
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const seleccionados = document.querySelectorAll(".jugador-checkbox:checked").length;
      const aviso = document.getElementById("aviso-seleccion") || (() => {
        const div = document.createElement("div");
        div.id = "aviso-seleccion";
        div.className = "text-center text-danger mb-2";
        document.getElementById("form-asistencia").before(div);
        return div;
      })();

      if (seleccionados < 10 || seleccionados > 12) {
        botonGenerar.disabled = true;
        aviso.textContent = "Selecciona entre 10 y 12 jugadores para poder generar equipos.";
      } else {
        botonGenerar.disabled = false;
        aviso.textContent = "";
      }
    });
  });
});
