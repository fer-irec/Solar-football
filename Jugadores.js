// Lista de 20 jugadores con una mala valoración intencional
const jugadores = [
    { nombre: "Ale Navarro", ataque: 2.2, defensa: 2.2 },
    { nombre: "Fer", ataque: 3, defensa: 3 },
    { nombre: "Jacob", ataque: 4, defensa: 4 },
    { nombre: "Min", ataque: 1.8, defensa: 2 },
    { nombre: "Damián", ataque: 4.2, defensa: 4 },
    { nombre: "Mario", ataque: 1.0, defensa: 2.2 },
    { nombre: "Mirko", ataque: 4, defensa: 4 },
    { nombre: "Qecco (GK)", ataque: 1.5, defensa: 4 },
    { nombre: "Oriol (GK)", ataque: 1.5, defensa: 4 },
    { nombre: "Abel", ataque: 2.5, defensa: 2.5 },
    { nombre: "Arnau", ataque: 4.1, defensa: 4 },
    { nombre: "Niccolo", ataque: 3.8, defensa: 3.4 },
    { nombre: "Merino", ataque: 2.5, defensa: 3.5 },
    { nombre: "Liya", ataque: 3, defensa: 2.8 },
    { nombre: "Yuancai", ataque: 1.3, defensa: 1.2 },
    { nombre: "Jon", ataque: 2.0, defensa: 2.3 },
    { nombre: "Peña", ataque: 2.0, defensa: 2.3 },
    { nombre: "Manu", ataque: 4.2, defensa: 3.7 },
    { nombre: "Vito", ataque: 3.8, defensa: 4 },
    { nombre: "Alex Jimenez", ataque: 4.2, defensa: 4.5 },
    { nombre: "Andrea Magioli", ataque: 4.5, defensa: 4.5 },
    { nombre: "Outman", ataque: 4.5, defensa: 4.7 },
    { nombre: "David Rovira", ataque: 3, defensa: 2.5 },
    { nombre: "Gustavo Madrigal", ataque: 2.5, defensa: 3 },
    { nombre: "Diego", ataque: 1.6, defensa: 2 },
    { nombre: "Andrea Aroldi", ataque: 1.6, defensa: 1.6 },
    { nombre: "Ricard", ataque: 1.6, defensa: 2.8 },
    { nombre: "Vitor", ataque: 2.2, defensa: 2.4 },
    { nombre: "Mario Lecce", ataque: 2.8, defensa: 2.8 },
    { nombre: "Jeff", ataque: 4, defensa: 4 },
    { nombre: "Payno", ataque: 2.5, defensa: 2.5 },
    { nombre: "Kevin", ataque: 4.5, defensa: 4 },
    { nombre: "Romain", ataque: 4, defensa: 4 },
    { nombre: "Maykel", ataque: 3.6, defensa: 3 },
    { nombre: "Alex Lopez", ataque: 3.6, defensa: 3 },
    { nombre: "Buda", ataque: 3.6, defensa: 3.2 },
    { nombre: "Lori", ataque: 3.6, defensa: 3.2 },
    { nombre: "Tobi", ataque: 2.8, defensa: 3.8 }
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
  
  function mostrarTabla() {
    const tbody = document.querySelector("#tabla-jugadores tbody");
    tbody.innerHTML = "";
    jugadores.forEach(j => {
      const media = limitar((parseFloat(j.ataque) + parseFloat(j.defensa)) / 2).toFixed(2);
      const fila = `<tr>
        <td>${j.nombre}</td>
        <td><span class="${colorClase(j.ataque)}">${j.ataque}</span></td>
        <td><span class="${colorClase(j.defensa)}">${j.defensa}</span></td>
        <td><span class="${colorClase(media)}">${media}</span></td>
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
  