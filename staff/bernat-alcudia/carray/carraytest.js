var Carray = require('./carray')

console.log('TEST Carray')

console.log('> constructor')

console.log('CASE contruct en an instance without elements')

var c = new Carray

console.log(c)
//Carray { lenght: 0 }

console.log('CASW constructs an instance with number elements')

var c = new Carray(10, 20, 30)

console.log(c)
//Carray { 0: 10, 1: 20,2: 30,length: 3}