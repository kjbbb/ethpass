
document.getElementById('add_password').onclick = addPassword;
document.getElementById('load_password').onclick = loadPasswords;

// Send a message to the content page to load the web3 object and query the blockchain for the contract information.
window.onload = () => {

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{from: 'popup', subject: 'setContractInst'}, function(response) {
                    if (chrome.runtime.lastError) {
                        console.log('ERROR: ', chrome.runtime.lastError);
                    } else {
                        console.log(response.response)
                    }
                }
        );

    });
	// chrome.extension.getBackgroundPage().initializContract();

}

chrome.storage.sync.get(['localcontract'], function(items){
    var contract = items[0]
})

function addPassword() {
    console.log(contract)
    let c = contract;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let passwordA = [];
    c.get((err, result) => {
        console.log(err, result);
        if (!err) {
            let passwordA = [];

            try {
                passwordA = JSON.parse(result);
            }
            catch (e) { }

            passwordA.push([username, password]);

            let payload = JSON.stringify(passwordA);
            //todo, encryption goes here
            //todo, compression

            c.set(payload, (err1, result1) => {
                //cool, we did it mostly. now just mash the 'load passwords' button
                //todo, add a 'password added' event so that we can load it automatically
            });
        }
    });
}

function loadPasswords() {
    let c = window.ContractInst;

    c.get((err, result) => {
        console.log(err, result);
        if (!err) {
            let passwordA = null;
            try {
                //todo, decryption goes here
                passwordA = JSON.parse(result);
            } catch (err) {
                passwordA = [];
            }

            console.log(passwordA);
            renderPasswords(passwordA);
        }
    });
}

//passwordA should be in the form of:
//[['username', 'password'], ...]
function renderPasswords(passwordA) {

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

