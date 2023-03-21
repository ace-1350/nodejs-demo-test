require('dotenv').config();
const crypto = require('crypto');

const algo = process.env.CRYPTO_ALGO;
const key = Buffer.from(process.env.CRYPTO_KEY, 'hex');
const iv = Buffer.from(process.env.CRYPTO_IV, 'hex');

function encrypt(text) {
    let cipher = crypto.createCipheriv(algo, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function decrypt(text) {
    let encrypted = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algo, key, iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// console.log(encrypt('admin@0001'));
// console.log(decrypt('d010ec6eaedf8fb2bd5ac5067c7826b4'));
module.exports = { encrypt, decrypt }