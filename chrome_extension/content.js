// content.js

// Send the windows.ContractInst 
chrome.runtime.sendMessage({
	from: 'content',
	subject: 'showPageAction'
});


/* Listen for the call from the popup.
* grab the web3 object
* deploy and initialize the contract
* return the contract detail in a response back to the popup window
*/

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if ((msg.from === 'popup') && (msg.subject === 'web3Info')) {

		var fs = require('fs');
		var solc = require('solc');
		var Web3 = require('web3');

		//todo, add dev and production mode
		web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

		console.log(web3)

		var contract = fs.readFileSync('./password.sol', 'utf-8');

		var compiled = solc.compile(contract, 1);

		var contractBytecode = compiled.contracts[':PasswordManager'].bytecode;
		var abiJson = compiled.contracts[':PasswordManager'].interface
		var abi = JSON.parse(abiJson);

		var Contract = web3.eth.contract(abi);

		var ContractInst = Contract.new({
		    from: web3.eth.accounts[0],
		    data: contractBytecode,
		    gas: '4300000'
		}, function(e, c) {

		    var contractDetails = {
		        address: c.address,
		        abi: c.abi,
		        bytecode: contractBytecode
		    };

		    var json_contractDetails = JSON.stringify(contractDetails);
		});

		let contractInfo = JSON.parse(json_contractDetails);

		let Contract = web3.eth.contract(contractInfo.abi);

		var ContractInst = Contract.at(contractInfo.address);

		// console.log(window.ContractInst);

		// injectScript( chrome.extension.getURL('get_web3.js'), 'body');

		sendResponse({
			contract: ContractInst
		});

	} 
});

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}




