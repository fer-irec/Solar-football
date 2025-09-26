// Lista de jugadores (ATK/DEF/TACT/STA) – datos actualizados
const jugadores = [
  { nombre: "Ale", ataque: 2.64, defensa: 2.59, tactica: 1.97, estamina: 2.67, puntualidad: 3 },
  { nombre: "Fer", ataque: 3.39, defensa: 2.97, tactica: 3.17, estamina: 2.60, puntualidad: 3 },
  { nombre: "Jacob", ataque: 4.08, defensa: 3.63, tactica: 3.33, estamina: 3.57, puntualidad: 3 },
  { nombre: "Min", ataque: 1.89, defensa: 1.87, tactica: 1.73, estamina: 1.00, puntualidad: 3 },
  { nombre: "Damian", ataque: 4.65, defensa: 4.14, tactica: 4.47, estamina: 4.27, puntualidad: 3 },
  { nombre: "Mirko", ataque: 3.74, defensa: 4.10, tactica: 3.57, estamina: 3.67, puntualidad: 3 },
  { nombre: "Queco (GK)", ataque: 1.53, defensa: 4.46, tactica: 3.50, estamina: 3.67, puntualidad: 3 },
  { nombre: "Oriol (GK)", ataque: 1.34, defensa: 4.43, tactica: 3.43, estamina: 4.00, puntualidad: 3 },
  { nombre: "Abel", ataque: 3.18, defensa: 2.95, tactica: 3.33, estamina: 2.33, puntualidad: 3 },
  { nombre: "Arnau", ataque: 4.40, defensa: 3.82, tactica: 4.23, estamina: 4.10, puntualidad: 3 },
  { nombre: "Nicolo", ataque: 3.39, defensa: 3.57, tactica: 2.83, estamina: 3.00, puntualidad: 3 },
  { nombre: "Liya", ataque: 3.56, defensa: 3.23, tactica: 3.10, estamina: 3.43, puntualidad: 3 },
  { nombre: "Jon", ataque: 2.54, defensa: 2.47, tactica: 2.00, estamina: 2.90, puntualidad: 3 },
  { nombre: "Peña", ataque: 2.81, defensa: 2.74, tactica: 2.23, estamina: 4.47, puntualidad: 3 },
  { nombre: "Vito", ataque: 3.64, defensa: 4.40, tactica: 3.77, estamina: 3.83, puntualidad: 3 },
  { nombre: "Alex Jimenez", ataque: 4.62, defensa: 4.50, tactica: 4.40, estamina: 4.33, puntualidad: 3 },
  { nombre: "Andrea Maioli", ataque: 4.54, defensa: 4.43, tactica: 4.53, estamina: 4.60, puntualidad: 3 },
  { nombre: "Outman", ataque: 4.44, defensa: 4.90, tactica: 4.17, estamina: 4.83, puntualidad: 3 },
  { nombre: "Sergio Ramos", ataque: 4.20, defensa: 3.65, tactica: 4.17, estamina: 4.07, puntualidad: 3 },
  { nombre: "Tolga", ataque: 3.53, defensa: 3.18, tactica: 3.70, estamina: 3.67, puntualidad: 3 },
  { nombre: "Amadou", ataque: 3.60, defensa: 3.47, tactica: 3.60, estamina: 3.90, puntualidad: 3 },
  { nombre: "David rovira", ataque: 2.98, defensa: 2.96, tactica: 2.50, estamina: 3.07, puntualidad: 3 },
  { nombre: "Jeff", ataque: 3.83, defensa: 3.23, tactica: 3.20, estamina: 3.43, puntualidad: 3 },
  { nombre: "Tobi (GK)", ataque: 2.26, defensa: 4.32, tactica: 3.93, estamina: 3.93, puntualidad: 3 },
  { nombre: "Rolando", ataque: 2.20, defensa: 3.00, tactica: 2.40, estamina: 2.65, puntualidad: 3 },
  { nombre: "Tomas", ataque: 2.85, defensa: 3.10, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Marcelo (GK)", ataque: 0.75, defensa: 4.10, tactica: 3.65, estamina: 3.50, puntualidad: 3 },
  { nombre: "Jorge", ataque: 2.75, defensa: 3.10, tactica: 2.75, estamina: 3.00, puntualidad: 3 },
  { nombre: "Enric Ll.", ataque: 1.50, defensa: 1.50, tactica: 1.35, estamina: 1.75, puntualidad: 3 },
  { nombre: "Codony", ataque: 4.30, defensa: 4.00, tactica: 4.20, estamina: 4.00, puntualidad: 3 },
  { nombre: "Magnus", ataque: 3.20, defensa: 3.00, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Jeremy", ataque: 3.00, defensa: 2.67, tactica: 2.75, estamina: 2.50, puntualidad: 3 },
  { nombre: "Oriol", ataque: 3.80, defensa: 4.20, tactica: 3.80, estamina: 3.80, puntualidad: 3 },
  { nombre: "Manu", ataque: 4.48, defensa: 4.22, tactica: 4.30, estamina: 4.30, puntualidad: 3 },
  { nombre: "Harris", ataque: 2.38, defensa: 2.08, tactica: 2.25, estamina: 2.00, puntualidad: 3 },
  { nombre: "Ricard", ataque: 2.26, defensa: 2.38, tactica: 1.75, estamina: 2.00, puntualidad: 3 },
  { nombre: "Gustavo Madrigal", ataque: 2.91, defensa: 2.88, tactica: 2.00, estamina: 3.07, puntualidad: 3 },
  { nombre: "Diego", ataque: 1.98, defensa: 2.35, tactica: 1.83, estamina: 1.67, puntualidad: 3 },
  { nombre: "Vitor", ataque: 2.77, defensa: 2.72, tactica: 2.35, estamina: 2.25, puntualidad: 3 },
  { nombre: "Mario Lecce", ataque: 3.28, defensa: 3.35, tactica: 3.00, estamina: 3.00, puntualidad: 3 },
  { nombre: "Buda", ataque: 3.59, defensa: 3.82, tactica: 3.37, estamina: 3.80, puntualidad: 3 },
  { nombre: "Treppo", ataque: 3.90, defensa: 3.88, tactica: 3.55, estamina: 3.55, puntualidad: 3 },
  { nombre: "Dominic", ataque: 3.30, defensa: 3.00, tactica: 2.75, estamina: 2.75, puntualidad: 3 },
  { nombre: "Elias", ataque: 1.17, defensa: 1.25, tactica: 1.25, estamina: 2.25, puntualidad: 3 },

  // Visitors
  { nombre: "Visitor 1 (2)", ataque: 2.00, defensa: 2.00, tactica: 2.00, estamina: 2.00, puntualidad: 3 },
  { nombre: "Visitor 2 (2.5)", ataque: 2.50, defensa: 2.50, tactica: 2.50, estamina: 2.50, puntualidad: 3 },
  { nombre: "Visitor 3 (3)", ataque: 3.50, defensa: 3.50, tactica: 3.50, estamina: 3.50, puntualidad: 3 },

  // HALL OF
  { nombre: "Payno", ataque: 3.04, defensa: 2.74, tactica: 2.10, estamina: 2.25, puntualidad: 3 },
  { nombre: "Fabien", ataque: 2.98, defensa: 2.85, tactica: 2.00, estamina: 2.90, puntualidad: 3 },
  { nombre: "Mario", ataque: 1.78, defensa: 2.36, tactica: 1.87, estamina: 1.67, puntualidad: 3 },
  { nombre: "Merino", ataque: 2.90, defensa: 3.63, tactica: 2.60, estamina: 3.33, puntualidad: 3 },
  { nombre: "Yuancai", ataque: 1.59, defensa: 1.33, tactica: 1.23, estamina: 1.73, puntualidad: 3 },
  { nombre: "Steven", ataque: 3.04, defensa: 3.08, tactica: 2.50, estamina: 2.50, puntualidad: 3 },
  { nombre: "Andrea Aroldi", ataque: 2.17, defensa: 2.01, tactica: 1.40, estamina: 2.30, puntualidad: 3 },
  { nombre: "Kevin", ataque: 4.61, defensa: 4.23, tactica: 4.47, estamina: 4.53, puntualidad: 3 },
  { nombre: "Romain", ataque: 4.45, defensa: 4.40, tactica: 4.63, estamina: 3.60, puntualidad: 3 },
  { nombre: "Maykel", ataque: 3.01, defensa: 2.84, tactica: 2.25, estamina: 3.00, puntualidad: 3 },
  { nombre: "Alex Lopez", ataque: 3.58, defensa: 3.17, tactica: 2.75, estamina: 2.00, puntualidad: 3 },
  { nombre: "Massi", ataque: 4.70, defensa: 3.85, tactica: 4.60, estamina: 4.00, puntualidad: 3 },
  { nombre: "Trompia", ataque: 4.63, defensa: 4.60, tactica: 4.83, estamina: 4.43, puntualidad: 3 },
  { nombre: "Lori", ataque: 3.55, defensa: 2.95, tactica: 3.37, estamina: 3.30, puntualidad: 3 }
];


function calcularMedia(j) {
  // Ponderaciones: ATK 0.3, DEF 0.3, TACT 0.2, STA 0.2
  return (j.ataque*0.3 + j.defensa*0.3 + j.tactica*0.2 + j.estamina*0.2);
}

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
let jugadoresOriginal = [...jugadores];
let jugadoresOrdenados = [...jugadores];
let ordenActual = { columna: null, estado: 0 }; // 0: original, 1: desc, 2: asc
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
  const theadRow = document.querySelector("#tabla-jugadores thead tr");
  if (!theadRow) return;
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

// ========== Historial ==========
function fmt2(x){ if (x===undefined||x===null||Number.isNaN(x)) return "—"; return (typeof x==="number"?x:parseFloat(x)).toFixed(2); }
function mostrarHistorial() {
  fetch("historial.json").then(res => res.json()).then(data => {
    const cont = document.getElementById("lista-historial");
    cont.innerHTML = "";
    data.forEach(partido => {
      const tarjeta = document.createElement("div"); tarjeta.className = "col";
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
  }).catch(err => {
    document.getElementById("lista-historial").innerHTML = `<div class="alert alert-danger">Error al cargar historial: ${err.message}</div>`;
  });
}
document.querySelector('a[href="#historial"]').addEventListener("click", mostrarHistorial);

// ========== Algoritmo "estrella + flojos" ==========
const ALPHA = 3.0;   // bono estrella
const GAMMA = 0.75;  // castigo lows sin estrella
const DELTA = 0.5;   // decreciente por muchas estrellas
const STAR_CUTOFF = 3.75; // ~7.5/10
const LOW_CUTOFF  = 2.00; // ~4/10

function teamScore(team) {
  const ratings = team.map(p => calcularMedia(p));
  const base = ratings.reduce((a,b)=>a+b, 0);
  const stars = team.filter(p => calcularMedia(p) >= STAR_CUTOFF);
  const lows  = team.filter(p => calcularMedia(p) <= LOW_CUTOFF);
  const nStar = stars.length, nLow = lows.length;
  const lowDepth = lows.length ? lows.reduce((a,p)=> a + Math.max(0, LOW_CUTOFF - calcularMedia(p)), 0) / lows.length : 0;
  const pLow = team.length > 1 ? (nLow / (team.length - 1)) : 0;
  const carryBonus = stars.reduce((sum, s) => sum + ALPHA * Math.max(0, calcularMedia(s) - STAR_CUTOFF) * pLow * lowDepth, 0);
  const orphanPenalty = GAMMA * Math.max(0, nLow - 2*nStar);
  const starPenalty   = DELTA * Math.max(0, nStar - 2);
  return base + carryBonus - orphanPenalty - starPenalty;
}

// ===== (antiguo) spread ponderado por componentes (aún útil en torneo/manual)
function scorePonderado(a, b) {
  const dAtk  = Math.abs(a.atk  - b.atk);
  const dDef  = Math.abs(a.def  - b.def);
  const dTact = Math.abs(a.tact - b.tact);
  const dSta  = Math.abs(a.sta  - b.sta);
  return 0.3*dAtk + 0.3*dDef + 0.2*dTact + 0.2*dSta;
}

// ========== NUEVO: helpers de restricciones para 2 equipos ==========
function esGK(j){ return /\(GK\)/i.test(j.nombre) || j.nombre.toLowerCase().includes("gk"); }
function esStar(j){ return calcularMedia(j) >= STAR_CUTOFF; }
function esLow(j){ return calcularMedia(j) <= LOW_CUTOFF; }
function esCapitan(j){ return calcularMedia(j) > 4.0; }

function conteoRol(team){
  return { gk: team.filter(esGK).length, star: team.filter(esStar).length, low: team.filter(esLow).length, cap: team.filter(esCapitan).length };
}

function costeEquipos(A,B){
  // varianza teamScore
  const sA = teamScore(A), sB = teamScore(B);
  const m = (sA + sB)/2;
  const varScore = ((sA-m)**2 + (sB-m)**2)/2;

  // conteos
  const a = conteoRol(A), b = conteoRol(B);

  // pesos (ajustables)
  const P_STAR_DIFF = 3.0;
  const P_LOW_DIFF  = 2.5;
  const P_CAP_OVER  = 1.5;   // >2 capitanes
  const P_LOW_MISS  = 4.0;   // hay lows en el pool pero un equipo se queda sin
  const P_GK_SPLIT  = 6.0;   // con 2 GKs, forzar 1-1

  const starDiff = Math.abs(a.star - b.star);
  const lowDiff  = Math.abs(a.low  - b.low);
  const capOver  = Math.max(0, a.cap-2) + Math.max(0, b.cap-2);

  const totalGK = a.gk + b.gk;
  const needSplit = (totalGK === 2);
  const badGKSplit = needSplit ? Math.abs(a.gk - b.gk) : 0;

  const totalLow = a.low + b.low;
  const lowMiss = (totalLow > 0 ? ((a.low===0)?1:0) + ((b.low===0)?1:0) : 0);

  return varScore
       + P_STAR_DIFF * starDiff
       + P_LOW_DIFF  * lowDiff
       + P_CAP_OVER  * capOver
       + P_LOW_MISS  * lowMiss
       + (needSplit ? P_GK_SPLIT * badGKSplit : 0);
}

// Semilla snake por media (y 1–1 GK si hay dos)
function seedSnake(players){
  const arr = players.slice().sort((a,b)=>calcularMedia(b)-calcularMedia(a));
  let A=[], B=[];
  const gks = arr.filter(esGK);
  if (gks.length >= 2){
    A.push(gks[0]); B.push(gks[1]);
    // quitar esos dos de arr
    let removed=0;
    for (let i=arr.length-1;i>=0 && removed<2;i--){
      if (esGK(arr[i])){ arr.splice(i,1); removed++; }
    }
  }
  let lr = true;
  while(arr.length){
    const chunk = arr.splice(0,2);
    if (lr){ if (chunk[0]) A.push(chunk[0]); if (chunk[1]) B.push(chunk[1]); }
    else   { if (chunk[0]) B.push(chunk[0]); if (chunk[1]) A.push(chunk[1]); }
    lr = !lr;
  }
  return [A,B];
}

// ========== Generar 2 equipos (con restricciones + FIFA promedio) ==========
function generarEquipos() {
  try {
    const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked"))
      .map(cb => jugadores[parseInt(cb.value)])
      .map(j => ({ ...j, media: calcularMedia(j), fifa: calcularFifa(j) }));

    if (seleccionados.length < 10 || seleccionados.length > 12) {
      throw new Error("Selecciona entre 10 y 12 jugadores para formar 2 equipos.");
    }

    // Semilla equilibrada
    let [bestA, bestB] = seedSnake(seleccionados);
    let bestCost = costeEquipos(bestA, bestB);

    // Búsqueda local (acepta solo mejoras de coste)
    const ITERS = 4000;
    for (let k=0; k<ITERS; k++){
      const A = bestA.slice(), B = bestB.slice();
      const ia = Math.floor(Math.random()*A.length);
      const ib = Math.floor(Math.random()*B.length);
      [A[ia], B[ib]] = [B[ib], A[ia]];
      const cost = costeEquipos(A,B);
      if (cost < bestCost){ bestA = A; bestB = B; bestCost = cost; }
    }

    // Estadísticas (FIFA promedio mostrado)
    const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
    const s1 = {
      atk: (sum(bestA, j => j.ataque) / bestA.length).toFixed(2),
      def: (sum(bestA, j => j.defensa) / bestA.length).toFixed(2),
      tact: (sum(bestA, j => j.tactica) / bestA.length).toFixed(2),
      sta: (sum(bestA, j => j.estamina) / bestA.length).toFixed(2),
      fifaAvg: Math.round(sum(bestA, j => j.fifa) / bestA.length)
    };
    const s2 = {
      atk: (sum(bestB, j => j.ataque) / bestB.length).toFixed(2),
      def: (sum(bestB, j => j.defensa) / bestB.length).toFixed(2),
      tact: (sum(bestB, j => j.tactica) / bestB.length).toFixed(2),
      sta: (sum(bestB, j => j.estamina) / bestB.length).toFixed(2),
      fifaAvg: Math.round(sum(bestB, j => j.fifa) / bestB.length)
    };

    const cont = document.getElementById("resultado-equipos");
    if (!cont) return;
    cont.innerHTML = `
      <div class="col-md-6">
        <h5><span class="circle white-circle"></span><span class="circle blue-circle"></span> Equipo 1</h5>
        <p>ATK: ${s1.atk} | DEF: ${s1.def} | TACT: ${s1.tact} | STA: ${s1.sta} | FIFA: ${s1.fifaAvg}</p>
        <ul class="list-group">
          ${bestA.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${calcularMedia(j) > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
        </ul>
      </div>
      <div class="col-md-6">
        <h5><span class="circle red-circle"></span><span class="circle orange-circle"></span> Equipo 2</h5>
        <p>ATK: ${s2.atk} | DEF: ${s2.def} | TACT: ${s2.tact} | STA: ${s2.sta} | FIFA: ${s2.fifaAvg}</p>
        <ul class="list-group">
          ${bestB.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${calcularMedia(j) > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
        </ul>
      </div>`;
  } catch (error) {
    const cont = document.getElementById("resultado-equipos");
    cont.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  }
}

// ========== Torneo (4 equipos) – muestra FIFA promedio ==========
function generarEquiposTorneo() {
  const seleccionados = Array.from(document.querySelectorAll(".jugador-torneo-checkbox:checked"))
    .map(cb => jugadores[parseInt(cb.value)])
    .map(j => ({ ...j, media: calcularMedia(j), fifa: calcularFifa(j) }));

  if (seleccionados.length < 20 || seleccionados.length > 24) {
    throw new Error("Selecciona entre 20 y 24 jugadores para el torneo.");
  }

  const intentos = 2000;
  let mejorScore = Infinity, mejorTopDiff = Infinity, mejorCompSpread = Infinity, mejores = null;

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
      fifa: Math.round(eq.reduce((s, j) => s + j.fifa, 0) / eq.length),
      top: eq.filter(j => j.media > 4).length
    }));

    const ratings = stats.map(s => s.rating);
    const score = Math.max(...ratings) - Math.min(...ratings);

    const spreadAtk  = Math.max(...stats.map(s => s.atk))  - Math.min(...stats.map(s => s.atk));
    const spreadDef  = Math.max(...stats.map(s => s.def))  - Math.min(...stats.map(s => s.def));
    const spreadTact = Math.max(...stats.map(s => s.tact)) - Math.min(...stats.map(s => s.tact));
    const spreadSta  = Math.max(...stats.map(s => s.sta))  - Math.min(...stats.map(s => s.sta));
    const compSpread = 0.3*spreadAtk + 0.3*spreadDef + 0.2*spreadTact + 0.2*spreadSta;

    const topCounts = stats.map(s => s.top);
    const topDiff = Math.max(...topCounts) - Math.min(...topCounts);

    const mejor = (score < mejorScore) ||
                  (score === mejorScore && compSpread < mejorCompSpread) ||
                  (score === mejorScore && compSpread === mejorCompSpread && topDiff < mejorTopDiff);

    if (mejor) { mejorScore = score; mejorCompSpread = compSpread; mejorTopDiff = topDiff; mejores = { eqs, stats }; }
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
          ${eq.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${calcularMedia(j) > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
        </ul>
      </div>`;
  });
}

// ========== MANUAL (pestaña) ==========
function actualizarContadoresManual() {
  const c1 = document.querySelectorAll('.jugador-manual-1:checked').length;
  const c2 = document.querySelectorAll('.jugador-manual-2:checked').length;
  const btn = document.getElementById('generar-manual');
  const t1 = document.getElementById('contador-manual-1');
  const t2 = document.getElementById('contador-manual-2');
  if (t1) t1.textContent = `Seleccionados: ${c1}`;
  if (t2) t2.textContent = `Seleccionados: ${c2}`;
  if (btn) btn.disabled = !(c1 === c2 && c1 >= 3);
}
function initManualTab() {
  const form1 = document.getElementById("form-manual-1");
  const form2 = document.getElementById("form-manual-2");
  if (!form1 || !form2) return;
  form1.innerHTML = ""; form2.innerHTML = "";
  jugadores.forEach((j, i) => {
    const id1 = `manual1_${i}`, id2 = `manual2_${i}`;
    form1.insertAdjacentHTML("beforeend", `
      <div class="form-check col-md-6">
        <input class="form-check-input jugador-manual-1" type="checkbox" id="${id1}" data-peer="${id2}" value="${i}">
        <label class="form-check-label" for="${id1}">${j.nombre}</label>
      </div>`);
    form2.insertAdjacentHTML("beforeend", `
      <div class="form-check col-md-6">
        <input class="form-check-input jugador-manual-2" type="checkbox" id="${id2}" data-peer="${id1}" value="${i}">
        <label class="form-check-label" for="${id2}">${j.nombre}</label>
      </div>`);
  });
  const wires = (selector) => document.querySelectorAll(selector).forEach(cb => {
    cb.addEventListener("change", (e) => {
      const peerId = e.target.getAttribute("data-peer");
      const peer = document.getElementById(peerId);
      if (!peer) return;
      if (e.target.checked) { peer.checked = false; peer.disabled = true; }
      else { peer.disabled = false; }
      actualizarContadoresManual();
    });
  });
  wires(".jugador-manual-1"); wires(".jugador-manual-2"); actualizarContadoresManual();
  const btn = document.getElementById("generar-manual");
  if (btn) btn.addEventListener("click", (e) => { e.preventDefault(); generarEquiposManual(); });
}
function generarEquiposManual() {
  const selIdx1 = Array.from(document.querySelectorAll(".jugador-manual-1:checked")).map(cb => parseInt(cb.value));
  const selIdx2 = Array.from(document.querySelectorAll(".jugador-manual-2:checked")).map(cb => parseInt(cb.value));
  if (selIdx1.length !== selIdx2.length || selIdx1.length < 3) {
    alert("Selecciona el mismo número de jugadores en ambos equipos (mínimo 3; recomendado 5)."); return;
  }
  const eq1 = selIdx1.map(i => ({ ...jugadores[i], media: calcularMedia(jugadores[i]), fifa: calcularFifa(jugadores[i]) }));
  const eq2 = selIdx2.map(i => ({ ...jugadores[i], media: calcularMedia(jugadores[i]), fifa: calcularFifa(jugadores[i]) }));
  const avg = (arr, f) => (arr.reduce((s, x) => s + f(x), 0) / arr.length);
  const s1 = { atk: avg(eq1, j=>j.ataque).toFixed(2), def: avg(eq1, j=>j.defensa).toFixed(2), tact: avg(eq1, j=>j.tactica).toFixed(2), sta: avg(eq1, j=>j.estamina).toFixed(2), fifaAvg: Math.round(avg(eq1, j=>j.fifa)), teamScore: teamScore(eq1).toFixed(2) };
  const s2 = { atk: avg(eq2, j=>j.ataque).toFixed(2), def: avg(eq2, j=>j.defensa).toFixed(2), tact: avg(eq2, j=>j.tactica).toFixed(2), sta: avg(eq2, j=>j.estamina).toFixed(2), fifaAvg: Math.round(avg(eq2, j=>j.fifa)), teamScore: teamScore(eq2).toFixed(2) };
  const cont = document.getElementById("resultado-manual"); if (!cont) return;
  cont.innerHTML = `
    <div class="col-md-6">
      <h5><span class="circle white-circle"></span><span class="circle blue-circle"></span> Equipo 1</h5>
      <p>ATK: ${s1.atk} | DEF: ${s1.def} | TACT: ${s1.tact} | STA: ${s1.sta} | FIFA: ${s1.fifaAvg} | <strong>Score:</strong> ${s1.teamScore}</p>
      <ul class="list-group">
        ${eq1.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${j.media > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
      </ul>
    </div>
    <div class="col-md-6">
      <h5><span class="circle red-circle"></span><span class="circle orange-circle"></span> Equipo 2</h5>
      <p>ATK: ${s2.atk} | DEF: ${s2.def} | TACT: ${s2.tact} | STA: ${s2.sta} | FIFA: ${s2.fifaAvg} | <strong>Score:</strong> ${s2.teamScore}</p>
      <ul class="list-group">
        ${eq2.map(j => `<li class="list-group-item">${j.nombre} ${generarEstrellasFIFA(j.fifa)}${j.media > 4 ? ' <strong>(C)</strong>' : ''}</li>`).join("")}
      </ul>
    </div>`;
}

// ========== Arranque ==========
document.addEventListener("DOMContentLoaded", () => {
  mostrarTabla();

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

  // Validaciones dinámicas (partido)
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
        if (botonGenerar) botonGenerar.disabled = true;
        aviso.textContent = "Selecciona entre 10 y 12 jugadores para poder generar equipos.";
      } else {
        if (botonGenerar) botonGenerar.disabled = false;
        aviso.textContent = "";
      }
    });
  });

  // Validaciones dinámicas (torneo)
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
        if (botonTorneo) botonTorneo.disabled = true;
        aviso.textContent = "Selecciona entre 20 y 24 jugadores para poder generar 4 equipos.";
      } else {
        if (botonTorneo) botonTorneo.disabled = false;
        aviso.textContent = "";
      }
    });
  });

  // Inicializar pestaña Manual (si existe en el HTML)
  initManualTab();
});
