// Permitir solo inputs correctos en los campos.
const EvitarIncorrectos = (event) => {
    const charCode = (typeof event.which === "undefined") ? event.keyCode : event.which;
    const charStr = String.fromCharCode(charCode);
    const value = event.target.value;

    if (value.length >= 8) {
        event.preventDefault();
        return;
    }
    if (!charStr.match(/^[0-9]*$/)) {
        event.preventDefault();
    }
};

// Obtener el elemento canvas y su contexto
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Definir propiedades del auto
let anchoAuto = 80;
let altoAuto = 40;
const radioRueda = 10;
let posXAuto = 0; // Posición inicial del auto
let velocidadAuto = 2; // Velocidad del auto
const tamañoFlecha = 15; // Tamaño de la flecha
let animacionId; // Variable para almacenar el ID de la animación
let tiempoInput; // Tiempo ingresado
let distanciaInput; // Distancia ingresada

// Función para mover el auto y actualizar el canvas
const animar = () => {
    // Actualizar posición del auto
    posXAuto += velocidadAuto;

    // Si el auto llega al final del canvas, restablecer su posición
    if (posXAuto > canvas.width) {
        posXAuto = -anchoAuto;
    }

    // Limpiar el fotograma anterior
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el auto en la posición actualizada
    dibujarAuto(posXAuto);

    // Dibujar la flecha en el frente del auto
    dibujarFlecha(posXAuto + anchoAuto);

    // Mostrar la velocidad
    dibujarVelocidad(velocidadAuto, posXAuto + anchoAuto / 2);

    // Dibujar tiempo y distancia
    dibujarVelocidadTiempo();

    // Dibujar la línea de la distancia en la parte inferior
    dibujarLineaDistancia();

    // Solicitar la próxima animación
    animacionId = requestAnimationFrame(animar);
};

// Función para dibujar el auto
const dibujarAuto = (x) => {
    // Dibujar el cuerpo del auto
    ctx.fillStyle = '#0066FF';
    ctx.fillRect(x, canvas.height / 2 - altoAuto / 2, anchoAuto, altoAuto);

    // Dibujar las ruedas
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x + 15, canvas.height / 2 + 15, radioRueda, 0, Math.PI * 2);
    ctx.arc(x + anchoAuto - 15, canvas.height / 2 + 15, radioRueda, 0, Math.PI * 2);
    ctx.fill();
};

// Función para dibujar la flecha que indica la dirección
const dibujarFlecha = (x) => {
    // Dibujar el palo de la flecha
    ctx.fillStyle = '#FF0000';
    const longitudPaloFlecha = tamañoFlecha * 1;
    ctx.fillRect(x + anchoAuto / 4, canvas.height / 2 - tamañoFlecha / 4, longitudPaloFlecha, tamañoFlecha / 2);

    // Dibujar la cabeza de la flecha
    ctx.beginPath();
    ctx.moveTo(x + anchoAuto / 4 + longitudPaloFlecha, canvas.height / 2 - tamañoFlecha / 2);
    ctx.lineTo(x + anchoAuto / 4 + longitudPaloFlecha + tamañoFlecha, canvas.height / 2);
    ctx.lineTo(x + anchoAuto / 4 + longitudPaloFlecha, canvas.height / 2 + tamañoFlecha / 2);
    ctx.closePath();
    ctx.fill();
};

// Función para dibujar la velocidad sobre el auto
const dibujarVelocidad = (velocidad, x) => {
    // Dibujar el texto de velocidad con unidades dinámicas
    const unidadVelocidad = document.getElementById('unitSwitch').checked ? 'm/s' : 'Km/h';
    const velocidadConUnidad = velocidad + ' ' + unidadVelocidad;

    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText(velocidadConUnidad, x, canvas.height / 2 - altoAuto / 2 - 5);
};

// Función para dibujar el tiempo y la velocidad en la esquina superior izquierda
const dibujarVelocidadTiempo = () => {
    // Mostrar tiempo y velocidad en la esquina superior izquierda con unidades dinámicas
    const unidadVelocidad = document.getElementById('unitSwitch').checked ? 'm/s' : 'Km/h';
    const unidadTiempo = document.getElementById('unitSwitch').checked ? 's' : 'horas';

    const velocidadConUnidad = velocidadAuto + ' ' + unidadVelocidad;
    const tiempoConUnidad = tiempo + ' ' + unidadTiempo;

    ctx.fillStyle = '#008080ff';
    ctx.font = '12px Arial';
    ctx.fillText("Tiempo: " + tiempoConUnidad, 10, 20);
    ctx.fillText("Velocidad: " + velocidadConUnidad, 10, 40);
};

// Función para dibujar la línea de la distancia en la parte inferior
const dibujarLineaDistancia = () => {
    // Mostrar distancia abajo en el medio con unidades dinámicas
    const unidadDistancia = document.getElementById('unitSwitch').checked ? 'm' : 'km';
    const distanciaConUnidad = distancia + ' ' + unidadDistancia;

    ctx.fillStyle = '#ff6600ff';
    ctx.font = '12px Arial';
    ctx.fillText("Distancia: " + distanciaConUnidad, 350, 180);
    const arrowLength = 10;

    ctx.beginPath();
    ctx.moveTo(arrowLength, canvas.height - 10);
    ctx.lineTo(canvas.width - arrowLength, canvas.height - 10);
    ctx.strokeStyle = '#ff6600ff';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(arrowLength, canvas.height - 10 - 5);
    ctx.lineTo(arrowLength - 5, canvas.height - 10);
    ctx.lineTo(arrowLength, canvas.height - 10 + 5);
    ctx.closePath();
    ctx.fillStyle = '#ff6600ff';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(canvas.width - arrowLength, canvas.height - 10 - 5);
    ctx.lineTo(canvas.width - arrowLength + 5, canvas.height - 10);
    ctx.lineTo(canvas.width - arrowLength, canvas.height - 10 + 5);
    ctx.closePath();
    ctx.fill();
};

// Función para manejar el clic del botón de cálculo
const handleClickCalcular = () => {
    tiempoInput = parseFloat(document.getElementById('tiempo').value);
    let velocidadInput = parseFloat(document.getElementById('velocidad').value);
    distanciaInput = parseFloat(document.getElementById('distancia').value);

    const resultSpan = document.getElementById('resultado');
    const canvasContainer = document.getElementById('canvasContainer');

    // Contar el número de entradas completadas
    let entradasCompletadas = 0;
    if (!isNaN(tiempoInput)) entradasCompletadas++;
    if (!isNaN(velocidadInput)) entradasCompletadas++;
    if (!isNaN(distanciaInput)) entradasCompletadas++;

    // Mostrar error si el número de entradas completadas no es exactamente 2
    if (entradasCompletadas !== 2) {
        Toastify({
            text: "Complete exactamente 2 de los 3 campos.",
            duration: 3000,
            gravity: "top",
            position: "left",
            background: "linear-gradient(to right, #FF0000, #FF6347)"
        }).showToast();
        resultSpan.textContent = "Hubo un error";
        // Mantener el canvas visible incluso si hay un error
        canvasContainer.style.display = 'block';
        return; // Salir de la función si hay un error
    }

    // Mostrar mensaje de error si tiempo o velocidad son calculadas y los otros 2 datos son 0
    if ((isNaN(velocidadInput) || isNaN(tiempoInput)) && distanciaInput === 0) {
        Toastify({
            text: "No se puede calcular con 0.",
            duration: 3000,
            gravity: "top",
            position: "left",
            background: "linear-gradient(to right, #FF0000, #FF6347)"
        }).showToast();
        resultSpan.textContent = "Hubo un error";
        // Mantener el canvas visible incluso si hay un error
        canvasContainer.style.display = 'block';
        return; // Salir de la función si hay un error
    }

    // Resetear posición del auto y velocidad
    posXAuto = 0;

    if (!isNaN(velocidadInput)) {
        velocidadAuto = velocidadInput;
    } else {
        if (!isNaN(distanciaInput) && !isNaN(tiempoInput)) {
            velocidadAuto = distanciaInput / tiempoInput;
            // Asignar la velocidad calculada al campo de entrada correspondiente
            velocidadInput = velocidadAuto;
            document.getElementById('velocidad').value = velocidadAuto;
        }
    }
    if (!isNaN(tiempoInput)) {
        // If tiempoInput is provided, set its value
        tiempo = tiempoInput;
    } else {
        // If tiempoInput is not provided, calculate it using distanciaInput and velocidadAuto
        if (!isNaN(distanciaInput) && !isNaN(velocidadAuto)) {
            tiempo = distanciaInput / velocidadAuto;
            // Asignar el tiempo calculado al campo de entrada correspondiente
            document.getElementById('tiempo').value = tiempo;
        }
    }
    if (!isNaN(distanciaInput)) {
        // If distanciaInput is provided, set its value
        distancia = distanciaInput;
    } else {
        // If distanciaInput is not provided, calculate it using tiempo and velocidadAuto
        if (!isNaN(tiempo) && !isNaN(velocidadAuto)) {
            distancia = tiempo * velocidadAuto;
            // Asignar la distancia calculada al campo de entrada correspondiente
            document.getElementById('distancia').value = distancia;
        }
    }

    // Calcular y mostrar el resultado
    if (!isNaN(tiempoInput) && !isNaN(velocidadInput)) {
        const unidadDistancia = document.getElementById('unitSwitch').checked ? 'm' : 'km';
        resultSpan.textContent = "Distancia: " + (velocidadInput * tiempoInput) + " " + unidadDistancia;
    } else if (!isNaN(distanciaInput) && !isNaN(velocidadInput)) {
        const unidadTiempo = document.getElementById('unitSwitch').checked ? 's' : 'horas';
        resultSpan.textContent = "Tiempo: " + (distanciaInput / velocidadInput) + " " + unidadTiempo;
    } else if (!isNaN(distanciaInput) && !isNaN(tiempoInput)) {
        const unidadVelocidad = document.getElementById('unitSwitch').checked ? 'm/s' : 'Km/h';
        resultSpan.textContent = "Velocidad: " + (distanciaInput / tiempoInput) + " " + unidadVelocidad;
    }
    // Mostrar canvas cuando el resultado está presente
    canvasContainer.style.display = 'block';

    // Detener la animación actual si existe
    if (animacionId) {
        cancelAnimationFrame(animacionId);
    }

    // Iniciar la animación
    animar();
};





// Agregar el event listener al botón de cálculo
document.getElementById('calcular').addEventListener('click', () => {
    handleClickCalcular();
});

document.addEventListener("DOMContentLoaded", () => {
    // Function to toggle placeholders based on the unit switch state
    const togglePlaceholders = () => {
        const unitSwitch = document.getElementById("unitSwitch");
        const tiempoInput = document.getElementById("tiempo");
        const velocidadInput = document.getElementById("velocidad");
        const distanciaInput = document.getElementById("distancia");

        if (unitSwitch.checked) { // Si el interruptor está marcado (m/s)
            tiempoInput.placeholder = "Tiempo (s)";
            velocidadInput.placeholder = "Velocidad (m/s)";
            distanciaInput.placeholder = "Distancia (m)";
        } else { // Si el interruptor no está marcado (Km/h)
            tiempoInput.placeholder = "Tiempo (hs)";
            velocidadInput.placeholder = "Velocidad (Km/h)";
            distanciaInput.placeholder = "Distancia (km)";
        }
    };

    // Event listener for the switch change
    const unitSwitch = document.getElementById("unitSwitch");
    unitSwitch.addEventListener("change", togglePlaceholders);

    // Initially call togglePlaceholders to set initial state
    togglePlaceholders();
});
