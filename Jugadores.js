// Lista de jugadores con puntuaciones
const jugadores = [
    { nombre: "Carlos Gómez", ataque: 4.5, defensa: 3.8 },
    { nombre: "Luis Torres", ataque: 3.2, defensa: 2.9 },
    { nombre: "Andrés Pérez", ataque: 5.0, defensa: 4.7 },
    { nombre: "José Ramírez", ataque: 2.1, defensa: 4.3 },
    { nombre: "Marco Díaz", ataque: 3.9, defensa: 3.5 }
  ];
  
  // Calcula media limitada entre 0 y 5
  function limitar(valor) {
    return Math.max(0, Math.min(5, valor));
  }
  
  // Crea e inserta las filas en la tabla
  function mostrarTabla() {
    const cuerpo = document.querySelector("#tabla-jugadores tbody");
    jugadores.forEach(jugador => {
      const fila = document.createElement("tr");
      const media = limitar((jugador.ataque + jugador.defensa) / 2).toFixed(2);
  
      fila.innerHTML = `
        <td>${jugador.nombre}</td>
        <td>${jugador.ataque}</td>
        <td>${jugador.defensa}</td>
        <td>${media}</td>
      `;
  
      cuerpo.appendChild(fila);
    });
  }
  
  document.addEventListener("DOMContentLoaded", mostrarTabla);
  