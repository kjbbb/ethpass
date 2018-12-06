# Setup
deploy contract on blockchain:  
  `launch testrpc`  
  `node deploy.js`  

  copy first line of output from `node deploy.js` into contract.js (into the contractInfoJson var)

build js:  
  `browserify app.js -o bundle.js`

# EthPass

  It's similar to a password manager like LastPass, but it uses Ethereum as
a back-end for decentralization purposes, rather than something like AWS. It
also uses MetaMask to encrypt and decrypt your data.

# FAQ

Q: Can you, or anyone else see my data?
A: Everyone can see the encrypted data, but only you (theoretically), can see
   the decrypted data.

Q: Can people see the encrypted versions of my passwords?
A: Yes, since Ethereum is essentially a large public computer. However, only
   your private key can decrypt them.
   
Q: Do you need Ethereum to use it?
A: You need to be able to interact with the Ethereum network to use it, so we
   recommend the browser plugin MetaMask, the Mist browser, or, you can manually
   create your own transactions.

Q: Does it cost money?
A: It costs a small network fee to store data on the blockchain, however, it is
   free to read and decrypt them.

Q: Is it open source?
A: Yes, you can see how it works. <github link>

Q: Can I store my passwords offline, and not sync them to the network?
A: Yes. This way, you also won't have to pay a miner fee, but you lose the
   benefits of decentralization.

# Disclaimer

Don't use this

