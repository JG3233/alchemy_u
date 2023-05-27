const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak.js");
const { toHex, utf8ToBytes} = require("ethereum-cryptography/utils")

function recoverKey(counter, signature) {
    console.log('Signature:', signature)
    console.log('Counter:', counter)
    const counterHash = keccak256(utf8ToBytes(counter.toString()))
    const decodedSignature = secp256k1.verify(signature, counterHash, publicKey)
    if (decodedSignature) {
        const recoveredPublicKey = toHex(signature.recoverPublicKey(counterHash).toRawBytes())
        console.log('Recovered Public Key:', recoveredPublicKey)
        return recoveredPublicKey
    }
    return null
}

const privateKey = "508569ab6ad0170cb79e8f40d4bcb618fc46ce10e868d3b2911bc1b895990884"
const publicKey = "03f82403241aec23c125779fdf9074b358735c276f30fe36c23c2664d49ee33d23"
const counter = "0"
const counterHash = keccak256(utf8ToBytes(counter))

// digital signature of counter using private key
const signature = secp256k1.sign(counterHash, privateKey)

console.log('Signature:', toHex(signature.toDERRawBytes()))

// decode signature
const decodedSignature = secp256k1.verify(signature, counterHash, publicKey)
const recoveredPublicKey = toHex(signature.recoverPublicKey(counterHash).toRawBytes())

console.log('Verify Signature:', decodedSignature)
console.log('Recovered Public Key:', recoveredPublicKey)

module.exports = recoverKey
