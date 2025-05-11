// Lista de 20 jugadores
const jugadores = [
    { nombre: "Carlos Gómez", ataque: 4.5, defensa: 3.8 },
    { nombre: "Luis Torres", ataque: 3.2, defensa: 2.9 },
    { nombre: "Andrés Pérez", ataque: 5.0, defensa: 4.7 },
    { nombre: "José Ramírez", ataque: 2.1, defensa: 4.3 },
    { nombre: "Marco Díaz", ataque: 3.9, defensa: 3.5 },
    { nombre: "Javier López", ataque: 2.7, defensa: 3.0 },
    { nombre: "Miguel Romero", ataque: 3.5, defensa: 4.2 },
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
    { nombre: "Gabriel Reyes", ataque: 3.6, defensa: 4.5 }
  ];
  
  // Limita los valores entre 0 y 5
  function limitar(valor) {
    return Math.max(0, Math.min(5, valor));
  }
  
  // Aplica clase de color según valor
  function colorear(valor) {
    valor = parseFloat(valor);
    if (valor < 2) return "bg-danger text-white";       // rojo
    if (valor < 4) return "bg-warning text-dark";       // naranja
    return "bg-primary text-white";                     // azul
  }
  
  // Mostrar tabla con colores por valor
  function mostrarTabla() {
    const cuerpo = document.querySelector("#tabla-jugadores tbody");
  
    jugadores.forEach(j => {
      const media = limitar((j.ataque + j.defensa) / 2).toFixed(2);
  
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${j.nombre}</td>
        <td class="${colorear(j.ataque)}">${j.ataque}</td>
        <td class="${colorear(j.defensa)}">${j.defensa}</td>
        <td class="${colorear(media)}">${media}</td>
      `;
      cuerpo.appendChild(fila);
    });
  }
  
  // Mostrar formulario de asistencia
  function mostrarAsistencia() {
    const form = document.getElementById("form-asistencia");
    jugadores.forEach((j, i) => {
      const check = `<div class="form-check">
        <input class="form-check-input jugador-checkbox" type="checkbox" id="jugador${i}" value="${i}">
        <label class="form-check-label" for="jugador${i}">${j.nombre}</label>
      </div>`;
      form.insertAdjacentHTML('beforeend', check);
    });
  
    document.querySelectorAll(".jugador-checkbox").forEach(cb =>
      cb.addEventListener("change", validarSeleccion)
    );
  }
  
  // Habilita botón si hay 12 confirmados
  function validarSeleccion() {
    const activos = document.querySelectorAll(".jugador-checkbox:checked");
    document.getElementById("generar-equipos").disabled = activos.length !== 12;
  }
  
  // Genera equipos equilibrados por media
  function generarEquipos() {
    const seleccionados = Array.from(document.querySelectorAll(".jugador-checkbox:checked"))
      .map(cb => jugadores[parseInt(cb.value)])
      .map(j => ({ ...j, media: (j.ataque + j.defensa) / 2 }));
  
    seleccionados.sort((a, b) => b.media - a.media);
  
    const equipo1 = [];
    const equipo2 = [];
  
    seleccionados.forEach((j, i) => (i % 2 === 0 ? equipo1 : equipo2).push(j));
    mostrarEquipos(equipo1, equipo2);
  }
  
  // Muestra equipos en pantalla
  function mostrarEquipos(eq1, eq2) {
    const cont = document.getElementById("resultado-equipos");
    cont.innerHTML = `
      <div class="col-md-6">
        <h5>Equipo 1</h5>
        <ul class="list-group">
          ${eq1.map(j => `<li class="list-group-item">${j.nombre} (M: ${j.media.toFixed(2)})</li>`).join("")}
        </ul>
      </div>
      <div class="col-md-6">
        <h5>Equipo 2</h5>
        <ul class="list-group">
          ${eq2.map(j => `<li class="list-group-item">${j.nombre} (M: ${j.media.toFixed(2)})</li>`).join("")}
        </ul>
      </div>
    `;
  }
  
  // Inicializar todo
  document.addEventListener("DOMContentLoaded", () => {
    mostrarTabla();
    mostrarAsistencia();
    document.getElementById("generar-equipos").addEventListener("click", generarEquipos);
  });
  