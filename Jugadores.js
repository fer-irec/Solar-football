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
    { nombre: "Merino", ataque: 2.75, defensa: 3.72, media: 3.23, fifa: 65 },
    { nombre: "Liya", ataque: 3.42, defensa: 3.38, media: 3.4, fifa: 68 },
    { nombre: "Yuancai", ataque: 1.56, defensa: 1.44, media: 1.5, fifa: 30 },
    { nombre: "Jon", ataque: 2.72, defensa: 2.5, media: 2.61, fifa: 52 },
    { nombre: "Peña", ataque: 2.64, defensa: 2.64, media: 2.64, fifa: 53 },
    { nombre: "Manu", ataque: 4.4, defensa: 4.06, media: 4.23, fifa: 85 },
    { nombre: "Vito", ataque: 3.7, defensa: 4.3, media: 4.0, fifa: 80 },
    { nombre: "Alex Jimenez", ataque: 4.48, defensa: 4.36, media: 4.42, fifa: 88 },
    { nombre: "Andrea Maioli", ataque: 4.54, defensa: 4.4, media: 4.47, fifa: 89 },
    { nombre: "Outman", ataque: 4.26, defensa: 4.88, media: 4.57, fifa: 91 },
    { nombre: "Sergio Ramos", ataque: 3.7, defensa: 3.7, media: 3.5, fifa: 70 },
    { nombre: "Tolga", ataque: 3.5, defensa: 3.5, media: 3.1, fifa: 62 },
    { nombre: "Harris", ataque: 2, defensa: 2, media: 2, fifa: 40 },
    { nombre: "Steven", ataque: 3, defensa: 3, media: 3, fifa: 60 },
    { nombre: "David Rovira", ataque: 3.26, defensa: 3.1, media: 3.18, fifa: 64 },
    { nombre: "Gustavo Madrigal", ataque: 2.95, defensa: 3.2, media: 3.07, fifa: 62 },
    { nombre: "Diego", ataque: 1.95, defensa: 2.3, media: 2.125, fifa: 43 },
    { nombre: "Andrea Aroldi", ataque: 1.76, defensa: 1.76, media: 1.76, fifa: 35 },
    { nombre: "Vitor", ataque: 2.72, defensa: 2.77, media: 2.75, fifa: 55 },
    { nombre: "Mario Lecce", ataque: 3.3, defensa: 3.45, media: 3.375, fifa: 68 },
    { nombre: "Jeff", ataque: 3.9, defensa: 3.65, media: 3.77, fifa: 76 },
    { nombre: "Payno", ataque: 3.26, defensa: 3.13, media: 3.2, fifa: 64 },
    { nombre: "Kevin", ataque: 4.6, defensa: 4.22, media: 4.41, fifa: 88 },
    { nombre: "Fabien", ataque: 3.13, defensa: 3.13, media: 3.13, fifa: 63 },
    { nombre: "Romain", ataque: 4.37, defensa: 4.3, media: 4.33, fifa: 87 },
    { nombre: "Maykel", ataque: 3.25, defensa: 3.175, media: 3.21, fifa: 64 },
    { nombre: "Alex Lopez", ataque: 3.5, defensa: 3.35, media: 3.42, fifa: 69 },
    { nombre: "Buda", ataque: 3.62, defensa: 3.9, media: 3.76, fifa: 75 },
    { nombre: "Lori", ataque: 3.47, defensa: 2.85, media: 3.16, fifa: 63 },
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
  
  function colorFifa(valor) {
    valor = parseFloat(valor);
    if (valor < 34) return "valor-rojo";
    if (valor < 67) return "valor-naranja";
    return "valor-verde";
  }
  
  function mostrarTabla() {
    const tbody = document.querySelector("#tabla-jugadores tbody");
    tbody.innerHTML = "";
    const thead = document.querySelector("#tabla-jugadores thead tr");
  
    if (!thead.querySelector("th.fifa")) {
      thead.insertAdjacentHTML("beforeend", "<th class='fifa'>FIFA</th>");
    }
  
    const allTh = thead.querySelectorAll("th.fifa");
    for (let i = 1; i < allTh.length; i++) {
      allTh[i].remove();
    }
  
    jugadores.forEach(j => {
      const media = limitar((j.ataque + j.defensa) / 2).toFixed(2);
      const fila = `<tr>
        <td>${j.nombre}</td>
        <td><span class="${colorClase(j.ataque)}">${j.ataque}</span></td>
        <td><span class="${colorClase(j.defensa)}">${j.defensa}</span></td>
        <td><span class="${colorClase(media)}">${media}</span></td>
        <td><span class="${colorFifa(j.fifa)}">${j.fifa ?? 0}</span></td>
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
        j.ataque = atk;
        j.defensa = def;
        localStorage.setItem(`jugador_${i}_ataque`, atk);
        localStorage.setItem(`jugador_${i}_defensa`, def);
        const nuevaMedia = ((atk + def) / 2).toFixed(2);
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
  
    seleccionados.sort((a, b) => b.media - a.media);
    const eq1 = [], eq2 = [];
    seleccionados.forEach((j, i) => (i % 2 === 0 ? eq1 : eq2).push(j));
  
    const media1_atk = (eq1.reduce((s, j) => s + j.ataque, 0) / eq1.length).toFixed(2);
    const media1_def = (eq1.reduce((s, j) => s + j.defensa, 0) / eq1.length).toFixed(2);
    const fifa1 = eq1.reduce((s, j) => s + (j.fifa ?? 0), 0);
    const media2_atk = (eq2.reduce((s, j) => s + j.ataque, 0) / eq2.length).toFixed(2);
    const media2_def = (eq2.reduce((s, j) => s + j.defensa, 0) / eq2.length).toFixed(2);
    const fifa2 = eq2.reduce((s, j) => s + (j.fifa ?? 0), 0);
  
    const cont = document.getElementById("resultado-equipos");
    cont.innerHTML = `
      <div class="col-md-6">
        <h5><span class="circle white-circle"></span><span class="circle blue-circle"></span> Equipo 1</h5>
        <p>ATK: ${media1_atk} | DEF: ${media1_def} | FIFA: ${fifa1}</p>
        <ul class="list-group">${eq1.map(j => `<li class="list-group-item">${j.nombre} (M: ${j.media.toFixed(2)})</li>`).join("")}</ul>
      </div>
      <div class="col-md-6">
        <h5><span class="circle red-circle"></span><span class="circle orange-circle"></span> Equipo 2</h5>
        <p>ATK: ${media2_atk} | DEF: ${media2_def} | FIFA: ${fifa2}</p>
        <ul class="list-group">${eq2.map(j => `<li class="list-group-item">${j.nombre} (M: ${j.media.toFixed(2)})</li>`).join("")}</ul>
      </div>`;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
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
  