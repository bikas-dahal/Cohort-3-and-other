console.log('Getting Started with internal of Javascript')

// Asynchronous Video

// function sum(n) {
//     let sum = 0;
//     while (n > 0) {
//         sum += n;
//         n -= 1;
//     }
//     return sum;
// }
//
// console.log(sum(190))

// Asynchronous part

const fs = require('fs');
// const content = fs.readFileSync('test.txt', 'utf8'); //synchronously  not recommend type
// console.log(content)
//
//
// function sum(a, b) {
//     return a + b
// }
//
// function doCal(a, b, f) {
//     return f(a, b)
// }
//
// console.log(doCal(1, 2, sum))

function read(err, data) {
    console.log(data)
}

// const content1 = fs.readFile('testa.txt', 'utf8', read); // recommend for file read
fs.readFile('testa.txt', 'utf8', read); // recommend for file read

// console.log(content1)


class Squrare {
    constructor(length, rame) {
        this.rame = rame;
        this.length = length;
    }

    area() {
        console.log(`Area for the length is, ${this.length * this.length}`)
    }
}

sq = new Squrare(12, 'gg')
sq.area()
