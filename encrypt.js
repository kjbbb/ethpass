var aesjs = require('aes-js');

/*
this packs and encrypts a javascript object to store on the blockchain (in our
case, an array of passwords). the resulting blob is is an array of bytes
(Uint8Array), with the first byte being the version, and the remaining being
the encrypted json string.

the version byte allows us to alter the encryption scheme in the future, or do
something like add compression.

VERSION (1 byte)
COUNTER (2 bytes)
PAYLOAD (n bytes)
SHA1    (32 bytes)

--password fee could be optional, but encouraged

--do we need a queue in the contract? (write ahead log)

*/

const version = 0x01;

var generatePayload = function(aes256KeyBytes, jsObj) {

        let jsonUtf8 = JSON.stringify(jsObj);

        let textBytes = aesjs.utils.utf8.toBytes(jsonUtf8);

        let aesCtr = new aesjs.ModeOfOperation.ctr(aes256KeyBytes);
        let encryptedBytes = aesCtr.encrypt(textBytes);

        //prepend version byte
        let r = new Uint8Array(encryptedBytes.length + 1);
        r[0] = version;
        for(let i = 0; i < encryptedBytes.length; i++) {
            r[i+1] = encryptedBytes[i];
        }

        return r;
};

var readPayload = function(aes256KeyBytes, encryptedPayloadBytes) {

        let aesCtr = new aesjs.ModeOfOperation.ctr(aes256KeyBytes);

        //ignore the first byte
        let payloadBytes = encryptedPayloadBytes.slice(1);
        let decryptedBytes = aesCtr.decrypt(payloadBytes);

        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

        let obj = JSON.parse(decryptedText);

        return obj;
};

var readPayloadHex = function(aes256KeyBytes, encryptedPayloadHex) {
    let bytes = aesjs.utils.hex.toBytes(encryptedPayloadHex);
    return readPayload(aes256KeyBytes, bytes);
}

var generatePayloadHex = function(aes256KeyBytes, encryptedPayloadBytes) {
    let bytes = generatePayload(aes256KeyBytes, encryptedPayloadBytes);
    return aesjs.utils.hex.fromBytes(bytes);
}

var getPayloadVersion = function(encryptedBytes) {
    return encryptedBytes[0];
}

module.exports = {
    generatePayload: generatePayload,
    generatePayloadHex: generatePayloadHex,
    readPayload: readPayload,
    readPayloadHex: readPayloadHex,
    version: version
};
