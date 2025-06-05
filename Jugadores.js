// Lista de jugadores (solo ataque y defensa)
const jugadores = [
  { nombre: "Ale", ataque: 2.62, defensa: 2.57 },
  { nombre: "Fer", ataque: 3.30, defensa: 3.10 },
  { nombre: "Jacob", ataque: 4.13, defensa: 3.67 },
  { nombre: "Min", ataque: 1.93, defensa: 1.92 },
  { nombre: "Damian", ataque: 4.52, defensa: 4.01 },
  { nombre: "Mario", ataque: 1.72, defensa: 2.37 },
  { nombre: "Mirko", ataque: 3.65, defensa: 3.98 },
  { nombre: "Queco (GK)", ataque: 1.38, defensa: 4.25 },
  { nombre: "Oriol (GK)", ataque: 1.28, defensa: 4.10 },
  { nombre: "Abel", ataque: 3.0, defensa: 2.95 },
  { nombre: "Arnau", ataque: 4.25, defensa: 3.99 },
  { nombre: "Niccolo", ataque: 3.70, defensa: 3.73 },
  { nombre: "Merino", ataque: 3.0, defensa: 3.74 },
  { nombre: "Liya", ataque: 3.53, defensa: 3.38 },
  { nombre: "Yuancai", ataque: 1.6, defensa: 1.6 },
  { nombre: "Jon", ataque: 2.63, defensa: 2.45 },
  { nombre: "Peña", ataque: 2.70, defensa: 2.68 },
  { nombre: "Manu", ataque: 4.47, defensa: 4.08 },
  { nombre: "Vito", ataque: 3.73, defensa: 4.33 },
  { nombre: "Alex Jimenez", ataque: 4.53, defensa: 4.42 },
  { nombre: "Andrea Maioli", ataque: 4.58, defensa: 4.48 },
  { nombre: "Outman", ataque: 4.37, defensa: 4.87 },
  { nombre: "Harris", ataque: 2.35, defensa: 2.15 },
  { nombre: "Sergio Ramos", ataque: 3.65, defensa: 3.35 },
  { nombre: "Tolga", ataque: 3.45, defensa: 3.0 },
  { nombre: "Amadou**", ataque: 3, defensa: 3 },
  { nombre: "Steven", ataque: 3.05, defensa: 3.1 },
  { nombre: "Ricard", ataque: 2.4, defensa: 2.5 },
  { nombre: "David Rovira", ataque: 3.03, defensa: 3.03 },
  { nombre: "Gustavo Madrigal", ataque: 2.81, defensa: 3.01 },
  { nombre: "Diego", ataque: 2.02, defensa: 2.42 },
  { nombre: "Andrea Aroldi", ataque: 1.92, defensa: 1.92 },
  { nombre: "Vitor", ataque: 2.76, defensa: 2.72 },
  { nombre: "Mario Lecce", ataque: 3.37, defensa: 3.47 },
  { nombre: "Jeff", ataque: 3.9, defensa: 3.66 },
  { nombre: "Payno", ataque: 3.27, defensa: 3.47 },
  { nombre: "Kevin", ataque: 4.69, defensa: 4.32 },
  { nombre: "Fabien", ataque: 3.13, defensa: 3.13 },
  { nombre: "Romain", ataque: 4.42, defensa: 4.34 },
  { nombre: "Maykel", ataque: 3.25, defensa: 3.18 },
  { nombre: "Alex Lopez", ataque: 3.5, defensa: 3.35 },
  { nombre: "Buda", ataque: 3.68, defensa: 3.84 },
  { nombre: "Massi", ataque: 4.7, defensa: 4 },
  { nombre: "Trompia", ataque: 4.65, defensa: 4.25 },
  { nombre: "Treppo", ataque: 3.9, defensa: 3.5 },
  { nombre: "Lori", ataque: 3.5, defensa: 2.92 },
  { nombre: "Tobi", ataque: 2.62, defensa: 4.03 },
  { nombre: "Dominic**", ataque: 3.5, defensa: 3.5 },
  { nombre: "Rolando**", ataque: 3.0, defensa: 3.0 },
  { nombre: "Tomas**", ataque: 3.5, defensa: 3.2 },
  { nombre: "Visitor 1 (2.5)", ataque: 2.5, defensa: 2.5 },
  { nombre: "Visitor 2( 2.5)", ataque: 2.5, defensa: 2.5 },
  { nombre: "Visitor 3 (3)", ataque: 3, defensa: 3 }
];

// Funciones de cálculo
function calcularMedia(j) {
  return (j.ataque + j.defensa) / 2;
}

function calcularFifa(j) {
  return Math.round(calcularMedia(j) * 20);
}

function limitar(valor) {
  return Math.max(0, Math.min(5, valor));
}

// Funciones visuales
function colorClase(valor) {
  if (valor < 1.5) return "valor-rojo";
  if (valor < 2.5) return "valor-naranja";
  if (valor < 3.5) return "valor-amarillo";
  if (valor < 4.5) return "valor-verde-claro";
  return "valor-verde-oscuro";
}

function colorFifa(valor) {
  if (valor < 20) return "valor-rojo";
  if (valor < 40) return "valor-naranja";
  if (valor < 60) return "valor-amarillo";
  if (valor < 80) return "valor-verde-claro";
  return "valor-verde-oscuro";
}

function generarEstrellasFIFA(puntuacion) {
  const total = 5;
  const normalizado = Math.max(0, Math.min(puntuacion, 100)) / 100 * total;
  const llenas = Math.floor(normalizado);
  const decimal = normalizado - llenas;

  let media = 0;
  if (decimal >= 0.75) media = 1;
  else if (decimal >= 0.25) media = 0.5;

  let estrellas = "";
  for (let i = 0; i < llenas; i++) estrellas += '<i class="fas fa-star"></i>';
  if (media === 1) estrellas += '<i class="fas fa-star"></i>';
  else if (media === 0.5) estrellas += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < total - llenas - (media ? 1 : 0); i++) estrellas += '<i class="far fa-star"></i>';

  return `<span class="fifa-stars">${estrellas}</span>`;
}

// Render de tabla
function mostrarTabla() {
  const tbody = document.querySelector("#tabla-jugadores tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  jugadores.forEach(j => {
    const media = limitar(calcularMedia(j)).toFixed(2);
    const fifa = calcularFifa(j);
    const fila = `<tr>
      <td>${j.nombre}</td>
      <td><span class="${colorClase(j.ataque)}">${j.ataque}</span></td>
      <td><span class="${colorClase(j.defensa)}">${j.defensa}</span></td>
      <td><span class="${colorClase(media)}">${media}</span></td>
      <td><span class="${colorFifa(fifa)}">${fifa}</span></td>
      <td>${generarEstrellasFIFA(fifa)}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });
}

// Ordenamiento
let ordenActual = { columna: null, ascendente: true };

function ordenarPor(columna) {
  if (ordenActual.columna === columna) {
    ordenActual.ascendente = !ordenActual.ascendente;
  } else {
    ordenActual.columna = columna;
    ordenActual.ascendente = false;
  }

  jugadores.sort((a, b) => {
    let valA = columna === 'nombre' ? a[columna].toLowerCase() :
               columna === 'media' ? calcularMedia(a) :
               columna === 'fifa' ? calcularFifa(a) :
               a[columna];
    let valB = columna === 'nombre' ? b[columna].toLowerCase() :
               columna === 'media' ? calcularMedia(b) :
               columna === 'fifa' ? calcularFifa(b) :
               b[columna];
    if (valA < valB) return ordenActual.ascendente ? -1 : 1;
    if (valA > valB) return ordenActual.ascendente ? 1 : -1;
    return 0;
  });

  mostrarTabla();
}

// Generar equipos
function generarEquipos() {
  const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked"))
    .map(cb => jugadores[parseInt(cb.value)]);
  if (seleccionados.length < 10 || seleccionados.length > 12) {
    alert("Selecciona entre 10 y 12 jugadores para formar 2 equipos.");
    return;
  }

  let mejorScore = Infinity, mejorTopDiff = Infinity;
  let mejorEq1 = [], mejorEq2 = [];

  for (let i = 0; i < 1000; i++) {
    const mezcla = [...seleccionados].sort(() => Math.random() - 0.5);
    const eq1 = mezcla.slice(0, Math.floor(seleccionados.length / 2));
    const eq2 = mezcla.slice(Math.floor(seleccionados.length / 2));

    const stat = team => {
      const medias = team.map(calcularMedia);
      return {
        atk: team.reduce((s, x) => s + x.ataque, 0) / team.length,
        def: team.reduce((s, x) => s + x.defensa, 0) / team.length,
        fifa: medias.reduce((s, m) => s + Math.round(m * 20), 0),
        top: medias.filter(m => m > 4).length
      };
    };

    const s1 = stat(eq1);
    const s2 = stat(eq2);
    const diff = Math.abs(s1.atk - s2.atk) + Math.abs(s1.def - s2.def);
    const topDiff = Math.abs(s1.top - s2.top);

    if (diff < mejorScore || (diff === mejorScore && topDiff < mejorTopDiff)) {
      mejorScore = diff;
      mejorTopDiff = topDiff;
      mejorEq1 = eq1;
      mejorEq2 = eq2;
    }
  }

  const cont = document.getElementById("resultado-equipos");
  if (!cont) return;

  const s1 = {
    atk: (mejorEq1.reduce((s, j) => s + j.ataque, 0) / mejorEq1.length).toFixed(2),
    def: (mejorEq1.reduce((s, j) => s + j.defensa, 0) / mejorEq1.length).toFixed(2),
    fifa: mejorEq1.reduce((s, j) => s + calcularFifa(j), 0)
  };
  const s2 = {
    atk: (mejorEq2.reduce((s, j) => s + j.ataque, 0) / mejorEq2.length).toFixed(2),
    def: (mejorEq2.reduce((s, j) => s + j.defensa, 0) / mejorEq2.length).toFixed(2),
    fifa: mejorEq2.reduce((s, j) => s + calcularFifa(j), 0)
  };

  cont.innerHTML = `
    <div class="col-md-6"><h5>Equipo 1</h5><p>ATK: ${s1.atk} | DEF: ${s1.def} | FIFA: ${s1.fifa}</p>
      <ul class="list-group">
        ${mejorEq1.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(calcularFifa(j))}</li>`).join("")}
      </ul>
    </div>
    <div class="col-md-6"><h5>Equipo 2</h5><p>ATK: ${s2.atk} | DEF: ${s2.def} | FIFA: ${s2.fifa}</p>
      <ul class="list-group">
        ${mejorEq2.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(calcularFifa(j))}</li>`).join("")}
      </ul>
    </div>`;
}

// Generar torneo
function generarEquiposTorneo() {
  const seleccionados = Array.from(document.querySelectorAll(".jugador-torneo-checkbox:checked"))
    .map(cb => jugadores[parseInt(cb.value)]);
  if (seleccionados.length < 20 || seleccionados.length > 24) {
    alert("Selecciona entre 20 y 24 jugadores para el torneo.");
    return;
  }

  let mejorScore = Infinity, mejorTopDiff = Infinity, mejores = null;
  for (let i = 0; i < 2000; i++) {
    const mezcla = [...seleccionados].sort(() => Math.random() - 0.5);
    const eqs = [[], [], [], []];
    mezcla.forEach((j, idx) => eqs[idx % 4].push(j));

    const stats = eqs.map(eq => {
      const medias = eq.map(calcularMedia);
      return {
        atk: eq.reduce((s, j) => s + j.ataque, 0) / eq.length,
        def: eq.reduce((s, j) => s + j.defensa, 0) / eq.length,
        fifa: medias.reduce((s, m) => s + Math.round(m * 20), 0),
        top: medias.filter(m => m > 4).length
      };
    });

    const atkDiff = Math.max(...stats.map(s => s.atk)) - Math.min(...stats.map(s => s.atk));
    const defDiff = Math.max(...stats.map(s => s.def)) - Math.min(...stats.map(s => s.def));
    const score = atkDiff + defDiff;
    const topDiff = Math.max(...stats.map(s => s.top)) - Math.min(...stats.map(s => s.top));

    if (score < mejorScore || (score === mejorScore && topDiff < mejorTopDiff)) {
      mejorScore = score;
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
        <h5>Equipo ${colores[i]}</h5>
        <p>ATK: ${s.atk.toFixed(2)} | DEF: ${s.def.toFixed(2)} | FIFA: ${s.fifa}</p>
        <ul class="list-group">
          ${eq.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(calcularFifa(j))}</li>`).join("")}
        </ul>
      </div>`;
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  mostrarTabla();
  document.querySelectorAll("#tabla-jugadores thead th").forEach((th, index) => {
    const mapeo = ["nombre", "ataque", "defensa", "media", "fifa"];
    const columna = mapeo[index];
    if (columna) {
      th.style.cursor = "pointer";
      th.addEventListener("click", () => {
        ordenarPor(columna);
        document.querySelectorAll("#tabla-jugadores thead th").forEach(th =>
          th.classList.remove("orden-asc", "orden-desc")
        );
        th.classList.add(ordenActual.ascendente ? "orden-asc" : "orden-desc");
      });
    }
  });

  document.getElementById("generar-equipos")?.addEventListener("click", generarEquipos);
  document.getElementById("generar-torneo")?.addEventListener("click", generarEquiposTorneo);
});
