// content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "clicked_browser_action" ) {

			var firstHref = document.baseURI;

			// console.log(firstHref);
			
			chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});

	}
}
);