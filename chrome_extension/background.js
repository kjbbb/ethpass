// background.js


function initializContract(tab) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		if(tabs[0].status == 'complete') {
			//We send the proper information to the content script to render our app.
			chrome.tabs.sendMessage(tabs[0].id, {load: true}, function(response) { // We don't do anything if we don't have a response
				
				console.log("Inside Background Response script, we had a response:");
		 	});
		}
	});
}

// Listen for the contract from the content page. Then store it in local browser RAM
chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse){
		if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
		// Enable the page-action for the requesting tab
			chrome.pageAction.show(sender.tab.id);
		}
    }
);

