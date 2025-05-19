// Lista de jugadores completa con columna FIFA
const jugadores = [
    { nombre: "Ale", ataque: 2.56, defensa: 2.6, media: 2.58, fifa: 52 },
    { nombre: "Fer", ataque: 3.36, defensa: 3.12, media: 3.24, fifa: 65 },
    { nombre: "Jacob", ataque: 4.2, defensa: 3.66, media: 3.93, fifa: 79 },
    { nombre: "Min", ataque: 1.84, defensa: 1.84, media: 1.84, fifa: 37 },
    { nombre: "Damian", ataque: 4.5, defensa: 3.94, media: 4.22, fifa: 84 },
    { nombre: "Mario", ataque: 1.64, defensa: 2.2, media: 1.92, fifa: 38 },
    { nombre: "Mirko", ataque: 3.68, defensa: 3.92, media: 3.8, fifa: 76 },
    { nombre: "Queco (GK)", ataque: 1.1, defensa: 4.4, media: 2.75, fifa: 55 },
    { nombre: "Oriol (GK)", ataque: 0.95, defensa: 4.32, media: 2.635, fifa: 53 },
    { nombre: "Abel", ataque: 2.96, defensa: 2.86, media: 2.91, fifa: 58 },
    { nombre: "Arnau", ataque: 4.28, defensa: 3.94, media: 4.11, fifa: 82 },
    { nombre: "Niccolo", ataque: 3.74, defensa: 3.88, media: 3.81, fifa: 76 },
    { nombre: "Merino", ataque: 2.75, defensa: 3.72, media: 3.23, fifa: 114354 },
    { nombre: "Liya", ataque: 3.42, defensa: 3.38, media: 3.4, fifa: 68 },
    { nombre: "Yuancai", ataque: 1.56, defensa: 1.44, media: 1.5, fifa: 30 },
    { nombre: "Jon", ataque: 2.72, defensa: 2.5, media: 2.61, fifa: 52 },
    { nombre: "Peña", ataque: 2.64, defensa: 2.64, media: 2.64, fifa: 53 },
    { nombre: "Manu", ataque: 4.4, defensa: 4.06, media: 4.23, fifa: 85 },
    { nombre: "Vito", ataque: 3.7, defensa: 4.3, media: 4.0, fifa: 80 },
    { nombre: "Alex Jimenez", ataque: 4.48, defensa: 4.36, media: 4.42, fifa: 88 },
    { nombre: "Andrea Maioli", ataque: 4.54, defensa: 4.4, media: 4.47, fifa: 89 },
    { nombre: "Outman", ataque: 4.26, defensa: 4.88, media: 4.57, fifa: 91 },
    { nombre: "Sergio Ramos", ataque: 3.5, defensa: 3.5, media: 3.5, fifa: 70 },
    { nombre: "Tolga", ataque: 3.2, defensa: 3.0, media: 3.1, fifa: 62 },
    { nombre: "Steven", ataque: 3, defensa: 3, media: 3, fifa: 60 },
    { nombre: "David Rovira", ataque: 3.26, defensa: 3.1, media: 3.18, fifa: 64 },
    { nombre: "Gustavo Madrigal", ataque: 2.95, defensa: 3.2, media: 3.075, fifa: 62 },
    { nombre: "Diego", ataque: 1.95, defensa: 2.3, media: 2.125, fifa: 43 },
    { nombre: "Andrea Aroldi", ataque: 1.76, defensa: 1.76, media: 1.76, fifa: 35 },
    { nombre: "Vitor", ataque: 2.725, defensa: 2.775, media: 2.75, fifa: 55 },
    { nombre: "Mario Lecce", ataque: 3.3, defensa: 3.45, media: 3.375, fifa: 68 },
    { nombre: "Jeff", ataque: 3.9, defensa: 3.65, media: 3.775, fifa: 76 },
    { nombre: "Payno", ataque: 3.26, defensa: 3.13, media: 3.2, fifa: 64 },
    { nombre: "Kavin", ataque: 4.6, defensa: 4.225, media: 4.4125, fifa: 88 },
    { nombre: "Fabien", ataque: 3.13, defensa: 3.13, media: 3.13, fifa: 63 },
    { nombre: "Romain", ataque: 4.375, defensa: 4.3, media: 4.3375, fifa: 87 },
    { nombre: "Maykel", ataque: 3.25, defensa: 3.175, media: 3.2125, fifa: 64 },
    { nombre: "Alex Lopez", ataque: 3.5, defensa: 3.35, media: 3.425, fifa: 69 },
    { nombre: "Buda", ataque: 3.625, defensa: 3.9, media: 3.76, fifa: 75 },
    { nombre: "Lori", ataque: 3.475, defensa: 2.85, media: 3.16, fifa: 63 },
    { nombre: "Visitor 1", ataque: 2.5, defensa: 2.5, media: 2.5, fifa: 50 },
    { nombre: "Visitor 2", ataque: 2.5, defensa: 2.5, media: 2.5, fifa: 50 },
    { nombre: "Tobi", ataque: 2.6, defensa: 4.03, media: 3.31, fifa: 66 }
  ];

function limitar(valor) {
  return Math.max(0, Math.min(5, valor));
}

function colorClase(valor) {
  valor = parseFloat(valor);
  if (valor < 1.7) return "valor-rojo";
  if (valor < 3.5) return "valor-naranja";
  return "valor-verde";
}

function cargarDesdeLocalStorage() {
  jugadores.forEach((j, i) => {
    const atkGuardado = localStorage.getItem(`jugador_${i}_ataque`);
    const defGuardado = localStorage.getItem(`jugador_${i}_defensa`);
    if (atkGuardado !== null && defGuardado !== null) {
      const atkProm = ((parseFloat(j.ataque) + parseFloat(atkGuardado)) / 2).toFixed(2);
      const defProm = ((parseFloat(j.defensa) + parseFloat(defGuardado)) / 2).toFixed(2);
      j.ataque = parseFloat(atkProm);
      j.defensa = parseFloat(defProm);
    }
  });
}

// Las funciones mostrarTabla, mostrarVotaciones, guardarVotaciones, mostrarAsistencia, validarSeleccion, generarEquipos, y DOMContentLoaded
// se añadirán en la siguiente celda para mantener el archivo organizado.



function mostrarTabla() {
    const tbody = document.querySelector("#tabla-jugadores tbody");
    tbody.innerHTML = "";
    jugadores.forEach(j => {
      if (isNaN(j.ataque) || isNaN(j.defensa) || isNaN(j.media)) return; // ignora datos incompletos
      const media = limitar((parseFloat(j.ataque) + parseFloat(j.defensa)) / 2).toFixed(2);
      const fila = `<tr>
        <td>${j.nombre}</td>
        <td><span class="${colorClase(j.ataque)}">${j.ataque}</span></td>
        <td><span class="${colorClase(j.defensa)}">${j.defensa}</span></td>
        <td><span class="${colorClase(media)}">${media}</span></td>
        <td><span>${j.fifa ?? 0}</span></td>
      </tr>`;
      tbody.insertAdjacentHTML("beforeend", fila);
    });
  }
  

function mostrarVotaciones() {
  const form = document.getElementById("form-votaciones");
  form.innerHTML = "";
  form.insertAdjacentHTML("beforeend", `<div class="row fw-bold text-center">
    <div class="col-md-4">Jugador</div>
    <div class="col-md-4">Votar Ataque</div>
    <div class="col-md-4">Votar Defensa</div>
  </div>`);
  jugadores.forEach((j, i) => {
    const savedAtk = localStorage.getItem(`jugador_${i}_ataque`) || "";
    const savedDef = localStorage.getItem(`jugador_${i}_defensa`) || "";
    form.insertAdjacentHTML("beforeend", `
      <div class="row align-items-center mb-2">
        <div class="col-md-4">${j.nombre}</div>
        <div class="col-md-4">
          <input type="number" min="0" max="5" step="0.1" class="form-control voto-input" id="atk${i}" value="${savedAtk}" data-index="${i}">
        </div>
        <div class="col-md-4">
          <input type="number" min="0" max="5" step="0.1" class="form-control voto-input" id="def${i}" value="${savedDef}" data-index="${i}">
        </div>
      </div>`);
  });
}

function guardarVotaciones() {
  const resultados = document.getElementById("votacion-resultado");
  resultados.innerHTML = "<h5>Media de votaciones:</h5><ul class='list-group'>";
  jugadores.forEach((j, i) => {
    const atkInput = document.getElementById(`atk${i}`);
    const defInput = document.getElementById(`def${i}`);
    const atk = parseFloat(atkInput?.value);
    const def = parseFloat(defInput?.value);
    if (!isNaN(atk) && !isNaN(def)) {
      const atkProm = ((parseFloat(j.ataque) + atk) / 2).toFixed(2);
      const defProm = ((parseFloat(j.defensa) + def) / 2).toFixed(2);
      j.ataque = parseFloat(atkProm);
      j.defensa = parseFloat(defProm);
      localStorage.setItem(`jugador_${i}_ataque`, atk);
      localStorage.setItem(`jugador_${i}_defensa`, def);
      const nuevaMedia = ((j.ataque + j.defensa) / 2).toFixed(2);
      resultados.innerHTML += `<li class='list-group-item'>${j.nombre}: Nueva media = ${nuevaMedia}</li>`;
    }
  });
  resultados.innerHTML += "</ul>";
  mostrarTabla();
  mostrarVotaciones();
  document.querySelectorAll('.voto-input').forEach(input => input.value = '');
}

function mostrarAsistencia() {
  const form = document.getElementById("form-asistencia");
  form.innerHTML = "";
  jugadores.forEach((j, i) => {
    form.insertAdjacentHTML("beforeend", `
      <div class="form-check col-md-6">
        <input class="form-check-input jugador-checkbox" type="checkbox" id="jugador${i}" value="${i}">
        <label class="form-check-label" for="jugador${i}">${j.nombre}</label>
      </div>`);
  });
  document.querySelectorAll(".jugador-checkbox").forEach(cb =>
    cb.addEventListener("change", validarSeleccion));
}

function validarSeleccion() {
  const seleccionados = document.querySelectorAll(".jugador-checkbox:checked");
  document.getElementById("generar-equipos").disabled = seleccionados.length !== 12;
}

function generarEquipos() {
  const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked"))
    .map(cb => jugadores[parseInt(cb.value)])
    .map(j => ({ ...j, media: (j.ataque + j.defensa) / 2 }));

  if (seleccionados.length !== 12) return;

  function combinaciones(arr, k) {
    const res = [];
    function backtrack(start, path) {
      if (path.length === k) {
        res.push([...path]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        path.push(arr[i]);
        backtrack(i + 1, path);
        path.pop();
      }
    }
    backtrack(0, []);
    return res;
  }

  const posibles = combinaciones(seleccionados, 6);
  let mejor = null;
  let menorDiff = Infinity;

  posibles.forEach(eq1 => {
    const eq2 = seleccionados.filter(j => !eq1.includes(j));
    const media1 = eq1.reduce((s, j) => s + j.media, 0) / 6;
    const media2 = eq2.reduce((s, j) => s + j.media, 0) / 6;
    const diff = Math.abs(media1 - media2);
    if (diff < menorDiff) {
      menorDiff = diff;
      mejor = [eq1, eq2];
    }
  });

  const [eq1, eq2] = mejor;

  const promedio = eq => ({
    atk: (eq.reduce((s, j) => s + j.ataque, 0) / eq.length).toFixed(2),
    def: (eq.reduce((s, j) => s + j.defensa, 0) / eq.length).toFixed(2)
  });

  const m1 = promedio(eq1);
  const m2 = promedio(eq2);

  const cont = document.getElementById("resultado-equipos");
  cont.innerHTML = `
    <div class="col-md-6">
      <h5><span class="circle white-circle"></span><span class="circle blue-circle"></span> Equipo 1</h5>
      <p>ATK: ${m1.atk} | DEF: ${m1.def}</p>
      <ul class="list-group">${eq1.map(j => `<li class="list-group-item">${j.nombre} (M: ${j.media.toFixed(2)})</li>`).join("")}</ul>
    </div>
    <div class="col-md-6">
      <h5><span class="circle red-circle"></span><span class="circle orange-circle"></span> Equipo 2</h5>
      <p>ATK: ${m2.atk} | DEF: ${m2.def}</p>
      <ul class="list-group">${eq2.map(j => `<li class="list-group-item">${j.nombre} (M: ${j.media.toFixed(2)})</li>`).join("")}</ul>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDesdeLocalStorage();
  mostrarTabla();
  mostrarAsistencia();
  mostrarVotaciones();

  document.getElementById("generar-equipos").addEventListener("click", generarEquipos);
  document.getElementById("guardar-votaciones").addEventListener("click", () => {
    guardarVotaciones();
    const alerta = document.createElement('div');
    alerta.className = "alert alert-success mt-3";
    alerta.role = "alert";
    alerta.innerText = "¡Votos guardados y tabla actualizada!";
    const resultado = document.getElementById("votacion-resultado");
    resultado.prepend(alerta);
    setTimeout(() => alerta.remove(), 3000);
  });
});