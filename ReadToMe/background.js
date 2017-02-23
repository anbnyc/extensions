let speaking = false;
let position = 0;
var text = "";

function readMe(){
	speaking = !speaking;
	chrome.tts.speak(text,
		{
			onEvent: function(event){
				if(event.type === "interrupted"){
					text = text.substring(position);
				} else {
					position = event.charIndex;
				}
			}
		});
}

function shutUp(){
	speaking = !speaking;
	chrome.tts.stop();
}

chrome.browserAction.onClicked.addListener(function(tab){
	if(text === ""){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
			chrome.tabs.sendMessage(tabs[0].id, {ask: "innerText"}, function(response){
				text = response.answer;
				readMe();
			});
		});
	} else if (speaking){
		shutUp();
	} else {
		readMe();
	}
});