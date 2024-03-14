// Case 1:usando el find,encuentra el primer numero mayor a 20

var numbers = [10, 20, 30, 40, 50, 60]

var case1 = numbers.find(function (x) {
    return x > 20
})


// case 2:ecuentra el primer string que contenga una 'u'

var strings = ['hola', 'mundo', 'a', 'todos']

var case2 = numbers.find(function (string) {
    return string.includes('u')
})


//case 3:encuentra el primer numero inpar