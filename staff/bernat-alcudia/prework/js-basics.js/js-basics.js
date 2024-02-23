// Funciones basicas JavaScript
function sumar(numero1, numero2) {//Parametros
    var resultado = numero1 + numero2;
    return resultado;//Devolvemos el resultado
}
function restar(numero1, numero2) {
    var resultado = numero1 - numero2;
    return resultado;
}

function multiplicar(numero1, numero2) {
    var resultado = numero1 * numero2;
    return resultado;
}

function dividir(numero1, numero2) {
    var resultado = numero1 / numero2;
    return resultado;
}

// Create a Map
const fruits = new Map();

// Set Map Values
fruits.set("apples", 500);
fruits.set("bananas", 300);
fruits.set("oranges", 200);

//Variables
var n1 = 3;
var n2 = 4;



resultadoSuma = sumar(n1, n2);//Llamamos a la funcion
resultadoResta = restar(n1, n2);
resultadoMultiplicar = multiplicar(n1, n2);
resultadoDividir = dividir(n1, n2);

//Bucles
var a = 100;
var b = 0;
while (b < a) {
    b++
    console.log(b);
}
for (let b = 0; b < a; a++) {
    console.log(b);

}