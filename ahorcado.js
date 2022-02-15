var btnIniciar = document.querySelector("#iniciar-juego");
var inputPalabra = document.querySelector("#input-nueva-palabra");
var btnAgregarPalabra = document.querySelector("#nueva-palabra");
var btnReiniciar = document.querySelector("#reiniciar-juego");

palabrasSecretas = ["NARANJA", "PIÑA", "MANZANA", "PERA"];

var juegoIniciado = false;
var palabraSorteada;
var indices = [];
var arrayPalabra;
arrayLetraIngresada = [];
arrayLetrasCorrectas = [];
arrayLetrasIncorrectas = [];
let letrasUnicas = [];


//genera un array sin letras repetidas
function cribarLetrasRepetidas() {
    for (i = 0; i < palabraSorteada.length; i++) {
        if (!letrasUnicas.includes(palabraSorteada[i])) {
            letrasUnicas.push(palabraSorteada[i])
        }
    }
}


//palabra aleatoria del array original
function sortearPalabra() {
    var numeroAleatorio = Math.floor(Math.random() * palabrasSecretas.length);
    palabraSorteada = palabrasSecretas[numeroAleatorio];
    palabrasSecretas.splice(numeroAleatorio, 1);
    return palabraSorteada;
}


//crea un array para ser usado como referencia para el juego
function crearArrayPalabra(palabra) {
    separada = palabra.split("");
    arrayPalabra = separada;
}


//asigna la funcionalidad a los botones de inicio y reinicio
btnIniciar.addEventListener("click", function (event) {
    event.preventDefault();
    pincel.clearRect(0, 0, pantalla.width, pantalla.height);
    iniciarJuego();
})

btnReiniciar.addEventListener("click", function (event) {
    event.preventDefault();
    pincel.clearRect(0, 0, pantalla.width, pantalla.height);
    iniciarJuego();
})


//permite al usuario agregar sus propias palabras
btnAgregarPalabra.addEventListener("click", function (event) {
    event.preventDefault();
    palabrasSecretas.push(inputPalabra.value.toUpperCase());
    inputPalabra.value = "";
    inputPalabra.focus();
})


//inicia un nuevo juego
function iniciarJuego() {
    pincel.clearRect(0, 0, pantalla.width, pantalla.height);
    pedestal();
    sortearPalabra();
    crearArrayPalabra(palabraSorteada);
    dibujarGuiones();
    cribarLetrasRepetidas();
    juegoIniciado = true;
    arrayLetraIngresada = [];
    arrayLetrasCorrectas = [];
    arrayLetrasIncorrectas = [];
}


//busca indices de las instancias de la letra
function buscarIndices() {
    if (juegoIniciado) {
        var indiceBuscado = arrayPalabra.indexOf(arrayLetraIngresada[0]);
        while (indiceBuscado != -1) { //el -1 es el return de indexOf si no encuentra el elemento
            indices.push(indiceBuscado);
            indiceBuscado = arrayPalabra.indexOf(arrayLetraIngresada[0], indiceBuscado + 1);
        }
    }
}


//dibuja la cantidad de guiones necesarios para la palabra en juego
function dibujarGuiones() {
    var inicioX = 350;
    var inicioY = 610;
    var contador = 0;
    var nLetras = palabraSorteada.length;
    while (contador < nLetras) {
        pincel.fillStyle = "red";
        pincel.fillRect(inicioX + (40 * contador), inicioY, 30, 4);
        contador++;
    }
}


//coloca cada letra en el lugar que deberia aparecer
function dibujarletras(arrOrden) {
    var inicioX = 358;
    var inicioY = 600;
    for (i = 0; i < arrOrden.length; i++) {
        pincel.fillStyle = "blue";
        pincel.font = "20px Georgia";
        pincel.fillText(arrayLetraIngresada[0], inicioX + (40 * arrOrden[i]), inicioY);
    }
    indices = [];
}


//captura las letras ingresadas y dibujas el ahorcado
document.addEventListener("keyup", function (event) {
    arrayLetraIngresada = [];
    var letra = event.key.toUpperCase();
    var codigo = letra.charCodeAt();
    if (juegoIniciado) {
        if (codigo > 64 && codigo < 91) {
            arrayLetraIngresada.push(letra);
            buscarIndices();
            dibujarletras(indices);
            var comparador = arrayLetrasIncorrectas.length;
            if (arrayPalabra.includes(letra)) {
                if (!arrayLetrasCorrectas.includes(letra)) {
                    arrayLetrasCorrectas.push(letra)
                }
            } else if (!arrayLetrasIncorrectas.includes(letra)) {
                arrayLetrasIncorrectas.push(letra)
            }
            if (comparador < arrayLetrasIncorrectas.length) {
                dibujarLetrasErroneas(arrayLetrasIncorrectas)
            }
            dibujarAhorcado();
        }
        verificarFinGanador();
        verificarFinPerdedor();
    }
});


//dibuja las letras que no estan en la palabra sorteada
function dibujarLetrasErroneas(letrasIncorrectas) {
    var inicioX = 400;
    var inicioY = 200;
    pincel.fillStyle = "black";
    pincel.font = "20px Georgia";
    pincel.fillText("letras erroneas " + letrasIncorrectas.toString(), inicioX, inicioY);
}


//comprueba si el juego ha terminado con resultado positivo
function verificarFinGanador() {
    let palabraOriginalsinLetrasRepetidas = letrasUnicas.sort().toString();
    let letrasErroneasIngresadas = arrayLetrasCorrectas.sort().toString();
    if (palabraOriginalsinLetrasRepetidas === letrasErroneasIngresadas) {
        pincel.fillStyle = "lightgreen";
        pincel.font = "50px Georgia";
        pincel.fillText("Ganaste, felicidades!", 600, 400);
        juegoIniciado = false;
        btnReiniciar.focus();
        letrasUnicas = [];
    }
}


//comprueba si el juego ha terminado con resultado negativo
function verificarFinPerdedor() {
    if (arrayLetrasIncorrectas.length > 5) {
        pincel.fillStyle = "red";
        pincel.font = "50px Georgia";
        pincel.fillText("Fin del juego!", 600, 400);
        juegoIniciado = false;
        alert("la palabra era " + palabraSorteada);
        btnReiniciar.focus();
        letrasUnicas = [];
    }
}


//dibuja la pieza del ahorcado correspondiente segun la cantidad de errores
function dibujarAhorcado() {
    let contador = arrayLetrasIncorrectas.length;
    if (contador === 1) {
        cabeza()
    } else if (contador === 2) {
        cuerpo()
    } else if (contador === 3) {
        brazoIzquierdo()
    } else if (contador === 4) {
        brazoDerecho()
    } else if (contador === 5) {
        piernaIzquierda()
    } else if (contador === 6) {
        piernaDerecha()
    }
}


