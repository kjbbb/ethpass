# Setup
deploy contract on blockchain:  
  `launch testrpc`  
  `node deploy.js`  

  copy first line of output from `node deploy.js` into contract.js (into the contractInfoJson var)

build js:  
  `browserify app.js -o bundle.js`


# CryptoPass

  CryptoPass is a decentralized application (DAPP) to store your passwords
securely on the blockchain, powered by Ethereum. CryptoPass leverages
blockchain infrastructure to store your passwords redundantly across the the
ethereum network, so that they are never lost, and are only accessible by you.
Benefits to using CryptoPass are similar to those of Bitcoin, you are in
control of your own data, and the data is backed up and indelibly stored on one
of the world’s largest networks of supercomputers, accessible anywhere that has
internet.

  Unlike current password managers, with CryptoPass, your passwords are not
stored on an enterprise cloud network that is owned by a company or business,
where you run the risk of them losing or accessing your data. Your passwords
are stored on Ethereum, which is owned by everyone, and your data is backed up
on hundreds of thousands of machines, and virtually guaranteed to not be lost.

  With CryptoPass, your data is readable and writable only by you, so no one
but you can see the passwords, including us. Before being forever cemented onto
the blockchain, the passwords are encrypted using your Ethereum private key. We
leverage Ethereum’s built-in, state of the art encryption to encrypt your data
before it is written to the blockchain, and only you can decrypt it. Just make
sure not to lose your Ethereum private key! We recommend following the standard
security protocols, such as printing out a paper wallet, and/or writing down
your account’s seed words.

# FAQ

Q: Can you, or anyone else see my passwords?
A: No, only you can see them. They are encrypted and decrypted client side, the
   plain text passwords never cross any network.

Q: Can people see the encrypted versions of my passwords?
A: Yes, since Ethereum is essentially a large public computer. However, only
   your private key can decrypt them. If you trust Bitcoin or Ethereum to hold
   your money, then that trust could be extended to passwords.

Q: Do you need Ethereum to use it?
A: You need to be able to interact with the Ethereum network to use it, so we
   recommend the browser plugin MetaMask, the Mist browser, or, you can manually
   create your own transactions.

Q: Does it cost money?
A: It costs a small network fee to store your passwords on the blockchain,
   however, it is free to read and decrypt them. The network fee goes to the
   network and miners running ethereum, since it costs real world resources to
   store your data on tens of thousands of machines. The fee is adjustable by you,
   depending on your patience. On top of that, we charge a fixed .0005 eth (20
   cent usd) fee per password. 

Q: Is it open source?
A: Yes, you can see how it works. <github link>

Q: Can I store my passwords offline, and not sync them to the network?
A: Yes. This way, you also won't have to pay a miner fee, but you lose the
   benefits of decentralization.
