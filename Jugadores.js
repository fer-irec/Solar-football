// Lista de 20 jugadores con una mala valoración intencional
const jugadores = [
    { nombre: "Carlos Gómez", ataque: 4.5, defensa: 3.8 },
    { nombre: "Luis Torres", ataque: 3.2, defensa: 2.9 },
    { nombre: "Andrés Pérez", ataque: 5.0, defensa: 4.7 },
    { nombre: "José Ramírez", ataque: 2.1, defensa: 4.3 },
    { nombre: "Marco Díaz", ataque: 3.9, defensa: 3.5 },
    { nombre: "Jugador Flojo", ataque: 0.8, defensa: 1.2 },
    { nombre: "Pedro Sánchez", ataque: 4.1, defensa: 2.8 },
    { nombre: "Raúl Ortega", ataque: 2.9, defensa: 3.6 },
    { nombre: "Hugo Díaz", ataque: 3.3, defensa: 3.9 },
    { nombre: "Álvaro Ruiz", ataque: 4.4, defensa: 4.1 },
    { nombre: "Nicolás Vera", ataque: 2.6, defensa: 2.7 },
    { nombre: "Esteban Ríos", ataque: 3.8, defensa: 3.4 },
    { nombre: "Iván Morales", ataque: 4.6, defensa: 2.5 },
    { nombre: "Tomás León", ataque: 3.1, defensa: 3.7 },
    { nombre: "Diego Benítez", ataque: 2.3, defensa: 3.8 },
    { nombre: "Sebastián Aguilar", ataque: 3.0, defensa: 4.0 },
    { nombre: "Bruno Vargas", ataque: 4.2, defensa: 3.1 },
    { nombre: "Cristian Muñoz", ataque: 2.8, defensa: 3.2 },
    { nombre: "Gabriel Reyes", ataque: 3.6, defensa: 4.5 },
    { nombre: "Mateo Suárez", ataque: 1.5, defensa: 1.4 }
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
      const media = limitar((j.ataque + j.defensa) / 2).toFixed(2);
      const fila = `<tr>
        <td>${j.nombre}</td>
        <td class="${colorClase(j.ataque)}">${j.ataque}</td>
        <td class="${colorClase(j.defensa)}">${j.defensa}</td>
        <td class="${colorClase(media)}">${media}</td>
      </tr>`;
      tbody.insertAdjacentHTML("beforeend", fila);
    });
  }
  
  function mostrarAsistencia() {
    const form = document.getElementById("form-asistencia");
    form.innerHTML = "";
    jugadores.forEach((j, i) => {
      form.insertAdjacentHTML("beforeend", `
        <div class="form-check">
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
    mostrarEquipos(eq1, eq2);
  }
  
  function mostrarEquipos(eq1, eq2) {
    const cont = document.getElementById("resultado-equipos");
    const media1 = eq1.reduce((s, j) => s + j.ataque, 0) / eq1.length;
    const media2 = eq1.reduce((s, j) => s + j.defensa, 0) / eq1.length;
    const media3 = eq2.reduce((s, j) => s + j.ataque, 0) / eq2.length;
    const media4 = eq2.reduce((s, j) => s + j.defensa, 0) / eq2.length;
  
    cont.innerHTML = `
      <div class="col-md-6">
        <h5><span class="circle white-circle"></span><span class="circle blue-circle"></span> Equipo 1</h5>
        <p>ATK: ${media1.toFixed(2)} | DEF: ${media2.toFixed(2)}</p>
        <ul class="list-group">
          ${eq1.map(j => `<li class="list-group-item">${j.nombre} (M: ${j.media.toFixed(2)})</li>`).join("")}
        </ul>
      </div>
      <div class="col-md-6">
        <h5><span class="circle red-circle"></span><span class="circle orange-circle"></span> Equipo 2</h5>
        <p>ATK: ${media3.toFixed(2)} | DEF: ${media4.toFixed(2)}</p>
        <ul class="list-group">
          ${eq2.map(j => `<li class="list-group-item">${j.nombre} (M: ${j.media.toFixed(2)})</li>`).join("")}
        </ul>
      </div>
    `;
  }
  
  function mostrarVotaciones() {
    const form = document.getElementById("form-votaciones");
    form.innerHTML = "";
    jugadores.forEach((j, i) => {
      form.insertAdjacentHTML("beforeend", `
        <div class="col-md-6">
          <label for="voto${i}" class="form-label">${j.nombre}</label>
          <input type="number" min="0" max="5" step="0.1" class="form-control voto-input" id="voto${i}" data-index="${i}">
        </div>`);
    });
  }
  
  function guardarVotaciones() {
    const resultados = document.getElementById("votacion-resultado");
    resultados.innerHTML = "<h5>Media de votaciones:</h5><ul class='list-group'>";
    jugadores.forEach((j, i) => {
      const input = document.getElementById(`voto${i}`);
      if (input && input.value) {
        const nuevo = (parseFloat(j.ataque + j.defensa + parseFloat(input.value)) / 3).toFixed(2);
        resultados.innerHTML += `<li class='list-group-item'>${j.nombre}: Nueva media = ${nuevo}</li>`;
      }
    });
    resultados.innerHTML += "</ul>";
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    mostrarTabla();
    mostrarAsistencia();
    mostrarVotaciones();
    document.getElementById("generar-equipos").addEventListener("click", generarEquipos);
    document.getElementById("guardar-votaciones").addEventListener("click", guardarVotaciones);
  });