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
  ;
    resultados.innerHTML += "</ul>";
  
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
  