const script = document.createElement("script");
script.src = chrome.runtime.getURL("thing.js");
document.body.appendChild(script);