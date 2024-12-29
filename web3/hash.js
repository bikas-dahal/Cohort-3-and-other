const crypto = require('crypto')

const input = 'web3'
const hash = crypto.createHash('sha256').update(input).digest('hex')

console.log(hash)

for (let i = 0; i < 100; i++) {
    let prefix = 'web3'
    let input = i.toString()
    let t = prefix + input

    const check = crypto.createHash('sha256')
    console.log('check is', check)

    const againCheck = crypto.createHash('sha256').update(t)
    console.log('again check is', againCheck)
    console.log(t)
    const hash = crypto.createHash('sha256').update(t).digest('hex')
    console.log('hash is', hash);
    
    if (hash.startsWith('00000')){
        console.log(hash)
        console.log(t)
    }
}
