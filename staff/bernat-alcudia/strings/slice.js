// El método slice() devuelve una copia de una parte del array dentro de un nuevo array empezando por inicio hasta fin (fin no incluido). El array original no se modificará.

// El código fuente de esta demostración interactiva está alojado en un repositorio Github. Si desea contribuir con ella, por favor clone https://github.com/mdn/interactive-examples y envíenos un "pull request".

// Sintaxis
// arr.slice([inicio [, fin]])
// Parámetros
// inicio
// Índice donde empieza la extracción. El primer elemento corresponde con el índice 0.

// Si el índice especificado es negativo, indica un desplazamiento desde el final del array.slice(-2) extrae los dos últimos elementos del array

// Si inicio es omitido el valor por defecto es 0.

// Si inicio es mayor a la longitud del array, se devuelve un array vacío.

// fin
// Índice que marca el final de la extracción. slice extrae hasta, pero sin incluir el final.

// slice(1,4) extrae desde el segundo elemento hasta el cuarto (los elementos con índices 1, 2, y 3).

// Con un índice negativo, fin indica un desplazamiento desde el final de la secuencia. slice(2,-1) extrae desde el tercer hasta el penúltimo elemento en la secuencia.

// Si fin es omitido, slice extrae hasta el final de la secuencia (arr.length).

// Si fin es mayor a la longitud del array, slice extrae hasta el final de la secuencia (arr.length).

// Valor de retorno
// Un nuevo array con los valores extraídos.


function slice(string, indexStart, indexEnd) {
    var value = '';
    for (let i = indexStart; i < indexEnd; i++) {
        value += string

    }
    return value
}

slice('apple', 1, 3)