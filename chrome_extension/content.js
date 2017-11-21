// content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "clicked_browser_action" ) {

			var firstHref = document.baseURI;

			// console.log(firstHref);
			
			chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});

		if (request.action == "getDOM")

			var web3 = document.web3

			console.log(web3);

		else

			sendResponse({}); // Send nothing..

	}

}
);