// Lista de jugadores con puntuaciones
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
  