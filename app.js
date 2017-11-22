var aes = require('aes-js');
var encrypt = require('./encrypt.js');
var contract = require('./contract.js');

window.onload = () => {
    let Contract = web3.eth.contract(contract.abi);
    ContractInst = Contract.at(contract.address);
    console.log(localStorage);
}

addPassword = () => {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    loadPasswords()
    .then((pwA) => {
        if (!pwA) pwA = [];

        pwA.push([username, password]);

        let keyBytes = aes.utils.hex.toBytes(localStorage.aes256key);
        let payload = encrypt.generatePayloadHex(keyBytes, pwA);

        ContractInst.set(payload, (err, result) => {
            console.log(result);
        });
    });
}

loadPasswords = () => {
    return new Promise((resolve, reject) => {
        let fnLoadPasswords = () => {
            ContractInst.get((err, result) => {
                if (!err) {
                    let keyBytes = aes.utils.hex.toBytes(localStorage.aes256key);
                    let payload = encrypt.readPayloadHex(keyBytes, result);
                    resolve(payload);
                    renderPasswords(payload);
                }
            });
        }

        if (localStorage.aes256key == undefined) {
            generateAes256Key()
            .then(keyBytes => {
                let keyHex = aes.utils.hex.fromBytes(keyBytes);
                localStorage.aes256key = keyHex;
                fnLoadPasswords();
            });
        }
        else {
            fnLoadPasswords();
        }
    
    });
}

//passwordA should be in the form of:
//[['username', 'password'], ...]
renderPasswords = (passwordA) => {

    let passwordsE = document.getElementById('passwords');
    while(passwordsE.firstChild) {
        passwordsE.removeChild(passwordsE.firstChild);
    }

    for(let i = 0; i < passwordA.length; i++) {
        let li = document.createElement('li');
        li.innerHTML = passwordA[i][0] + ' ' + passwordA[i][1];
        
        passwordsE.appendChild(li);
    }
}

generateAes256Key = () => {
    let utf8key = 'Authorize metamask to encrypt/decrypt password. Click sign.';
    return new Promise((resolve, reject) => {
        web3.personal.sign(web3.fromUtf8(utf8key), web3.eth.accounts[0], (e, r) => {
            if (e) reject(e);
            else {
                let aesKeyHex = r.substring(2, 34); //remove '0x'
                let aesKeyBytes = aes.utils.hex.toBytes(aesKeyHex);
                resolve(aesKeyBytes);
            }
        });
    });
}
