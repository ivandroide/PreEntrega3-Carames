
// Se arma variable string a partir de listado de palabras aleatorias obtenidos desde sitio web
const string_Abecedario = 'A, B, C, D, E, F, G, H, I, J, K, L, M, N, Ñ, O, P, Q, R, S, T, U, V, W, X, Y, Z';

// Se arma array de 84 elementos a partir de string con listado de nombres de animales.
const array_Abecedario = string_Abecedario.split(', ');

// Objeto para guardar progreso del juego. Cada letra ingresada se va almacenando. Sirve para detectar ingresos repetidos.
let obj_progreso = {};


// Se verifica si ya se encuentra almacenado en memoria el string con nombres de animales.
if (localStorage.getItem("JSON_stringAnimales") === null) {

    // En caso negativo, se almacena lista de nombres en memoria para posteriores ejecuciones del sitio.   
    localStorage.setItem("JSON_stringAnimales", '["Abejas","Anguila","Ardilla","Ballena","Beluga","Bisonte","Buitre","Burro","Caballo","Cabra","Canguro","Cocodrilo","Dingo","Dromedario","Elefante","Escarabajo","Flamenco","Foca","Frailecillo","Gacela","Gallina","Ganso","Gato","Gorila","Hiena","Hormiga","Ibis","Iguana","Impala","Irukandji","Jaguar","Jerbo","Jilguero","Jirafa","Kiwi","Koala","Krill","Lagartija","Langosta","Lechuza","Liebre","Macaco","Mamba","Mantis","Mapache","Medusa","Narval","Nautilo","Novillo","Nutria","Ñu","Ocelote","Orca","Ornitorrinco","Oso","Oveja","Paloma","Panda","Pantera","Perro","Quetzal","Quirquincho","Rana","Renacuajo","Rinoceronte","Ruiseñor","Salamandra","Serpiente","Termita","Tigre","Urraca","Vaca","Varano","Venado","Vinchuca","Vizcacha","Wallaby","Wombat","Yak","Yegua","Zancudo","Zorro","Zorrino","Zorzal"]');

}

// Se arma array con nombre de animales, a partir de contenido recuperado desde local storage.
// En versión anterior (entrega previa), este array se armaba de forma similar al actual 'array_Abecedario'. 
const array_Palabras = JSON.parse(localStorage.getItem("JSON_stringAnimales"));




// Variable para almacenar palabra a adivinar.
let palabra_elegida = '';

// Variable contadora de ingresos de letras incorrectas.
let errores = 0;

// Arreglo para pre-cargar información de imágenes a mostrarse.
let images = [];




//-------------- DECLARACIÓN DE FUNCIONES

// Retorna valor comprendido entre 0 y X (parámetro MAX de entrada)
function getRandomInt(max) {

    return Math.floor((Math.random() * max));

}

// Búsqueda de caracter dentro de string y retorno de posiciones con acierto.
function getIndicesOf(searchStr, str) {

    let startIndex = 0;
    let indices = [];

    if (searchStr.length === 0) {

        // Si no hay acierto de la letra en la palabra, se retorna array vacío.
        return [];

    } else {   ///

        while ((x = str.indexOf(searchStr, startIndex)) > -1) {

            // Si letra se encuentra contenida en string, se 'descubre' dentro del objeto de progreso, añadiendo entrada.        
            indices.push(x);
            startIndex = x + searchStr.length;

        }

        return indices;

    }

}



function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];

    }
}


// Se pasan rutas de imágenes a cargarse.
preload(
    "./images/avance_0.png",
    "./images/avance_1.png",
    "./images/avance_2.png",
    "./images/avance_3.png",
    "./images/avance_4.png",
    "./images/avance_5.png",
    "./images/avance_6.png"
)


// Llamado a función para elección aleatoria de palabra del array.
palabra_elegida = array_Palabras[getRandomInt(array_Palabras.length)].toUpperCase();


// Declaración de constantes para elementos de pantalla.
const cont_div1 = document.getElementById("div1");
const cont_div2 = document.getElementById("div2");
const cont_div3 = document.getElementById("div3");
const cont_div4 = document.getElementById("div4");



cont_div1.innerHTML = `<input id ="refresh" type="image" src="./images/repeat.svg"  class="button buttonHover"/>`;

cont_div2.innerHTML = `<img src="${images[errores].src}"></img>`;

cont_div3.innerHTML = `<p id="palabra" class="palabra">`;


for (let a = 0; a < palabra_elegida.length; a++) {

    // Se arma nombre de clave en forma dinámica de X cantidad de propiedades a generarse en el objeto.
    let campo = 'letra_' + a;

    Object.defineProperty(obj_progreso, campo, { value: '_', enumerable: true, writable: true });

    // Se aprovecha la cantidad de iteraciones para imprimir ayuda visual en pantalla.
    cont_div3.innerHTML += `_ `;

}

cont_div3.innerHTML += `</p>`;


array_Abecedario.forEach((element, index) => {

    // Se arma variable con nombre de botón a crearse en iteración actual del array.
    const nombreBoton = `btn_${index}`;

    cont_div4.innerHTML += `<button id="${nombreBoton}" class="button buttonHover">${element}</button>`;

})

cont_div1.onclick = (e) => {

    if (e.target.id == 'refresh') {
        location.reload()
    }

}


cont_div4.onclick = (e) => {

    // Se verifica que elemento clickeado sea de tipo botón.
    if (e.target.nodeName == 'BUTTON') {

        let btn = document.getElementById(e.target.id);

        btn.disabled = true;                        // Luego de presionar un botón, se deshabilita su uso.
        btn.classList.remove("buttonHover");        // Se deshabilita la clase que realiza la animación de resaltado del botón.


        if (palabra_elegida.includes(e.target.textContent)) {

            btn.classList.add('buttonOK');


            // Se obtienen posiciones de aciertos de la letra dentro de la palabra.
            let indices = getIndicesOf(e.target.textContent, palabra_elegida);


            for (let i = 0; i < indices.length; i++) {

                campo = 'letra_' + indices[i];
                obj_progreso[campo] = e.target.textContent;

            }


            // Se verifica si palabra aún posee letras pendientes a adivinar.   
            if (!(Object.values(obj_progreso).includes('_'))) {

                // Impresión final del progreso (palabra completa)           
                console.log(Object.values(obj_progreso));
                victoria = 'X';

                // Se deshabilita el uso de las letras.
                array_Abecedario.forEach((element, index) => {

                    // Se arma variable con nombre de botón a crearse en iteración actual del array.
                    nombreBoton = `btn_${index}`;
                    btn = document.getElementById(nombreBoton);
                    btn.disabled = true;                        // Luego de presionar un botón, se deshabilita su uso.
                    btn.classList.remove("buttonHover");        // Se deshabilita la clase que realiza la animación de resaltado del botón.

                })

                // Se muestra mensaje de fin de juego exitoso.
                Swal.fire({
                    title: '¡Felicitaciones!',
                    text: `El animal era: ${palabra_elegida}`,
                    icon: 'success',
                    color: 'green',
                    background: '#d2eede',
                    iconColor: 'green',
                    customClass: 'swal-border-ok',
                    allowOutsideClick: false,

                })

            }


        } else {

            errores++;
            btn.classList.add('buttonError');

        }

        cont_div1.innerHTML = `<input id ="refresh" type="image" src="./images/repeat.svg" class="button buttonHover"/> `;

        cont_div2.innerHTML = `<img src="${images[errores].src}"></img>`;

        cont_div3.innerHTML = `<p id="palabra" class="palabra">`;

        for (let a = 0; a < palabra_elegida.length; a++) {

            campo = 'letra_' + a;

            cont_div3.innerHTML += `${obj_progreso[campo]} `;

        }

        cont_div3.innerHTML += `</p>`;


        if (errores == 6) {

            array_Abecedario.forEach((element, index) => {

                // Se arma variable con nombre de botón a crearse en iteración actual del array.
                nombreBoton = `btn_${index}`;
                btn = document.getElementById(nombreBoton);
                btn.disabled = true;                        // Luego de presionar un botón, se deshabilita su uso.
                btn.classList.remove("buttonHover");        // Se deshabilita la clase que realiza la animación de resaltado del botón.

            })


            // Se muestra mensaje de fin de juego fallido.
            Swal.fire({
                title: '¡Mejor suerte para la próxima!',
                text: `El animal era: ${palabra_elegida}`,
                icon: 'error',
                background: '#ffe7e4',
                iconColor: 'red',
                customClass: 'swal-border-error',
                allowOutsideClick: false,

            })

        }

    }

}