var stencil = require('../')

// Average two points:
var c = [-1, 1]
stencil(0, c)
// => c = [ 0.5, 0.5 ]
console.log('c = ',c)


// Central first derivative:
var c = [-1, 0, 1]
stencil(1, c)
// => c = [ -0.5, 0, 0.5 ]
console.log('c = ',c)


// One-sided first derivative:
var c = [0, 1, 2]
stencil(1, c)
// => c = [ -1.5, 2, -0.5 ]
console.log('c = ',c)


// Second derivative sixth order compact:
var c = [-2, -1, 1, 2, -2, -1, 0, 1, 2]
stencil(1, c, 4)
// => c = [ 0.027777777777778206,
//          0.44444444444444775,
//          0.4444444444444405,
//          0.027777777777777398,
//         -0.11574074074074253,
//         -0.7407407407407423,
//          7.771561172376096e-15,
//          0.7407407407407378,
//          0.11574074074073923 ]
console.log('c = ',c)
