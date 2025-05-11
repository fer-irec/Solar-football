// Lista de jugadores con valores de ataque y defensa
const jugadores = [
    { nombre: "Carlos Gómez", ataque: 4.5, defensa: 3.8 },
    { nombre: "Luis Torres", ataque: 3.2, defensa: 2.9 },
    { nombre: "Andrés Pérez", ataque: 5.0, defensa: 4.7 },
    { nombre: "José Ramírez", ataque: 2.1, defensa: 4.3 },
    { nombre: "Marco Díaz", ataque: 3.9, defensa: 3.5 }
  ];
  
  // Función para limitar el valor entre 0 y 5
  function limitar(valor) {
    return Math.max(0, Math.min(5, valor));
  }
  
  // Crear tabla de jugadores
  function crearTablaJugadores(jugadores) {
    const tabla = document.createElement('table');
    tabla.style.borderCollapse = 'collapse';
    tabla.style.width = '100%';
  
    // Encabezado
    const encabezado = tabla.insertRow();
    ['Jugador', 'Ataque', 'Defensa', 'Media'].forEach(texto => {
      const th = document.createElement('th');
      th.innerText = texto;
      th.style.border = '1px solid #ccc';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f2f2f2';
      encabezado.appendChild(th);
    });
  
    // Filas de jugadores
    jugadores.forEach(jugador => {
      const fila = tabla.insertRow();
      const media = limitar((jugador.ataque + jugador.defensa) / 2);
  
      [jugador.nombre, jugador.ataque, jugador.defensa, media.toFixed(2)].forEach(valor => {
        const celda = fila.insertCell();
        celda.innerText = valor;
        celda.style.border = '1px solid #ccc';
        celda.style.padding = '8px';
      });
    });
  
    // Insertar tabla en el documento
    document.getElementById('tabla-jugadores').appendChild(tabla);
  }
  
  // Ejecutar cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    crearTablaJugadores(jugadores);
  });
  