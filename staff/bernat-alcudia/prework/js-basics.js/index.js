//Bucles for
var cars = [
]
cars[0] = 'aston martin';
cars[1] = 'ferrari';
cars[2] = 'batmovil';

for (let i = 0; i < cars.length; i++) {
    var coches = cars[i];
    console.log(coches);

}

//--------------------------------------------------------------------------------------

// Funcion añadir propiedad a elemento

var model = 7;

function addElement(object, element) {
    object[object.length] = element;


    return object.length;
}

var numbers = {
    '0': 10,
    '1': 30,
    '2': 40,
    'length': 3
}

function removeFirstElement(object) {

    object[3] = object[2]
    object[2] = object[1]
    object[1] = object[0]

    delete object[0];

    object[0] = object[1]
    object[1] = object[2]
    object[2] = object[3]
    delete object[3];
    return object;
}
function removeLastElement(object) {
    delete object[object.length - 1];


    return object;
}
removeFirstElement(cars);

addElement(cars, model);
removeLastElement(cars);

cars.forEach(element => {
    console.log(cars);
});



