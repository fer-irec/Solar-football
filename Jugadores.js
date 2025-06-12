// Lista de jugadores (solo ataque y defensa)
const jugadores = [
  { nombre: "Ale", ataque: 2.60, defensa: 2.56 },
  { nombre: "Fer", ataque: 3.39, defensa: 3.10 },
  { nombre: "Jacob", ataque: 4.17, defensa: 3.56 },
  { nombre: "Min", ataque: 1.91, defensa: 1.90 },
  { nombre: "Damian", ataque: 4.63, defensa: 4.02 },
  { nombre: "Mario", ataque: 1.78, defensa: 2.29 },
  { nombre: "Mirko", ataque: 3.69, defensa: 4.01 },
  { nombre: "Queco (GK)", ataque: 1.55, defensa: 4.47 },
  { nombre: "Oriol (GK)", ataque: 1.34, defensa: 4.30 },
  { nombre: "Abel", ataque: 3.05, defensa: 2.95 },
  { nombre: "Arnau", ataque: 4.37, defensa: 3.86 },
  { nombre: "Nicolo", ataque: 3.45, defensa: 3.72 },
  { nombre: "Merino", ataque: 2.89, defensa: 3.62 },
  { nombre: "Liya", ataque: 3.49, defensa: 3.39 },
  { nombre: "Yuancai", ataque: 1.55, defensa: 1.37 },
  { nombre: "Jon", ataque: 2.72, defensa: 2.48 },
  { nombre: "Peña", ataque: 2.68, defensa: 2.72 },
  { nombre: "Manu", ataque: 4.48, defensa: 4.16 },
  { nombre: "Vito", ataque: 3.64, defensa: 4.43 },
  { nombre: "Alex Jimenez", ataque: 4.64, defensa: 4.47 },
  { nombre: "Andrea Maioli", ataque: 4.63, defensa: 4.53 },
  { nombre: "Outman", ataque: 4.45, defensa: 4.90 },
  { nombre: "Harris", ataque: 2.36, defensa: 2.16 },
  { nombre: "Sergio Ramos", ataque: 3.97, defensa: 3.53 },
  { nombre: "Tolga", ataque: 3.40, defensa: 2.80 },
  { nombre: "Amadou", ataque: 3.35, defensa: 3.15 },
  { nombre: "Steven", ataque: 3.04, defensa: 3.08 },
  { nombre: "Ricard", ataque: 2.33, defensa: 2.38 },
  { nombre: "David Rovira", ataque: 2.98, defensa: 2.96 },
  { nombre: "Gustavo Madrigal", ataque: 2.91, defensa: 2.96 },
  { nombre: "Diego", ataque: 1.98, defensa: 2.37 },
  { nombre: "Andrea Aroldi", ataque: 2.17, defensa: 2.01 },
  { nombre: "Vitor", ataque: 2.77, defensa: 2.77 },
  { nombre: "Mario Lecce", ataque: 3.37, defensa: 3.47 },
  { nombre: "Jeff", ataque: 3.87, defensa: 3.37 },
  { nombre: "Payno", ataque: 3.20, defensa: 2.90 },
  { nombre: "Kevin", ataque: 4.64, defensa: 4.27 },
  { nombre: "Fabien", ataque: 3.13, defensa: 3.13 },
  { nombre: "Romain", ataque: 4.52, defensa: 4.45 },
  { nombre: "Maykel", ataque: 3.10, defensa: 3.04 },
  { nombre: "Alex Lopez", ataque: 3.50, defensa: 3.35 },
  { nombre: "Buda", ataque: 3.58, defensa: 3.88 },
  { nombre: "Massi", ataque: 4.13, defensa: 4.23 },
  { nombre: "Trompia", ataque: 4.67, defensa: 4.40 },
  { nombre: "Treppo", ataque: 3.83, defensa: 3.67 },
  { nombre: "Lori", ataque: 3.57, defensa: 2.77 },
  { nombre: "Tobi", ataque: 2.52, defensa: 3.60 },
  { nombre: "Dominic", ataque: 3.30, defensa: 3.0 },
  { nombre: "Rolando", ataque: 2.4, defensa: 2.75 },
  { nombre: "Tomas", ataque: 3.5, defensa: 3.2 },
  { nombre: "Visitor 1 (2.5)", ataque: 2.5, defensa: 2.5 },
  { nombre: "Visitor 2( 2.5)", ataque: 2.5, defensa: 2.5 },
  { nombre: "Visitor 3 (3)", ataque: 3, defensa: 3 }
];

// Funciones auxiliares
function calcularMedia(j) {
  return (j.ataque + j.defensa) / 2;
}

function calcularFifa(j) {
  return Math.round(calcularMedia(j) * 20);
}

function limitar(valor) {
  return Math.max(0, Math.min(5, valor));
}

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

// Mostrar tabla de jugadores
function mostrarTabla() {
  const tbody = document.querySelector("#tabla-jugadores tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

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

// Estado de orden actual
let ordenActual = {
  columna: null,
  estado: null // puede ser 'asc', 'desc' o null
};

// Función para ordenar por columna
function ordenarPor(columna) {
  if (ordenActual.columna === columna) {
    if (ordenActual.estado === 'asc') {
      ordenActual.estado = 'desc';
    } else if (ordenActual.estado === 'desc') {
      ordenActual.estado = null;
    } else {
      ordenActual.estado = 'asc';
    }
  } else {
    ordenActual.columna = columna;
    ordenActual.estado = 'asc';
  }

  // Limpiar clases visuales
  document.querySelectorAll("#tabla-jugadores thead th").forEach(th => {
    th.classList.remove("orden-asc", "orden-desc");
    th.classList.add("sortable");
  });

  // Aplicar clase visual si hay orden
  const ths = Array.from(document.querySelectorAll("#tabla-jugadores thead th"));
  const index = ["nombre", "ataque", "defensa", "media", "fifa"].indexOf(columna);
  if (ordenActual.estado && index >= 0) {
    ths[index].classList.remove("sortable");
    ths[index].classList.add(ordenActual.estado === 'asc' ? "orden-asc" : "orden-desc");
  }

  if (!ordenActual.estado) {
    mostrarTabla(); // estado original
    return;
  }

  jugadores.sort((a, b) => {
    let valA = columna === 'nombre' ? a[columna].toLowerCase() :
               columna === 'media' ? calcularMedia(a) :
               columna === 'fifa' ? calcularFifa(a) : a[columna];
    let valB = columna === 'nombre' ? b[columna].toLowerCase() :
               columna === 'media' ? calcularMedia(b) :
               columna === 'fifa' ? calcularFifa(b) : b[columna];

    if (valA < valB) return ordenActual.estado === 'asc' ? -1 : 1;
    if (valA > valB) return ordenActual.estado === 'asc' ? 1 : -1;
    return 0;
  });

  mostrarTabla();
}

// Inicialización en DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  mostrarTabla();
  document.querySelectorAll("#tabla-jugadores thead th").forEach((th, index) => {
    const mapeo = ["nombre", "ataque", "defensa", "media", "fifa"];
    const columna = mapeo[index];
    if (columna) {
      th.style.cursor = "pointer";
      th.classList.add("sortable");
      th.addEventListener("click", () => {
        ordenarPor(columna);
      });
    }
  });
});

//FUNCIONA TODO