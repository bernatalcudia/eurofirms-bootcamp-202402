// El método split() divide un objeto de tipo String en un array (vector) de cadenas mediante la separación de la cadena en subcadenas.

// Sintaxis
// cadena.split([separador][,limite])
// Parámetros
// separador
// Especifica el carácter a usar para la separación de la cadena. El separador es tratado como una cadena o como una expresión regular. Si se omite el separador, el array devuelto contendrá un sólo elemento con la cadena completa.

// limite
// Opcional. Entero que especifica un límite sobre el número de divisiones a realizar. El método split() todavía se divide en todas las concordancias del separador, pero divide la matriz devuelta en la cantidad de elementos impuesta por el limite.

// Descripción
// El método split() devuelve el nuevo array.

// Cuando se encuentra, el separador es eliminado de la cadena y las subcadenas obtenidas se devuelven en un array. Si el separador no es encontrado o se omite, el array contendrá un único elemento con la cadena original completa. Si el separador es una cadena vacía la cadena es convertida en un array de carácteres.

// Si el separador es una expresión regular que contiene paréntesis de captura, entonces cada vez que el separador concuerda, los resultados (incluído cualquier resultado indefinido) de los paréntesis de captura son divididos en el array resultante. Sin embargo no todos los navegadores soportan esta característica.