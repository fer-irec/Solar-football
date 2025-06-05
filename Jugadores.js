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

function calcularMedia(j) {
  return (j.ataque + j.defensa) / 2;
}

function calcularFifa(j) {
  return Math.round(calcularMedia(j) * 20);
}

function mostrarTabla() {
  const tbody = document.querySelector("#tabla-jugadores tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const thead = document.querySelector("#tabla-jugadores thead tr");

  if (!thead.querySelector("th.fifa")) thead.insertAdjacentHTML("beforeend", "<th class='fifa'>FIFA</th>");
  if (!thead.querySelector("th.stars")) thead.insertAdjacentHTML("beforeend", "<th class='stars'>Stars</th>");

  const allFifaTh = thead.querySelectorAll("th.fifa");
  const allStarsTh = thead.querySelectorAll("th.stars");
  for (let i = 1; i < allFifaTh.length; i++) allFifaTh[i].remove();
  for (let i = 1; i < allStarsTh.length; i++) allStarsTh[i].remove();

  jugadores.forEach(j => {
    const media = limitar(calcularMedia(j)).toFixed(2);
    const fifa = calcularFifa(j);
    const estrellasHTML = generarEstrellasFIFA(fifa);
    const fila = `<tr>
      <td>${j.nombre}</td>
      <td><span class="${colorClase(j.ataque)}">${j.ataque}</span></td>
      <td><span class="${colorClase(j.defensa)}">${j.defensa}</span></td>
      <td><span class="${colorClase(media)}">${media}</span></td>
      <td><span class="${colorFifa(fifa)}">${fifa}</span></td>
      <td>${estrellasHTML}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });
}

let ordenActual = {
  columna: null,
  ascendente: true
};

function ordenarPor(columna) {
  if (ordenActual.columna === columna) {
    ordenActual.ascendente = !ordenActual.ascendente;
  } else {
    ordenActual.columna = columna;
    ordenActual.ascendente = false;
  }

  jugadores.sort((a, b) => {
    let valA = columna === 'nombre' ? a[columna].toLowerCase() : columna === 'media' ? calcularMedia(a) : columna === 'fifa' ? calcularFifa(a) : a[columna];
    let valB = columna === 'nombre' ? b[columna].toLowerCase() : columna === 'media' ? calcularMedia(b) : columna === 'fifa' ? calcularFifa(b) : b[columna];

    if (valA < valB) return ordenActual.ascendente ? -1 : 1;
    if (valA > valB) return ordenActual.ascendente ? 1 : -1;
    return 0;
  });

  mostrarTabla();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#tabla-jugadores thead th").forEach((th, index) => {
    const mapeo = ["nombre", "ataque", "defensa", "media", "fifa"];
    const columna = mapeo[index];
    if (columna) {
      th.style.cursor = "pointer";
      th.addEventListener("click", () => {
        ordenarPor(columna);
        document.querySelectorAll("#tabla-jugadores thead th").forEach(th => th.classList.remove("orden-asc", "orden-desc"));
        th.classList.add(ordenActual.ascendente ? "orden-asc" : "orden-desc");
      });
    }
  });
});
