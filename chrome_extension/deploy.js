var fs = require('fs');
var solc = require('solc');
var Web3 = require('web3');

//todo, add dev and production mode
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

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

    console.log(JSON.stringify(contractDetails));
});
