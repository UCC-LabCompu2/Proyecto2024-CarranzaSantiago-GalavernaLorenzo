const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Globales necesarias para animación
let posXAuto = 0;
const anchoAuto = 80;
let velocidadAuto = 2;
let animacionId;
let tiempo;
let distancia;
let distanciaRestante;

/**
 * Evita que se ingresen caracteres incorrectos en los campos.
 * @method EvitarIncorrectos
 * @param {Event} event - El evento de entrada que activa la función.
 * @return {void}
 */
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

/**
 * Limpia todos los campos del formulario, oculta el resultado, detiene la animación y limpia el canvas.
 * @method clearForm
 * @return {void}
 */
const clearForm = () => {
    document.getElementById('tiempo').value = '';
    document.getElementById('velocidad').value = '';
    document.getElementById('distancia').value = '';
    // Oculta el resultado
    document.getElementById('resultado').textContent = '';
    if (animacionId) {
        cancelAnimationFrame(animacionId);
    }
    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
* Anima el auto moviéndolo a través del canvas y redibuja los elementos.
 * @method animar
 * @return {void}
 */

const animar = () => {
    posXAuto += velocidadAuto;

    // Si el auto alcanza el borde del canvas, detén la animación
    if (posXAuto >= canvas.width - anchoAuto) {
        posXAuto = canvas.width - anchoAuto; // Ajusta la posición para que la trompa del auto esté en el borde
        velocidadAuto = 0;
        cancelAnimationFrame(animacionId);
        return;
    }

    if (distanciaRestante < 50) {
        velocidadAuto *= distanciaRestante / 50; // Reduce la velocidad gradualmente
    }

    if (velocidadAuto < 0.01) {
        velocidadAuto = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarAuto(posXAuto);
    dibujarFlecha(posXAuto + anchoAuto);
    dibujarVelocidad(velocidadAuto, posXAuto + anchoAuto / 2);
    dibujarVelocidadTiempo();
    dibujarLineaDistancia();

    if (velocidadAuto > 0) { // Solo sigue animando si la velocidad es mayor que 0
        animacionId = requestAnimationFrame(animar);
    }
};

/**
 * Dibuja el cuerpo y las ruedas del auto en el canvas.
 * @method dibujarAuto
 * @param {number} x - La posición horizontal del auto en el canvas.
 * @return {void}
 */
const dibujarAuto = (x) => {
    const altoAuto = 40;
    const radioRueda = 10;
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

/**
 * Dibuja una flecha que indica la dirección sobre el auto en el canvas.
 * @method dibujarFlecha
 * @param {number} x - La posición horizontal donde se dibujará la flecha.
 * @return {void}
 */
const dibujarFlecha = (x) => {
    const tamañoFlecha = 15;
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

/**
 * Dibuja la velocidad sobre el auto en el canvas.
 * @method dibujarVelocidad
 * @param {number} velocidad - La velocidad del auto.
 * @param {number} x - La posición horizontal donde se dibujará la velocidad.
 * @return {void}
 */
const dibujarVelocidad = (velocidad, x) => {
    const altoAuto = 40;
    // Dibujar el texto de velocidad con unidades dinámicas
    const unidadVelocidad = document.getElementById('unitSwitch').checked ? 'm/s' : 'Km/h';
    const velocidadConUnidad = velocidad + ' ' + unidadVelocidad;

    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText(velocidadConUnidad, x, canvas.height / 2 - altoAuto / 2 - 5);
};

/**
 * Dibuja el tiempo y la velocidad en la esquina superior izquierda del canvas.
 * @method dibujarVelocidadTiempo
 * @return {void}
 */
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

/**
 * Dibuja una línea de distancia en la parte inferior del canvas y muestra la distancia con unidades dinámicas.
 * @method dibujarLineaDistancia
 * @return {void}
 */
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

/**
 * Realiza los cálculos basados en los campos de entrada y muestra el resultado.
 * Además, maneja casos de errores específicos y limita la visualización y animación en caso de resultados demasiado grandes.
 * @method handleClickCalcular
 * @return {void}
 */
const handleClickCalcular = () => {
    const tiempoInput = parseFloat(document.getElementById('tiempo').value);
    const velocidadInput = parseFloat(document.getElementById('velocidad').value);
    const distanciaInput = parseFloat(document.getElementById('distancia').value);
    const MAX_RESULTADO_PERMITIDO = 10000;

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
        return;
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
        return;
    }

    posXAuto = 0;

    if (!isNaN(velocidadInput)) {
        velocidadAuto = velocidadInput;
    } else {
        if (!isNaN(distanciaInput) && !isNaN(tiempoInput)) {
            velocidadAuto = distanciaInput / tiempoInput;
            // Asignar la velocidad calculada al campo de entrada correspondiente
            document.getElementById('velocidad').value = velocidadAuto;
        }
    }

    if (!isNaN(tiempoInput)) {
        tiempo = tiempoInput;
    } else {
        if (!isNaN(distanciaInput) && !isNaN(velocidadAuto)) {
            tiempo = distanciaInput / velocidadAuto;
            // Asignar el tiempo calculado al campo de entrada correspondiente
            document.getElementById('tiempo').value = tiempo;
        }
    }

    if (!isNaN(distanciaInput)) {
        distancia = distanciaInput;
    } else {
        if (!isNaN(tiempo) && !isNaN(velocidadAuto)) {
            distancia = tiempo * velocidadAuto;
            // Asignar la distancia calculada al campo de entrada correspondiente
            document.getElementById('distancia').value = distancia;
        }
    }

    let resultado;

    // Calcular y mostrar el resultado
    if (!isNaN(tiempoInput) && !isNaN(velocidadInput)) {
        resultado = velocidadInput * tiempoInput;
        const unidadDistancia = document.getElementById('unitSwitch').checked ? 'm' : 'km';
        resultSpan.textContent = "Distancia: " + resultado.toFixed(2) + " " + unidadDistancia;
    } else if (!isNaN(distanciaInput) && !isNaN(velocidadInput)) {
        resultado = distanciaInput / velocidadInput;
        const unidadTiempo = document.getElementById('unitSwitch').checked ? 's' : 'horas';
        resultSpan.textContent = "Tiempo: " + resultado.toFixed(2) + " " + unidadTiempo;
    } else if (!isNaN(distanciaInput) && !isNaN(tiempoInput)) {
        resultado = distanciaInput / tiempoInput;
        const unidadVelocidad = document.getElementById('unitSwitch').checked ? 'm/s' : 'Km/h';
        resultSpan.textContent = "Velocidad: " + resultado.toFixed(2) + " " + unidadVelocidad;
    }

    if (resultado && resultado > MAX_RESULTADO_PERMITIDO) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (animacionId) {
            cancelAnimationFrame(animacionId);
        }

        Toastify({
            text: "No se puede graficar números tan grandes.",
            duration: 3000,
            gravity: "top",
            position: "left",
            background: "linear-gradient(to right, #FF0000, #FF6347)"
        }).showToast();

        resultSpan.textContent = '';

        return;
    }

    // Mostrar canvas cuando el resultado está presente
    canvasContainer.style.display = 'block';

    // Detener la animación actual si existe
    if (animacionId) {
        cancelAnimationFrame(animacionId);
    }

    animar();
};

/**
 * Maneja el clic en el botón de animar, inicia la animación del auto si se han ingresado los tres campos: tiempo, velocidad y distancia.
 * Si falta algún campo, muestra un mensaje de error.
 * @method handleClickAnimar
 * @return {void}
 */
const handleClickAnimar = () => {
    // Detener la animación actual si existe
    if (animacionId) {
        cancelAnimationFrame(animacionId);
    }

    // Obtener los valores de los campos de entrada
    const tiempoInput = parseFloat(document.getElementById('tiempo').value);
    const velocidadInput = parseFloat(document.getElementById('velocidad').value);
    const distanciaInput = parseFloat(document.getElementById('distancia').value);

    // Contar el número de entradas completadas
    let entradasCompletadas = 0;
    if (!isNaN(tiempoInput)) entradasCompletadas++;
    if (!isNaN(velocidadInput)) entradasCompletadas++;
    if (!isNaN(distanciaInput)) entradasCompletadas++;

    // Mostrar mensaje de error si no se han ingresado los tres datos
    if (entradasCompletadas !== 3) {
        Toastify({
            text: "Complete todos los campos antes de animar.",
            duration: 3000,
            gravity: "top",
            position: "left",
            background: "linear-gradient(to right, #FF0000, #FF6347)"
        }).showToast();
        return;
    }

    velocidadAuto = velocidadInput;
    posXAuto = 0;

    animar();
};

/**
 * Cambia los placeholders de los campos de entrada según el estado del interruptor de unidades.
 * @method togglePlaceholders
 * @return {void}
 */
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

/**
 * Evita que se incluya el carácter '-' al pegar texto en un campo de entrada específico.
 * @method handlePaste
 * @param {Event} event - El evento de pegado que activa la función.
 * @param {string} elementId - El ID del elemento de entrada.
 * @return {void}
 */
const handlePaste = (event, elementId) => {
    const pastedText = event.clipboardData.getData('text');
    if (pastedText.includes('-')) {
        event.preventDefault();
        const newValue = pastedText.replace(/-/g, '');
        document.getElementById(elementId).value += newValue;
    }
};

/**
 * Evita el uso de las flechas en inputs de tipo number.
 * @method disableArrowKeys
 * @param {Event} event - El evento de teclado que activa la función.
 * @return {void}
 */
const disableArrowKeys = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
    }
};

// Añadir el evento a los inputs de tipo number
document.addEventListener('DOMContentLoaded', () => {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('keydown', disableArrowKeys);
    });
});