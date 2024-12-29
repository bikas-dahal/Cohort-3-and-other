
// Promisified version of SetTimeout

function setTimeoutPromisified(duration) {
    return new Promise( function (resolve) {
        setTimeout(resolve, duration)
    } )
}

// Promisified version of FS
function readFileAsync() {
    return new Promise(function (resolve) {
        fs.readFile('testa.txt', 'utf8', function (err, data) {
            resolve(data)
        });
    })
}


// First way
// Callback hell

// setTimeout(
//     function (){
//         console.log('1 sec')
//         setTimeout(
//             function (){
//                 console.log('2 sec');
//                 setTimeout(
//                     function (){
//                         console.log('3 sec');
//                     }, 3000
//                 )
//             }, 2000
//         )
//     }, 1000
// )

// Second Way
// Promise Chaining

// setTimeoutPromisified(1000).then(function () {
//     console.log('1 sec')
//     return setTimeoutPromisified(3000).then(function () {
//         console.log('3 sec')
//         return setTimeoutPromisified(1000).then(function () {
//             console.log('1  sec')
//         })
//     })
// })

//Final and better way,
// Async Await

async function run() {
    await setTimeoutPromisified(1000);
    console.log('1 sec')
    await setTimeoutPromisified(2000)
    console.log('3 sec')
    await setTimeoutPromisified(3000)
    console.log('6 sec')
}

run()



//
// function callback() {
//     console.log('Here we are,')
// }
//
// setTimeoutPromisified(2000).then(callback)

// function abc () {
//
// }
//
// let p = new Promise(abc)
//
// console.log(p)

var a = 1
var b = a
var b =3

console.log(b)

const fs = require('fs');

function readFile(filename) {
    return new Promise(firstargres)
}

function  firstargres(firsrargf) {
    fs.readFile('test.txt', 'utf-8', (err, data) => {
        firsrargf(data)
    })
}


const p= readFile()


p.then(ram)

function ram( content) {
    console.log(content)
}
