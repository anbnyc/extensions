chrome.runtime.onMessage.addListener(
	function(request,sender,sendResponse){
		if(request.ask == "innerText"){
			sendResponse({answer: document.body.innerText})
		}
	}
);