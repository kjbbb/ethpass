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
	if ((request.from === 'popup') && (request.subject === 'setContractInst')) {

		injectScript( chrome.extension.getURL('ethpass.js'), 'body');
		
		sendResponse({
			response: 'Contract in local storage'
		});
		return true;

	} 
});


function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}




