var aesjs = require('aes-js');
var msgpack = require('msgpack-lite');
var pbkdf2 = require('pbkdf2');

const version = 0x01;

function stripKeynames(password) {
  if (password.version == 1) {
    return [
      password.version,
      password.name,
      password.username,
      password.password,
      password.notes,
      password.mtime,
      password.ctime 
    ];
  }
}

function addKeynames(password) {
  if (password[0] == 1) {
    return {
      version: password[0],
      name: password[1],
      username: password[2],
      password: password[3],
      notes: password[4],
      mtime: password[5],
      ctime: password[6],
    };
  }
}

//encrypt an array of password objects
function encryptPassword(key256, passwordA) {

  //strip off key names to save space
  passwordA = passwordA.map((password) => {
    return stripKeynames(password);
  });

  //pack message
  let packed = msgpack.pack(passwordA);

  //encrypt message
  let aesCtr = new aesjs.ModeOfOperation.ctr(key256);
  let encryptedBytes = aesCtr.encrypt(packed);

  return encryptedBytes;
}

function verifySchema(password) {
  if (password.length !== 7) return false;
  else if (!(
    typeof password[0] == 'number' &&
    typeof password[1] == 'string' &&
    typeof password[2] == 'string' &&
    typeof password[3] == 'string' &&
    typeof password[4] == 'string' &&
    typeof password[5] == 'number' &&
    typeof password[6] == 'number'
  )) {
    return false;
  }
  return true;
}

//decrypt a blob into an array of password objects
function decryptPassword(key256, encryptedBlob) {
  let aesCtr = new aesjs.ModeOfOperation.ctr(key256);
  let decryptedBytes = aesCtr.decrypt(encryptedBlob);

  let unpacked = msgpack.unpack(decryptedBytes);

  if (Object.prototype.toString.call(unpacked) !== '[object Array]') {
    throw 'invalid object 1';
  }

  if (unpacked.length && !verifySchema(unpacked[0])) {
    throw 'invalid object 2';
  }

  //re-add keynames
  let passwordA = unpacked.map((password) => {
    return addKeynames(password);
  });

  return passwordA;
}

//generate a 256 bit key with 10000 rounds of sha256 pbkfs2
function genKey256(password, salt) {

  if (password.length < 8)
    throw 'pbkdf2 password too short';
  if (salt.length < 8)
    throw 'pbkdf2 salt length too short';

  let key256 = pbkdf2.pbkdf2Sync(password, salt, 10000, 256 / 8, 'sha256');

  if (!key256 || key256.length !== 32)
    throw 'pbkdf2 didnt generate key correctly:' + key256;

  return key256;
}

//var key256 = pbkdf2.pbkdf2Sync('password', 'salt', 1, 256 / 8, 'sha512');

module.exports = {
    encryptPassword: encryptPassword,
    decryptPassword: decryptPassword,
    genKey256: genKey256,
    version: version
};
